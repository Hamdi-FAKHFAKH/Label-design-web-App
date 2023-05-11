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
} from "@nebular/theme";
import { SmartTableComponent } from "./GestionProduits/smart-table/smart-table.component";
import { WindowFormComponent } from "./GestionProduits/create-produit/window-form.component";
import { CommonModule } from "@angular/common";
import { UpdateProduitComponent } from "./GestionProduits/update-produit/update-produit.component";
import { ImpressionEtiquetteComponent } from "./ImpressionEtiquette/impression-etiquette/impression-etiquette.component";
import { LabelComponentComponent } from "./ImpressionEtiquette/label-component/label-component.component";
import { ImpressionService } from "./ImpressionEtiquette/impressionService";
import { LabeltHttpService } from "./CréationEtiquette/labelHTTP.service";
import { QRCodeModule } from "angularx-qrcode";
import { NgxBarcodeModule } from "ngx-barcode";
import { NbDateFnsDateModule } from "@nebular/date-fns";
import { NbMomentDateModule } from "@nebular/moment";

@NgModule({
  imports: [
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
    SmartTableComponent,
    WindowFormComponent,
    UpdateProduitComponent,
    ImpressionEtiquetteComponent,
    LabelComponentComponent,
  ],
  exports: [],
  providers: [ImpressionService, LabeltHttpService],
})
export class AptModule {}
