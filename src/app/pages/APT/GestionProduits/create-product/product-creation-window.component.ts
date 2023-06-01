import { Component, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { NbWindowRef } from "@nebular/theme";
import { GestionProduitHttpService } from "../GestionProduitHttp.service";
import { GestionProduitService } from "../GestionProduit.service";
import { SerialNumberData } from "../GestionProduit.data";
import { v4 as uuidv4 } from "uuid";
import Swal from "sweetalert2";
import { AuthService } from "../../../../auth/authService.service";
import { HistoriqueService } from "../../../HistoriqueHttp.service";
@Component({
  templateUrl: "./product-creation-window.component.html",
  styleUrls: ["./product-creation-window.component.scss"],
})
export class ProductCreationWindowComponent implements OnInit {
  produits: String[] = [];
  lotData: string[] = [];
  SerialNumberData: SerialNumberData[];
  selectedSerialNumber: SerialNumberData;
  addNewSerialNumber: boolean;
  formatLotValid: Boolean = false;
  formatSN: string;
  lotValue: string;
  // Icons(formes) list
  formes: { id: string; name: string; path: string; clicked: boolean }[];
  //
  constructor(
    public windowRef: NbWindowRef,
    private gestionProduitHttpService: GestionProduitHttpService,
    private gestionProduitService: GestionProduitService,
    private authService: AuthService,
    private historiqueService: HistoriqueService
  ) {}
  //
  async ngOnInit() {
    this.gestionProduitService.formes.map((val) => {
      val.clicked = false;
    });
    this.formes = this.gestionProduitService.formes;
    const { SDTPRA } = await this.gestionProduitHttpService
      .getSDTPRA()
      .toPromise();
    this.produits = SDTPRA;
    this.gestionProduitHttpService.getLots().subscribe((res) => {
      for (const i in res.lots) {
        this.lotData.push(res.lots[i]);
      }
      console.log(this.lotData);
    });
    this.gestionProduitHttpService.getSerialNumber().subscribe((res) => {
      this.SerialNumberData = res.serialNumber;
    });
    this.addNewSerialNumber = false;
  }
  // check if data is text
  checkValueByRegex(value) {
    if (value) return value.match(/^[^a-zA-Z]+$/);
    return false;
  }
  // select / unselected formes
  addForme(id, name, path, clicked, index) {
    if (clicked) {
      this.formes[index] = { id: id, name: name, path: path, clicked: true };
    } else {
      this.formes[index] = { id: id, name: name, path: path, clicked: false };
    }
    console.log(this.gestionProduitService.formes);
  }
  //close product creation window
  close() {
    this.windowRef.close();
  }
  // Submit the product creation form
  async onSubmit(form: NgForm) {
    let success = true;
    let idSN;
    let numLot: string;
    // vérifier si produit déja créer
    const prod = await this.gestionProduitHttpService
      .getAllProduits()
      .toPromise();
    for (const p in prod.produits) {
      if (prod.produits[p]["ref"] == form.value.ref) {
        Swal.fire({
          icon: "info",
          title: "Oops...",
          text: "Produit déja existe!",
        });
        success = false;
        return;
      }
    }
    if (!success) {
      return;
    }
    // create / check the existence of the Lot
    // create a new Lot Format
    if (form.value.newformatLot) {
      let res;
      try {
        res = (await this.gestionProduitService.CreateLot(form.value)).lot
          .numLot;
        numLot = res;
      } catch (e) {
        console.log(e);
        if (e.error.erreur.errors[0].path == "PK__Lot__E5A90244EAD7D78F") {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Numéro de Lot déja Exist!",
          });
          return;
        } else {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Format de Lot déja Exist!",
          });
          return;
        }
      }
    }
    if (
      form.value.formatLot &&
      form.value.formatLot !== "Ajouter un Nouveau Format"
    ) {
      numLot = form.value.formatLot;
    }
    //create / check the existence of a <<client>>
    if (form.value.codeClient) {
      success =
        (await this.gestionProduitService.AddClient(form.value)) && success;
    }
    // create / check the existence of a <<fournisseur>>
    if (form.value.codeFournisseur) {
      success =
        (await this.gestionProduitService.AddFournisseur(form.value)) &&
        success;
    }
    // create SerialNumber
    if (
      form.value.withSN &&
      form.value.prefix &&
      form.value.suffix &&
      form.value.nbrCaractere &&
      form.value.typeCompteur &&
      form.value.pas &&
      this.addNewSerialNumber
    ) {
      this.formatSN =
        form.value.prefix +
        "-" +
        form.value.suffix +
        `{NC : ${form.value.nbrCaractere}}` +
        `{Type : ${form.value.typeCompteur}}` +
        `{pas : ${form.value.pas}}`;

      idSN = await this.gestionProduitService.AddSerialNumber(
        form.value,

        this.formatSN
      );
    }
    if (!this.addNewSerialNumber && form.value.FormatSN) {
      idSN = this.selectedSerialNumber.idSN;
    }

    //add formes
    let formes = "";
    this.formes.map((val) => {
      if (val.clicked) {
        formes += val.id + ";";
      }
    });
    // create product
    if (success && form.value.ref) {
      success = await this.gestionProduitService.CreateProduit(
        form.value,
        numLot,
        idSN,
        formes
      );
      if (!!success) {
        this.windowRef.close();
        //create historique Produit
        await this.historiqueService
          .createHistoriqueProduit({
            refProd: form.value.ref,
            data: "",
            motif: "",
            operation: "Create",
            userMatricule: this.authService.user.getValue().matricule,
          })
          .toPromise();
      } else
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Échec de la création du produit",
        });
    }
  }

  SelectSn(val) {
    this.selectedSerialNumber = this.SerialNumberData[val];
  }

  addSN(event) {
    this.addNewSerialNumber = event.target.checked;
  }
  // get base64 data of new added icon
  getBase64 = (e) => {
    var file = e.target.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      /** ******* console ********** */
      this.gestionProduitHttpService
        .createForm({
          id: uuidv4(),
          name: e.target.files[0].name.substring(
            0,
            e.target.files[0].name.indexOf(".")
          ),
          clicked: false,
          path: reader.result.toString(),
        })
        .toPromise()
        .then((val) => {
          console.log("image saved");
          this.gestionProduitService.getFormes();
        })
        .catch((e) => {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Icon déja existe !",
          });
        });
    };
    reader.onerror = function (error) {
      console.log("Error: ", error);
    };
  };

  checkFormatLot(data: string) {
    data.match(/^(dd|MM|yyyy)(\-|\/|\s)(dd|MM|yyyy)(\-|\/|\s)?(dd|MM|yyyy)?$/gm)
      ? (this.formatLotValid = true)
      : (this.formatLotValid = false);
    console.log(this.formatLotValid);
  }
}
