import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from "@angular/core";
import { GestionProduitHttpService } from "../../GestionProduits/GestionProduitHttp.service";
import { LabeltHttpService } from "../../CréationEtiquette/labelHTTP.service";
import { ComposentHttpData } from "../../CréationEtiquette/EtiquetteHttp.data";
import { ComponetList } from "../../CréationEtiquette/ComposentData";
import {
  ClientData,
  CreateFormeResultData,
  FournisseurData,
  GetOneSerialNumberResultData,
  LotData,
  SerialNumberData,
} from "../../GestionProduits/GestionProduit.data";
import { DragDropService } from "../../CréationEtiquette/drag-drop.service";
import Swal from "sweetalert2";

@Component({
  selector: "ngx-label-component",
  templateUrl: "./label-component.component.html",
  styleUrls: ["./label-component.component.scss"],
})
export class LabelComponentComponent implements OnChanges, OnInit {
  @Input() refProd;
  @Input() OF;
  @Input() changeSN;
  @Output() list1Event = new EventEmitter<ComponetList[]>();
  @Output() withSN = new EventEmitter<boolean>();
  @Output() sn = new EventEmitter<SerialNumberData>();
  @Output() withDataMatrix = new EventEmitter<Boolean>();
  list1: ComponetList[];
  labelStyle: {
    "background-color"?: string;
    width?: string;
    height?: string;
    padding?: string;
    "border-radius"?: string;
  };
  labelInfo: {
    color: string;
    format: string;
    refProdSimlaire: string;
    longueur: number;
    largeur: number;
    padding: number;
  };
  list: ComponetList[];
  SN: SerialNumberData;
  dragDropLibre: boolean = true;
  snComp: ComponetList;
  constructor(
    private gestionProduitHttpService: GestionProduitHttpService,
    private labelHttpService: LabeltHttpService,
    public dragDropService: DragDropService
  ) {}
  ngOnInit(): void {
    this.changeSN.subscribe(() => {
      this.changeSn();
    });
  }
  // return style de container en mettant son bordure none
  rowStyle(item: ComponetList) {
    return {
      ...item.style,
      "border-style": "none",
    };
  }
  ngOnChanges(): void {
    this.refProd &&
      this.loadEtiquette(this.refProd)
        .then(() => {
          console.log("load SUCCESS");
        })
        .catch((err) => {
          console.log(err);
        });
  }
  // charger les élements de l'étiquette en fonction de référence Produit a partir de la BD
  async loadEtiquette(refProd: string) {
    this.list1 = [];
    this.labelStyle = {};
    let produit;
    try {
      produit = (
        await this.gestionProduitHttpService.getOneProduit(refProd).toPromise()
      ).produit;
      this.withDataMatrix.emit(produit.withDataMatrix);
    } catch (e) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Produit n'existe Pas!",
        footer:
          '<a [routerLink]="["/pages/apt/gestionProduits"]" >Créer un produit pour cet OF</a>',
      });
      return;
    }
    let etiquette;
    try {
      etiquette = (
        await this.labelHttpService
          .GetOneEtiquette(produit.idEtiquette)
          .toPromise()
      ).etiquette;
    } catch (e) {
      console.log(e);
    }
    console.log(etiquette);
    if (!etiquette) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Aucune Etiquette crée pour ce produit",
        footer:
          '<a href="/pages/apt/CreationEtiquette" >Créer une Etiquette pour ce Produit</a>',
      });
    }
    if (etiquette) {
      this.labelInfo = {
        color: etiquette.couleur,
        format: etiquette.format,
        refProdSimlaire: etiquette.id1,
        longueur: etiquette.longeur,
        largeur: etiquette.largeur,
        padding: etiquette.padding,
      };
      if (this.labelInfo) {
        this.labelStyle = {
          "background-color": this.labelInfo.color,
          width: this.labelInfo.largeur + "mm",
          height: this.labelInfo.longueur + "mm",
          padding: this.labelInfo.padding + "mm",
        };
        if (this.labelInfo.format == "cercle") {
          this.labelStyle = {
            ...this.labelStyle,
            "border-radius": this.labelInfo.largeur + "mm",
          };
        }
      }
      // download all components of label from DB
      const { composents } = await this.labelHttpService
        .GetAllComponentsByEtiquette(produit.idEtiquette)
        .toPromise();
      //get Client
      const client = produit.codeClient
        ? (
            await this.gestionProduitHttpService
              .getClient(produit.codeClient)
              .toPromise()
          ).body.client
        : null;
      //get Fournisseur
      const fournisseur = produit.codeFournisseur
        ? (
            await this.gestionProduitHttpService
              .getFournisseur(produit.codeFournisseur)
              .toPromise()
          ).body.fournisseur
        : null;
      //get Lot
      const lot = produit.numLot
        ? (
            await this.gestionProduitHttpService
              .getOneLot(produit.numLot)
              .toPromise()
          ).lot
        : null;

      //get Forme
      const forme = await Promise.all(
        produit.formes.split(";").map((val) => {
          if (val) {
            return this.gestionProduitHttpService.getOneForm(val).toPromise();
          }
        })
      );
      //get SN
      const SN = produit.idSN
        ? await this.gestionProduitHttpService
            .getOneSerialNumber(produit.idSN)
            .toPromise()
        : null;

      if (SN) {
        this.SN = SN.serialNumber;
        this.withSN.emit(true);
        this.sn.emit(this.SN);
      } else {
        this.withSN.emit(false);
      }

      // fill list1
      if (!composents.some((val) => val.x == null || val.y == null)) {
        this.dragDropLibre = true;
        this.dragDropService.dragPosition = {};
        composents.forEach((comp) => {
          if (comp.refItem == "idSN") {
            this.snComp = this.ComponentToInsert(
              comp,
              produit,
              client,
              fournisseur,
              forme,
              lot,
              SN
            );
            this.list1.push(this.snComp);
          } else {
            this.list1.push(
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
          }
          this.dragDropService.dragPosition[comp.id] = {
            x: +comp.x,
            y: +comp.y,
          };
        });
        console.log(this.dragDropService.dragPosition);
      } else {
        this.dragDropLibre = false;
        this.list = [];
        const list: ComponetList[] = [];
        this.uploadData(
          Array.from(composents),
          produit,
          client,
          fournisseur,
          forme,
          lot,
          SN
        );
        this.orderElementsInList1(composents, this.list, list);
        this.snComp = this.findSN(list);
        console.log(this.snComp);
        this.list1 = list;
      }
      this.list1Event.emit(this.list1);
    }
  }
  // rechercher l'element Sérial Number dans un list
  findSN(data: ComponetList[]) {
    const res = data.find((val) => val.refItem == "idSN" && val.data);
    let resarray;
    if (!res) {
      resarray = data.map((val) => {
        if (val.children.length > 0) {
          return this.findSN(val.children);
        } else {
          return null;
        }
      });
    }
    return (
      res || resarray.find((val) => val && val.refItem == "idSN" && val.data)
    );
  }
  // parcourir les element a partir de BD et les insérer dans list ( utiliser dans le drag & drop avec container)
  uploadData(listFromDB, produit, client, fournisseur, form, lot, SN) {
    listFromDB.map((item) => {
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
        listFromDB[listFromDB.findIndex((obj) => obj && obj.id == item.id)] =
          null;
      }
    });
    listFromDB.forEach((item) => {
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
          const index1 = listFromDB.findIndex(
            (obj) => obj && obj.id === item.id
          );
          if (index1 !== -1) listFromDB[index1] = null;
        }
      }
    });

    if (listFromDB.some((val) => val !== null)) {
      this.uploadData(listFromDB, produit, client, fournisseur, form, lot, SN);
    }
  }
  // order item in list1
  orderElementsInList1(
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
            this.orderElementsInList1(
              listFromDB,
              val.children,
              listOut[+itemFromDB.ordre].children
            );
          }
        }
      });
    });
  }
  //return item to insert in list 1 (list1 contient list des element insérer dans l'étiquette)
  ComponentToInsert(
    obj: ComposentHttpData,
    produit,
    client: ClientData,
    fournisseur: FournisseurData,
    form: CreateFormeResultData[],
    lot: LotData,
    SN: GetOneSerialNumberResultData
  ): ComponetList {
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
          : obj.refItem == "of" && this.OF
          ? this.OF
          : produit[obj.refItem],
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
  // changer le Numéro de Série dans l'étiquette
  changeSn = () => {
    const suff = parseInt(this.SN.suffix) + +this.SN.pas;
    this.SN.suffix = suff.toString().padStart(+this.SN.nbrCaractere, "0");
    this.snComp.data = this.SN.prefix + this.SN.suffix;
    console.log(this.snComp);
  };
}
