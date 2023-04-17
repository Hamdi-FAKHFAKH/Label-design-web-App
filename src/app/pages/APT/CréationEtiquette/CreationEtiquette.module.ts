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
} from "@nebular/theme";
import {
  Tab1Component,
  Tab2Component,
  TabsComponent,
} from "./tabs/tabs.component";
import { CreationEtiquetteRoutingModule } from "./CreationEtiquette.routing.module";
import { SidebarComponent } from "./sidebar/sidebar.component";

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
    NbMenuModule,
    NbContextMenuModule,
    NbSelectModule,
  ],
  declarations: [TabsComponent, Tab1Component, Tab2Component, SidebarComponent],
  exports: [],
  providers: [],
})
export class CreattionEtiquetteModule {}
