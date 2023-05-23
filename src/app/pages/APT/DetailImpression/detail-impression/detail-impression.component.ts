import { Component, OnInit } from "@angular/core";
import { LocalDataSource } from "ng2-smart-table";
import { DetailImpressionHttpService } from "../detailImpressionHttp.service";
import { EtiquetteImprimeeData } from "../detailImpressionHttp.data";
import { AuthService } from "../../../../auth/authService.service";

@Component({
  selector: "ngx-detail-impression",
  templateUrl: "./detail-impression.component.html",
  styleUrls: ["./detail-impression.component.scss", "./smart-table.css"],
})
export class DetailImpressionComponent implements OnInit {
  constructor(
    private detailImpressionHttp: DetailImpressionHttpService,
    private authService: AuthService
  ) {}
  etiquettes: EtiquetteImprimeeData[];
  settings = {
    hideSubHeader: true,
    pager: { display: true },
    filter: false,
    mode: "external",
    actions: { position: "right", add: false },
    columns: {
      numOF: {
        title: "N° OF",
        type: "string",
        filter: false,
      },
      refProd: {
        title: "Référence Produit",
        type: "string",
        filter: false,
      },
      formatLot: {
        title: "Format de Lot",
        type: "string",
        filter: false,
      },
      serialNumber: {
        title: "Numéro de Série",
        type: "string",
        filter: false,
      },
      withDataMatrix: {
        title: "Code QR",
        type: "string",
        filter: false,
      },
      nbrCopie: {
        title: "Nombre d'étiquettes",
        type: "string",
        filter: false,
      },
      action: {
        title: "Impression/Réimpression",
        type: "string",
        filter: false,
      },
      dateImp: {
        title: "Date d'impression",
        type: "string",
        filter: false,
      },
      dateReImp: {
        title: "Dérniere date de réimpression",
        type: "string",
        filter: false,
      },
      userMatricule: {
        title: "Utilisateur d'impression",
        type: "string",
        filter: false,
      },
      userMatriculeReImp: {
        title: "Utilisateur de réimpression",
        type: "string",
        filter: false,
      },
    },
    edit: {
      inputClass: "edit",
      editButtonContent: '<i class="fa-solid fa-print fa-xs" > </i>',
      confirmSave: true,
    },
    delete: {
      inputClass: "success",
      deleteButtonContent: '<i class="fas fa-search fa-xs" ></i>',
      confirmDelete: true,
    },
  };

  source: LocalDataSource = new LocalDataSource();

  async ngOnInit() {
    this.etiquettes = (
      await this.detailImpressionHttp.GetALLEtiquettesImprimees().toPromise()
    ).etiquettesImprimees;
    this.source.load(
      this.etiquettes.map((val) => {
        return {
          ...val,
          userMatricule: this.authService.user.getValue().matricule,
        };
      })
    );
  }
  search(data) {}
  print(data) {}
  onSearch(query: string = "") {
    if (query == "") {
      this.source.reset(false);
    } else {
      this.source.setFilter(
        [
          // fields we want to include in the search
          {
            field: "numOF",
            search: query,
          },
          {
            field: "refProd",
            search: query,
          },
          {
            field: "dateImp",
            search: query,
          },
          {
            field: "userMatricule",
            search: query,
          },
        ],
        false
      );
    }
  }
}
