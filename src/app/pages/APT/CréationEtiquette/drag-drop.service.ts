import {
  CdkDragMove,
  CdkDragRelease,
  CdkDropList,
  copyArrayItem,
  moveItemInArray,
} from "@angular/cdk/drag-drop";
import { DOCUMENT } from "@angular/common";
import { Inject, Injectable } from "@angular/core";
import { v4 as uuidv4 } from "uuid";
export interface ListData {
  id: string;
  type: string;
  children: ListData[];
}
export interface DropInfo {
  targetId: string;
  action?: string;
}
@Injectable()
export class DragDropService {
  // ids for connected drop lists
  currentHoverDropListId?: string;
  // ids for connected drop lists
  dropTargetIds = ["label"]; //contient tous les id
  nodeLookup = {}; // {id : object(node)}
  nodeLookup2 = {};
  showDragPlaceholder;
  list1: ListData[] = [];
  list2: ListData[] = [
    {
      id: "item1",
      type: "container-2",
      children: [
        {
          id: "item11",
          type: "vide",
          children: [],
        },
        {
          id: "item12",
          type: "vide",
          children: [],
        },
      ],
    },
    {
      id: "item2",
      type: "container-3",
      children: [
        {
          id: "item11",
          type: "vide",
          children: [],
        },
        {
          id: "item12",
          type: "vide",
          children: [],
        },
        {
          id: "item13",
          type: "vide",
          children: [],
        },
      ],
    },
    {
      id: "item3",
      type: "container",
      children: [],
    },
    {
      id: "item4",
      type: "div",
      children: [],
    },
    {
      id: "item5",
      type: "img",
      children: [],
    },
    {
      id: "item6",
      type: "vide",
      children: [],
    },
  ];
  dropActionTodo: DropInfo = {
    targetId: "label",
  };
  prepareDragDrop(nodes: ListData[]) {
    nodes.forEach((node) => {
      this.dropTargetIds.push(node.id);
      this.nodeLookup2[node.id] = node;
      this.prepareDragDrop(node.children);
    });
  }
  constructor(@Inject(DOCUMENT) private document: Document) {
    this.prepareDragDrop(this.list2);
    console.log(this.dropTargetIds);
    this.list1.forEach((node) => {
      this.nodeLookup[node.id] = node;
    });
    this.showDragPlaceholder = true;
  }
  dragMoved(event) {
    this.dropActionTodo = {
      targetId: "label",
    };
    let e = this.document.elementFromPoint(
      event.pointerPosition.x,
      event.pointerPosition.y
    );
    if (!e) {
      return;
    }
    let container = e.classList.contains("container1")
      ? e
      : e.closest(".container1");
    if (!container) {
      return;
    }

    this.dropActionTodo = {
      targetId: container.getAttribute("data-id"),
    };
    const targetRect = container.getBoundingClientRect();
    const oneThirdHeight = targetRect.height / 4;

    // if (event.pointerPosition.y - targetRect.top < oneThirdHeight) {
    //   // before
    //   this.dropActionTodo["action"] = "before";
    // } else if (event.pointerPosition.y - targetRect.top > 4 * oneThirdHeight) {
    //   // after
    //   this.dropActionTodo["action"] = "after";
    // } else {
    // inside
    //  this.dropActionTodo["action"] = "inside";
    if (this.nodeLookup[this.dropActionTodo.targetId].type === "container-2") {
      const demiWidth = targetRect.width / 2;
      if (event.pointerPosition.x - targetRect.left < demiWidth) {
        this.dropActionTodo["action"] = "insideLeft";
        console.log("insideLeft");
      } else {
        this.dropActionTodo["action"] = "insideRight";
        console.log("insideRight");
      }
    } else if (
      this.nodeLookup[this.dropActionTodo.targetId].type === "container-3"
    ) {
      const oneThirdWidth = targetRect.width / 3;
      if (event.pointerPosition.x - targetRect.left < oneThirdWidth) {
        this.dropActionTodo["action"] = "insideLeft";
        console.log("insideLeft");
      } else if (
        event.pointerPosition.x - targetRect.left > oneThirdWidth &&
        event.pointerPosition.x - targetRect.left < 2 * oneThirdWidth
      ) {
        this.dropActionTodo["action"] = "insideMiddle";
        console.log("insideLeft");
      } else {
        this.dropActionTodo["action"] = "insideRight";
        console.log("insideRight");
      }
    } else {
      this.dropActionTodo["action"] = "inside";
    }
    //}
    console.log("dragEvent");
    console.log(this.nodeLookup[this.dropActionTodo.action]);
  }

