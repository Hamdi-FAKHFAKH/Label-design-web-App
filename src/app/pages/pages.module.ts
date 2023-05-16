import { NgModule } from "@angular/core";
import { NbMenuModule } from "@nebular/theme";

import { ThemeModule } from "../@theme/theme.module";
import { PagesComponent } from "./pages.component";
import { PagesRoutingModule } from "./pages-routing.module";
import { MiscellaneousModule } from "./miscellaneous/miscellaneous.module";
import { FormsModules } from "./forms/forms.module";
import { CookieService } from "ngx-cookie-service";
import { ProfilComponent } from "./profil/profil.component";
import { NbIconModule } from "@nebular/theme";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { Ng2SmartTableModule } from "ng2-smart-table";
@NgModule({
  imports: [
    PagesRoutingModule,
    ThemeModule,
    NbMenuModule,
    MiscellaneousModule,
    FormsModules,
    NbIconModule,
    FontAwesomeModule,
    Ng2SmartTableModule,
  ],
  providers: [CookieService],
  declarations: [PagesComponent, ProfilComponent],
})
export class PagesModule {}
