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

@Component({
  selector: "ngx-label-component",
  templateUrl: "./label-component.component.html",
  styleUrls: ["./label-component.component.scss"],
})
export class LabelComponentComponent implements OnChanges, OnInit {
  @Input() refProd;
  @Input() changeSN;
  @Output() list1Event = new EventEmitter<ComponetList[]>();
  @Output() withSN = new EventEmitter<boolean>();
  @Output() sn = new EventEmitter<SerialNumberData>();
  @Output() withDataMatrix = new EventEmitter<Boolean>();
  list1;
  labelStyle;
  labelInfo;
  list;
  SN;

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
  async loadEtiquette(refProd: string) {
    const { produit } = await this.gestionProduitHttpService
      .getOneProduit(refProd)
      .toPromise();
    this.withDataMatrix.emit(produit.withDataMatrix);
    const { etiquette } = await this.labelHttpService
      .GetOneEtiquette(produit.idEtiquette)
      .toPromise();
    console.log(etiquette);
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
    this.list1 = [];
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
    console.log("dragPosition From db");
    console.log(this.dragDropService.dragPosition);
    // this.uploadData(
    //   Array.from(composents),
    //   produit,
    //   client,
    //   fournisseur,
    //   forme,
    //   lot
    // );
    // const list = [];
    // this.fillList1(composents, this.list, list);
    // this.list1 = [...list];
    this.list1Event.emit(this.list1);
  }

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
  changeSn = () => {
    const suff = parseInt(this.SN.suffix) + +this.SN.pas;
    this.SN.suffix = suff.toString().padStart(+this.SN.nbrCaractere, "0");
    this.snComp.data = this.SN.prefix + this.SN.suffix;
    console.log(this.snComp);
  };
}
