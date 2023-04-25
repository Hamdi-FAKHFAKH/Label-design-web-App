import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
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
    padding: 3,
    showPaddingCadre: false,
  };
  labelInfo = new BehaviorSubject<infoLabel>(this.initLabelInfo);
  convertToPdf() {
    var element = document.getElementById("test");
    var options = {
      filename: "test.pdf",
      compression: "FAST",
      scale: 5,
    };
    domToPdf(element, options, function (pdf) {
      console.log("done");
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
