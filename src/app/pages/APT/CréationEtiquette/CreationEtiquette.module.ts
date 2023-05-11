import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import {
  NbCardModule,
  NbIconModule,
  NbInputModule,
  NbButtonModule,
  NbTabsetModule,
  NbSidebarModule,
  NbLayoutModule,
  NbThemeModule,
  NbMenuModule,
  NbContextMenuModule,
  NbSelectModule,
  NbRouteTabsetModule,
  NbAccordionModule,
} from "@nebular/theme";
import { CreationEtiquetteRoutingModule } from "./CreationEtiquette.routing.module";
import { SidebarComponent } from "./sidebar/sidebar.component";
import { TabsComponent } from "./tabs/tabs.component";
import { EtiquetteTabComponent } from "./tabs/EtiquetteTab/EtiquetteTab.component";
import { LabelService } from "./label.service";
import { CommonModule } from "@angular/common";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { LabeltHttpService } from "./labelHTTP.service";
import { DesignTabComponent } from "./tabs/design-tab/design-tab.component";
import { DragDropModule } from "@angular/cdk/drag-drop";
import { DragDropService } from "./drag-drop.service";
import { FieldStyleFormComponent } from "./fieldStyleForm/fieldStyleForm.component";
import { QRCodeModule } from "angularx-qrcode";
import { DataMatrixStyleFormComponent } from "./data-matrix-style-form/data-matrix-style-form.component";
import {
  BarcodeGeneratorAllModule,
  QRCodeGeneratorAllModule,
  DataMatrixGeneratorAllModule,
} from "@syncfusion/ej2-angular-barcode-generator";
import { NgxBarcodeModule } from "ngx-barcode";
import { ContainerStyleFormComponent } from "./container-style-form/container-style-form.component";
import { FormeStyleFormComponent } from "./forme-style-form/forme-style-form.component";

@NgModule({
  imports: [
    FormsModule,
    NbButtonModule,
    NbCardModule,
    NbIconModule,
    NbInputModule,
    CreationEtiquetteRoutingModule,
    NbTabsetModule,
    NbSidebarModule,
    NbLayoutModule,
    NbThemeModule,
    NbAccordionModule,
    NbMenuModule,
    NbRouteTabsetModule,
    NbContextMenuModule,
    NbSelectModule,
    CommonModule,
    FontAwesomeModule,
    DragDropModule,
    QRCodeModule,
    BarcodeGeneratorAllModule,
    QRCodeGeneratorAllModule,
    DataMatrixGeneratorAllModule,
    NgxBarcodeModule,
  ],
  declarations: [
    TabsComponent,
    SidebarComponent,
    EtiquetteTabComponent,
    DesignTabComponent,
    FieldStyleFormComponent,
    DataMatrixStyleFormComponent,
    ContainerStyleFormComponent,
    FormeStyleFormComponent,
  ],
  exports: [],
  providers: [
    LabelService,
    LabeltHttpService,
    DragDropService,
    NbAccordionModule,
  ],
})
export class CreattionEtiquetteModule {}
