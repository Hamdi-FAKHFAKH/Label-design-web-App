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
    const index = this.dragDropService.listOfLabelElements.findIndex((obj) => {
      return obj.id == id;
    });
    if (index != -1) {
      this.dragDropService.listOfLabelElements[index].style = Object.assign(
        {},
        this.dragDropService.defaultTextStyle
      );
      this.dragDropService.listOfDragItems.push(
        this.dragDropService.listOfLabelElements[index]
      );
      if (this.dragDropService.dragDropLibre) {
        this.dragDropService.dragPosition[
          this.dragDropService.listOfLabelElements[index].id
        ] = this.dragDropService.listOfLabelElements[index];
      }
      console.log("***drag postion after delete");
      console.log(this.dragDropService.dragPosition);

      this.dragDropService.listOfLabelElements.splice(index, 1);
    } else {
      this.dragDropService.listOfLabelElements.forEach((obj, index) => {
        obj.children.forEach((obj1, index1) => {
          if (obj1.id == id) {
            this.dragDropService.listOfDragItems.push(
              this.dragDropService.listOfLabelElements[index].children[index1]
            );
            this.dragDropService.listOfLabelElements[index].children.splice(
              index1,
              1
            );
            return;
          }
          obj1.children &&
            obj1.children.forEach((obj2, index2) => {
              if (obj2.id == id) {
                this.dragDropService.listOfDragItems.push(
                  this.dragDropService.listOfLabelElements[index].children[
                    index1
                  ].children[index2]
                );
                this.dragDropService.listOfLabelElements[index].children[
                  index1
                ].children.splice(index2, 1);
                console.log(`${obj.id}- ${obj1.id} - ${obj2.id}`);
              }
            });
        });
      });
    }
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
