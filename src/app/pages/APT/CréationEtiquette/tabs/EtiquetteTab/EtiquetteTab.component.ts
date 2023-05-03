import { Component, OnInit } from "@angular/core";
import { LabelService } from "../../label.service";
import { GestionProduitHttpService } from "../../../GestionProduits/GestionProduitHttp.service";
import { LabeltHttpService } from "../../labelHTTP.service";
import { DragDropService } from "../../drag-drop.service";
@Component({
  selector: "ngx-etiquette-tab",
  templateUrl: "./EtiquetteTab.component.html",
  styleUrls: ["./EtiquetteTab.component.scss"],
})
export class EtiquetteTabComponent implements OnInit {
  largeur;
  longueur;
  padding;
  color;
  unitLong: string;
  unitLarg: string;
  unitPadding: string;
  labelInfo;
  listProd;
  refProdWithEtiquette;
  minPadding;

  constructor(
    private lableService: LabelService,
    private gestionProduitHttpService: GestionProduitHttpService,
    private labelHttpService: LabeltHttpService,
    private dragDropService: DragDropService
  ) {}

  async ngOnInit() {
    this.unitLarg = "mm";
    this.unitLong = "mm";
    this.unitPadding = "mm";
    this.gestionProduitHttpService.getAllProduits().subscribe((res) => {
      this.listProd = res.produits;
    });
    this.lableService.labelInfo.subscribe((info) => {
      this.labelInfo = info;
    });
    if (this.labelInfo) {
      this.longueur = this.labelInfo.longueur;
      this.largeur = this.labelInfo.largeur;
      this.padding = this.labelInfo.padding;
      this.minPadding = this.labelInfo.padding;
    }
    const res = await this.labelHttpService
      .getAllProduitWithEtiquette()
      .toPromise();
    this.refProdWithEtiquette = res.produits;
  }

  change(elemName, elemValue) {
    if (this.labelInfo.format == "cercle" && elemName == "longueur") {
      this.minPadding = Math.ceil(
        (+elemValue - Math.sqrt((+elemValue * +elemValue) / 2)) / 2
      );
      this.lableService.labelInfo.next({
        ...this.labelInfo,
        longueur: +elemValue,
        largeur: +elemValue,
        padding: this.minPadding,
      });
      this.padding = this.labelInfo.padding;
    } else if (elemName == "padding") {
      if (+elemValue > this.minPadding) {
        this.lableService.labelInfo.next({
          ...this.labelInfo,
          [elemName]: elemValue,
          showPaddingCadre: true,
        });
        setTimeout(() => {
          this.lableService.labelInfo.next({
            ...this.labelInfo,
            showPaddingCadre: false,
          });
        }, 1600);
      }
    } else if (elemName == "refProd") {
      if (this.dragDropService.list1.length >= 1) {
        alert(
          "êtes-vous sûr de changer la référence ? tous les champs sur l'étiquette seront perdus"
        );
        this.dragDropService.list1.length = 0;
      }
      this.lableService.labelInfo.next({
        ...this.labelInfo,
        refProd: elemValue,
        id: `TE-${elemValue}`,
      });
    } else {
      this.lableService.labelInfo.next({
        ...this.labelInfo,
        [elemName]: elemValue,
        showPaddingCadre: false,
      });
    }
  }
  changeLongUnit(long) {
    if (this.labelInfo.format == "cercle" && this.unitLong === "mm") {
      this.change("longueur", +long * 10);
      this.change("largeur", +long * 10);
      this.unitLong = "cm";
    } else if (this.labelInfo.format == "cercle" && this.unitLong === "cm") {
      this.change("longueur", +long);
      this.change("largeur", +long);
      this.unitLong = "mm";
    } else if (this.unitLong === "mm") {
      this.unitLong = "cm";
      this.change("longueur", +long * 10);
    } else {
      this.unitLong = "mm";
      this.change("longueur", +long);
    }
    this.longueur = long;
  }
  changeLargUnit(larg) {
    if (this.unitLarg === "mm") {
      this.unitLarg = "cm";
      this.change("largeur", +larg * 10);
    } else {
      this.unitLarg = "mm";
      this.change("largeur", +larg);
    }
    this.largeur = larg;
  }
  changePaddingUnit(pad) {
    if (this.unitPadding === "mm") {
      this.unitPadding = "cm";
      this.change("padding", +pad * 10);
    } else {
      this.unitPadding = "mm";
      this.change("padding", +pad);
    }
    this.padding = pad;
  }
  changeOrientation() {
    const larg = this.labelInfo.largeur;
    this.change("largeur", +this.labelInfo.longueur);
    this.change("longueur", +larg);
    this.longueur = this.labelInfo.longueur;
    this.largeur = this.labelInfo.largeur;
  }
  setCercle() {
    this.change("format", "cercle");
    this.lableService.labelInfo.next({
      ...this.labelInfo,
      longueur: this.labelInfo.longueur,
      largeur: this.labelInfo.longueur,
      padding: Math.ceil(
        (this.labelInfo.longueur -
          Math.sqrt((this.labelInfo.longueur * this.labelInfo.longueur) / 2)) /
          2
      ),
    });
    this.largeur = this.labelInfo.longueur;
    this.longueur = this.labelInfo.longueur;
    this.padding = this.labelInfo.padding;
  }
  setRectangle() {
    this.change("format", "rectangle");
    this.lableService.labelInfo.next({
      ...this.labelInfo,
      padding: 3,
    });
    this.padding = 3;
    this.minPadding = 3;
  }
  async DownloadLabelData(val) {
    this.change("refProdSimlaire", val);
    const { produit } = await this.gestionProduitHttpService
      .getOneProduit(val)
      .toPromise();
    const { etiquette } = await this.labelHttpService
      .GetOneEtiquette(produit.idEtiquette)
      .toPromise();
    console.log(etiquette);
    this.lableService.labelInfo.next({
      ...this.labelInfo,
      color: etiquette.couleur,
      format: etiquette.format,
      refProdSimlaire: etiquette.id1,
      longueur: etiquette.longeur,
      largeur: etiquette.largeur,
      padding: etiquette.padding,
    });
    if (this.labelInfo) {
      this.longueur = this.labelInfo.longueur;
      this.largeur = this.labelInfo.largeur;
      this.padding = this.labelInfo.padding;
      this.minPadding = this.labelInfo.padding;
    }
  }
}

//   id: "dddd",
//   refProd: "dcddcd",
//   refProdSimlaire: "ssxsxsx",
//   hauteur: 552,
//   largeur: 888,
//   format: "dzdz",
//   color: "sdzz",
//   withRule: false,
//   withGrid: false,
// }
