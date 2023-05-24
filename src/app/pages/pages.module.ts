import { NgModule } from "@angular/core";
import { NbCardModule, NbMenuModule } from "@nebular/theme";

import { ThemeModule } from "../@theme/theme.module";
import { PagesComponent } from "./pages.component";
import { PagesRoutingModule } from "./pages-routing.module";
import { CookieService } from "ngx-cookie-service";
import { ProfilComponent } from "./profil/profil.component";
import { NbIconModule } from "@nebular/theme";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { Ng2SmartTableModule } from "ng2-smart-table";
import { NotFoundComponent } from "./not-found/not-found.component";
@NgModule({
  imports: [
    PagesRoutingModule,
    ThemeModule,
    NbMenuModule,
    NbCardModule,
    NbIconModule,
    FontAwesomeModule,
    Ng2SmartTableModule,
  ],
  providers: [CookieService],
  declarations: [PagesComponent, ProfilComponent, NotFoundComponent],
})
export class PagesModule {}
