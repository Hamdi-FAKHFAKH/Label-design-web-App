import { Component, Input, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { DragDropService } from "../drag-drop.service";
import { ComponentStyle, ComponetList } from "../ComposentData";
import { ProduitData } from "../../GestionProduits/GestionProduit.data";

@Component({
  selector: "ngx-field-style-form",
  templateUrl: "./fieldStyleForm.component.html",
  styleUrls: ["./fieldStyleForm.component.scss"],
})
export class FieldStyleFormComponent implements OnInit {
  @Input() itemId;
  items = {};
  produit: ProduitData;
  componentstyle: ComponentStyle = {};
  paddingClicked;
  marginCliked;
  fontFamily = [
    "Verdana",
    "Geneva",
    "Tahoma",
    "sans-serif",
    "Times New Roman",
    "Courier New",
    "Courier",
    "monospace",
  ];
  constructor(public dragDropService: DragDropService) {}
  ngOnInit(): void {
    this.getAllItems(this.dragDropService.list1);
    this.produit = this.dragDropService.produit;
    this.paddingClicked = "padding";
    this.marginCliked = "margin";
    this.componentstyle = {
      "font-weight": "normal",
      bold: false,
      italic: false,
      "font-style": "normal",
      "text-decoration": "none",
      underline: false,
    };
    this.items[this.itemId].style = this.componentstyle;
  }
  getAllItems(list: ComponetList[]) {
    list.forEach((item) => {
      this.items[item.id] = item;
      if (item.children) {
        this.getAllItems(item.children);
      }
    });
  }
  changeStyle(itemName: string, itemValue: string | number | boolean) {
    if (itemName == "bold") {
      this.componentstyle.bold == true
        ? (this.componentstyle = {
            ...this.componentstyle,
            "font-weight": "bold",
          })
        : (this.componentstyle = {
            ...this.componentstyle,
            "font-weight": "normal",
          });
    }
    if (itemName == "italic") {
      this.componentstyle.italic == true
        ? (this.componentstyle = {
            ...this.componentstyle,
            "font-style": "italic",
          })
        : (this.componentstyle = {
            ...this.componentstyle,
            "font-style": "normal",
          });
    }
    if (itemName == "underline") {
      this.componentstyle.underline == true
        ? (this.componentstyle = {
            ...this.componentstyle,
            "text-decoration": "underline",
          })
        : (this.componentstyle = {
            ...this.componentstyle,
            "text-decoration": "none",
          });
    }
    this.componentstyle = {
      ...this.componentstyle,
      [itemName]: itemValue,
    };
    console.log("comp Style");

    this.items[this.itemId].style = this.componentstyle;
  }
}
