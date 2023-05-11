import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
} from "@angular/core";
import { LabelService } from "../label.service";
import { LabeltHttpService } from "../labelHTTP.service";
import { v4 as uuidv4 } from "uuid";
import { GestionProduitHttpService } from "../../GestionProduits/GestionProduitHttp.service";
import { CdkDragEnd, CdkDropList } from "@angular/cdk/drag-drop";
import { DragDropService } from "../drag-drop.service";
import { ComponetList } from "../ComposentData";

@Component({
  selector: "ngx-sidebar",
  templateUrl: "./sidebar.component.html",
  styleUrls: ["./sidebar.component.scss"],
})
export class SidebarComponent implements OnInit {
  @ViewChildren("dimension") elReference: QueryList<ElementRef>;
  @ViewChild(CdkDropList) dropList?: CdkDropList;
  containerNotVide;
  container2NotVide;
  container3NotVide;
  labelStyle;
  labelInfo;
  list1;
  list3 = [];
  list4 = [];
  dragPosition = { x: 0, y: 0 };
  idEtiquette;
  constructor(
    private labelService: LabelService,
    private lablHttpService: LabeltHttpService,
    private gestionProduitHttpService: GestionProduitHttpService,
    public dragDropService: DragDropService
  ) {}
  changePosition(x, y) {
    this.dragPosition = {
      x: x ? x : this.dragPosition.x,
      y: y ? y : this.dragPosition.y,
    };
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
    const { produits } = await this.lablHttpService
      .getAllProduitWithEtiquette()
      .toPromise();
    const refProdWithEtiquette = [];

    produits.map((val) => {
      refProdWithEtiquette.push(val.ref);
      if (val.ref === this.labelInfo.refProd) {
        this.idEtiquette = val.idEtiquette;
      }
    });
    if (!this.labelInfo.refProd) {
      alert("selectionner la référence Produit");
    } else if (refProdWithEtiquette.includes(this.labelInfo.refProd)) {
      alert(
        "vous voulez écraser les données de l'etiquette de ref produit" +
          this.labelInfo.refProd +
          "?"
      );
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
    }
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

      await this.createComponent(this.dragDropService.list1, this.idEtiquette);
    }
    this.labelService.convertToPdf();
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
  dragEnd($event: CdkDragEnd) {
    this.dragPosition.x = Math.round(+$event.source.getFreeDragPosition().x);
    this.dragPosition.y = Math.round(+$event.source.getFreeDragPosition().y);
    console.log($event.source.getFreeDragPosition());
  }
}

//TODO: ajout la régle dans l'etiquette
//TODO: affiche la grille
//TODO: ajoute les formes
//TODO: verifier les champs des produits similaire
