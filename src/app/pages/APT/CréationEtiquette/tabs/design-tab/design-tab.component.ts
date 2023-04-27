import {
  AfterViewInit,
  Component,
  Input,
  OnInit,
  ViewChild,
} from "@angular/core";
import { ShareService } from "../../share.service";
import {
  CdkDrag,
  CdkDragDrop,
  CdkDragMove,
  CdkDragRelease,
  CdkDropList,
  copyArrayItem,
  moveItemInArray,
} from "@angular/cdk/drag-drop";
import { DragDropService } from "../../drag-drop.service";

@Component({
  selector: "ngx-design-tab",
  templateUrl: "./design-tab.component.html",
  styleUrls: ["./design-tab.component.scss"],
})
export class DesignTabComponent implements OnInit {
  list2;
  list3 = [];
  ngOnInit(): void {
    this.list2 = this.dragDropService.list2;
  }
  // @Input() refProd: string;
  // @Input() dragebel;

  constructor(public dragDropService: DragDropService) {}

  dragMoved(event) {
    this.dragDropService.dragMoved(event);
  }

  onDrop(event: CdkDragDrop<string[]>) {
    this.dragDropService.drop(event);
  }
}
