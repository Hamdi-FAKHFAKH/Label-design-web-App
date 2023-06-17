import { Component, OnInit } from "@angular/core";
import { LocalDataSource } from "ng2-smart-table";
import { EtiquetteImprimeeData } from "../../DetailImpression/detailImpressionHttp.data";
import { DetailImpressionHttpService } from "../../DetailImpression/detailImpressionHttp.service";
import { Utils } from "../../../formatDate";
import * as Papa from "papaparse";
@Component({
  selector: "ngx-historique-of",
  templateUrl: "./historique-of.component.html",
  styleUrls: ["./historique-of.component.scss", "./smart-table.css"],
})
export class HistoriqueOFComponent implements OnInit {
  etiquettes: EtiquetteImprimeeData[];
  etiquettesImprimees;
  settings = {
    hideSubHeader: true,
    pager: { display: true },
    filter: false,
    mode: "external",
    actions: false,
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
      motifReimpression: {
        title: "Motif de réimpression",
        type: "string",
        filter: false,
      },
      userMatricule: {
        title: "Utilisateur d'impression",
        type: "string",
        filter: false,
      },
      date: {
        title: "Date d'impression",
        type: "string",
        filter: false,
      },
    },
  };

  source: LocalDataSource = new LocalDataSource();
  constructor(
    private detailImpressionHttp: DetailImpressionHttpService,
    private utils: Utils
  ) {}

  async ngOnInit() {
    this.etiquettes = (
      await this.detailImpressionHttp.GetALLEtiquettesImprimees().toPromise()
    ).etiquettesImprimees;
    this.etiquettesImprimees = this.etiquettes.map((val) => {
      return { ...val, date: this.utils.formatDate(val.date) };
    });
    this.source.load(this.etiquettesImprimees);
  }
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
          {
            field: "serialNumber",
            search: query,
          },
        ],
        false
      );
    }
  }
  exportToCsv(data: any[]) {
    const csv = Papa.unparse(data, {
      delimiter: ";",
    });
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.setAttribute("hidden", "");
    a.setAttribute("href", url);
    a.setAttribute("download", "HistoriqueOF.csv");
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }
}
