import { Component, OnInit } from "@angular/core";
import { LabelService } from "../../label.service";
import { GestionProduitHttpService } from "../../../GestionProduits/GestionProduitHttp.service";
import { LabeltHttpService } from "../../labelHTTP.service";
import { DragDropService } from "../../drag-drop.service";
import { ComposentHttpData } from "../../EtiquetteHttp.data";
import {
  ClientData,
  CreateFormeResultData,
  FournisseurData,
  GetFormeResultData,
  GetOneSerialNumberResultData,
  LotData,
  ProduitData,
} from "../../../GestionProduits/GestionProduit.data";
import { ComponetList } from "../../ComposentData";
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
  componentsExtractedFromDB = [];
  listOfComponentFromDB: ComponetList[];
  productToBeCreated;
  produitwithEtiquette;
  constructor(
    private lableService: LabelService,
    private gestionProduitHttpService: GestionProduitHttpService,
    private labelHttpService: LabeltHttpService,
    private dragDropService: DragDropService
  ) {}

  async ngOnInit() {
    this.listOfComponentFromDB = [];
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
    this.produitwithEtiquette = await this.labelHttpService
      .getAllProduitWithEtiquette()
      .toPromise();
    console.log("product to creted");
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
      this.gestionProduitHttpService
        .getOneProduit(this.lableService.labelInfo.getValue().refProd)
        .toPromise()
        .then((val) => {
          this.productToBeCreated = val.produit;
          console.log(this.productToBeCreated);
          console.log(this.produitwithEtiquette.produits);
          console.log(!!this.productToBeCreated["withSN"]);

          this.refProdWithEtiquette = this.produitwithEtiquette.produits.filter(
            (obj) =>
              Object.keys(obj).every(
                (key) => !!this.productToBeCreated[key] === !!obj[key]
              )
          );
          console.log(this.refProdWithEtiquette);
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
    if (val && val !== null) {
      this.dragDropService.list1.length = 0;
      this.change("refProdSimlaire", val);
      const { produit } = await this.gestionProduitHttpService
        .getOneProduit(val)
        .toPromise();
      console.log("label ref prod");
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
      // download all components of label from DB
      const { composents } = await this.labelHttpService
        .GetAllComponentsByEtiquette(produit.idEtiquette)
        .toPromise();
      //get Client
      const client = this.productToBeCreated.codeClient
        ? (
            await this.gestionProduitHttpService
              .getClient(this.productToBeCreated.codeClient)
              .toPromise()
          ).body.client
        : null;
      //get Fournisseur
      const fournisseur = this.productToBeCreated.codeFournisseur
        ? (
            await this.gestionProduitHttpService
              .getFournisseur(this.productToBeCreated.codeFournisseur)
              .toPromise()
          ).body.fournisseur
        : null;
      //get Lot
      const lot = this.productToBeCreated.numLot
        ? (
            await this.gestionProduitHttpService
              .getOneLot(this.productToBeCreated.numLot)
              .toPromise()
          ).lot
        : null;
      //get SN
      const SN = this.productToBeCreated.idSN
        ? await this.gestionProduitHttpService
            .getOneSerialNumber(this.productToBeCreated.idSN)
            .toPromise()
        : null;
      this.dragDropService.list1.length = 0;
      this.listFromDB = [...composents];
      this.list = [];
      const forme = await Promise.all(
        this.productToBeCreated.formes.split(";").map((val) => {
          if (val) {
            return this.gestionProduitHttpService.getOneForm(val).toPromise();
          }
        })
      );

      console.log("****list  avant fill list******");
      console.log(this.list);
      console.log("composents");
      console.log(composents);
      if (this.dragDropService.dragDropLibre) {
        this.dragDropService.dragPosition = {};
        composents.forEach((comp) => {
          this.dragDropService.list1.push(
            this.ComponentToInsert(
              comp,
              produit,
              client,
              fournisseur,
              forme,
              lot,
              SN
            )
          );
          this.dragDropService.dragPosition[comp.id] = {
            x: +comp.x,
            y: +comp.y,
          };
        });
      }
      if (!this.dragDropService.dragDropLibre) {
        const list: ComponetList[] = [];
        this.uploadData(produit, client, fournisseur, forme, lot, SN);
        this.fillList1(composents, this.list, list);
        this.dragDropService.list1 = [...list];
      }
      // save all items in list1 into object
      this.dragDropService.getAllItems(this.dragDropService.list1);
      console.log("****list 1 ******");
      console.log(this.dragDropService.list1);

      if (this.labelInfo) {
        this.longueur = this.labelInfo.longueur;
        this.largeur = this.labelInfo.largeur;
        this.padding = this.labelInfo.padding;
        this.minPadding = this.labelInfo.padding;
      }
    }
  }
  list: ComponetList[] = [];
  ComponentToInsert(
    obj: ComposentHttpData,
    produit,
    client: ClientData,
    fournisseur: FournisseurData,
    form: CreateFormeResultData[],
    lot: LotData,
    SN: GetOneSerialNumberResultData
  ) {
    return {
      id: obj.id,
      data:
        obj.refItem == "desClient" && client
          ? client.desClient
          : obj.refItem == "idSN" && SN
          ? SN.serialNumber.prefix + SN.serialNumber.suffix
          : obj.refItem == "desFournisseur" && fournisseur
          ? fournisseur.desFournisseur
          : obj.refItem == "format" && lot
          ? lot.format
          : (obj.refItem && obj.refItem.includes("formes") ? form : null)
          ? form[+obj.refItem.split("-")[1]].form.path
          : this.productToBeCreated[obj.refItem],
      refItem: obj.refItem,
      title: obj.title,
      type:
        obj.refItem && obj.refItem.includes("formes") && form
          ? "forme"
          : obj.type,
      children: [],
      dataMatrixCode: obj.dataMatrixCode,
      dataMatrixFormat: obj.dataMatrixFormat,
      format: obj.format,
      style: {
        "background-color": obj["background-color"],
        "border-color": obj["border-color"],
        "border-style": obj["border-style"],
        "border-width": obj["border-width"],
        "font-weight": obj.bold ? "bold" : "normal",
        "font-family": obj["font-family"],
        "font-size": obj["font-size"],
        "font-style": obj.italic ? "italic" : obj["font-style"],
        margin: obj["margin"],
        "margin-left": obj["margin-left"],
        "margin-right": obj["margin-right"],
        "margin-bottom": obj["margin-bottom"],
        "margin-top": obj["margin-top"],
        padding: obj["padding"],
        "padding-top": obj["padding-top"],
        "padding-bottom": obj["padding-bottom"],
        "padding-right": obj["padding-right"],
        "padding-left": obj["padding-left"],
        "text-align": obj["text-align"],
        color: obj["color"],
        italic: obj["italic"],
        underline: obj["underline"],
        width: obj["width"],
        height: obj["height"],
        "text-decoration": obj["text-decoration"],
        transform: obj["transform"],
      },
    };
  }
  findCompoent(list: ComponetList[], component: ComponetList) {
    list.forEach((val) => {
      console.log("egale");

      console.log(val.id);
      console.log(component.id);
    });
    return list.some((val) => val.id === component.id);
  }
  listFromDB: ComposentHttpData[];
  nochildren = false;

  uploadData(produit, client, fournisseur, form, lot, SN) {
    this.listFromDB.map((item) => {
      if (item && item.children == "") {
        this.list.push(
          this.ComponentToInsert(
            item,
            produit,
            client,
            fournisseur,
            form,
            lot,
            SN
          )
        );
        this.listFromDB[
          this.listFromDB.findIndex((obj) => obj && obj.id == item.id)
        ] = null;
      }
    });
    this.listFromDB.forEach((item) => {
      if (item && item.children != "") {
        const listOfChildrenId = item.children.split(";") || [item.children];
        const inseredComponent = this.ComponentToInsert(
          item,
          produit,
          client,
          fournisseur,
          form,
          lot,
          SN
        );
        const listofIdFromList = this.list.map((val) => val.id);
        if (listOfChildrenId.every((elem) => listofIdFromList.includes(elem))) {
          listOfChildrenId.forEach((obj) => {
            if (this.list.map((val) => val.id).includes(obj)) {
              const index = this.list.findIndex(
                (searched) => searched.id == obj
              );
              inseredComponent.children.push(this.list[index]);
              this.list.splice(index, 1);
            }
          });
          this.list.push(inseredComponent);
          const index1 = this.listFromDB.findIndex(
            (obj) => obj && obj.id === item.id
          );
          if (index1 !== -1) this.listFromDB[index1] = null;
        }
      }
    });

    if (this.listFromDB.some((val) => val !== null)) {
      this.uploadData(produit, client, fournisseur, form, lot, SN);
    }
  }
  fillList1(
    listFromDB: ComposentHttpData[],
    listIn: ComponetList[],
    listOut: ComponetList[]
  ) {
    listIn.forEach((val, index) => {
      listFromDB.forEach((itemFromDB) => {
        if (itemFromDB.id == val.id) {
          listOut[+itemFromDB.ordre] = {
            data: val.data,
            id: val.id,
            refItem: val.refItem,
            title: val.title,
            type: val.type,
            dataMatrixCode: val.dataMatrixCode,
            dataMatrixFormat: val.dataMatrixFormat,
            format: val.format,
            style: { ...val.style },
            children: [],
          };
          if (val.children && val.children.length > 0) {
            this.fillList1(
              listFromDB,
              val.children,
              listOut[+itemFromDB.ordre].children
            );
          }
        }
      });
    });
  }
}
