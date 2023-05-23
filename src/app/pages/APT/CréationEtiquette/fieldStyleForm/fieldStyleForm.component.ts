import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from "@angular/core";
import { NgForm } from "@angular/forms";
import { DragDropService } from "../drag-drop.service";
import { ComponentStyle, ComponetList } from "../ComposentData";
import { ProduitData } from "../../GestionProduits/GestionProduit.data";

@Component({
  selector: "ngx-field-style-form",
  templateUrl: "./fieldStyleForm.component.html",
  styleUrls: ["./fieldStyleForm.component.scss"],
})
export class FieldStyleFormComponent implements OnInit, OnChanges {
  @Input() itemId;
  math = Math;
  produit: ProduitData;
  list1;
  componentstyle: ComponentStyle = {};
  paddingClicked;
  paddingValue;
  marginValue;
  marginCliked;
  defaultrotation;
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
  defaultSelectedStyle;
  stylesDuplicated = {};
  constructor(public dragDropService: DragDropService) {}
  ngOnInit(): void {
    // this.getAllItems(this.dragDropService.list1);
    this.produit = this.dragDropService.produit;
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.paddingClicked = this.dragDropService.items[this.itemId].style[
      "padding-right"
    ]
      ? "padding-right"
      : this.dragDropService.items[this.itemId].style["padding-left"]
      ? "padding-left"
      : this.dragDropService.items[this.itemId].style["padding-top"]
      ? "padding-top"
      : this.dragDropService.items[this.itemId].style["padding-bottom"]
      ? "padding-bottom"
      : "padding";
    this.marginCliked = this.dragDropService.items[this.itemId].style[
      "margin-right"
    ]
      ? "margin-right"
      : this.dragDropService.items[this.itemId].style["margin-left"]
      ? "margin-left"
      : this.dragDropService.items[this.itemId].style["margin-top"]
      ? "margin-top"
      : this.dragDropService.items[this.itemId].style["margin-bottom"]
      ? "margin-bottom"
      : "margin";

    Object.keys(this.componentstyle).forEach((key) => {
      if (!this.dragDropService.items[this.itemId].style[key])
        this.dragDropService.items[this.itemId].style[key] =
          this.componentstyle[key];
    });

    // const transformvalue: string = this.dragDropService.items[this.itemId].style
    //   ? this.dragDropService.items[this.itemId].style.transform
    //   : null;
    // if (transformvalue) {
    //   this.defaultrotation = transformvalue.substring(
    //     transformvalue.indexOf("(") + 1,
    //     transformvalue.indexOf(")")
    //   );
    // }
    this.list1 = this.dragDropService.list1.slice();
    this.list1.splice(
      this.dragDropService.list1.findIndex((obj) => obj.id == this.itemId),
      1
    );
    this.defaultSelectedStyle = this.stylesDuplicated[this.itemId] || null;
  }
  changeStyle(itemName: string, itemValue: string | number | boolean) {
    console.log();

    if (itemName == "bold") {
      this.componentstyle.bold == true
        ? (this.dragDropService.items[this.itemId].style = {
            ...this.dragDropService.items[this.itemId].style,
            "font-weight": "bold",
          })
        : (this.dragDropService.items[this.itemId].style = {
            ...this.dragDropService.items[this.itemId].style,
            "font-weight": "normal",
          });
    }
    if (itemName == "italic") {
      this.componentstyle.italic == true
        ? (this.dragDropService.items[this.itemId].style = {
            ...this.dragDropService.items[this.itemId].style,
            "font-style": "italic",
          })
        : (this.dragDropService.items[this.itemId].style = {
            ...this.dragDropService.items[this.itemId].style,
            "font-style": "normal",
          });
    }
    if (itemName == "underline") {
      this.componentstyle.underline == true
        ? (this.dragDropService.items[this.itemId].style = {
            ...this.dragDropService.items[this.itemId].style,
            "text-decoration": "underline",
          })
        : (this.dragDropService.items[this.itemId].style = {
            ...this.dragDropService.items[this.itemId].style,
            "text-decoration": "none",
          });
    }
    this.dragDropService.items[this.itemId].style = {
      ...this.dragDropService.items[this.itemId].style,
      [itemName]: itemValue,
    };

    //this.dragDropService.items[this.itemId].style = this.componentstyle;
    // Object.assign(this.dragDropService.items[this.itemId].style, this.componentstyle);
    console.log("***style***");

    console.log(this.dragDropService.items[this.itemId].style);
  }
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
  duplicateStyle(data: string) {
    data &&
      Object.assign(
        this.dragDropService.items[this.itemId].style,
        this.dragDropService.items[data].style
      );
    this.stylesDuplicated[this.itemId] = data;
  }
}
