import { Component, OnInit } from "@angular/core";

@Component({
  selector: "ngx-profil",
  templateUrl: "./profil.component.html",
  styleUrls: ["./profil.component.scss"],
})
export class ProfilComponent {
  newMotdePasse: boolean = false;
  settings = {
    actions: false,
    columns: {
      id: {
        title: "ID",
        filter: false,
      },
      refProd: {
        title: "Référence Produit",
        filter: false,
      },
      operation: {
        title: "Opération",
        filter: false,
      },
      msg: {
        title: "Message",
        filter: false,
      },
      date: { filter: false, title: "Date" },
    },
  };
  constructor() {}
}
