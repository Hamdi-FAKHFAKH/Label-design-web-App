import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { SmartTableComponent } from "./GestionProduits/smart-table/smart-table.component";
import { AptComponent } from "./apt.component";
import { ImpressionEtiquetteComponent } from "./ImpressionEtiquette/impression-etiquette/impression-etiquette.component";

const routes: Routes = [
  {
    path: "",
    component: AptComponent,
    children: [
      {
        path: "gestionProduits",
        component: SmartTableComponent,
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
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AptRoutingModule {}
