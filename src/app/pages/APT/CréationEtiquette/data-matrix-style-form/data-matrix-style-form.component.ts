import { Component, Input, OnInit } from "@angular/core";
import { DragDropService } from "../drag-drop.service";
import { ComponetList } from "../ComposentData";
import { LabelService } from "../label.service";
import { GestionProduitHttpService } from "../../GestionProduits/GestionProduitHttp.service";
import { toXML } from "jstoxml";
@Component({
  selector: "ngx-data-matrix-style-form",
  templateUrl: "./data-matrix-style-form.component.html",
  styleUrls: ["./data-matrix-style-form.component.scss"],
})
export class DataMatrixStyleFormComponent implements OnInit {
  @Input() itemId;
  xmlForm: string;
  listItem = [];
  marginCliked;
  items = {};
  fixString = "";
  produit;
  tagList = ["RS", "GS", "EOT", "|)>", ""];
  valueList = [];
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
    private dragDropService: DragDropService,
    private labelService: LabelService,
    private gestionProduitHttpService: GestionProduitHttpService
  ) {}
  getAllItems(list: ComponetList[]) {
    list.forEach((item) => {
      this.items[item.id] = item;
      if (item.children) {
        this.getAllItems(item.children);
      }
    });
  }

  ngOnInit(): void {
    this.marginCliked = "margin";
    this.getAllItems(this.dragDropService.list1);
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
    });
  }

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
  changeStyle(champName: string, champval: string) {
    this.items[this.itemId].style = {
      ...this.items[this.itemId].style,
      [champName]: champval,
    };
  }
  addItem(tag: string, val: string) {
    let tagexiste = false;
    this.listItem.forEach((val) => {
      if (Object.keys(val)[0] == tag) {
        tagexiste = true;
        return;
      }
    });

    if (tag == "|)>") {
      this.fixString = "|)>";
    }
    !tagexiste && val && tag
      ? this.listItem.push({ [tag]: val })
      : this.listItem.map((objval, index) => {
          if (Object.keys(objval)[0] == tag) {
            this.listItem[index] = { [tag]: val };
            return;
          }
        });

    const config = {
      indent: "    ",
    };
    const res = toXML(this.listItem, config);
    this.xmlForm = this.fixString + res;
    this.change("data", this.xmlForm);
  }
}
