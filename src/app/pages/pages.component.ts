import { Component, OnInit } from "@angular/core";

// import { MENU_ITEMS } from "./pages-menu";
import { NbIconLibraries, NbMenuItem } from "@nebular/theme";
import { AuthService } from "../auth/authService.service";
import { Ateliers, roles, UAP, User } from "../auth/user";
@Component({
  selector: "ngx-pages",
  styleUrls: ["pages.component.scss"],
  template: `
    <ngx-one-column-layout>
      <nb-menu [items]="menu"></nb-menu>
      <router-outlet></router-outlet>
    </ngx-one-column-layout>
  `,
})
export class PagesComponent implements OnInit {
  user: User;
  menu: NbMenuItem[];
  constructor(iconsLibrary: NbIconLibraries, private authService: AuthService) {
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
  ngOnInit(): void {
    this.user = this.authService.user.getValue();
    this.menu = [
      {
        title: "Acceuil",
        icon: "home",
        link: "/pages/Home",
        home: true,
      },
      {
        title: " UAP 1",
        expanded: true,
        icon: { icon: "industry", pack: "fa" },
        children: [
          {
            title: "S500 - Atelier Protection Thermique",
            expanded: true,
            hidden:
              (this.user.atelier !== Ateliers.APT &&
                ![
                  roles.admin.toString(),
                  roles.directeur.toString(),
                  roles.visitor.toString(),
                  roles.responsableUAP.toString(),
                ].includes(this.user.role)) ||
              (this.user.UAP !== UAP.UAP1 &&
                this.user.role == roles.responsableUAP),
            children: [
              {
                title: "Gestion Produits",
                link: "/pages/apt/gestionProduits",
                icon: "cube",
                hidden: this.user.role == roles.agentSaisie,
              },
              {
                title: "Création Etiquettes",
                link: "/pages/apt/CreationEtiquette",
                icon: "edit-2-outline",
                hidden: this.user.role == roles.agentSaisie,
              },
              {
                title: "Impression Etiquettes",
                link: "/pages/apt/ImpressionEtiquettes",
                icon: "printer-outline",
              },
              {
                title: "Détails Impression",
                link: "/pages/apt/DetailImpression",
                icon: "info",
              },
              {
                title: "Historique OF",
                link: "/pages/apt/HistoriqueOF",
                icon: "clock",
                hidden: this.user.role == roles.agentSaisie,
              },
              {
                title: "Vérification des étiquettes",
                link: "/pages/apt/ControlEtiquette",
                icon: "checkmark-circle-outline",
                hidden:
                  [
                    roles.agentMethod.toString(),
                    roles.responsableUAP.toString(),
                    roles.agentSaisie.toString(),
                  ].includes(this.user.role) &&
                  this.user.atelier !== Ateliers.APT,
              },
            ],
          },
          {
            title: "S900 - Atelier Isolants Souples",
            expanded: true,
            hidden:
              (this.user.atelier !== Ateliers.AIS &&
                ![
                  roles.admin.toString(),
                  roles.directeur.toString(),
                  roles.visitor.toString(),
                  roles.responsableUAP.toString(),
                ].includes(this.user.role)) ||
              (this.user.UAP !== UAP.UAP1 &&
                this.user.role == roles.responsableUAP),
            link: "/pages/ais",
          },
        ],
      },
      {
        title: "Gestion des Utilisateurs",
        icon: "person-add",
        link: "/pages/users",
        hidden: this.user.role !== roles.admin,
      },
      {
        title: "Gestion des Ateliers",
        icon: { icon: "square-plus", pack: "fa" },
        link: "/pages/ateliers",
        hidden: ![
          roles.admin.toString(),
          roles.directeur.toString(),
          roles.visitor.toString(),
        ].includes(this.user.role),
      },
    ];
  }
}
