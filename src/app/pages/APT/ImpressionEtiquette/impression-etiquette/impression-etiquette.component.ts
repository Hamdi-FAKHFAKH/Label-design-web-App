import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  Input,
  ViewChild,
  ElementRef,
  Renderer2,
  AfterViewInit,
} from "@angular/core";
import { ImpressionHttpService } from "../impressionHttpService";
import { LabelItem } from "../../Create-label/ComposentData";
import { format } from "date-fns";
import { LabelService } from "../../Create-label/label.service";
import { GestionProduitHttpService } from "../../GestionProduits/GestionProduitHttp.service";
import {
  ProduitData,
  SerialNumberData,
} from "../../GestionProduits/GestionProduit.data";
import { LocalDataSource } from "ng2-smart-table";
import { DetailImpressionHttpService } from "../../DetailImpression/detailImpressionHttp.service";
import { AuthService } from "../../../../auth/authService.service";
import { getcanvas } from "dom-to-pdf";
import { Renderer } from "leaflet";
import { environment } from "../../../../../environments/environment";

class RegexFormatLot {
  public static readonly "date" =
    /^(0[0-9]|1[0-9])\/(0[0-9]|1[0-2])\/(20[2-9][0-9])$/gm;
  public static readonly "dd/MM" = /^(0[0-9]|1[0-9])\/(0[0-9]|1[0-2])$/gm;
  public static readonly "MM/yyyy" = /^(0[0-9]|1[0-2])\/(20[2-9][0-9])$/gm;
  public static readonly "dd/MM/yyyy" =
    /^(0[0-9]|1[0-9])\/(0[0-9]|1[0-2])\/(20[2-9][0-9])$/gm;
  public static readonly "dd-MM-yyyy" =
    /^(0[0-9]|1[0-9])\-(0[0-9]|1[0-2])\-(20[2-9][0-9])$/gm;
  public static readonly "dd MM yyyy" =
    /^(0[0-9]|1[0-9])\s(0[0-9]|1[0-2])\s(20[2-9][0-9])$/gm;
}
@Component({
  selector: "ngx-impression-etiquette",
  templateUrl: "./impression-etiquette.component.html",
  styleUrls: ["./impression-etiquette.component.scss", "./smart-table.css"],
})
export class ImpressionEtiquetteComponent implements OnInit {
  @ViewChild("printComponent", { static: false }) d1: ElementRef;
  lotdata;
  sn: SerialNumberData;
  refProd: string;
  OF: string;
  OfList: string[];
  OfListData: string[];
  printerList: string[];
  formatLot: string;
  lot: LabelItem;
  idEtiquette: string;
  produit: ProduitData;
  lotField;
  nbrCopie;
  formatLotValid: boolean;
  nbrCopieValid: boolean;
  withSN: boolean;
  datamatrix;
  etiquetteData: LabelItem[];
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
    private detailImpressionHttpService: DetailImpressionHttpService,
    private authService: AuthService,
    private renderer: Renderer2
  ) {}
  async ngOnInit() {
    this.formatLotValid = false;
    this.nbrCopieValid = false;
    this.OfListData = (
      await this.impressionHttpService.GetAllOF().toPromise()
    ).of.map((res) => res.ofnum);
    this.printerList = await this.impressionHttpService
      .GetPrinterList()
      .toPromise();
    this.OfList = this.OfListData.slice(0, 20);
  }
  async getOFinfo(ofnum) {
    this.source.load([]);
    this.lotField = "";
    this.nbrCopie = "";
    if (ofnum) {
      this.OfList = this.OfListData.filter((val) =>
        val.startsWith(ofnum)
      ).slice(0, 20);
      const of = (
        await this.impressionHttpService.GetRefProduitByOF(ofnum).toPromise()
      )?.of;
      if (of) {
        this.numOF = ofnum;
        this.refProd = of?.proref || "";
        this.OF = of?.ofnum;

        try {
          this.produit = (
            await this.gestionProduitHttpService
              .getOneProduit(this.refProd)
              .toPromise()
          ).produit;
          this.idEtiquette = this.produit.idEtiquette;
        } catch (e) {}
        this.impressionDetail = {
          ...this.impressionDetail,
          OF: of.ofnum,
          refProduit: of.proref,
        };
      }
    } else {
      this.OfList = this.OfListData.slice(0, 20);
      this.refProd = "";
    }
  }
  async loadList1Data(data: LabelItem[]) {
    this.formatLotValid = false;
    this.nbrCopieValid = false;
    this.lot = this.findDateFormat(data);
    this.datamatrix = this.findDataMatrix(data);
    if (this.lot) {
      this.formatLot = this.lot.data;
      this.datamatrix;
    } else {
      this.formatLot = null;
      this.formatLotValid = true;
    }
  }
  withSNFunction(data) {
    this.withSN = data;
  }
  findDateFormat(data: LabelItem[]) {
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
  findDataMatrix(data: LabelItem[]) {
    const res = data.find((val) => val.refItem == "datamatrixData" && val.data);
    let resarray;
    if (!res) {
      resarray = data.map((val) => {
        if (val.children.length > 0) {
          return this.findDataMatrix(val.children);
        } else {
          return null;
        }
      });
    }
    return (
      res ||
      resarray.find((val) => val && val.refItem == "datamatrixData" && val.data)
    );
  }
  findSN(data: LabelItem[]) {
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
    this.formatLot.includes("dd") && this.formatLot.includes("MM")
      ? date.getFullYear() === new Date().getFullYear()
      : this.formatLot == "MM/yyyy" && date.getDate() == 1;
  changeDate(e: Date) {
    this.lot.data = format(e, this.formatLot);
    this.lotdata = this.lot.data;
    this.datamatrix.data = this.datamatrix.data
      .toString()
      .replaceAll(this.formatLot, this.lot.data);
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
      this.lotdata = this.lot.data;
      this.datamatrix.data = this.datamatrix.data
        .toString()
        .replaceAll(this.formatLot, this.lot.data);
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
    if (data.match(/^[1-9]{1}([0-9]){0,2}$/gm)) {
      this.nbrCopieValid = true;
      this.nbrCopie = +data;
      this.fillTable();
    } else {
      this.nbrCopieValid = false;
    }
  }
  getSN(sn: SerialNumberData) {
    this.sn = sn;
  }
  IswithDataMatrix(data: boolean) {
    this.impressionDetail.codeQR = data ? "Oui" : "Non";
  }
  // print label
  async print(nbrcopie, printerName) {
    const timeout = (ms) => {
      return new Promise((resolve) => setTimeout(resolve, ms));
    };
    if (this.refProd && !this.withSN) {
      await this.labelService.convertToPdf();
      let fileexist;
      try {
        fileexist = (
          await this.impressionHttpService
            .CheckFileExistence(
              `PdfFiles/label-${this.refProd}.pdf`.replace("/", "%2F")
            )
            .toPromise()
        ).exist;
      } catch (error) {}
      let printStatus;
      if (fileexist) {
        const resde = await this.impressionHttpService
          .DeleteFile(`PdfFiles/label-${this.refProd}.pdf`.replace("/", "%2F"))
          .toPromise();
        const res = await this.labelService.sendPdfFileToServer(this.refProd);
        printStatus = (
          await this.impressionHttpService
            .PrintLabel({
              copies: nbrcopie,
              filePath: `${environment.pdfPath}/label-${this.refProd}.pdf`,
              printerName: printerName,
            })
            .toPromise()
        ).status;
      } else {
        fileexist = await this.labelService.sendPdfFileToServer(this.refProd);
        printStatus = (
          await this.impressionHttpService
            .PrintLabel({
              copies: nbrcopie,
              filePath: `${environment.pdfPath}/label-${this.refProd}.pdf`,
              printerName: printerName,
            })
            .toPromise()
        ).status;
      }
      if (fileexist && printStatus == 200) {
        const printedLabel = (
          await this.detailImpressionHttpService
            .GetALLEtiquettesImprimees()
            .toPromise()
        ).etiquettesImprimees.find((val) => val.refProd == this.refProd);
        await this.createPrintedLabel(
          printedLabel ? +printedLabel.nbrCopie + nbrcopie : nbrcopie,
          `${environment.pdfPath}/label-${this.refProd}.pdf`
        );
        this.changeSn.emit();
      }
    } else if (this.refProd && this.withSN) {
      for (let i = 0; i < +nbrcopie; i++) {
        await this.labelService.convertToPdf();
        let fileexist;
        try {
          fileexist = (
            await this.impressionHttpService
              .CheckFileExistence(
                `PdfFiles/label-${this.refProd}-${
                  this.sn ? this.sn.prefix + this.sn.suffix : ""
                }.pdf`.replace("/", "%2F")
              )
              .toPromise()
          ).exist;
        } catch (error) {}
        let printStatus;
        if (fileexist) {
          const resde = await this.impressionHttpService
            .DeleteFile(
              `PdfFiles/label-${this.refProd}.pdf`.replace("/", "%2F")
            )
            .toPromise();

          const res = await this.labelService.sendPdfFileToServer(
            `${this.refProd}-${this.sn ? this.sn.prefix + this.sn.suffix : ""}`
          );

          printStatus = (
            await this.impressionHttpService
              .PrintLabel({
                copies: 1,
                filePath: `${environment.pdfPath}/label-${this.refProd}-${
                  this.sn ? this.sn.prefix + this.sn.suffix : ""
                }.pdf`,
                printerName: printerName,
              })
              .toPromise()
          ).status;
        } else {
          fileexist = await this.labelService.sendPdfFileToServer(
            `${this.refProd}-${this.sn ? this.sn.prefix + this.sn.suffix : ""}`
          );
          printStatus = (
            await this.impressionHttpService
              .PrintLabel({
                copies: 1,
                filePath: `${environment.pdfPath}/label-${this.refProd}-${
                  this.sn ? this.sn.prefix + this.sn.suffix : ""
                }.pdf`,
                printerName: printerName,
              })
              .toPromise()
          ).status;
        }
        if (fileexist && printStatus == 200) {
          await this.createPrintedLabel(
            1,
            `${environment.pdfPath}/label-${this.refProd}-${
              this.sn ? this.sn.prefix + this.sn.suffix : ""
            }.pdf`
          );
          this.changeSn.emit();
          await timeout(1000);
        }
      }
    }
  }
  async createPrintedLabel(nbrCopie, filePath) {
    let d = new Date();
    let ye = new Intl.DateTimeFormat("en", { year: "numeric" }).format(d);
    let mo = new Intl.DateTimeFormat("en", { month: "2-digit" }).format(d);
    let da = new Intl.DateTimeFormat("en", { day: "2-digit" }).format(d);
    await this.detailImpressionHttpService
      .CreateEtiquetteImprimee({
        dataMatrixData: this.produit["datamatrixData"]
          .replace("<<SN>>", this.sn?.prefix + this.sn?.suffix)
          .replace("<<OF>>", this.OF)
          .replace("<<FormatLot>>", this.impressionDetail.lot),
        idEtiquette: this.idEtiquette,
        action: "impression",
        date: new Date(),
        nbrCopie: nbrCopie,
        motifReimpression: null,
        formatLot: this.impressionDetail.lot,
        numOF: this.numOF,
        refProd: this.refProd,
        serialNumber: this.sn ? this.sn.prefix + this.sn.suffix : "-",
        state: "success",
        userMatricule: this.authService.user.getValue().matricule,
        withDataMatrix: this.impressionDetail.codeQR ? true : false,
        filePath: filePath,
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
