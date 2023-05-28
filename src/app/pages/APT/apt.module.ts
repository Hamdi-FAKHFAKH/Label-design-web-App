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
import { UpdateProduitComponent } from "./GestionProduits/update-product/update-produit.component";
import { ImpressionEtiquetteComponent } from "./ImpressionEtiquette/impression-etiquette/impression-etiquette.component";
import { LabelComponentComponent } from "./ImpressionEtiquette/label-component/label-component.component";
import { ImpressionHttpService } from "./ImpressionEtiquette/impressionHttpService";
import { LabeltHttpService } from "./CréationEtiquette/labelHTTP.service";
import { QRCodeModule } from "angularx-qrcode";
import { NgxBarcodeModule } from "ngx-barcode";
import { NbDateFnsDateModule } from "@nebular/date-fns";
import { NbMomentDateModule } from "@nebular/moment";
import { DragDropModule } from "@angular/cdk/drag-drop";
import { DragDropService } from "./CréationEtiquette/drag-drop.service";
import { LabelService } from "./CréationEtiquette/label.service";
import { HistoriqueOFComponent } from "./HistoriqueOF/historique-of/historique-OF.component";
import { DetailImpressionComponent } from "./DetailImpression/detail-impression/detail-impression.component";
import { DetailImpressionHttpService } from "./DetailImpression/detailImpressionHttp.service";

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
  ],
  exports: [],
  providers: [
    ImpressionHttpService,
    LabeltHttpService,
    DragDropService,
    LabelService,
    DetailImpressionHttpService,
  ],
})
export class AptModule {}
