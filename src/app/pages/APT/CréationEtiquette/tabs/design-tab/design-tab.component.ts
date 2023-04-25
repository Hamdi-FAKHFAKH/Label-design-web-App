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
export class DesignTabComponent implements AfterViewInit {
  list2 = ["div", "img", "row", "container"];
  list3 = [];
  @ViewChild(CdkDropList) dropList?: CdkDropList;
  // @Input() refProd: string;
  // @Input() dragebel;

  constructor(public dragDropService: DragDropService) {}

  allowDropPredicate = (drag: CdkDrag, drop: CdkDropList) => {
    return this.isDropAllowed(drag, drop);
  };

  isDropAllowed(drag: CdkDrag, drop: CdkDropList) {
    if (this.dragDropService.currentHoverDropListId == null) {
      return true;
    }

    return drop.id === this.dragDropService.currentHoverDropListId;
  }
  ngAfterViewInit(): void {
    if (this.dropList) {
      this.dragDropService.register(this.dropList);
    }
  }
  allowDrop(ev) {
    ev.preventDefault();
  }
  dragMoved(event: CdkDragMove<string[]>) {
    this.dragDropService.dragMoved(event);
  }
  dragReleased(event: CdkDragRelease) {
    this.dragDropService.dragReleased(event);
  }
  onDrop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      // Handle drop within the same container
      moveItemInArray(this.list2, event.previousIndex, event.currentIndex);
    } else {
      // Handle drop between different containers
      copyArrayItem(
        event.previousContainer.data,
        this.list2,
        event.previousIndex,
        event.currentIndex
      );
    }
  }
}
