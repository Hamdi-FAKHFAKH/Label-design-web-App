import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { SmartTableComponent } from "./GestionProduits/smart-table/smart-table.component";
import { AptComponent } from "./apt.component";

const routes: Routes = [
  {
    path: "",
    component: AptComponent,
    children: [
      {
        path: "gestionProduits",
        component: SmartTableComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AptRoutingModule {}
