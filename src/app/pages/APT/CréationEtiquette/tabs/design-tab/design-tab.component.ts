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
import { ComponetList } from "../../ComposentData";

@Component({
  selector: "ngx-design-tab",
  templateUrl: "./design-tab.component.html",
  styleUrls: ["./design-tab.component.scss"],
})
export class DesignTabComponent implements OnInit {
  list2;
  list1;
  idToDeletePath = [];
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
  remove(id: string) {
    console.log(id + "deleted");
    console.log(this.dragDropService.list1);

    const index = this.dragDropService.list1.findIndex((obj) => {
      return obj.id == id;
    });
    index != -1
      ? this.dragDropService.list1.splice(index, 1)
      : this.dragDropService.list1.forEach((obj, index) => {
          obj.children.forEach((obj1, index1) => {
            if (obj1.id == id) {
              this.dragDropService.list1[index].children.splice(index1, 1);
              return;
            }
            obj1.children &&
              obj1.children.forEach((obj2, index2) => {
                if (obj2.id == id) {
                  this.dragDropService.list1[index].children[
                    index1
                  ].children.splice(index2, 1);
                  console.log(`${obj.id}- ${obj1.id} - ${obj2.id}`);
                }
              });
          });
        });
  }
  findIdToDelete(searchedid: string, list: ComponetList[], parentId) {
    list.forEach((obj) => {
      if (obj.id == searchedid) {
      } else {
        this.findIdToDelete(searchedid, obj.children, obj.id);
      }
    });
  }
}
