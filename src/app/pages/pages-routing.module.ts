import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";

import { PagesComponent } from "./pages.component";
import { NotFoundComponent } from "./not-found/not-found.component";
import { ProfilComponent } from "./profil/profil.component";

const routes: Routes = [
  {
    path: "",
    component: PagesComponent,
    children: [
      {
        path: "profil",
        component: ProfilComponent,
      },
      {
        path: "apt",
        loadChildren: () => import("./APT/apt.module").then((m) => m.AptModule),
      },

      {
        path: "",
        redirectTo: "apt",
        pathMatch: "full",
      },
      {
        path: "**",
        component: NotFoundComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {}