  drop(event) {
    if (!this.dropActionTodo) return;
    const draggedItemId = event.item.data; //draggebel
    const parentItemId = event.previousContainer.id; //dragebel previous parent
    const targetListId: string = "label"; //parent of drag area
    //get object of the dragebel item
    const draggedItem = this.nodeLookup2[draggedItemId];
    console.log("targetListId");
    console.log(targetListId);
    console.log("parentItemId");
    console.log(parentItemId);
    if (this.dropActionTodo.action == "insideLeft" && draggedItem) {
      this.nodeLookup[this.dropActionTodo.targetId].children[0] = draggedItem;
    } else if (
      (this.dropActionTodo.action == "insideMiddle" && draggedItem) ||
      (this.dropActionTodo.action == "insideRight" &&
        this.nodeLookup[this.dropActionTodo.targetId].type === "container-2" &&
        draggedItem)
    ) {
      this.nodeLookup[this.dropActionTodo.targetId].children[1] = draggedItem;
    } else if (
      this.dropActionTodo.action == "insideRight" &&
      draggedItem &&
      this.nodeLookup[this.dropActionTodo.targetId].type === "container-3"
    ) {
      this.nodeLookup[this.dropActionTodo.targetId].children[2] = draggedItem;
    } else if (this.dropActionTodo.action == "inside" && draggedItem) {
      this.nodeLookup[this.dropActionTodo.targetId].children.push(draggedItem);
    } else {
      if (event.previousContainer === event.container) {
        // Handle drop within the same container
        moveItemInArray(
          event.container.data,
          event.previousIndex,
          event.currentIndex
        );
      } else {
        const id = uuidv4();
        if (draggedItem.type === "container-2") {
          this.list1.splice(
            event.currentIndex,
            0,
            Object.assign(
              {},
              {
                ...event.previousContainer.data[event.previousIndex],
                children: [
                  {
                    id: "item11",
                    type: "vide",
                    children: [],
                  },
                  {
                    id: "item12",
                    type: "vide",
                    children: [],
                  },
                ],
                id: id,
              }
            )
          );
        } else if (draggedItem.type === "container-3") {
          this.list1.splice(
            event.currentIndex,
            0,
            Object.assign(
              {},
              {
                ...event.previousContainer.data[event.previousIndex],
                children: [
                  {
                    id: "item11",
                    type: "vide",
                    children: [],
                  },
                  {
                    id: "item12",
                    type: "vide",
                    children: [],
                  },
                  {
                    id: "item13",
                    type: "vide",
                    children: [],
                  },
                ],
                id: id,
              }
            )
          );
        } else {
          this.list1.splice(
            event.currentIndex,
            0,
            Object.assign(
              {},
              {
                ...event.previousContainer.data[event.previousIndex],
                children: [],
                id: id,
              }
            )
          );
        }
        this.nodeLookup[id] = this.list1[event.currentIndex];
      }
    }
    console.log("list form service");
    console.log(this.list1);
  }
  // recherche le parent de drop area
  getParentNodeId(
    id: string,
    nodesToSearch: ListData[],
    parentId: string
  ): string {
    for (let node of nodesToSearch) {
      if (node.id == id) return parentId;
      let ret = this.getParentNodeId(id, node.children, node.id);
      if (ret) return ret;
    }
    return null;
  }
}
