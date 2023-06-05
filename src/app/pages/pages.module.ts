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
  declarations: [PagesComponent, ProfilComponent, NotFoundComponent],
})
export class PagesModule {}
