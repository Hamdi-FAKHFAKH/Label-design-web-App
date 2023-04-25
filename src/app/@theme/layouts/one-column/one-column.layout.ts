import { Component } from "@angular/core";
import { LayoutService } from "../../../@core/utils";
import {
  NbMediaBreakpointsService,
  NbMenuService,
  NbSidebarService,
} from "@nebular/theme";
@Component({
  selector: "ngx-one-column-layout",
  styleUrls: ["./one-column.layout.scss"],
  template: `
    <nb-layout windowMode>
      <nb-layout-header fixed>
        <ngx-header></ngx-header>
      </nb-layout-header>

      <nb-sidebar class="menu-sidebar" tag="menu-sidebar" responsive>
        <!-- (mouseenter)="toggleSidebar()" (mouseleave)="collapseSidebar()" -->
        <ng-content select="nb-menu"></ng-content>
      </nb-sidebar>

      <nb-layout-column style="padding: 0px; z-index: 1;">
        <ng-content select="router-outlet"></ng-content>
      </nb-layout-column>
    </nb-layout>
  `,
})
export class OneColumnLayoutComponent {
  constructor(
    private sidebarService: NbSidebarService,
    private menuService: NbMenuService,

    private layoutService: LayoutService
  ) {}
  toggleSidebar(): boolean {
    this.sidebarService.expand("menu-sidebar");
    this.layoutService.changeLayoutSize();
    return false;
  }
  collapseSidebar(): boolean {
    this.sidebarService.compact("menu-sidebar");
    this.layoutService.changeLayoutSize();
    return false;
  }
}
