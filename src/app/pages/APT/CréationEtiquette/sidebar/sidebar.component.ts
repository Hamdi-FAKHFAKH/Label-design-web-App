import { AfterViewInit, Component, OnInit, ViewChild } from "@angular/core";
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
@Component({
  selector: "ngx-sidebar",
  templateUrl: "./sidebar.component.html",
  styleUrls: ["./sidebar.component.scss"],
})
export class SidebarComponent implements OnInit {
  @ViewChild(CdkDropList) dropList?: CdkDropList;
  labelStyle;
  labelInfo;
  list1 = [];
  list3 = [];
  list4 = [];
  constructor(
    private labelService: LabelService,
    private lablHttpService: LabeltHttpService,
    private gestionProduitHttpService: GestionProduitHttpService
  ) {}
  ngOnInit(): void {
    this.labelService.labelInfo.subscribe((info) => {
      // console.log(info);
      if (info) {
        console.log("update format");

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
      console.log(res);
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
      console.log(res);
      console.log(res2);
    }

    //this.labelService.convertToPdf();
  }
  drop(ev) {
    console.log("ev2");
    console.log(ev);
    ev.container.element.nativeElement.appendChild(
      ev.item.element.nativeElement
    );
    // ev.preventDefault();
    // var data = ev.dataTransfer.getData("text");
    // console.log(data);
    // if (data.includes("drag")) {
    //   ev.target.appendChild(document.getElementById(data));
    //   document.getElementById("msg").remove();
    //   // this.dragebel = false;
    // }
  }
  onDrop(event: CdkDragDrop<string[]>) {
    console.log(event.previousContainer.id);

    if (event.previousContainer.id === event.container.id) {
      // Handle drop within the same container
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      // Handle drop between different containers
      copyArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }

    // event.container.element.nativeElement.appendChild(
    //   event.item.element.nativeElement
    // );
  }
}
