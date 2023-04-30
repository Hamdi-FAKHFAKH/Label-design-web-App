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
  list1;

  ngOnInit(): void {
    console.log("list2 from design");
    console.log(this.dragDropService.list2);

    this.list1 = this.dragDropService.list1;
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
