import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { LabeltHttpService } from "./labelHTTP.service";
import { ImpressionHttpService } from "../ImpressionEtiquette/impressionHttpService";
import { downloadPdf, getcanvas } from "dom-to-pdf";
@Injectable()
export class LabelService {
  // initial label data
  private initLabelInfo: infoLabel = {
    id: null,
    refProd: null,
    color: "#ffffff",
    format: "rectangle",
    largeur: 50,
    longueur: 150,
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
    console.log(this.labelInfo.getValue().longueur);
    var element = document.getElementById("test");
    var options = {
      filename: "label.pdf",
      compression: "FAST",
      scale: 1,
      overrideWidth: this.labelInfo.getValue().longueur * 3.78,
    };
    const pdf = await downloadPdf(element, options);
    // const canvas = await getcanvas(element, options);
    // console.log(canvas);
    // document.getElementById("printComponent").appendChild(canvas);
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
