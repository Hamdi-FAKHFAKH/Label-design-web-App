import { Component, OnInit, Output, EventEmitter, Input } from "@angular/core";
import { ImpressionHttpService } from "../impressionHttpService";
import { ComponetList } from "../../CréationEtiquette/ComposentData";
import { format } from "date-fns";
import { LabelService } from "../../CréationEtiquette/label.service";
import { GestionProduitHttpService } from "../../GestionProduits/GestionProduitHttp.service";
import { SerialNumberData } from "../../GestionProduits/GestionProduit.data";
import { LocalDataSource } from "ng2-smart-table";
import { DetailImpressionHttpService } from "../../DetailImpression/detailImpressionHttp.service";
class RegexFormatLot {
  public static readonly "date" =
    /^(0[0-9]|1[0-9])\/(0[0-9]|1[0-2])\/(20[2-9][0-9])$/gm;
  public static readonly "dd/MM" = /^(0[0-9]|1[0-9])\/(0[0-9]|1[0-2])$/gm;
  public static readonly "MM/yyyy" = /^(0[0-9]|1[0-2])\/(20[2-9][0-9])$/gm;
}
@Component({
  selector: "ngx-impression-etiquette",
  templateUrl: "./impression-etiquette.component.html",
  styleUrls: ["./impression-etiquette.component.scss", "./smart-table.css"],
})
export class ImpressionEtiquetteComponent implements OnInit {
  sn: SerialNumberData;
  refProd: string;
  OfList: string[];
  printerList: string[];
  formatLot: string;
  lot: ComponetList;
  idEtiquette: string;
  lotField;
  nbrCopie;
  formatLotValid: boolean;
  nbrCopieValid: boolean;
  withSN: boolean;
  etiquetteData: ComponetList[];
  changeSn = new EventEmitter();
  numOF: string;
  listofImpressionDetail;
  settings = {
    actions: false,
    hideSubHeader: true,
    pager: { display: true },
    filter: false,
    mode: "external",
    columns: {
      OF: {
        title: "Numéro OF",
        type: "string",
        filter: false,
        class: "customformat",
      },
      refProduit: {
        title: "Référence Produit",
        type: "string",
        filter: false,
      },
      lot: {
        title: "Numéro de Lot",
        type: "string",
        filter: false,
      },
      sn: {
        title: "Numéro de Série",
        type: "string",
        filter: false,
      },
      codeQR: {
        title: "Code QR",
        type: "string",
        filter: false,
      },
      nbrEtiquette: {
        title: "Nombre d'étiquette",
        type: "string",
        filter: false,
      },
    },
  };
  source: LocalDataSource = new LocalDataSource();
  impressionDetail: {
    OF: string;
    refProduit?: string;
    lot: string;
    sn: string;
    codeQR: string;
    nbrEtiquette: number;
  };
  constructor(
    private impressionHttpService: ImpressionHttpService,
    private labelService: LabelService,
    private gestionProduitHttpService: GestionProduitHttpService,
    private detailImpressionHttpService: DetailImpressionHttpService
  ) {}
  async ngOnInit() {
    this.formatLotValid = false;
    this.nbrCopieValid = false;
    this.OfList = (
      await this.impressionHttpService.GetAllOF().toPromise()
    ).of.map((res) => res.ofnum);
    this.printerList = await this.impressionHttpService
      .GetPrinterList()
      .toPromise();
  }
  async getOFinfo(ofnum) {
    this.source.load([]);
    this.lotField = "";
    this.nbrCopie = "";
    if (ofnum) {
      const of = (
        await this.impressionHttpService.GetRefProduitByOF(ofnum).toPromise()
      ).of;
      this.numOF = ofnum;
      this.refProd = of.proref;
      try {
        this.idEtiquette = await (
          await this.gestionProduitHttpService
            .getOneProduit(this.refProd)
            .toPromise()
        ).produit.idEtiquette;
      } catch (e) {}
      this.impressionDetail = {
        ...this.impressionDetail,
        OF: of.ofnum,
        refProduit: of.proref,
      };
    }
  }
  async loadList1Data(data: ComponetList[]) {
    this.formatLotValid = false;
    this.nbrCopieValid = false;
    this.lot = this.findDateFormat(data);
    if (this.lot) {
      this.formatLot = this.lot.data;
    } else {
      this.formatLot = null;
      this.formatLotValid = true;
    }
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
          return this.findSN(val.children);
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
    this.impressionDetail = {
      ...this.impressionDetail,
      lot: this.lot.data,
    };
    this.fillTable();
  }
  changeLot(data: string) {
    if (data.match(RegexFormatLot[this.formatLot]) && data) {
      this.formatLotValid = true;
      this.lot.data = data;
      this.impressionDetail = {
        ...this.impressionDetail,
        lot: this.lot.data,
      };
      this.fillTable();
    } else {
      this.formatLotValid = false;
    }
  }

