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
  math = Math;
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
