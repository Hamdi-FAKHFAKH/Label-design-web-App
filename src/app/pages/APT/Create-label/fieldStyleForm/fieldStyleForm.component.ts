import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from "@angular/core";
import { NgForm } from "@angular/forms";
import { DragDropService } from "../drag-drop.service";
import { ComponentStyle, LabelItem } from "../ComposentData";
import { ProduitData } from "../../GestionProduits/GestionProduit.data";

@Component({
  selector: "ngx-field-style-form",
  templateUrl: "./fieldStyleForm.component.html",
  styleUrls: ["./fieldStyleForm.component.scss"],
})
export class FieldStyleFormComponent implements OnInit, OnChanges {
  // the id of the selected item in the label
  @Input() itemId;
  math = Math;
  produit: ProduitData;
  listOfLabelElementsCopy: LabelItem[] = [];
  componentstyle: ComponentStyle = {};
  // specify which padding selected
  paddingClicked: string;
  // specify which margin selected
  marginCliked: string;
  defaultrotation: string;
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
  defaultSelectedStyle: string;
  stylesDuplicated = {};
  constructor(public dragDropService: DragDropService) {}
  //
  ngOnInit(): void {
    this.produit = this.dragDropService.produit;
    this.componentstyle.bold == false;
    this.componentstyle.italic == false;
    this.componentstyle.underline == false;
  }
  // executed when changing item ID (when changing selected item)
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
    // Object.keys(this.componentstyle).forEach((key) => {
    //   if (!this.dragDropService.items[this.itemId].style[key])
    //     this.dragDropService.items[this.itemId].style[key] =
    //       this.componentstyle[key];
    // });
    this.componentstyle.bold == false;
    this.componentstyle.italic == false;
    this.componentstyle.underline == false;
    this.listOfLabelElementsCopy.length = 0;
    this.findDiplicatedStyle(this.dragDropService.listOfLabelElements);
    this.defaultSelectedStyle = this.stylesDuplicated[this.itemId] || null;
  }
  //change the style of the text element
  changeStyle(itemName: string, itemValue: string | number | boolean) {
    console.log();

    if (itemName == "bold") {
      this.componentstyle.bold == true
        ? (this.dragDropService.items[this.itemId].style = {
            ...this.dragDropService.items[this.itemId].style,
            "font-weight": "bold",
            bold: true,
          })
        : (this.dragDropService.items[this.itemId].style = {
            ...this.dragDropService.items[this.itemId].style,
            "font-weight": "normal",
            bold: false,
          });
    }
    if (itemName == "italic") {
      this.componentstyle.italic == true
        ? (this.dragDropService.items[this.itemId].style = {
            ...this.dragDropService.items[this.itemId].style,
            "font-style": "italic",
            italic: true,
          })
        : (this.dragDropService.items[this.itemId].style = {
            ...this.dragDropService.items[this.itemId].style,
            "font-style": "normal",
            italic: false,
          });
    }
    if (itemName == "underline") {
      this.componentstyle.underline == true
        ? (this.dragDropService.items[this.itemId].style = {
            ...this.dragDropService.items[this.itemId].style,
            "text-decoration": "underline",
            underline: true,
          })
        : (this.dragDropService.items[this.itemId].style = {
            ...this.dragDropService.items[this.itemId].style,
            "text-decoration": "none",
            underline: false,
          });
    }
    this.dragDropService.items[this.itemId].style = {
      ...this.dragDropService.items[this.itemId].style,
      [itemName]: itemValue,
    };
  }
  //change position of the text element
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
  //duplicate Style of the text element
  duplicateStyle(data: string) {
    data &&
      Object.assign(
        this.dragDropService.items[this.itemId].style,
        this.dragDropService.items[data].style
      );
    this.stylesDuplicated[this.itemId] = data;
  }
  findDiplicatedStyle(list: LabelItem[]) {
    list.forEach((val) => {
      val.type == "text" && val.id != this.itemId
        ? this.listOfLabelElementsCopy.push(val)
        : val.children && this.findDiplicatedStyle(val.children);
    });
  }
}
