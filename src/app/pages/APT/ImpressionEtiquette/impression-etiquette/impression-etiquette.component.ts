import { Component, OnInit, Output, EventEmitter, Input } from "@angular/core";
import { ImpressionService } from "../impressionService";
import { ComponetList } from "../../CréationEtiquette/ComposentData";
import { format } from "date-fns";
import { LabelService } from "../../CréationEtiquette/label.service";
import { GestionProduitHttpService } from "../../GestionProduits/GestionProduitHttp.service";
import { SerialNumberData } from "../../GestionProduits/GestionProduit.data";

class RegexFormatLot {
  public static readonly "date" =
    /^(0[0-9]|1[0-9])\/(0[0-9]|1[0-2])\/(20[2-9][0-9])$/gm;
  public static readonly "dd/MM" = /^(0[0-9]|1[0-9])\/(0[0-9]|1[0-2])$/gm;
  public static readonly "MM/yyyy" = /^(0[0-9]|1[0-2])\/(20[2-9][0-9])$/gm;
}
@Component({
  selector: "ngx-impression-etiquette",
  templateUrl: "./impression-etiquette.component.html",
  styleUrls: ["./impression-etiquette.component.scss"],
})
export class ImpressionEtiquetteComponent implements OnInit {
  refProd;
  OfList;
  printerList;
  formatLot;
  lot;
  formatLotValid;
  nbrCopieValid;
  withSN;
  changeSn = new EventEmitter();
  //Sérial Number
  constructor(
    private impressionService: ImpressionService,
    private labelService: LabelService,
    private gestionProduitHttpService: GestionProduitHttpService
  ) {}
  async ngOnInit() {
    this.formatLotValid = false;
    this.nbrCopieValid = false;
    this.OfList = (await this.impressionService.GetAllOF().toPromise()).of.map(
      (res) => res.ofnum
    );
    this.printerList = await this.impressionService
      .GetPrinterList()
      .toPromise();
  }
  async getOFinfo(ofnum) {
    const of = (
      await this.impressionService.GetRefProduitByOF(ofnum).toPromise()
    ).of;
    this.refProd = of.proref;
    console.log(this.refProd);
  }
  async loadList1Data(data: ComponetList[]) {
    console.log(data);

    this.lot = this.findDateFormat(data);
    const idsn = this.findSN(data);
    const produit = (
      await this.gestionProduitHttpService
        .getOneProduit(this.refProd)
        .toPromise()
    ).produit;

    if (this.lot) this.formatLot = this.lot.data;
  }
  withSNFunction(data) {
    this.withSN = data;
    console.log("withSN");
    console.log(this.withSN);
  }
  findDateFormat(data: ComponetList[]) {
    const res = data.find((val) => val.refItem == "format" && val.data);
    let resarray;
    if (!res) {
      resarray = data.map((val) => {
        if (val.children.length > 0) {
          return this.findDateFormat(val.children);
        } else {
          return null;
        }
      });
    }
    return (
      res || resarray.find((val) => val && val.refItem == "format" && val.data)
    );
  }
  findSN(data: ComponetList[]) {
    const res = data.find((val) => val.refItem == "idSN" && val.data);
    let resarray;
    if (!res) {
      resarray = data.map((val) => {
        if (val.children.length > 0) {
          return this.findDateFormat(val.children);
        } else {
          return null;
        }
      });
    }
    return (
      res || resarray.find((val) => val && val.refItem == "idSN" && val.data)
    );
  }
  filterFn = (date: Date) =>
    this.formatLot == "dd/MM"
      ? date.getFullYear() === new Date().getFullYear()
      : this.formatLot == "MM/yyyy" && date.getDate() == 1;
  changeDate(e: Date) {
    this.lot.data = format(e, this.formatLot);
    this.formatLotValid = true;
  }
  changeLot(data: string) {
    if (data.match(RegexFormatLot[this.formatLot])) {
      this.formatLotValid = true;
      this.lot.data = data;
    } else {
      this.formatLotValid = false;
    }
  }

  changenbrCopie(data: string) {
    console.log(data.match(/^[1-9]{1}([0-9]){0,2}$/gm));

    data.match(/^[1-9]{1}([0-9]){0,2}$/gm)
      ? (this.nbrCopieValid = true)
      : (this.nbrCopieValid = false);
  }
  changeSNFunction() {
    this.changeSn.emit();
  }
  async print(nbrcopie, printerName) {
    const timeout = (ms) => {
      return new Promise((resolve) => setTimeout(resolve, ms));
    };
    if (this.refProd && !this.withSN) {
      this.labelService.convertToPdf();
      let i = 0;
      let fileexist;
      while (i < 3) {
        await timeout(2000);
        try {
          fileexist = (
            await this.impressionService
              .CheckFileExistence({
                path: "C:/Users/hamdi/Downloads/label.pdf",
              })
              .toPromise()
          ).exist;
        } catch (error) {
          console.log("File Not Found");
        }
        fileexist ? (i = 3) : i++;
      }

      let printStatus;
      console.log(fileexist);
      console.log(printerName);
      console.log(nbrcopie);
      if (fileexist) {
        printStatus = (
          await this.impressionService
            .PrintLabel({
              copies: +nbrcopie,
              filePath: "C:/Users/hamdi/Downloads/label.pdf",
              printerName: printerName,
            })
            .toPromise()
        ).status;
      }
      if (fileexist && printStatus == 200) {
        let res = await this.impressionService
          .DeleteFile({
            path: "C:/Users/hamdi/Downloads/label.pdf",
          })
          .toPromise();
        console.log(res.deleted);
      }
    } else if (this.refProd && this.withSN) {
      for (let i = 0; i < +nbrcopie; i++) {
        this.labelService.convertToPdf();
        let j = 0;
        let fileexist;
        while (j < 3) {
          await timeout(2000);
          try {
            fileexist = (
              await this.impressionService
                .CheckFileExistence({
                  path: "C:/Users/hamdi/Downloads/label.pdf",
                })
                .toPromise()
            ).exist;
          } catch (error) {
            console.log("File Not Found");
          }
          fileexist ? (j = 3) : j++;
        }

        let printStatus;
        if (fileexist) {
          printStatus = (
            await this.impressionService
              .PrintLabel({
                copies: 1,
                filePath: "C:/Users/hamdi/Downloads/label.pdf",
                printerName: printerName,
              })
              .toPromise()
          ).status;
        }
        if (fileexist && printStatus == 200) {
          this.changeSn.emit();
          let res = await this.impressionService
            .DeleteFile({
              path: "C:/Users/hamdi/Downloads/label.pdf",
            })
            .toPromise();
          console.log(res.deleted);
        }
      }
    }
  }
}

//TODO: Numero de serie lors de l'impression de l'etiquette
