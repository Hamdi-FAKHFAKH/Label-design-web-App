import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { TabsComponent } from "./tabs/tabs.component";
import { SidebarComponent } from "./sidebar/sidebar.component";

const routes: Routes = [
  {
    path: "",
    component: SidebarComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreationEtiquetteRoutingModule {}
