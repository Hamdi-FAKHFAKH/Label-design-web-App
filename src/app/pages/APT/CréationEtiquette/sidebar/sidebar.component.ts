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
import { ComponentTitle, ComponetList } from "../ComposentData";
import Swal from "sweetalert2";
import domtoimage from "dom-to-image";
import { NbSidebarService, NbWindowService } from "@nebular/theme";
import { te } from "date-fns/locale";
@Component({
  selector: "ngx-sidebar",
  templateUrl: "./sidebar.component.html",
  styleUrls: ["./sidebar.component.scss", "./borderStyle.css"],
})
export class SidebarComponent implements OnInit {
  @ViewChildren("dimension") elReference: QueryList<ElementRef>;
  @ViewChild(CdkDropList) dropList?: CdkDropList;
  @ViewChild("template") templateRef: TemplateRef<any>;
  containerNotVide;
  container2NotVide;
  container3NotVide;
  labelStyle;
  labelInfo;
  list1;
  list3 = [];
  list4 = [];
  ListWithNewID = [];
  imgSrc;
  idEtiquette;
  itemId;
  selectedItemClass = {};
  constructor(
    private labelService: LabelService,
    private lablHttpService: LabeltHttpService,
    private gestionProduitHttpService: GestionProduitHttpService,
    public dragDropService: DragDropService,
    private windowService: NbWindowService,
    private sidebarService: NbSidebarService
  ) {}

