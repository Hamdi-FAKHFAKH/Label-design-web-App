import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { LabeltHttpService } from "./labelHTTP.service";
import { ImpressionHttpService } from "../ImpressionEtiquette/impressionHttpService";
var domToPdf = require("dom-to-pdf");
@Injectable()
export class LabelService {
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
  canDesign = false;
  pdfData;
  constructor(private ImpressionHttpService: ImpressionHttpService) {}
  async convertToPdf() {
    var element = document.getElementById("test");
    var options = {
      filename: "label.pdf",
      compression: "FAST",
      scale: 3,
    };
    const pdf = await domToPdf(element, options);
    this.pdfData = pdf.output("datauristring");
  }
  sendPdfFileToServer(refProd) {
    return this.ImpressionHttpService.sendPdfFileToServer({
      data: this.pdfData,
      fileName: `label-${refProd}.pdf`,
    }).toPromise();
  }
}

interface infoLabel {
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
