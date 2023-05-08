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
} from "@nebular/theme";
import { SmartTableComponent } from "./GestionProduits/smart-table/smart-table.component";
import { WindowFormComponent } from "./GestionProduits/create-produit/window-form.component";
import { CommonModule } from "@angular/common";
import { UpdateProduitComponent } from "./GestionProduits/update-produit/update-produit.component";
import { ImpressionEtiquetteComponent } from './ImpressionEtiquette/impression-etiquette/impression-etiquette.component';

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
  ],
  declarations: [
    AptComponent,
    SmartTableComponent,
    WindowFormComponent,
    UpdateProduitComponent,
    ImpressionEtiquetteComponent,
  ],
  exports: [],
  providers: [],
})
export class AptModule {}
