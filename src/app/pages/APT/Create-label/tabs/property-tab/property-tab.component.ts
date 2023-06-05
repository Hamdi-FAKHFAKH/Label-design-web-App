import { Component, OnInit } from "@angular/core";
import { DragDropService } from "../../drag-drop.service";

@Component({
  selector: "ngx-property-tab",
  templateUrl: "./property-tab.component.html",
  styleUrls: ["./property-tab.component.scss"],
})
export class PropertyTabComponent {
  constructor(public dragDropService: DragDropService) {}
}
