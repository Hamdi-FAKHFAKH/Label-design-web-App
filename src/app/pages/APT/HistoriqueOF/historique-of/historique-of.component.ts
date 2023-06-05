import { Component, OnInit } from "@angular/core";
import { LocalDataSource } from "ng2-smart-table";
import { EtiquetteImprimeeData } from "../../DetailImpression/detailImpressionHttp.data";
import { DetailImpressionHttpService } from "../../DetailImpression/detailImpressionHttp.service";

@Component({
  selector: "ngx-historique-of",
  templateUrl: "./historique-of.component.html",
  styleUrls: ["./historique-of.component.scss", "./smart-table.css"],
})
export class HistoriqueOFComponent implements OnInit {
  etiquettes: EtiquetteImprimeeData[];
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
  constructor(private detailImpressionHttp: DetailImpressionHttpService) {}

  async ngOnInit() {
    this.etiquettes = (
      await this.detailImpressionHttp.GetALLEtiquettesImprimees().toPromise()
    ).etiquettesImprimees;
    this.source.load(
      this.etiquettes.map((val) => {
        let d = new Date(val.date);
        let ye = new Intl.DateTimeFormat("en", {
          year: "numeric",
        }).format(d);
        let mo = new Intl.DateTimeFormat("en", {
          month: "2-digit",
        }).format(d);
        let da = new Intl.DateTimeFormat("en", {
          day: "2-digit",
        }).format(d);
        let h = new Intl.DateTimeFormat("fr", {
          hour: "2-digit",
        })
          .format(d)
          .replace(" h", "");
        let mm = new Intl.DateTimeFormat("en", {
          minute: "2-digit",
        }).format(d);
        let ss = new Intl.DateTimeFormat("en", {
          second: "2-digit",
        }).format(d);
        return { ...val, date: `${da}/${mo}/${ye}  ${h}:${mm}:${ss}` };
      })
    );
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
}
