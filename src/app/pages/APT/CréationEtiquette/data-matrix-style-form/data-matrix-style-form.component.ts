import { Component, Input, OnInit } from "@angular/core";
import { DragDropService } from "../drag-drop.service";
import { LabelItem } from "../ComposentData";
import { LabelService } from "../label.service";
import { GestionProduitHttpService } from "../../GestionProduits/GestionProduitHttp.service";
import { toXML } from "jstoxml";
import { LabeltHttpService } from "../labelHTTP.service";
import { ProduitData } from "../../GestionProduits/GestionProduit.data";
@Component({
  selector: "ngx-data-matrix-style-form",
  templateUrl: "./data-matrix-style-form.component.html",
  styleUrls: ["./data-matrix-style-form.component.scss"],
})
export class DataMatrixStyleFormComponent implements OnInit {
  // the id of the selected item in the label
  @Input() itemId: string;
  xmlForm: string;
  math = Math;
  // specify which margin selected
  marginCliked: string;
  //{itemID : itemObject} of items in the label
  items = {};
  produit: ProduitData;
  tagList: string[] = [];
  valueList: string[] = [];
  codage = ["ASCI"];
  barcodeObjs = [
    { name: "Code 128", value: "CODE128" },
    {
      name: "Code 128B",
      value: "CODE128B",
    },
    { name: "Code39", value: "CODE39" },
  ];
  constructor(
    public dragDropService: DragDropService,
    private labelService: LabelService,
    private labelHttpService: LabeltHttpService,
    private gestionProduitHttpService: GestionProduitHttpService
  ) {}
  //
  async ngOnInit() {
    this.xmlForm = this.dragDropService.items[this.itemId].data;
    this.marginCliked = "margin";
    this.items = this.dragDropService.items;
    this.tagList = (
      await this.labelHttpService.GetAllTag().toPromise()
    ).tags.map((val) => val.tag);
    this.labelService.labelInfo.subscribe((val) => {
      val.refProd !== null &&
        this.gestionProduitHttpService
          .getOneProduit(val.refProd)
          .toPromise()
          .then((resProduit) => {
            this.produit = resProduit.produit;
            Object.keys(resProduit.produit).forEach((item) => {
              if (
                resProduit.produit[item] &&
                typeof resProduit.produit[item] != "boolean"
              )
                this.valueList.push(resProduit.produit[item]);
            });
          });
      this.valueList.push("<<SN>>");
      this.valueList.push("<<OF>>");
      this.valueList.push("<<FormatLot>>");
    });
  }
  // change QR code Parameter
  change(champName: string, champval: string) {
    if (champName == "format") {
      this.items[this.itemId].dataMatrixFormat = champval;
    } else if (champName == "code") {
      this.items[this.itemId].dataMatrixCode = champval;
    } else if (champName == "hauteur") {
      this.items[this.itemId].style.height = champval;
    } else if (champName == "largeur") {
      this.items[this.itemId].style.width = champval;
    } else {
      this.items[this.itemId].data = champval;
    }
  }
  //change datamatrix style
  changeStyle(champName: string, champval: string) {
    this.items[this.itemId].style = {
      ...this.items[this.itemId].style,
      [champName]: champval,
    };
    if (
      champName == "width" &&
      this.items[this.itemId].dataMatrixFormat == "qrcode"
    ) {
      this.items[this.itemId].style = {
        ...this.items[this.itemId].style,
        height: champval,
      };
    }
  }
  // add data to the dataMatrix
  addItem(tag: string, val: string) {
    if (tag == "|)>") {
      this.xmlForm = "|)>" + this.xmlForm;
    }
    let listItem;
    if (tag !== "|)>") {
      listItem = [{ [tag]: val }];
    }
    const config = {
      indent: "    ",
      attributeReplacements: {
        "<": "<",
        ">": ">",
        "&": "&",
        '"': "'",
      },
      contentReplacements: {
        "<": "<",
        ">": ">",
        "&": "&",
        '"': "'",
      },
    };
    const res = toXML(listItem, config);
    this.xmlForm = this.xmlForm + res;
    this.change("data", this.xmlForm);
  }
  //
  changePosition(x, y) {
    const xround = Math.round(+x / 0.26);
    const yround = Math.round(+y / 0.26);
    this.dragDropService.dragPosition[this.itemId] = {
      x: x != null ? +xround : this.dragDropService.dragPosition[this.itemId].x,
      y: y != null ? +yround : this.dragDropService.dragPosition[this.itemId].y,
    };
    console.log(Math.round(+y / 0.26));

    console.log(this.dragDropService.dragPosition[this.itemId]);
  }
}
