import { Component, Input, OnInit } from "@angular/core";
import { DragDropService } from "../drag-drop.service";
import { ComponetList } from "../ComposentData";

@Component({
  selector: "ngx-data-matrix-style-form",
  templateUrl: "./data-matrix-style-form.component.html",
  styleUrls: ["./data-matrix-style-form.component.scss"],
})
export class DataMatrixStyleFormComponent implements OnInit {
  @Input() itemId;
  marginCliked;
  items = {};
  codage = ["ASCI"];
  barcodeObjs = [
    { name: "Code 128", value: "CODE128" },
    {
      name: "Code 128B",
      value: "CODE128B",
    },
    { name: "Code39", value: "CODE39" },
  ];
  constructor(private dragDropService: DragDropService) {}
  getAllItems(list: ComponetList[]) {
    list.forEach((item) => {
      this.items[item.id] = item;
      if (item.children) {
        this.getAllItems(item.children);
      }
    });
    console.log("items");
  }

  ngOnInit(): void {
    this.marginCliked = "margin";
    this.getAllItems(this.dragDropService.list1);
  }

  change(champName: string, champval: string) {
    if (champName == "format") {
      this.items[this.itemId].dataMatrixFormat = champval;
    } else if (champName == "code") {
      this.items[this.itemId].dataMatrixCode = champval;
    } else if (champName == "longueur") {
      this.items[this.itemId].style.height = champval;
    } else if (champName == "largeur") {
      this.items[this.itemId].style.width = champval;
    } else {
      this.items[this.itemId].data = champval;
    }
    console.log(this.dragDropService.list1);
  }
  changeStyle(champName: string, champval: string) {
    this.items[this.itemId].style = {
      ...this.items[this.itemId].style,
      [champName]: champval,
    };
  }
}
