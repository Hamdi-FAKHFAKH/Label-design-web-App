import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { ProductMangementComponent } from "./GestionProduits/product-management-component/product-management.component";
import { AptComponent } from "./apt.component";
import { ImpressionEtiquetteComponent } from "./ImpressionEtiquette/impression-etiquette/impression-etiquette.component";
import { HistoriqueOFComponent } from "./HistoriqueOF/historique-of/historique-OF.component";
import { DetailImpressionComponent } from "./DetailImpression/detail-impression/detail-impression.component";
import { ControlPrintedLabelsComponent } from "./Control-printed-labels/control-printed-labels/control-printed-labels.component";
import { AptGuard } from "../../auth/apt-guard.service";
import { ConfirmNavigationGuard } from "./Create-label/CanDeactivate";
const routes: Routes = [
  {
    path: "",
    component: AptComponent,
    children: [
      {
        path: "gestionProduits",
        component: ProductMangementComponent,
        canActivate: [AptGuard],
      },
      {
        path: "ImpressionEtiquettes",
        component: ImpressionEtiquetteComponent,
      },

      {
        path: "CreationEtiquette",
        loadChildren: () =>
          import("./Create-label/CreationEtiquette.module").then(
            (m) => m.CreattionEtiquetteModule
          ),
        canActivate: [AptGuard],
        canDeactivate: [ConfirmNavigationGuard],
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
        path: "ControlEtiquette",
        component: ControlPrintedLabelsComponent,
      },
      {
        path: "",
        redirectTo: "ImpressionEtiquettes",
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
