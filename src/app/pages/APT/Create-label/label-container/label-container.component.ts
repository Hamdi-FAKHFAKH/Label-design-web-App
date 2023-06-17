import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  Input,
  OnChanges,
  OnInit,
  QueryList,
  SimpleChanges,
  TemplateRef,
  ViewChild,
  ViewChildren,
} from "@angular/core";
import { LabelService } from "../label.service";
import { LabeltHttpService } from "../labelHTTP.service";
import { v4 as uuidv4 } from "uuid";
import { GestionProduitHttpService } from "../../GestionProduits/GestionProduitHttp.service";
import { CdkDragEnd, CdkDropList } from "@angular/cdk/drag-drop";
import { DragDropService } from "../drag-drop.service";
import { ComponentTitle, LabelItem } from "../ComposentData";
import Swal from "sweetalert2";
import { getcanvas } from "dom-to-pdf";
import { NbSidebarService, NbWindowService } from "@nebular/theme";
import { te } from "date-fns/locale";
import { infoLabel } from "../label.service";
import { NavigationStart, Route, Router } from "@angular/router";

import { Observable } from "rxjs";
@Component({
  selector: "ngx-sidebar",
  templateUrl: "./label-container.component.html",
  styleUrls: ["./label-container.component.scss", "./borderStyle.css"],
})
export class SidebarComponent implements OnInit {
  @ViewChildren("dimension") elReference: QueryList<ElementRef>;
  @ViewChild(CdkDropList) dropList?: CdkDropList;
  @ViewChild("template") templateRef: TemplateRef<any>;
  containerNotVide: boolean;
  container2NotVide: boolean;
  container3NotVide: boolean;
  labelStyle: {
    width: string;
    height: string;
    padding: string;
    "border-radius"?: string;
    "background-color": string;
  };
  labelInfo: infoLabel;
  ListWithNewID: LabelItem[] = [];
  imgSrc: string;
  idEtiquette: string;
  itemId: string;
  constructor(
    private labelService: LabelService,
    private lablHttpService: LabeltHttpService,
    private gestionProduitHttpService: GestionProduitHttpService,
    public dragDropService: DragDropService,
    private windowService: NbWindowService,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.dragDropService.listOfLabelElements.length = 0;
    this.dragDropService.propertyTabActive = false;
    this.dragDropService.designTabActive = false;
    this.containerNotVide = false;
    this.container2NotVide = false;
    this.container3NotVide = false;
    this.labelService.labelInfo.subscribe((info) => {
      if (info) {
        this.labelStyle = {
          "background-color": info.color,
          height: info.largeur + "mm",
          width: info.longueur + "mm",
          padding: info.padding + "mm",
        };
        if (info.format == "cercle") {
          this.labelStyle = {
            ...this.labelStyle,
            "border-radius": info.largeur + "mm",
          };
        }
      }
      this.labelInfo = info;
    });
  }
  // search item in list of item in the label
  findItem(data: LabelItem[], refItem) {
    const res = data.find((val) => val.refItem == refItem && val.data);
    let resarray;
    if (!res) {
      resarray = data.map((val) => {
        if (val.children && val.children.length > 0) {
          return this.findItem(val.children, refItem);
        } else {
          return null;
        }
      });
    }
    return (
      res || resarray.find((val) => val && val.refItem == refItem && val.data)
    );
  }
  // zoomIn / ZoomOut the label
  zoomIn() {
    this.labelStyle = {
      ...this.labelStyle,
      width: +this.labelStyle.width.split("mm")[0] + 10 + "mm",
      height: +this.labelStyle.height.split("mm")[0] + 10 + "mm",
    };
    if (this.labelInfo.format == "cercle") {
      this.labelStyle = {
        ...this.labelStyle,
        padding:
          Math.ceil(
            (+this.labelStyle.width.split("mm")[0] -
              Math.sqrt(
                (+this.labelStyle.width.split("mm")[0] *
                  +this.labelStyle.width.split("mm")[0]) /
                  2
              )) /
              2
          ) + "mm",
      };
    }
  }
  zoomOut() {
    //TODO : add zomm in and zoom out pour cercle
    if (
      +this.labelStyle.height.split("mm")[0] > +this.labelInfo.largeur &&
      +this.labelStyle.width.split("mm")[0] > +this.labelInfo.longueur
    ) {
      this.labelStyle = {
        ...this.labelStyle,
        width: +this.labelStyle.width.split("mm")[0] - 10 + "mm",
        height: +this.labelStyle.height.split("mm")[0] - 10 + "mm",
      };
    }
    if (this.labelInfo.format == "cercle") {
      this.labelStyle = {
        ...this.labelStyle,
        padding:
          Math.ceil(
            (+this.labelStyle.width.split("mm")[0] -
              Math.sqrt(
                (+this.labelStyle.width.split("mm")[0] *
                  +this.labelStyle.width.split("mm")[0]) /
                  2
              )) /
              2
          ) + "mm",
      };
    }
  }
  initZoom(): void {
    this.labelStyle = {
      ...this.labelStyle,
      height: this.labelInfo.largeur + "mm",
      width: this.labelInfo.longueur + "mm",
    };
    if (this.labelInfo.format == "cercle") {
      this.labelStyle = {
        ...this.labelStyle,
        padding:
          Math.ceil(
            (+this.labelStyle.width.split("mm")[0] -
              Math.sqrt(
                (+this.labelStyle.width.split("mm")[0] *
                  +this.labelStyle.width.split("mm")[0]) /
                  2
              )) /
              2
          ) + "mm",
      };
    }
  }
  // save label in DB
  async saveLabel() {
    this.dragDropService.propertyTabActive = false;
    this.dragDropService.designTabActive = true;
    const produitsWithEtiquette = (
      await this.lablHttpService.getAllProduitWithEtiquette().toPromise()
    ).produits;
    const refProdWithEtiquette = [];
    produitsWithEtiquette.map((val) => {
      refProdWithEtiquette.push(val.ref);
      if (val.ref === this.labelInfo.refProd) {
        this.idEtiquette = val.idEtiquette;
      }
    });
    const produit = (
      await this.gestionProduitHttpService
        .getOneProduit(this.labelInfo.refProd)
        .toPromise()
    ).produit;
    if (!this.labelInfo.refProd) {
      Swal.fire("Selectionner la référence Produit", "", "info");
      return;
    }
    Swal.fire({
      title:
        "vous voulez écraser les données de l'étiquette associée à la référence produite" +
        this.labelInfo.refProd +
        " ?",
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: "Oui",
      confirmButtonColor: "#007BFF",
      denyButtonText: `Non`,
    }).then(async (result) => {
      if (result.isConfirmed) {
        //********************************************************* check components in label ************************ */
        let datamatrix = this.findItem(
          this.dragDropService.listOfLabelElements,
          "datamatrixData"
        );
        let SN = this.findItem(
          this.dragDropService.listOfLabelElements,
          "idSN"
        );
        let lot = this.findItem(
          this.dragDropService.listOfLabelElements,
          "format"
        );
        let OF = this.findItem(this.dragDropService.listOfLabelElements, "of");

        if (produit.withDataMatrix && !datamatrix) {
          Swal.fire(
            "DataMatrix introuvable?",
            "Veuillez inclure un DataMatrix sur l'étiquette",
            "info"
          );
          return;
        }
        if (
          produit.withDataMatrix &&
          (datamatrix.data ==
            "Veuillez saisir les données que vous souhaitez inclure dans la DataMatrix." ||
            !datamatrix.data)
        ) {
          Swal.fire(
            "Les données contenues dans la DataMatrix sont inexistantes ou nulles.",
            "Veuillez saisir les données que vous souhaitez inclure dans la DataMatrix.",
            "info"
          );
          return;
        }
        if (produit.withSN && !SN) {
          Swal.fire(
            "Numéro de Série introuvable?",
            "Veuillez inclure le Numéro de Série sur l'étiquette",
            "info"
          );
          return;
        }
        if (produit.withOF && !OF) {
          Swal.fire(
            "Ordre de Fabrication(OF) introuvable?",
            "Veuillez inclure l'Ordre de Fabrication(OF) sur l'étiquette",
            "info"
          );
          return;
        }
        if (produit.numLot && !lot) {
          Swal.fire(
            "Format de LOT introuvable?",
            "Veuillez inclure le format de LOT sur l'étiquette",
            "info"
          );
          return;
        }
        //********************************************************************* save data ****************************** */
        // update label
        if (
          refProdWithEtiquette.includes(this.labelInfo.refProd) &&
          this.idEtiquette
        ) {
          //update etiquette
          try {
            await this.lablHttpService
              .UpdateEtiquette(this.idEtiquette, {
                couleur: this.labelInfo.color,
                format: this.labelInfo.format,
                createur: null,
                id1: this.labelInfo.id,
                largeur: this.labelInfo.largeur,
                longeur: this.labelInfo.longueur,
                padding: this.labelInfo.padding,
                modificateur: null,
              })
              .toPromise();
            //remove all components of this label
            await this.lablHttpService
              .deleteComponentsByEtiquette(this.idEtiquette)
              .toPromise();
            // create all Components
            await this.createComponent(
              this.dragDropService.listOfLabelElements,
              this.idEtiquette
            );
            Swal.fire({
              icon: "success",
              title: "L'étiquette a été enregistrée",
              showConfirmButton: false,
              timer: 1500,
            });
            console.log("update label");
            console.log(this.dragDropService.listOfLabelElements);
          } catch (error) {
            Swal.fire({
              icon: "error",
              title: "Les modifications ne sont pas enregistrées",
              text: error.message,
              showConfirmButton: false,
              timer: 1500,
            });
          }
        }
        // create new label
        else {
          const id: string = uuidv4();
          this.idEtiquette = id;
          try {
            //create Components
            await this.lablHttpService
              .CreateEtiquette({
                couleur: this.labelInfo.color,
                format: this.labelInfo.format,
                id: id,
                createur: null,
                id1: this.labelInfo.id,
                largeur: this.labelInfo.largeur,
                longeur: this.labelInfo.longueur,
                padding: this.labelInfo.padding,
                modificateur: null,
              })
              .toPromise();
            await this.gestionProduitHttpService
              .updateProduit(
                { ref: this.labelInfo.refProd, idEtiquette: id },
                this.labelInfo.refProd
              )
              .toPromise();
            let listOfElementsWithNewId = [];
            this.FillListOfLabelComponentsWithNewID(
              this.dragDropService.listOfLabelElements,
              listOfElementsWithNewId
            );
            console.log("list with new id");
            console.log(listOfElementsWithNewId);
            console.log(this.dragDropService.dragPosition);
            await this.createComponent(
              listOfElementsWithNewId,
              this.idEtiquette
            );
            Swal.fire({
              icon: "success",
              title: "L'étiquette a été enregistrée",
              showConfirmButton: false,
              timer: 1500,
            });
          } catch (e) {
            console.log(e);
          }
        }
      } else if (result.isDenied) {
        Swal.fire("Les modifications ne sont pas enregistrées", "", "info");
      }
    });
  }

