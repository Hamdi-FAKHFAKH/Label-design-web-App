import { NgModule } from "@angular/core";
import { AptRoutingModule } from "./apt-routing.module";
import { AptComponent } from "./apt.component";
import { Ng2SmartTableModule } from "ng2-smart-table";
import { FormsModule } from "@angular/forms";
import {
  NbCardModule,
  NbIconModule,
  NbInputModule,
  NbTreeGridModule,
  NbButtonModule,
  NbDatepickerModule,
  NbLayoutModule,
} from "@nebular/theme";
import { ProductMangementComponent } from "./GestionProduits/product-management-component/product-management.component";
import { ProductCreationWindowComponent } from "./GestionProduits/create-product/product-creation-window.component";
import { CommonModule } from "@angular/common";
import { LabelComponentComponent } from "./ImpressionEtiquette/label-component/label-component.component";
import { ImpressionHttpService } from "./ImpressionEtiquette/impressionHttpService";
import { LabeltHttpService } from "./Create-label/labelHTTP.service";
import { QRCodeModule } from "angularx-qrcode";
import { NgxBarcodeModule } from "ngx-barcode";
import { NbDateFnsDateModule } from "@nebular/date-fns";
import { NbMomentDateModule } from "@nebular/moment";
import { DragDropModule } from "@angular/cdk/drag-drop";
import { DragDropService } from "./Create-label/drag-drop.service";
import { LabelService } from "./Create-label/label.service";
import { HistoriqueOFComponent } from "./HistoriqueOF/historique-of/historique-OF.component";
import { DetailImpressionComponent } from "./DetailImpression/detail-impression/detail-impression.component";
import { DetailImpressionHttpService } from "./DetailImpression/detailImpressionHttp.service";

import { HistoriqueService } from "../HistoriqueHttp.service";
import { ControlPrintedLabelsComponent } from "./Control-printed-labels/control-printed-labels/control-printed-labels.component";
import { CheckPrintedLabelHttp } from "./Control-printed-labels/checkPrintedLabelHttp.service";
import { ImpressionEtiquetteComponent } from "./ImpressionEtiquette/impression-etiquette/impression-etiquette.component";
import { UpdateProduitComponent } from "./GestionProduits/update-product/update-produit.component";
import { AptGuard } from "./../../auth/apt-guard.service";

@NgModule({
  imports: [
    NbLayoutModule,
    DragDropModule,
    FormsModule,
    NbButtonModule,
    AptRoutingModule,
    NbCardModule,
    NbIconModule,
    NbInputModule,
    NbTreeGridModule,
    Ng2SmartTableModule,
    NbLayoutModule,
    CommonModule,
    QRCodeModule,
    NgxBarcodeModule,
    NbDatepickerModule,
    NbDateFnsDateModule.forRoot({
      parseOptions: {
        useAdditionalWeekYearTokens: true,
        useAdditionalDayOfYearTokens: true,
      },
      formatOptions: {
        useAdditionalWeekYearTokens: true,
        useAdditionalDayOfYearTokens: true,
      },
    }),
    NbMomentDateModule,
  ],
  declarations: [
    AptComponent,
    ProductMangementComponent,
    ProductCreationWindowComponent,
    UpdateProduitComponent,
    ImpressionEtiquetteComponent,
    LabelComponentComponent,
    HistoriqueOFComponent,
    DetailImpressionComponent,
    ControlPrintedLabelsComponent,
  ],
  exports: [],
  providers: [
    ImpressionHttpService,
    LabeltHttpService,
    DragDropService,
    LabelService,
    DetailImpressionHttpService,
    CheckPrintedLabelHttp,
    HistoriqueService,
    AptGuard,
  ],
})
export class AptModule {}
