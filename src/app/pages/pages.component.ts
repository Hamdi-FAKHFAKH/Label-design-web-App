import { Component } from "@angular/core";

import { MENU_ITEMS } from "./pages-menu";
import { NbIconLibraries } from "@nebular/theme";
@Component({
  selector: "ngx-pages",
  styleUrls: ["pages.component.scss"],
  template: `
    <ngx-one-column-layout>
      <nb-menu [items]="menu"></nb-menu>
      <!-- <ngx-menu></ngx-menu> -->
      <router-outlet></router-outlet>
    </ngx-one-column-layout>
  `,
})
export class PagesComponent {
  constructor(iconsLibrary: NbIconLibraries) {
    iconsLibrary.registerFontPack("fa", {
      packClass: "fa",
      iconClassPrefix: "fa",
    });
    iconsLibrary.registerFontPack("far", {
      packClass: "far",
      iconClassPrefix: "fa",
    });
    iconsLibrary.registerFontPack("ion", { iconClassPrefix: "ion" });
  }
  menu = MENU_ITEMS;
}
