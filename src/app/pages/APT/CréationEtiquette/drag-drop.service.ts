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
  nodeLookup = {}; // {id : object(node)}
  nodeLookup2 = {};
  showDragPlaceholder;
  refproduit: string;
  produit: ProduitData;
  list1: ComponetList[] = [];
  //TODO: modifier liste 2 comme BD
  list2: ComponetList[];
  dropActionTodo: DropInfo = {
    targetId: "label",
  };
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
    labelService.labelInfo.subscribe((val) => {
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
                type: "vide",
                children: [],
                data: "",
                refItem: null,
                title: "",
              },
              {
                id: uuidv4(),
                type: "vide",
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
                type: "vide",
                children: [],
                data: "",
                refItem: null,
                title: "",
              },
              {
                id: uuidv4(),
                type: "vide",
                children: [],
                data: "",
                refItem: null,
                title: "",
              },
              {
                id: uuidv4(),
                type: "vide",
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
            children: [],
            data: "",
            refItem: null,
            title: "",
          },
          {
            id: uuidv4(),
            type: "vide",
            data: "",
            refItem: null,
            title: "",
          },
        ];
        this.refproduit = val.refProd;
        gestionProduitHttpService
          .getOneProduit(this.refproduit)
          .toPromise()
          .then((resProduit) => {
            this.produit = resProduit.produit;
            console.log("produits");
            console.log(resProduit);
            Object.keys(resProduit.produit).forEach((item) => {
              if (
                item !== "createdAt" &&
                item !== "updatedAt" &&
                item !== "idEtiquette" &&
                item !== "withSN" &&
                item !== "withOF" &&
                item !== "Createur" &&
                item !== "Modificateur" &&
                item !== "formes" &&
                resProduit.produit[item]
              ) {
                if (
                  item === "idSN" &&
                  resProduit.produit.idSN &&
                  resProduit.produit.withSN
                ) {
                  gestionProduitHttpService
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
                        },
                      });
                      this.prepareDragDrop(this.list2);
                    });
                } else if (
                  resProduit.produit.codeClient &&
                  item === "codeClient"
                ) {
                  gestionProduitHttpService
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
                          },
                        }
                      );
                      this.prepareDragDrop(this.list2);
                    });
                } else if (
                  resProduit.produit.codeFournisseur &&
                  item === "codeFournisseur"
                ) {
                  gestionProduitHttpService
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
                          },
                        }
                      );
                      this.prepareDragDrop(this.list2);
                    });
                } else {
                  this.list2.push({
                    id: uuidv4(),
                    type:
                      item == "withDataMatrix"
                        ? "QRcode"
                        : item == "formes"
                        ? "shape"
                        : "text",
                    refItem: item,
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
                    },
                    dataMatrixFormat: item == "withDataMatrix" ? "qrcode" : "",
                  });
                  this.prepareDragDrop(this.list2);
                }
              }
            });
            console.log(this.list2);
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
            type: "vide",
            children: [],
            data: "",
            refItem: null,
            title: "",
          },
          {
            id: uuidv4(),
            type: "vide",
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
            type: "vide",
            children: [],
            data: "",
            refItem: null,
            title: "",
          },
          {
            id: uuidv4(),
            type: "vide",
            children: [],
            data: "",
            refItem: null,
            title: "",
          },
          {
            id: uuidv4(),
            type: "vide",
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
        children: [],
        data: "",
        refItem: null,
        title: "",
      },
      {
        id: uuidv4(),
        type: "vide",
        data: "",
        refItem: null,
        title: "",
      },
    ];
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
      this.nodeLookup[this.dropActionTodo.targetId].children[0] = {
        ...draggedItem,
        id: uuidv4(),
      };
    } else if (
      (this.dropActionTodo.action == "insideMiddle" && draggedItem) ||
      (this.dropActionTodo.action == "insideRight" &&
        this.nodeLookup[this.dropActionTodo.targetId].type === "container-2" &&
        draggedItem)
    ) {
      this.nodeLookup[this.dropActionTodo.targetId].children[1] = {
        ...draggedItem,
        id: uuidv4(),
      };
    } else if (
      this.dropActionTodo.action == "insideRight" &&
      draggedItem &&
      this.nodeLookup[this.dropActionTodo.targetId].type === "container-3"
    ) {
      this.nodeLookup[this.dropActionTodo.targetId].children[2] = {
        ...draggedItem,
        id: uuidv4(),
      };
    } else if (this.dropActionTodo.action == "inside" && draggedItem) {
      this.nodeLookup[this.dropActionTodo.targetId].children.push({
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
                ...draggedItem,
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
                ...draggedItem,
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
}
