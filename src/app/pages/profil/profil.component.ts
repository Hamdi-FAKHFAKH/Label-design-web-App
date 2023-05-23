import { Component, OnInit } from "@angular/core";

@Component({
  selector: "ngx-profil",
  templateUrl: "./profil.component.html",
  styleUrls: ["./profil.component.scss"],
})
export class ProfilComponent {
  imgdata: string;
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
  getBase641 = (e) => {
    var file = e.target.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      /** ******* console ********** */
      console.log("name");
      console.log(e.target.files[0]);
      console.log(reader.result.toString());
      this.imgdata = reader.result.toString();
    };
    reader.onerror = function (error) {
      console.log("Error: ", error);
    };
  };
}
