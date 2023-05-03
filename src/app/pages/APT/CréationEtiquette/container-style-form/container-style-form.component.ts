import { Component, Input, OnInit } from "@angular/core";
import { DragDropService } from "../drag-drop.service";

@Component({
  selector: "ngx-container-style-form",
  templateUrl: "./container-style-form.component.html",
  styleUrls: ["./container-style-form.component.scss"],
})
export class ContainerStyleFormComponent implements OnInit {
  paddingClicked;
  marginCliked;
  @Input() itemId;
  items = {};

  constructor(private dragDropService: DragDropService) {}

  ngOnInit(): void {
    this.paddingClicked = "padding";
    this.marginCliked = "margin";
    this.items = this.dragDropService.items;
  }
  changeStyle(itemName: string, itemValue: string) {
    this.items[this.itemId].style = {
      ...this.items[this.itemId].style,
      [itemName]: itemValue,
    };
    console.log("list1");
    console.log(this.dragDropService.list1);
  }
}
