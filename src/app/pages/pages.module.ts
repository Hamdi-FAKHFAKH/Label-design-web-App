import { NgModule } from "@angular/core";
import { NbCardModule, NbLayoutModule, NbMenuModule } from "@nebular/theme";

import { ThemeModule } from "../@theme/theme.module";
import { PagesComponent } from "./pages.component";
import { PagesRoutingModule } from "./pages-routing.module";
import { CookieService } from "ngx-cookie-service";
import { ProfilComponent } from "./profil/profil.component";
import { NbIconModule } from "@nebular/theme";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { Ng2SmartTableModule } from "ng2-smart-table";
import { NotFoundComponent } from "./not-found/not-found.component";
import { GestionUtilisateursHttpService } from "./GestionUtilisateursHttp.service";
import { FormsModule } from "@angular/forms";
import { HistoriqueService } from "./HistoriqueHttp.service";
import { AssComponent } from './ASS/ass/ass.component';
import { AisComponent } from './AIS/ais/ais.component';
import { UserManagementComponent } from './user-management/user-management/user-management.component';
import { CreateUserWindowComponent } from './user-management/create-user-window/create-user-window.component';
import { UpdateUserWindowComponent } from './user-management/update-user-window/update-user-window.component';
import { AtelierMangementComponent } from './atelier-mangement/atelier-mangement.component';
import { CreateAtelierWindowComponent } from './atelier-mangement/create-atelier-window/create-atelier-window.component';
import { UpdateAtelierWindowComponent } from './atelier-mangement/update-atelier-window/update-atelier-window.component';
@NgModule({
  imports: [
    FormsModule,
    PagesRoutingModule,
    ThemeModule,
    NbMenuModule,
    NbCardModule,
    NbIconModule,
    FontAwesomeModule,
    Ng2SmartTableModule,
    NbLayoutModule,
  ],
  providers: [CookieService, GestionUtilisateursHttpService, HistoriqueService],
  declarations: [PagesComponent, ProfilComponent, NotFoundComponent, AssComponent, AisComponent, UserManagementComponent, CreateUserWindowComponent, UpdateUserWindowComponent, AtelierMangementComponent, CreateAtelierWindowComponent, UpdateAtelierWindowComponent],
})
export class PagesModule {}
