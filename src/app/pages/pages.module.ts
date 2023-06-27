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
import { ProductHistoriqueService } from "./HistoriqueHttp.service";
import { AssComponent } from "./ASS/ass/ass.component";
import { AisComponent } from "./AIS/ais/ais.component";
import { UserManagementComponent } from "./user-management/user-management/user-management.component";
import { CreateUserWindowComponent } from "./user-management/create-user-window/create-user-window.component";
import { UpdateUserWindowComponent } from "./user-management/update-user-window/update-user-window.component";
import { AtelierMangementComponent } from "./atelier-mangement/atelier-mangement.component";
import { CreateAtelierWindowComponent } from "./atelier-mangement/create-atelier-window/create-atelier-window.component";
import { UpdateAtelierWindowComponent } from "./atelier-mangement/update-atelier-window/update-atelier-window.component";
import { HomeComponent } from "./home/home.component";
import { monthYearPrintedlabelChartComponent } from "./charts/monthYearprintedlabelChart-bar.component";
import { NgxEchartsModule } from "ngx-echarts";
import { NgxChartsModule } from "@swimlane/ngx-charts";
import { ChartModule } from "angular2-chartjs";
import { DetailImpressionHttpService } from "./APT/DetailImpression/detailImpressionHttp.service";
import { ReprintedLabelChartComponent } from "./charts/reprinted label-chart.component";
import { ReprintedLabelLineChartComponent } from "./charts/reprinted-labels-lineChart";
import { GestionProduitHttpService } from "./APT/GestionProduits/GestionProduitHttp.service";
import { ProductHistoryComponent } from "./charts/ProductHistoryComponent.component";
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
    NgxEchartsModule,
    NgxChartsModule,
    ChartModule,
  ],
  providers: [
    CookieService,
    GestionUtilisateursHttpService,
    DetailImpressionHttpService,
    GestionProduitHttpService,
  ],
  declarations: [
    PagesComponent,
    ProfilComponent,
    NotFoundComponent,
    AssComponent,
    AisComponent,
    UserManagementComponent,
    CreateUserWindowComponent,
    UpdateUserWindowComponent,
    AtelierMangementComponent,
    CreateAtelierWindowComponent,
    UpdateAtelierWindowComponent,
    HomeComponent,
    monthYearPrintedlabelChartComponent,
    ReprintedLabelChartComponent,
    ReprintedLabelLineChartComponent,
    ProductHistoryComponent,
  ],
})
export class PagesModule {}
