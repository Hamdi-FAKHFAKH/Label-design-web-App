import { moveItemInArray } from "@angular/cdk/drag-drop";
import { DOCUMENT } from "@angular/common";
import { Inject, Injectable } from "@angular/core";
import { v4 as uuidv4 } from "uuid";
import { GestionProduitHttpService } from "../GestionProduits/GestionProduitHttp.service";
import { LabelService } from "./label.service";
import { ComponentTitle, ComponetList } from "./ComposentData";
import { ProduitData } from "../GestionProduits/GestionProduit.data";
export interface DropInfo {
  targetId: string;
  action?: string;
}
@Injectable()
export class DragDropService {
  // ids for connected drop lists
  dropTargetIds = ["label"]; //contient tous les id
  nodeLookup2 = {}; // object containe all elements in list2 {key : element id , value : element}
  items = {}; // object containe all elements in list1 {key : element id , value : element}
  showDragPlaceholder;
  refproduit: string;
  produit: ProduitData;
  // list of elements in the label
  list1: ComponetList[] = [];
  // list of draggable elements
  list2: ComponetList[];
  // determine the type of action to be taken and the target ID
  dropActionTodo: DropInfo = {
    targetId: "label",
  };
  dragDropLibre: boolean = true;
  // position of draggable elements
  dragPosition = {};
  //fill dropTargetIds list and nodeLookup2 object
  prepareDragDrop(nodes: ComponetList[]) {
    nodes.forEach((node) => {
      this.dropTargetIds.push(node.id);
      this.nodeLookup2[node.id] = node;
      if (node.children) {
        this.prepareDragDrop(node.children);
      }
    });
  }

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private gestionProduitHttpService: GestionProduitHttpService,
    private labelService: LabelService
  ) {
    this.labelService.labelInfo.subscribe((val) => {
      if (this.refproduit !== val.refProd && val.refProd !== null) {
        this.list2 = [
          {
            id: uuidv4(),
            type: "container-2",
            data: "",
            refItem: null,
            title: "",
            children: [
              {
                id: uuidv4(),
                type: "container-1",
                children: [],
                data: "",
                refItem: null,
                title: "",
                style: null,
              },
              {
                id: uuidv4(),
                type: "container-1",
                children: [],
                data: "",
                title: "",
                refItem: null,
                style: null,
              },
            ],
          },
          {
            id: uuidv4(),
            type: "container-3",
            data: "",
            refItem: null,
            title: "",
            children: [
              {
                id: uuidv4(),
                type: "container-1",
                children: [],
                data: "",
                refItem: null,
                style: null,
                title: "",
              },
              {
                id: uuidv4(),
                type: "container-1",
                children: [],
                data: "",
                refItem: null,
                title: "",
                style: null,
              },
              {
                id: uuidv4(),
                type: "container-1",
                style: null,
                children: [],
                data: "",
                refItem: null,
                title: "",
              },
            ],
          },
          {
            id: uuidv4(),
            type: "container",
            children: [
              {
                id: uuidv4(),
                type: "container-1",
                children: [],
                data: "",
                style: null,
                refItem: null,
                title: "",
              },
            ],
            data: "",
            refItem: null,
            title: "",
          },
        ];
        this.refproduit = val.refProd;
        this.gestionProduitHttpService
          .getOneProduit(this.refproduit)
          .toPromise()
          .then((resProduit) => {
            this.produit = resProduit.produit;
            Object.keys(resProduit.produit).forEach((item) => {
              if (
                item !== "createdAt" &&
                item !== "updatedAt" &&
                item !== "idEtiquette" &&
                item !== "withSN" &&
                item !== "withOF" &&
                item !== "Createur" &&
                item !== "Modificateur" &&
                item !== "datamatrixData" &&
                resProduit.produit[item]
              ) {
                if (item === "idSN" && resProduit.produit.idSN) {
                  resProduit.produit.withSN &&
                    this.gestionProduitHttpService
                      .getOneSerialNumber(resProduit.produit.idSN)
                      .toPromise()
                      .then((serialNumber) => {
                        this.list2.push({
                          id: uuidv4(),
                          type: "text",
                          refItem: item,
                          title: ComponentTitle.SN,
                          data:
                            serialNumber.serialNumber.prefix +
                            serialNumber.serialNumber.suffix,
                          style: {
                            "font-weight": "normal",
                            bold: false,
                            italic: false,
                            "font-style": "normal",
                            "text-decoration": "none",
                            underline: false,
                            height: "fit-content",
                            width: "fit-content",
                          },
                          children: [],
                        });
                        this.prepareDragDrop(this.list2);
                      });
                } else if (item === "formes" && resProduit.produit.formes) {
                  resProduit.produit.formes.split(";").forEach((val, index) => {
                    if (val) {
                      this.gestionProduitHttpService
                        .getOneForm(val)
                        .toPromise()
                        .then((obj) => {
                          const id = uuidv4();
                          const icon = {
                            id: id,
                            type: "forme",
                            refItem: `${item}-${index}`,
                            title: ComponentTitle.forms,
                            children: [],
                            data: obj.form.path,
                          };
                          this.list2.push(icon);
                          this.nodeLookup2[id] = icon;
                        })
                        .catch((err) => {
                          console.log(err.message);
                        });
                    }
                  });
                } else if (resProduit.produit.numLot && item === "numLot") {
                  this.gestionProduitHttpService
                    .getOneLot(resProduit.produit.numLot)
                    .toPromise()
                    .then((lot) => {
                      this.list2.push(
                        {
                          id: uuidv4(),
                          type: "text",
                          refItem: item,
                          title: ComponentTitle.numLot,
                          data: resProduit.produit.numLot,
                          style: {
                            "font-weight": "normal",
                            bold: false,
                            italic: false,
                            "font-style": "normal",
                            "text-decoration": "none",
                            underline: false,
                            width: "fit-content",
                            height: "fit-content",
                          },
                        },
                        {
                          id: uuidv4(),
                          type: "text",
                          title: ComponentTitle.formatLot,
                          refItem: "format",
                          data: lot.lot.format,
                          style: {
                            "font-weight": "normal",
                            bold: false,
                            italic: false,
                            "font-style": "normal",
                            "text-decoration": "none",
                            underline: false,
                            width: "fit-content",
                            height: "fit-content",
                          },
                        }
                      );
                      this.prepareDragDrop(this.list2);
                    });
                } else if (
                  resProduit.produit.codeClient &&
                  item === "codeClient"
                ) {
                  this.gestionProduitHttpService
                    .getClient(resProduit.produit.codeClient)
                    .toPromise()
                    .then((client) => {
                      this.list2.push(
                        {
                          id: uuidv4(),
                          type: "text",
                          refItem: item,
                          title: ComponentTitle.codeClient,
                          data: resProduit.produit.codeClient,
                          style: {
                            "font-weight": "normal",
                            bold: false,
                            italic: false,
                            "font-style": "normal",
                            "text-decoration": "none",
                            underline: false,
                            width: "fit-content",
                            height: "fit-content",
                          },
                        },
                        {
                          id: uuidv4(),
                          type: "text",
                          title: ComponentTitle.desClient,
                          refItem: "desClient",
                          data: client.body.client.desClient,
                          style: {
                            "font-weight": "normal",
                            bold: false,
                            italic: false,
                            "font-style": "normal",
                            "text-decoration": "none",
                            underline: false,
                            width: "fit-content",
                            height: "fit-content",
                          },
                        }
                      );
                      this.prepareDragDrop(this.list2);
                    });
                } else if (
                  resProduit.produit.codeFournisseur &&
                  item === "codeFournisseur"
                ) {
                  this.gestionProduitHttpService
                    .getFournisseur(resProduit.produit.codeFournisseur)
                    .toPromise()
                    .then((fournisseur) => {
                      this.list2.push(
                        {
                          id: uuidv4(),
                          type: "text",
                          refItem: item,
                          title: ComponentTitle.codeFournisseur,
                          data: resProduit.produit.codeFournisseur,
                          style: {
                            "font-weight": "normal",
                            bold: false,
                            italic: false,
                            "font-style": "normal",
                            "text-decoration": "none",
                            underline: false,
                            width: "fit-content",
                            height: "fit-content",
                          },
                        },
                        {
                          id: uuidv4(),
                          type: "text",
                          title: ComponentTitle.desFournisseur,
                          refItem: "desClient",
                          data: fournisseur.body.fournisseur.desFournisseur,
                          style: {
                            "font-weight": "normal",
                            bold: false,
                            italic: false,
                            "font-style": "normal",
                            "text-decoration": "none",
                            underline: false,
                            height: "fit-content",
                            width: "fit-content",
                          },
                        }
                      );
                      this.prepareDragDrop(this.list2);
                    });
                } else {
                  this.list2.push({
                    id: uuidv4(),
                    type: item == "withDataMatrix" ? "QRcode" : "text",
                    refItem: item == "withDataMatrix" ? "datamatrixData" : item,
                    title: ComponentTitle[item],
                    data:
                      item == "withDataMatrix"
                        ? "datamatrix"
                        : resProduit.produit[item],
                    style: {
                      "font-weight": "normal",
                      bold: false,
                      italic: false,
                      "font-style": "normal",
                      "text-decoration": "none",
                      underline: false,
                      height: item == "withDataMatrix" ? "110" : "fit-content",
                      width: item == "withDataMatrix" ? "110" : "fit-content",
                    },
                    dataMatrixFormat: item == "withDataMatrix" ? "qrcode" : "",
                  });
                }
              }
            });
          });
      }
    });
    this.list2 = [
      {
        id: uuidv4(),
        type: "container-2",
        data: "",
        refItem: null,
        title: "",
        children: [
          {
            id: uuidv4(),
            type: "container-1",
            children: [],
            data: "",
            refItem: null,
            title: "",
            style: null,
          },
          {
            id: uuidv4(),
            type: "container-1",
            children: [],
            data: "",
            title: "",
            refItem: null,
          },
        ],
      },
      {
        id: uuidv4(),
        type: "container-3",
        data: "",
        refItem: null,
        title: "",
        children: [
          {
            id: uuidv4(),
            type: "text",
            children: [],
            data: "",
            refItem: null,
            title: "",
          },
          {
            id: uuidv4(),
            type: "container-1",

            children: [],
            data: "",
            refItem: null,
            title: "",
            style: null,
          },
          {
            id: uuidv4(),
            type: "container-1",
            children: [],
            data: "",
            refItem: null,
            title: "",
            style: null,
          },
        ],
      },
      {
        id: uuidv4(),
        type: "container",
        children: [
          {
            id: uuidv4(),
            type: "container-1",
            children: [],
            data: "",
            refItem: null,
            title: "",
            style: null,
          },
        ],
        data: "",
        refItem: null,
        title: "",
      },
      {
        id: uuidv4(),
        type: "container-1",
        data: "",
        refItem: null,
        title: "",
        children: [],
        style: null,
      },
    ];
    this.showDragPlaceholder = true;
  }
  // called when element dragged
  dragMoved(event) {
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
    if (this.items[this.dropActionTodo.targetId].type === "container-2") {
      const demiWidth = targetRect.width / 2;
      if (event.pointerPosition.x - targetRect.left < demiWidth) {
        this.dropActionTodo["action"] = "insideLeft";
      } else {
        this.dropActionTodo["action"] = "insideRight";
      }
    } else if (
      this.items[this.dropActionTodo.targetId].type === "container-3"
    ) {
      const oneThirdWidth = targetRect.width / 3;
      if (event.pointerPosition.x - targetRect.left < oneThirdWidth) {
        this.dropActionTodo["action"] = "insideLeft";
      } else if (
        event.pointerPosition.x - targetRect.left > oneThirdWidth &&
        event.pointerPosition.x - targetRect.left < 2 * oneThirdWidth
      ) {
        this.dropActionTodo["action"] = "insideMiddle";
      } else {
        this.dropActionTodo["action"] = "insideRight";
      }
    } else {
      this.dropActionTodo["action"] = "inside";
    }
  }

  drop(event) {
    if (!this.dropActionTodo) return;
    const draggedItemId = event.item.data; //draggebel
    const parentItemId = event.previousContainer.id; //dragebel previous parent
    const targetListId: string = "label"; //parent of drag area
    //get object of the dragebel item
    const draggedItem = this.nodeLookup2[draggedItemId];
    if (
      this.dropActionTodo.action == "insideLeft" &&
      draggedItem &&
      !["container-2", "container-3", "container"].includes(draggedItem.type)
    ) {
      this.items[this.dropActionTodo.targetId].children[0].children.push({
        ...draggedItem,
        id: uuidv4(),
      });
    } else if (
      (this.dropActionTodo.action == "insideMiddle" &&
        draggedItem &&
        !["container-2", "container-3", "container"].includes(
          draggedItem.type
        )) ||
      (this.dropActionTodo.action == "insideRight" &&
        this.items[this.dropActionTodo.targetId].type === "container-2" &&
        draggedItem &&
        !["container-2", "container-3", "container"].includes(draggedItem.type))
    ) {
      this.items[this.dropActionTodo.targetId].children[1].children.push({
        ...draggedItem,
        id: uuidv4(),
      });
    } else if (
      this.dropActionTodo.action == "insideRight" &&
      draggedItem &&
      this.items[this.dropActionTodo.targetId].type === "container-3" &&
      !["container-2", "container-3", "container"].includes(draggedItem.type)
    ) {
      this.items[this.dropActionTodo.targetId].children[2].children.push({
        ...draggedItem,
        id: uuidv4(),
      });
    } else if (
      this.dropActionTodo.action == "inside" &&
      draggedItem &&
      !["container-2", "container-3", "container"].includes(draggedItem.type)
    ) {
      this.items[this.dropActionTodo.targetId].children[0].type ==
        "container-1" &&
        this.items[this.dropActionTodo.targetId].children.splice(0, 1);
      this.items[this.dropActionTodo.targetId].children.push({
        ...draggedItem,
        id: uuidv4(),
      });
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
                ...draggedItem,
                children: [
                  {
                    id: uuidv4(),
                    type: "container-1",
                    children: [],
                    style: null,
                  },
                  {
                    id: uuidv4(),
                    type: "container-1",
                    children: [],
                    style: null,
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
                ...draggedItem,
                children: [
                  {
                    id: uuidv4(),
                    type: "container-1",
                    children: [],
                    style: null,
                  },
                  {
                    id: uuidv4(),
                    type: "container-1",
                    children: [],
                    style: null,
                  },
                  {
                    id: uuidv4(),
                    type: "container-1",
                    children: [],
                    style: null,
                  },
                ],
                id: id,
              }
            )
          );
        } else if (draggedItem.type === "container") {
          this.list1.splice(
            event.currentIndex,
            0,
            Object.assign(
              {},
              {
                ...draggedItem,
                children: [
                  {
                    id: uuidv4(),
                    type: "container-1",
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
                ...draggedItem,
                children: [],
                id: id,
              }
            )
          );
        }
        this.items[id] = this.list1[event.currentIndex];
        this.dragPosition[id] = { x: 0, y: 0 };
        console.log("dragPosition");
        console.log(this.dragPosition);
      }
      console.log("list1");
      console.log(this.list1);
      console.log("list2");
      console.log(this.list2);
    }

    this.getAllItems(this.list1);
  }
  // fill items object with all elements in list1
  getAllItems(list: ComponetList[]) {
    list.forEach((item) => {
      this.items[item.id] = item;
      if (item.children) {
        this.getAllItems(item.children);
      }
    });
  }
}