  onDrop(event) {
    this.setTabPropertyActive(event.item.data);
    this.dragDropService.drop(event);
    this.containerNotVide = this.dragDropService.listOfLabelElements.some(
      (item) =>
        item.type == "container" &&
        item.children.some((val) => val.children.length > 0)
    );
    this.container2NotVide = this.dragDropService.listOfLabelElements.some(
      (item) =>
        item.children.length == 2 &&
        item.children.some((val) => val.children.length > 0)
    );
    this.container3NotVide = this.dragDropService.listOfLabelElements.some(
      (item) =>
        item.children.length == 3 &&
        item.children.some((val) => val.children.length > 0)
    );
  }
  dragMoved(event) {
    this.dragDropService.dragMoved(event);
  }
  delete(id: string) {}
  // .row style
  rowStyle(item: LabelItem) {
    return {
      ...item.style,
      "border-style": "none",
    };
  }
  async createComponent(list: LabelItem[], idEtiquette) {
    await Promise.all(
      list.map(async (obj, index) => {
        if (obj.children && obj.children.length > 0) {
          await this.lablHttpService
            .CreateComponent({
              x: this.dragDropService.dragDropLibre
                ? Math.round(this.dragDropService.dragPosition[obj.id].x)
                : null,
              y: this.dragDropService.dragDropLibre
                ? Math.round(this.dragDropService.dragPosition[obj.id].y)
                : null,
              ordre: index,
              "background-color": obj.style && obj.style["background-color"],
              "border-color":
                (obj.style && obj.style["border-color"]) || "#ffffff",
              "border-style":
                (obj.style && obj.style["border-style"]) || "none",
              "border-width": (obj.style && obj.style["border-width"]) || "0pt",
              bold: obj.style && obj.style.bold,
              "font-family":
                (obj.style && obj.style["font-family"]) || "Times New Roman",
              "font-size": (obj.style && obj.style["font-size"]) || "12pt",
              "font-style": obj.style && obj.style["font-style"],
              margin: obj.style && obj.style["margin"],
              "margin-left": obj.style && obj.style["margin-left"],
              "margin-right": obj.style && obj.style["margin-right"],
              "margin-bottom": obj.style && obj.style["margin-bottom"],
              "margin-top": obj.style && obj.style["margin-top"],
              padding: obj.style && obj.style["padding"],
              "padding-top": obj.style && obj.style["padding-top"],
              "padding-bottom": obj.style && obj.style["padding-bottom"],
              "padding-right": obj.style && obj.style["padding-right"],
              "padding-left": obj.style && obj.style["padding-left"],
              "text-align": obj.style && obj.style["text-align"],
              color: (obj.style && obj.style["color"]) || "#000000",
              italic: obj.style && obj.style["italic"],
              underline: obj.style && obj.style["underline"],
              width: (obj.style && obj.style["width"]) || "null",
              height: (obj.style && obj.style["height"]) || "null",
              "text-decoration": obj.style && obj.style["text-decoration"],
              transform: obj.style && obj.style["transform"],
              type: obj.type,
              refItem: obj.refItem,
              children:
                obj.children.length > 1
                  ? obj.children.map((val) => val.id).join(";")
                  : obj.children[0].id,
              title: obj.title,
              format: obj.format,
              id: obj.id,
              refEtiquette: idEtiquette,
              dataMatrixCode: obj.dataMatrixCode,
              dataMatrixFormat: obj.dataMatrixFormat,
            })
            .toPromise();

          await this.createComponent(obj.children, idEtiquette);
        } else {
          await this.lablHttpService
            .CreateComponent({
              x: this.dragDropService.dragDropLibre
                ? Math.round(this.dragDropService.dragPosition[obj.id].x)
                : null,
              y: this.dragDropService.dragDropLibre
                ? Math.round(this.dragDropService.dragPosition[obj.id].y)
                : null,
              ordre: index,
              "background-color": obj.style && obj.style["background-color"],
              "border-color":
                (obj.style && obj.style["border-color"]) || "#ffffff",
              "border-style":
                (obj.style && obj.style["border-style"]) || "none",
              "border-width": (obj.style && obj.style["border-width"]) || "0pt",
              bold: obj.style && obj.style.bold,
              "font-family":
                (obj.style && obj.style["font-family"]) || "Times New Roman",
              "font-size": (obj.style && obj.style["font-size"]) || "12pt",
              "font-style": obj.style && obj.style["font-style"],
              margin: obj.style && obj.style["margin"],
              "margin-left": obj.style && obj.style["margin-left"],
              "margin-right": obj.style && obj.style["margin-right"],
              "margin-bottom": obj.style && obj.style["margin-bottom"],
              "margin-top": obj.style && obj.style["margin-top"],
              padding: obj.style && obj.style["padding"],
              "padding-top": obj.style && obj.style["padding-top"],
              "padding-bottom": obj.style && obj.style["padding-bottom"],
              "padding-right": obj.style && obj.style["padding-right"],
              "padding-left": obj.style && obj.style["padding-left"],
              "text-align": obj.style && obj.style["text-align"],
              color: (obj.style && obj.style["color"]) || "#000000",
              italic: obj.style && obj.style["italic"],
              underline: obj.style && obj.style["underline"],
              width: (obj.style && obj.style["width"]) || "null",
              height: (obj.style && obj.style["height"]) || "null",
              "text-decoration": obj.style && obj.style["text-decoration"],
              transform: obj.style && obj.style["transform"],
              type: obj.style && obj.type,
              refItem: obj.refItem,
              children: "",
              title: obj.title,
              format: obj.format,
              id: obj.id,
              refEtiquette: idEtiquette,
              dataMatrixCode: obj.dataMatrixCode,
              dataMatrixFormat: obj.dataMatrixFormat,
            })
            .toPromise();
          obj.type == "QRcode" &&
            (await this.gestionProduitHttpService
              .updateProduit(
                { ref: this.labelInfo.refProd, datamatrixData: obj.data },
                this.labelInfo.refProd
              )
              .toPromise());
        }
      })
    );
  }
  dragEnd($event: CdkDragEnd, itemId: string) {
    this.dragDropService.dragPosition[itemId].x = Math.round(
      +$event.source.getFreeDragPosition().x < 0
        ? 0
        : +$event.source.getFreeDragPosition().x
    );
    this.dragDropService.dragPosition[itemId].y = Math.round(
      +$event.source.getFreeDragPosition().y < 0
        ? 0
        : +$event.source.getFreeDragPosition().y
    );
  }
  // fill list Of Label Elements with new id;
  FillListOfLabelComponentsWithNewID(
    list: LabelItem[],
    ListWithNewID: LabelItem[]
  ) {
    list.forEach((item, index) => {
      const id = uuidv4();
      ListWithNewID.push(Object.assign({}, { ...item, id: id, children: [] }));
      this.dragDropService.dragPosition[id] =
        this.dragDropService.dragPosition[item.id];
      if (item.children) {
        this.FillListOfLabelComponentsWithNewID(
          item.children,
          ListWithNewID[index].children
        );
      }
    });
  }
  //
  async openLabelView() {
    var element = document.getElementById("test");
    var options = {
      filename: "label.pdf",
      compression: "FAST",
      scale: 1,
    };
    const canva = await getcanvas(element, options);
    // canva.height = 300;
    // canva.width = 00;
    this.imgSrc = canva.toDataURL("image/jpeg", 1.0);
    const window = this.windowService.open(this.templateRef, {
      title: `Nouveau Produit`,
      windowClass: "col-6",
      buttons: { minimize: true, fullScreen: false, maximize: false },
    });
  }
  //get id of selected item
  setTabPropertyActive(itemId) {
    // this.sidebarService.toggle(false, "creationEtiquette");
    this.dragDropService.propertyTabActive = true;
    this.dragDropService.selectedItem = itemId;
    this.itemId = itemId;
    Object.keys(this.dragDropService.items).forEach((key) => {
      if (this.dragDropService.items[key].style) {
        this.dragDropService.items[key].style.border = "none"; // TODO:cannot set preoerty of undifined
      }
    });
  }
  //
  textStyle(item: LabelItem) {
    const style = {};
    Object.keys(item.style).forEach((key) => {
      if (key != "transform") style[key] = item.style[key];
    });
    return style;
  }
  //delete the selected element in the label
  remove(id: string) {
    this.dragDropService.propertyTabActive = false;
    this.dragDropService.designTabActive = true;
    const index = this.dragDropService.listOfLabelElements.findIndex((obj) => {
      return obj.id == id;
    });
    if (
      index != -1 &&
      !["container-2", "container-3"].includes(
        this.dragDropService.listOfLabelElements[index].type
      )
    ) {
      this.dragDropService.listOfLabelElements[index].style = Object.assign(
        {},
        this.dragDropService.defaultTextStyle
      );
      this.dragDropService.listOfDragItems.push(
        this.dragDropService.listOfLabelElements[index]
      );
      this.dragDropService.nodeLookup2[
        this.dragDropService.listOfLabelElements[index].id
      ] = this.dragDropService.listOfLabelElements[index];
      this.dragDropService.nodeLookup2[
        this.dragDropService.listOfLabelElements[index].id
      ] = this.dragDropService.listOfLabelElements[index];
      this.dragDropService.listOfLabelElements.splice(index, 1);
    } else {
      this.dragDropService.listOfLabelElements.forEach((obj, index) => {
        obj.children.forEach((obj1, index1) => {
          if (obj1.id == id) {
            this.dragDropService.listOfLabelElements[index].children[
              index1
            ].style = Object.assign({}, this.dragDropService.defaultTextStyle);
            this.dragDropService.listOfDragItems.push(
              this.dragDropService.listOfLabelElements[index].children[index1]
            );
            this.dragDropService.nodeLookup2[
              this.dragDropService.listOfLabelElements[index].children[
                index1
              ].id
            ] =
              this.dragDropService.listOfLabelElements[index].children[index1];
            this.dragDropService.listOfLabelElements[index].children.splice(
              index1,
              1
            );
            return;
          }
          obj1.children &&
            obj1.children.forEach((obj2, index2) => {
              if (obj2.id == id) {
                this.dragDropService.listOfLabelElements[index].children[
                  index1
                ].children[index2].style = Object.assign(
                  {},
                  this.dragDropService.defaultTextStyle
                );
                this.dragDropService.listOfDragItems.push(
                  this.dragDropService.listOfLabelElements[index].children[
                    index1
                  ].children[index2]
                );
                this.dragDropService.nodeLookup2[
                  this.dragDropService.listOfLabelElements[index].children[
                    index1
                  ].children[index2].id
                ] =
                  this.dragDropService.listOfLabelElements[index].children[
                    index1
                  ].children[index2];
                this.dragDropService.listOfLabelElements[index].children[
                  index1
                ].children.splice(index2, 1);
              }
            });
        });
      });
    }
    if (
      ["container-2", "container-3", "container"].includes(
        this.dragDropService.listOfLabelElements[index].type
      )
    ) {
      this.dragDropService.listOfLabelElements.splice(index, 1);
    }
  }
  //detect keybord event
  @HostListener("document:keydown", ["$event"])
  handleKeyboardEvent(event: KeyboardEvent) {
    let focusedElement: Element;
    focusedElement = document.activeElement;
    if (focusedElement && focusedElement.tagName === "BODY" && this.itemId) {
      if (event.code === "ArrowUp") {
        this.dragDropService.dragPosition[this.itemId] = {
          x: +this.dragDropService.dragPosition[this.itemId].x,
          y:
            +this.dragDropService.dragPosition[this.itemId].y - 3.8 >= 0 &&
            +this.dragDropService.dragPosition[this.itemId].y - 3.8,
        };
      } else if (event.code === "ArrowDown") {
        this.dragDropService.dragPosition[this.itemId] = {
          x: +this.dragDropService.dragPosition[this.itemId].x,
          y: this.dragDropService.dragPosition[this.itemId].y + 3.8,
        };
      } else if (event.code === "ArrowLeft") {
        this.dragDropService.dragPosition[this.itemId] = {
          x:
            +this.dragDropService.dragPosition[this.itemId].x - 3.8 >= 0 &&
            +this.dragDropService.dragPosition[this.itemId].x - 3.8,
          y: this.dragDropService.dragPosition[this.itemId].y,
        };
      } else if (event.code === "ArrowRight") {
        this.dragDropService.dragPosition[this.itemId] = {
          x: +this.dragDropService.dragPosition[this.itemId].x + 3.8,
          y: this.dragDropService.dragPosition[this.itemId].y,
        };
      } else if (event.code === "Delete") {
        this.remove(this.itemId);
      }
    }
  }
  // @HostListener("click", ["$event"])
  // handleMouseEvent(e) {
  //   console.log(e.target.classList.contains("draggeditem"));
  //   console.log(e.target.getAttribute("cdkDragBoundary"));
  // }
}
