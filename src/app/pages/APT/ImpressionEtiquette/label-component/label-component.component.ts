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
import { LabeltHttpService } from "../../Create-label/labelHTTP.service";
import { ComposentHttpData } from "../../Create-label/labelHttp.data";
import { LabelItem } from "../../Create-label/ComposentData";
import {
  ClientData,
  CreateFormeResultData,
  FournisseurData,
  GetOneSerialNumberResultData,
  LotData,
  SerialNumberData,
} from "../../GestionProduits/GestionProduit.data";
import { DragDropService } from "../../Create-label/drag-drop.service";
import Swal from "sweetalert2";
import { DetailImpressionHttpService } from "../../DetailImpression/detailImpressionHttp.service";
import { EtiquetteImprimeeData } from "../../DetailImpression/detailImpressionHttp.data";
import { Router } from "@angular/router";
import { AuthService } from "../../../../auth/authService.service";
import { roles } from "../../../../auth/user";

@Component({
  selector: "ngx-label-component",
  templateUrl: "./label-component.component.html",
  styleUrls: ["./label-component.component.scss"],
})
export class LabelComponentComponent implements OnChanges, OnInit {
  @Input() refProd;
  @Input() OF: string;
  @Input() changeSN;
  @Input() lotdata;
  @Output() list1Event = new EventEmitter<LabelItem[]>();
  @Output() withSN = new EventEmitter<boolean>();
  @Output() sn = new EventEmitter<SerialNumberData>();
  @Output() withDataMatrix = new EventEmitter<Boolean>();
  produit;
  formatLot;
  list1: LabelItem[];
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
  list: LabelItem[];
  SN: SerialNumberData;
  dragDropLibre: boolean = true;
  snComp: LabelItem;
  dataMatrixComp: LabelItem;
  constructor(
    private gestionProduitHttpService: GestionProduitHttpService,
    private labelHttpService: LabeltHttpService,
    public dragDropService: DragDropService,
    private detailImpressionHttpService: DetailImpressionHttpService,
    private router: Router,
    private authService: AuthService
  ) {}
  ngOnInit(): void {
    this.changeSN.subscribe(() => {
      this.changeSn();
    });
  }
  // return style de container en mettant son bordure none
  rowStyle(item: LabelItem) {
    return {
      ...item.style,
      "border-style": "none",
    };
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes.refProd &&
      changes.refProd.currentValue !== changes.refProd.previousValue
    ) {
      this.refProd &&
        this.loadEtiquette(this.refProd)
          .then(() => {})
          .catch((err) => {});
    } else {
      if (this.dataMatrixComp) {
        this.dataMatrixComp.data = this.dataMatrixComp.data
          .replace("<<FormatLot>>", this.lotdata)
          .replace(
            changes.lotdata?.previousValue,
            changes.lotdata?.currentValue
          );
      }
    }
  }
  // charger les élements de l'étiquette en fonction de référence Produit a partir de la BD
  async loadEtiquette(refProd: string) {
    this.list1 = [];
    this.labelStyle = {};

    try {
      this.produit = (
        await this.gestionProduitHttpService.getOneProduit(refProd).toPromise()
      ).produit;
      this.withDataMatrix.emit(this.produit.withDataMatrix);
    } catch (e) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Produit n'existe Pas!",
        showConfirmButton:
          this.authService.user.getValue().role !== roles.agentSaisie,
        confirmButtonColor: "#3374B5",
        confirmButtonText: "Créer un produit pour cet OF",
        showCancelButton: true,
        cancelButtonText: "Fermer",
      }).then((result) => {
        if (result.isConfirmed) {
          this.router.navigate(["/pages/apt/gestionProduits"]);
        }
      });
      return;
    }
    let etiquette;
    try {
      etiquette = (
        await this.labelHttpService
          .GetOneEtiquette(this.produit.idEtiquette)
          .toPromise()
      ).etiquette;
    } catch (e) {}
    if (!etiquette) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Aucune Etiquette crée pour ce produit",
        showConfirmButton:
          this.authService.user.getValue().role !== roles.agentSaisie,
        confirmButtonColor: "#3374B5",
        confirmButtonText: "Créer une Etiquette pour ce Produit",
        showCancelButton: true,
        cancelButtonText: "Fermer",
      }).then((result) => {
        if (result.isConfirmed) {
          this.router.navigate(["/pages/apt/CreationEtiquette"]);
        }
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
      this.labelStyle = {
        "background-color": this.labelInfo.color,
        height: this.labelInfo.largeur + "mm",
        width: this.labelInfo.longueur + "mm",
        padding: this.labelInfo.padding + "mm",
      };
      if (this.labelInfo.format == "cercle") {
        this.labelStyle = {
          ...this.labelStyle,
          "border-radius": this.labelInfo.largeur + "mm",
        };
      }
      // download all components of label from DB
      const { composents } = await this.labelHttpService
        .GetAllComponentsByEtiquette(this.produit.idEtiquette)
        .toPromise();
      //get Client
      const client = this.produit.codeClient
        ? (
            await this.gestionProduitHttpService
              .getClient(this.produit.codeClient)
              .toPromise()
          ).body.client
        : null;
      //get Fournisseur
      const fournisseur = this.produit.codeFournisseur
        ? (
            await this.gestionProduitHttpService
              .getFournisseur(this.produit.codeFournisseur)
              .toPromise()
          ).body.fournisseur
        : null;
      //get Lot
      const lot = this.produit.numLot
        ? (
            await this.gestionProduitHttpService
              .getOneLot(this.produit.numLot)
              .toPromise()
          ).lot
        : null;
      this.formatLot = lot.format;
      //get Forme
      const forme = await Promise.all(
        this.produit.formes.split(";").map((val) => {
          if (val) {
            return this.gestionProduitHttpService.getOneForm(val).toPromise();
          }
        })
      );
      //get SN
      const SN = this.produit.idSN
        ? await this.gestionProduitHttpService
            .getOneSerialNumber(this.produit.idSN)
            .toPromise()
        : null;

      if (SN) {
        this.SN = SN.serialNumber;
        const printedLabel = (
          await this.detailImpressionHttpService
            .GetALLEtiquettesImprimees()
            .toPromise()
        ).etiquettesImprimees.filter((val) => val.refProd == refProd);
        //Find Last SN
        const lastSerialNumber: string = printedLabel
          .map((obj) => obj.serialNumber.split(this.SN.prefix)[1])
          .sort()
          .pop();

        if (lastSerialNumber) {
          this.SN.suffix = lastSerialNumber;
          //increment the SN by one step
          const suff = parseInt(this.SN.suffix) + +this.SN.pas;
          this.SN.suffix = suff.toString().padStart(+this.SN.nbrCaractere, "0");
          //send true to the print component to indicate that the label has an SN
        }
        this.withSN.emit(true);
        // send
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
              this.produit,
              client,
              fournisseur,
              forme,
              lot,
              SN
            );
            this.list1.push(this.snComp);
          } else if (comp.refItem == "datamatrixData") {
            this.dataMatrixComp = this.ComponentToInsert(
              comp,
              this.produit,
              client,
              fournisseur,
              forme,
              lot,
              SN
            );
            this.list1.push(this.dataMatrixComp);
          } else {
            this.list1.push(
              this.ComponentToInsert(
                comp,
                this.produit,
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
      } else {
        this.dragDropLibre = false;
        this.list = [];
        const list: LabelItem[] = [];
        this.uploadData(
          Array.from(composents),
          this.produit,
          client,
          fournisseur,
          forme,
          lot,
          SN
        );
        this.orderElementsInList1(composents, this.list, list);
        this.snComp = this.findSN(list);
        this.dataMatrixComp = this.findDataMatrix(list);
        this.list1 = list;
      }
      this.list1Event.emit(this.list1);
    }
  }
  // rechercher l'element Sérial Number dans un list
  findSN(data: LabelItem[]) {
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
  findDataMatrix(data: LabelItem[]) {
    const res = data.find((val) => val.refItem == "datamatrixData" && val.data);
    let resarray;
    if (!res) {
      resarray = data.map((val) => {
        if (val.children.length > 0) {
          return this.findDataMatrix(val.children);
        } else {
          return null;
        }
      });
    }
    return (
      res ||
      resarray.find((val) => val && val.refItem == "dataMatrixData" && val.data)
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
    listIn: LabelItem[],
    listOut: LabelItem[]
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
  ): LabelItem {
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
          : obj.refItem == "datamatrixData"
          ? produit[obj.refItem]
              .replace(
                "<<SN>>",
                SN?.serialNumber.prefix + SN?.serialNumber.suffix
              )
              .replace("<<OF>>", this.OF)
              .replace("<<FormatLot>>", lot.format)
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
    if (this.SN) {
      const suff = parseInt(this.SN.suffix) + +this.SN.pas;
      this.SN.suffix = suff.toString().padStart(+this.SN.nbrCaractere, "0");
      this.snComp.data = this.SN.prefix + this.SN.suffix;
      if (this.dataMatrixComp) {
        this.dataMatrixComp.data = this.produit.datamatrixData.replace(
          "<<SN>>",
          this.snComp.data
        );
        this.dataMatrixComp.data = this.dataMatrixComp.data
          .replace("<<FormatLot>>", this.lotdata)
          .replace("<<OF>>", this.OF);
      }
    }
  };
}
