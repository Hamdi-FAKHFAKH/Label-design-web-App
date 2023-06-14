import { Component, OnInit } from "@angular/core";
import { LabelService } from "../label.service";
import { DragDropService } from "../drag-drop.service";

@Component({
  selector: "ngx-tabs",
  styleUrls: ["./tabs.component.scss"],
  templateUrl: "./tabs.component.html",
})
export class TabsComponent implements OnInit {
  // enable/disable design Tab
  canDesign: boolean;
  designTabActive = false;
  labelTabActive = false;
  constructor(
    private labelService: LabelService,
    public dragDropService: DragDropService
  ) {}
  //
  ngOnInit(): void {
    this.labelService.labelInfo.subscribe((val) => {
      val.refProd ? (this.canDesign = true) : (this.canDesign = false);
    });
  }
  //change Selected Tab
  tabChange(e) {
    if (e.tabId == "label" || e.tabId == "design") {
      this.dragDropService.propertyTabActive = false;
    }
    if (e.tabId == "label") {
      this.labelTabActive = true;
      this.dragDropService.designTabActive = false;
    }
    if (e.tabId == "design") {
      this.dragDropService.designTabActive = true;
      this.labelTabActive = false;
    }
  }
}
