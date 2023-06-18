import {
  AfterViewInit,
  Component,
  Input,
  OnInit,
  ViewChild,
} from "@angular/core";
import { CdkDragDrop } from "@angular/cdk/drag-drop";
import { DragDropService } from "../../drag-drop.service";
import { LabelItem } from "../../ComposentData";

@Component({
  selector: "ngx-design-tab",
  templateUrl: "./design-tab.component.html",
  styleUrls: ["./design-tab.component.scss"],
})
export class DesignTabComponent {
  idToDeletePath = [];

  constructor(public dragDropService: DragDropService) {}
  // executed when drag element from design tab
  dragMoved(event) {
    this.dragDropService.dragMoved(event);
  }
  //executed when drop element in the label
  onDrop(event: CdkDragDrop<string[]>) {
    this.dragDropService.drop(event);
  }
  //delete the selected element in the label
  remove(id: string) {
    this.dragDropService.remove(id);
  }
  findIdToDelete(searchedid: string, list: LabelItem[], parentId) {
    list.forEach((obj) => {
      if (obj.id == searchedid) {
      } else {
        this.findIdToDelete(searchedid, obj.children, obj.id);
      }
    });
  }
}
