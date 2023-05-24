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

    domToPdf(element, options, (pdf) => {
      console.log("jsPDF");
      this.pdfData = pdf.output("datauristring");
      this.sendPdfFileToServer();
    });
  }
  sendPdfFileToServer() {
    const pdfData = this.pdfData; // base64-encoded PDF data
    const blob = new Blob([pdfData], { type: "application/pdf" });
    const file = new File([blob], "label.pdf", { type: "application/pdf" });
    const formData = new FormData();
    formData.append("pdfFile", file, "label.pdf");
    this.ImpressionHttpService.sendPdfFileToServer(formData)
      .toPromise()
      .then((val) => {
        console.log("success");
        console.log(val);
      })
      .catch((e) => {
        console.log("error");
        console.log(e);
      });
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
