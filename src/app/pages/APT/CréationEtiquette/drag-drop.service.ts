import {
  CdkDragMove,
  CdkDragRelease,
  CdkDropList,
} from "@angular/cdk/drag-drop";
import { DOCUMENT } from "@angular/common";
import { Inject, Injectable } from "@angular/core";
@Injectable()
export class DragDropService {
  dropLists: CdkDropList[] = [];
  currentHoverDropListId?: string;

  constructor(@Inject(DOCUMENT) private document: Document) {}

  public register(dropList: CdkDropList) {
    if (
      this.dropLists.map((val) => {
        if (val == dropList) {
          return false;
        }
      })
    ) {
      this.dropLists.push(dropList);
      console.log("register");
      console.log(this.dropLists);
    }
  }

  dragMoved(event: CdkDragMove<String[]>) {
    let elementFromPoint = this.document.elementFromPoint(
      event.pointerPosition.x,
      event.pointerPosition.y
    );

    if (!elementFromPoint) {
      this.currentHoverDropListId = undefined;
      return;
    }

    let dropList = elementFromPoint.classList.contains("cdk-drop-list")
      ? elementFromPoint
      : elementFromPoint.closest(".cdk-drop-list");

    if (!dropList) {
      this.currentHoverDropListId = undefined;
      return;
    }

    this.currentHoverDropListId = dropList.id;
  }

  dragReleased(event: CdkDragRelease) {
    this.currentHoverDropListId = undefined;
  }
}
