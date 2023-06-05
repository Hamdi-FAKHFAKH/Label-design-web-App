import { Component, Input, OnInit } from "@angular/core";
import { DragDropService } from "../drag-drop.service";

@Component({
  selector: "ngx-container-style-form",
  templateUrl: "./container-style-form.component.html",
  styleUrls: ["./container-style-form.component.scss"],
})
export class ContainerStyleFormComponent implements OnInit {
  // specify which padding selected
  paddingClicked: string;
  // specify which margin selected
  marginCliked: string;
  // the id of the selected item in the label
  @Input() itemId: string;
  defaultrotation: string;
  math = Math;
  //
  constructor(public dragDropService: DragDropService) {}

  ngOnInit(): void {
    this.paddingClicked = "padding";
    this.marginCliked = "margin";
    const transformvalue: string = this.dragDropService.items[this.itemId].style
      ? this.dragDropService.items[this.itemId].style.transform
      : null;
    if (transformvalue) {
      this.defaultrotation = transformvalue.substring(
        transformvalue.indexOf("(") + 1,
        transformvalue.indexOf(")")
      );
    }
  }
  // change container style
  changeStyle(itemName: string, itemValue: string) {
    this.dragDropService.items[this.itemId].style = {
      ...this.dragDropService.items[this.itemId].style,
      [itemName]: itemValue,
    };
  }
}
