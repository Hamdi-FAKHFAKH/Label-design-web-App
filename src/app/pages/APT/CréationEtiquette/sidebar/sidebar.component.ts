import {
  AfterContentChecked,
  AfterContentInit,
  AfterViewInit,
  Component,
  OnInit,
  ViewChild,
} from "@angular/core";
import { LabelService } from "../label.service";
import { LabeltHttpService } from "../labelHTTP.service";
import { v4 as uuidv4 } from "uuid";
import { GestionProduitHttpService } from "../../GestionProduits/GestionProduitHttp.service";
import {
  CdkDragDrop,
  CdkDropList,
  copyArrayItem,
  moveItemInArray,
} from "@angular/cdk/drag-drop";
import bwipjs from "bwip-js";
import { DragDropService } from "../drag-drop.service";
import { ComponetList } from "../ComposentData";

@Component({
  selector: "ngx-sidebar",
  templateUrl: "./sidebar.component.html",
  styleUrls: ["./sidebar.component.scss"],
})
export class SidebarComponent implements OnInit {
  @ViewChild(CdkDropList) dropList?: CdkDropList;
  containerNotVide;
  container2NotVide;
  container3NotVide;
  labelStyle;
  labelInfo;
  list1;
  list3 = [];
  list4 = [];
  constructor(
    private labelService: LabelService,
    private lablHttpService: LabeltHttpService,
    private gestionProduitHttpService: GestionProduitHttpService,
    public dragDropService: DragDropService
  ) {}
  ngOnInit(): void {
    this.containerNotVide = false;
    this.container2NotVide = false;
    this.container3NotVide = false;
    // let canvas = bwipjs.toCanvas("mycanvas", {
    //   bcid: "code128", // Barcode type
    //   text: "0123456789", // Text to encode
    //   scale: 3, // 3x scaling factor
    //   height: 10, // Bar height, in millimeters
    //   includetext: true, // Show human-readable text
    //   textxalign: "center", // Always good to set this
    // });
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
    this.list1 = this.dragDropService.list1;
  }

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
    let idEtiquette;
    produits.map((val) => {
      refProdWithEtiquette.push(val.ref);
      if (val.ref === this.labelInfo.refProd) {
        idEtiquette = val.idEtiquette;
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
        .UpdateEtiquette(idEtiquette, {
          couleur: this.labelInfo.color,
          format: this.labelInfo.format,
          id: idEtiquette,
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
      //create composent
      this.dragDropService.list1.map((obj, index) => {
        const res3 = this.lablHttpService
          .CreateComopsent({
            "background-color": obj.style["background-color"],
            "border-color": obj.style["border-color"],
            "border-style": obj.style["border-style"],
            "border-width": obj.style["border-width"],
            bold: obj.style.bold,
            "font-family": obj.style["font-family"],
            "font-size": obj.style["font-size"],
            "font-style": obj.style["font-style"],
            margin: obj.style["margin"],
            "margin-left": obj.style["margin-left"],
            "margin-right": obj.style["margin-right"],
            "margin-bottom": obj.style["margin-bottom"],
            "margin-top": obj.style["margin-top"],
            padding: obj.style["padding"],
            "padding-top": obj.style["padding-top"],
            "padding-bottom": obj.style["padding-bottom"],
            "padding-right": obj.style["padding-right"],
            "padding-left": obj.style["padding-left"],
            "text-align": obj.style["text-align"],
            color: obj.style["color"],
            italic: obj.style["italic"],
            underline: obj.style["underline"],
            width: obj.style["width"],
            height: obj.style["height"],
            "text-decoration": obj.style["text-decoration"],
            transform: obj.style["transform"],
            type: obj.type,
            refItem: obj.refItem,
            children: obj.children.join(";"),
            data: obj.data,
            title: obj.title,
            format: obj.format,
            id: `${index}-${obj.id}`,
            refEtiquette: id,
            dataMatrixCode: obj.dataMatrixCode,
            dataMatrixFormat: obj.dataMatrixCode,
          })
          .toPromise()
          .then(() => {
            console.log(
              `composent num ${index} with id : ${obj.id} insered successefly `
            );
          });
      });
    }

    //this.labelService.convertToPdf();
  }
  // drop(ev) {
  //   ev.container.element.nativeElement.appendChild(
  //     ev.item.element.nativeElement
  //   );
  // }
  onDrop(event) {
    this.dragDropService.drop(event);
    this.containerNotVide = this.list1.some(
      (item) =>
        item.type == "container" &&
        item.children.some((val) => val.type !== "vide")
    );
    this.container2NotVide = this.list1.some(
      (item) =>
        item.children.length == 2 &&
        item.children.some((val) => val.type !== "vide")
    );
    this.container3NotVide = this.list1.some(
      (item) =>
        item.children.length == 3 &&
        item.children.some((val) => val.type !== "vide")
    );
    // this.list1[event.currentIndex] = {
    //   ...this.list1[event.currentIndex],
    //   id: "dfdddfdfd",
    // };

    // event.container.element.nativeElement.appendChild(
    //   event.item.element.nativeElement
    // );
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
}
