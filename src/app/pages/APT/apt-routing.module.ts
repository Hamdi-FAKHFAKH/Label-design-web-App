import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { ProductMangementComponent } from "./GestionProduits/product-management-component/product-management.component";
import { AptComponent } from "./apt.component";
import { ImpressionEtiquetteComponent } from "./ImpressionEtiquette/impression-etiquette/impression-etiquette.component";
import { HistoriqueOFComponent } from "./HistoriqueOF/historique-of/historique-OF.component";
import { DetailImpressionComponent } from "./DetailImpression/detail-impression/detail-impression.component";

const routes: Routes = [
  {
    path: "",
    component: AptComponent,
    children: [
      {
        path: "gestionProduits",
        component: ProductMangementComponent,
      },
      {
        path: "ImpressionEtiquettes",
        component: ImpressionEtiquetteComponent,
      },

      {
        path: "CreationEtiquette",
        loadChildren: () =>
          import("./CréationEtiquette/CreationEtiquette.module").then(
            (m) => m.CreattionEtiquetteModule
          ),
      },
      {
        path: "HistoriqueOF",
        component: HistoriqueOFComponent,
      },
      {
        path: "DetailImpression",
        component: DetailImpressionComponent,
      },
      {
        path: "",
        redirectTo: "gestionProduits",
        pathMatch: "full",
      },
    ],
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AptRoutingModule {}
