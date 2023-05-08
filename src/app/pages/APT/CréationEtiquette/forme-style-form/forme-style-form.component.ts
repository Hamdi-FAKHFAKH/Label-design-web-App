import { Component, Input, OnInit } from "@angular/core";
import { DragDropService } from "../drag-drop.service";

@Component({
  selector: "ngx-forme-style-form",
  templateUrl: "./forme-style-form.component.html",
  styleUrls: ["./forme-style-form.component.scss"],
})
export class FormeStyleFormComponent implements OnInit {
  @Input() itemId;
  marginCliked;
  paddingClicked;
  defaultrotation;
  constructor(public dragDropService: DragDropService) {}
  changeStyle(champName: string, champval: string) {
    this.dragDropService.items[this.itemId].style = {
      ...this.dragDropService.items[this.itemId].style,
      [champName]: champval,
    };
  }
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
}
