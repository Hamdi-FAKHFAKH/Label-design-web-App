import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";

import { PagesComponent } from "./pages.component";
import { NotFoundComponent } from "./not-found/not-found.component";
import { ProfilComponent } from "./profil/profil.component";
import { AccessGuard } from "../auth/access-guard.service";
import { AssComponent } from "./ASS/ass/ass.component";
import { AisComponent } from "./AIS/ais/ais.component";
import { UserManagementComponent } from "./user-management/user-management/user-management.component";
import { AtelierMangementComponent } from "./atelier-mangement/atelier-mangement.component";
import { HomeComponent } from "./home/home.component";

const routes: Routes = [
  {
    path: "",
    component: PagesComponent,
    children: [
      {
        path: "Home",
        component: HomeComponent,
      },
      {
        path: "profil",
        component: ProfilComponent,
      },
      {
        path: "ass",
        component: AssComponent,
      },
      {
        path: "ais",
        component: AisComponent,
      },
      {
        path: "users",
        component: UserManagementComponent,
      },
      {
        path: "ateliers",
        component: AtelierMangementComponent,
      },
      {
        path: "apt",
        loadChildren: () => import("./APT/apt.module").then((m) => m.AptModule),
        canActivate: [AccessGuard],
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
