import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { LabeltHttpService } from "./labelHTTP.service";
import { ImpressionHttpService } from "../ImpressionEtiquette/impressionHttpService";
var domToPdf = require("dom-to-pdf");
@Injectable()
export class LabelService {
  // initial label data
  private initLabelInfo: infoLabel = {
    id: null,
    refProd: null,
    color: "#ffffff",
    format: "rectangle",
    largeur: 150,
    longueur: 50,
    refProdSimlaire: null,
    withGrid: false,
    withRule: false,
    padding: 0,
    showPaddingCadre: false,
  };
  labelInfo = new BehaviorSubject<infoLabel>(this.initLabelInfo);
  //Enable/disable the Design tab
  canDesign = false;
  base64PdfData;
  //
  constructor(private ImpressionHttpService: ImpressionHttpService) {}
  async convertToPdf() {
    var element = document.getElementById("test");
    var options = {
      filename: "label.pdf",
      compression: "FAST",
      scale: 3,
    };
    const pdf = await domToPdf(element, options);
    this.base64PdfData = pdf.output("datauristring");
  }
  //save pdf file in the server
  sendPdfFileToServer(refProd) {
    return this.ImpressionHttpService.sendPdfFileToServer({
      data: this.base64PdfData,
      fileName: `label-${refProd}.pdf`,
    }).toPromise();
  }
}
export interface infoLabel {
  id: string;
  refProd: string;
  refProdSimlaire: string;
  longueur: number;
  largeur: number;
  padding: number;
  format: string;
  color: string;
  withRule: boolean;
  withGrid: boolean;
  showPaddingCadre: boolean;
}