  entred(e) {
    console.log("entred");
    console.log(e);
  }
  ngOnInit(): void {
    this.containerNotVide = false;
    this.container2NotVide = false;
    this.container3NotVide = false;
    this.labelService.labelInfo.subscribe((info) => {
      // console.log(info);
      if (info) {
        this.labelStyle = {
          "background-color": info.color,
          width: info.largeur + "mm",
          height: info.longueur + "mm",
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
  // pour récuperer la hauteur et la largeur des containers
  // ngAfterViewInit() {
  //   console.log(
  //     this.elReference.toArray().forEach((val) => {
  //       console.log("item");
  //       console.log(val.nativeElement.getAttribute("item"));

  //       console.log("height");
  //       console.log(val.nativeElement.offsetHeight);
  //       console.log("width");
  //       console.log(val.nativeElement.offsetWidth);
  //     })
  //   );
  // }
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
    console.log(
      +this.labelStyle.width.split("mm")[0] + " " + this.labelInfo.largeur
    );
    //TODO : add zomm in and zoom out pour cercle
    if (
      +this.labelStyle.width.split("mm")[0] > +this.labelInfo.largeur &&
      +this.labelStyle.height.split("mm")[0] > +this.labelInfo.longueur
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
    console.log(this.labelStyle.height);
  }
  initZoom(): void {
    this.labelStyle = {
      ...this.labelStyle,
      width: this.labelInfo.largeur + "mm",
      height: this.labelInfo.longueur + "mm",
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
  async saveToPdf() {
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
    } else if (refProdWithEtiquette.includes(this.labelInfo.refProd)) {
      Swal.fire({
        title:
          "vous voulez écraser les données de l'etiquette avec la référence produit " +
          this.labelInfo.refProd +
          " ?",
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: "Oui",
        confirmButtonColor: "#007BFF",
        denyButtonText: `Non`,
      }).then(async (result) => {
        if (result.isConfirmed) {
          if (
            produit.withDataMatrix &&
            !this.dragDropService.list1.some((val) => val.type == "QRcode")
          ) {
            Swal.fire(
              "DataMatrix introuvable?",
              "Veuillez inclure un DataMatrix sur l'étiquette",
              "info"
            );
            return;
          }
          if (
            produit.withSN &&
            !this.dragDropService.list1.some(
              (val) => val.title == ComponentTitle.SN
            )
          ) {
            Swal.fire(
              "Numéro de Série introuvable?",
              "Veuillez inclure le Numéro de Série sur l'étiquette",
              "info"
            );
            return;
          }
          if (
            produit.withOF &&
            !this.dragDropService.list1.some(
              (val) => val.title == ComponentTitle.OF
            )
          ) {
            Swal.fire(
              "Ordre de Fabrication(OF) introuvable?",
              "Veuillez inclure l'Ordre de Fabrication(OF) sur l'étiquette",
              "info"
            );
            return;
          }
          const res = await this.lablHttpService
            .UpdateEtiquette(this.idEtiquette, {
              couleur: this.labelInfo.color,
              format: this.labelInfo.format,
              id: this.idEtiquette,
              createur: null,
              id1: this.labelInfo.id,
              largeur: this.labelInfo.largeur,
              longeur: this.labelInfo.longueur,
              padding: this.labelInfo.padding,
              modificateur: null,
            })
            .toPromise();
          if (this.labelInfo.refProd) {
            //remove all components of this label
            await this.lablHttpService
              .deleteComponentsByEtiquette(this.idEtiquette)
              .toPromise()
              .catch((err) => {
                console.log(err.error.Status);
              });
            console.log("***list1***");
            console.log(this.dragDropService.list1);
            this.FillList1WithNewID(
              this.dragDropService.list1,
              this.ListWithNewID
            );
            console.log("***list1 after fill***");
            console.log(this.ListWithNewID);
            await this.createComponent(
              this.dragDropService.list1,
              this.idEtiquette
            );
          }
          Swal.fire({
            icon: "success",
            title: "L'étiquette a été enregistrée",
            showConfirmButton: false,
            timer: 1500,
          });
        } else if (result.isDenied) {
          Swal.fire("Les modifications ne sont pas enregistrées", "", "info");
        }
      });
    } else {
      const id: string = uuidv4();
      const res = await this.lablHttpService
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
      const res2 = await this.gestionProduitHttpService
        .updateProduit(
          { ref: this.labelInfo.refProd, idEtiquette: id },
          this.labelInfo.refProd
        )
        .toPromise();
      this.idEtiquette = id;
      if (this.labelInfo.refProd) {
        //remove all components of this label
        await this.lablHttpService
          .deleteComponentsByEtiquette(this.idEtiquette)
          .toPromise()
          .catch((err) => {
            console.log(err.error.Status);
          });
        console.log("***list1***");
        console.log(this.dragDropService.list1);
        this.FillList1WithNewID(this.dragDropService.list1, this.ListWithNewID);
        console.log("***list1 after fill***");
        console.log(this.ListWithNewID);
        try {
          await this.createComponent(
            this.dragDropService.list1,
            this.idEtiquette
          );
          Swal.fire({
            icon: "success",
            title: "L'étiquette a été enregistrée",
            showConfirmButton: false,
            timer: 1500,
          });
        } catch (e) {}
      }
    }
  }

  onDrop(event) {
    this.dragDropService.drop(event);
    this.containerNotVide = this.dragDropService.list1.some(
      (item) =>
        item.type == "container" &&
        item.children.some((val) => val.children.length > 0)
    );
    this.container2NotVide = this.dragDropService.list1.some(
      (item) =>
        item.children.length == 2 &&
        item.children.some((val) => val.children.length > 0)
    );
    this.container3NotVide = this.dragDropService.list1.some(
      (item) =>
        item.children.length == 3 &&
        item.children.some((val) => val.children.length > 0)
    );
  }
  dragMoved(event) {
    this.dragDropService.dragMoved(event);
  }
  delete(id: string) {}
  rowStyle(item: ComponetList) {
    return {
      ...item.style,
      "border-style": "none",
    };
  }
  async createComponent(list: ComponetList[], idEtiquette) {
    await Promise.all(
      list.map(async (obj, index) => {
        if (obj.children && obj.children.length > 0) {
          await this.lablHttpService
            .CreateComponent({
              x: this.dragDropService.dragDropLibre
                ? this.dragDropService.dragPosition[obj.id].x
                : null,
              y: this.dragDropService.dragDropLibre
                ? this.dragDropService.dragPosition[obj.id].y
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
              width: (obj.style && obj.style["width"]) || "50",
              height: (obj.style && obj.style["height"]) || "50",
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
          console.log(
            `composent num ${index} with id : ${obj.type} insered successefly `
          );
          await this.createComponent(obj.children, idEtiquette);
        } else {
          await this.lablHttpService
            .CreateComponent({
              x: this.dragDropService.dragDropLibre
                ? this.dragDropService.dragPosition[obj.id].x
                : null,
              y: this.dragDropService.dragDropLibre
                ? this.dragDropService.dragPosition[obj.id].y
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
              width: (obj.style && obj.style["width"]) || "50",
              height: (obj.style && obj.style["height"]) || "50",
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
          console.log(
            `composent num ${index} with id : ${obj.type} insered successefly `
          );
        }
      })
    );
  }
  dragEnd($event: CdkDragEnd, itemId: string) {
    console.log(+$event.source.getFreeDragPosition().x);
    console.log(
      $event.dropPoint.x -
        document.getElementById("label").getBoundingClientRect().left
    );

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
    //console.log($event.source);
  }
  FillList1WithNewID(list: ComponetList[], ListWithNewID: ComponetList[]) {
    list.forEach((item, index) => {
      const id = uuidv4();
      ListWithNewID.push(Object.assign({}, { ...item, id: id, children: [] }));
      this.dragDropService.dragPosition[id] =
        this.dragDropService.dragPosition[item.id];
      if (item.children) {
        this.FillList1WithNewID(item.children, ListWithNewID[index].children);
      }
    });
  }
  openLabelView() {
    var node = document.getElementById("container");
    domtoimage.toSvg(node).then(
      (data) => {
        this.imgSrc = data;
        console.log(data);
      },
      {
        style: { width: "400px", height: "200px !important", display: "block" },
      }
    );
    const window = this.windowService.open(this.templateRef, {
      title: `Nouveau Produit`,
      windowClass: "container",
      closeOnBackdropClick: false,
      buttons: { minimize: true, fullScreen: false, maximize: false },
    });
  }
  setTabPropertyActive(itemId) {
    console.log(itemId);
    // this.sidebarService.toggle(false, "creationEtiquette");
    this.dragDropService.propertyTabActive = true;
    this.dragDropService.selectedItem = itemId;
  }
  textStyle(item: ComponetList) {
    const style = {};
    Object.keys(item.style).forEach((key) => {
      if (key != "transform") style[key] = item.style[key];
    });
    return style;
  }
  setItemId(data) {
    console.log(data);
    this.itemId = data;
    Object.keys(this.dragDropService.items).forEach(
      (key) => (this.dragDropService.items[key].style.border = "none")
    );

    // this.dragDropService.boxClassList[this.itemId] = true;
    // console.log(this.dragDropService.boxClassList);
    // console.log(this.dragDropService.boxClassList[this.itemId]);
  }
  remove(id: string) {
    console.log(id + "deleted");
    console.log(this.dragDropService.list1);

    const index = this.dragDropService.list1.findIndex((obj) => {
      return obj.id == id;
    });
    if (index != -1) {
      this.dragDropService.list2.push(this.dragDropService.list1[index]);
      this.dragDropService.list1.splice(index, 1);
    } else {
      this.dragDropService.list1.forEach((obj, index) => {
        obj.children.forEach((obj1, index1) => {
          if (obj1.id == id) {
            this.dragDropService.list2.push(
              this.dragDropService.list1[index].children[index1]
            );
            this.dragDropService.list1[index].children.splice(index1, 1);
            return;
          }
          obj1.children &&
            obj1.children.forEach((obj2, index2) => {
              if (obj2.id == id) {
                this.dragDropService.list2.push(
                  this.dragDropService.list1[index].children[index1].children[
                    index2
                  ]
                );
                this.dragDropService.list1[index].children[
                  index1
                ].children.splice(index2, 1);
                console.log(`${obj.id}- ${obj1.id} - ${obj2.id}`);
              }
            });
        });
      });
    }
  }
  @HostListener("document:keydown", ["$event"])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.code === "ArrowUp") {
      this.dragDropService.dragPosition[this.itemId] = {
        x: +this.dragDropService.dragPosition[this.itemId].x,
        y: this.dragDropService.dragPosition[this.itemId].y - 1,
      };
    } else if (event.code === "ArrowDown") {
      this.dragDropService.dragPosition[this.itemId] = {
        x: +this.dragDropService.dragPosition[this.itemId].x,
        y: this.dragDropService.dragPosition[this.itemId].y + 1,
      };
    } else if (event.code === "ArrowLeft") {
      this.dragDropService.dragPosition[this.itemId] = {
        x: +this.dragDropService.dragPosition[this.itemId].x - 1,
        y: this.dragDropService.dragPosition[this.itemId].y,
      };
    } else if (event.code === "ArrowRight") {
      this.dragDropService.dragPosition[this.itemId] = {
        x: +this.dragDropService.dragPosition[this.itemId].x + 1,
        y: this.dragDropService.dragPosition[this.itemId].y,
      };
    } else if (event.code === "Delete") {
      this.remove(this.itemId);
    }
  }
}

//TODO: ajout la régle dans l'etiquette
//TODO: affiche la grille
//TODO: ajoute les formes
//TODO: verifier les champs des produits similaire
//TODO: supprimer placeHolder de draggebl elements and disable list order
// TODO: supprimer les style css contient des valeur null
