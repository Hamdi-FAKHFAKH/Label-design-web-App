import { CdkDrag, Point } from "@angular/cdk/drag-drop";
import { Component } from "@angular/core";

@Component({
  selector: "ngx-drag-drop",
  templateUrl: "./drag-drop2.component.html",
  styleUrls: ["./drag-drop2.component.css"],
})
export class DragDrop2Component {
  dragPosition = { x: 0, y: 0 };
  color: String = "green";
  dragebel = true;
  changePosition() {
    // var x = event.dropPoint.x;
    // var y = event.dropPoint.y;
    // y = y < 69 ? 0 : y - 69;
    // //x =this.dragPosition.x < 461 ? 0 :
    // x = this.dragPosition.x > 861 ? 861 : x - 470;
    var bodyRect = document.body.getBoundingClientRect();
    var x =
      document.getElementById("drag1").getBoundingClientRect().left -
      bodyRect.left;
    var y =
      document.getElementById("drag1").getBoundingClientRect().top -
      bodyRect.top;
    this.dragPosition = {
      x: x,
      y: y,
    };
    console.log(x);
  }
  changePos() {
    var divpos = console.log(divpos);
    this.dragPosition = {
      x: this.dragPosition.x > 369 ? 369 : this.dragPosition.x,
      y: this.dragPosition.y > 369 ? 369 : this.dragPosition.y,
    };
  }

  getInfo(event) {
    var x = event.dropPoint.x;
    var y = event.dropPoint.y;
    //y = y < 69 ? 0 : y > 300 ? 300 : y - 69;
    x = x < 470 ? 0 : x > 861 ? 861 : x - 470;
    //y = y < 69 ? 0 : y > 300 ? 300 : y - 69;
    console.log("x : " + x + " y : " + y);
  }
  allowDrop(ev) {
    ev.preventDefault();
  }

  drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
  }

  drop(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    console.log(data);
    if (data.includes("drag")) {
      ev.target.appendChild(document.getElementById(data));
      document.getElementById("msg").remove();
      this.dragebel = false;
    }
  }
}
