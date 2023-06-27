import { Component, OnInit } from "@angular/core";
import { DetailImpressionHttpService } from "../APT/DetailImpression/detailImpressionHttp.service";
import { GestionProduitHttpService } from "../APT/GestionProduits/GestionProduitHttp.service";

@Component({
  selector: "ngx-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
})
export class HomeComponent implements OnInit {
  totalPrintedLabel;
  totalRePrintedLabel;
  totalRePrintedLabelwithSN;
  totalProduit;
  historiqueProduit;
  constructor(
    private detailImpressionHttpService: DetailImpressionHttpService,
    private gestionProduitHttpService: GestionProduitHttpService
  ) {}
  async ngOnInit() {
    this.totalPrintedLabel = (
      await this.detailImpressionHttpService
        .GetTotalEtiquettesImprimees()
        .toPromise()
    ).etiquettesImprimees[0].total;
    //
    this.totalRePrintedLabel = (
      await this.detailImpressionHttpService
        .GetTotalEtiquettesRéimprimees()
        .toPromise()
    ).etiquettesImprimees[0].total;
    //
    this.totalRePrintedLabelwithSN = (
      await this.detailImpressionHttpService
        .GetTotalEtiquettesRéimprimeesWithSN()
        .toPromise()
    ).etiquettesImprimees[0].total;
    //
    this.totalProduit = (
      await this.gestionProduitHttpService.getTotalProduitNumber().toPromise()
    ).produits[0].total;
  }
}