  changenbrCopie(data: string) {
    console.log(data.match(/^[1-9]{1}([0-9]){0,2}$/gm));

    if (data.match(/^[1-9]{1}([0-9]){0,2}$/gm)) {
      this.nbrCopieValid = true;
      this.nbrCopie = +data;
      this.fillTable();
    } else {
      this.nbrCopieValid = false;
    }
  }
  changeSNFunction() {
    this.changeSn.emit();
  }
  getSN(sn: SerialNumberData) {
    this.sn = sn;
  }
  IswithDataMatrix(data: boolean) {
    this.impressionDetail.codeQR = data ? "Oui" : "Non";
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
            await this.impressionHttpService
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
          await this.impressionHttpService
            .PrintLabel({
              copies: +nbrcopie,
              filePath: "C:/Users/hamdi/Downloads/label.pdf",
              printerName: printerName,
            })
            .toPromise()
        ).status;
      }
      if (fileexist && printStatus == 200) {
        let res = await this.impressionHttpService
          .DeleteFile({
            path: "C:/Users/hamdi/Downloads/label.pdf",
          })
          .toPromise();
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
              await this.impressionHttpService
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
            await this.impressionHttpService
              .PrintLabel({
                copies: 1,
                filePath: "C:/Users/hamdi/Downloads/label.pdf",
                printerName: printerName,
              })
              .toPromise()
          ).status;
          if (fileexist && printStatus == 200) {
            this.changeSn.emit();
            let res = await this.impressionHttpService
              .DeleteFile({
                path: "C:/Users/hamdi/Downloads/label.pdf",
              })
              .toPromise();
            await this.createPrintedLabel(1);
          }
        }
      }
    }
  }
  async createPrintedLabel(nbrCopie) {
    let d = new Date();
    let ye = new Intl.DateTimeFormat("en", { year: "numeric" }).format(d);
    let mo = new Intl.DateTimeFormat("en", { month: "numeric" }).format(d);
    let da = new Intl.DateTimeFormat("en", { day: "2-digit" }).format(d);
    await this.detailImpressionHttpService
      .CreateEtiquetteImprimee({
        idEtiquette: this.idEtiquette,
        action: "impression",
        dateImp: `${da}/${mo}/${ye}`,
        MotifReimpression: "",
        nbrCopie: nbrCopie,
        formatLot: this.impressionDetail.lot,
        numOF: this.numOF,
        refProd: this.refProd,
        serialNumber: this.sn ? this.sn.prefix + this.sn.suffix : "-",
        state: "success",
        userMatricule: "ali",
        withDataMatrix: this.impressionDetail.codeQR ? true : false,
      })
      .toPromise();
  }
  fillTable() {
    this.listofImpressionDetail = [];
    if (this.sn && this.withSN) {
      let suffix = this.sn && this.sn.suffix;
      for (let i = 0; i < +this.nbrCopie; i++) {
        this.listofImpressionDetail.push({
          ...this.impressionDetail,
          sn: this.sn.prefix + suffix,
          nbrEtiquette: 1,
        });
        const suff = parseInt(suffix) + +this.sn.pas;
        suffix = suff.toString().padStart(+this.sn.nbrCaractere, "0");
      }
      this.listofImpressionDetail &&
        this.source.load(this.listofImpressionDetail);
    } else {
      this.listofImpressionDetail.push({
        ...this.impressionDetail,
        nbrEtiquette: +this.nbrCopie,
        sn: "   -   ",
      });
      this.listofImpressionDetail &&
        this.source.load(this.listofImpressionDetail);
    }
  }
}

//TODO: les différent sénario lors de scanner OF
