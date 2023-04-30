import { Component, OnInit } from "@angular/core";
import { LabelService } from "../label.service";

@Component({
  selector: "ngx-tabs",
  styleUrls: ["./tabs.component.scss"],
  templateUrl: "./tabs.component.html",
})
export class TabsComponent implements OnInit {
  canDesign;
  constructor(private labelService: LabelService) {}
  ngOnInit(): void {
    this.labelService.labelInfo.subscribe((val) => {
      val.refProd ? (this.canDesign = true) : (this.canDesign = false);
    });
  }
}
