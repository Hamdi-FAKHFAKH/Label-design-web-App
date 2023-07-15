import { Component, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { NbWindowRef } from "@nebular/theme";
import { GestionProduitHttpService } from "../GestionProduitHttp.service";
import { GestionProduitService } from "../GestionProduit.service";
import { AllProduitData, SerialNumberData } from "../GestionProduit.data";
import Swal from "sweetalert2";
import { v4 as uuidv4 } from "uuid";
import { AuthService } from "../../../../auth/authService.service";
import { ProductHistoriqueService } from "../../../HistoriqueHttp.service";
@Component({
  selector: "ngx-update-produit",
  templateUrl: "./update-produit.component.html",
  styleUrls: ["./update-produit.component.scss"],
})
export class UpdateProduitComponent implements OnInit {
  formes: { id: string; name: string; path: string; clicked: boolean }[] = [];
  lotValue: string;
  //check Lot Format
  formatLotValid: boolean = false;
  windowdata: AllProduitData;
  produits: String[] = [];
  lotData: string[] = [];
  refProd: string;
  //
  constructor(
    public windowRef: NbWindowRef,
    private gestionProduitHttpService: GestionProduitHttpService,
    private gestionProduitService: GestionProduitService,
    private authService: AuthService,
    private historiqueService: ProductHistoriqueService
  ) {}
  //
  async ngOnInit() {
    await this.getFormes();
    const protypCod = (
      await this.gestionProduitHttpService
        .getProdTypesFromAtelierCode(this.authService.user.getValue().atelier)
        .toPromise()
    ).lienProTypeAtelier.map((val) => val.ProtypCod);
    this.gestionProduitHttpService.getSDTPRA(protypCod).subscribe((res) => {
      this.produits = res.SDTPRA;
    });
    this.gestionProduitHttpService.getLots().subscribe((res) => {
      for (const i in res.lots) {
        this.lotData.push(res.lots[i]);
      }
    });
    this.refProd = this.windowdata.ref;

    this.windowdata.formes.split(";").forEach((forme, index) => {
      if (forme) {
        const selectedForme = this.formes.find((obj) => obj.id == forme);
        selectedForme.clicked = true;
      }
    });
    this.lotValue = this.windowdata.numLot;
  }
  // get all Formes(icons) From DB
  async getFormes() {
    this.formes.length = 0;
    const val = await this.gestionProduitHttpService.getForms().toPromise();
    val.forms.forEach((obj) => {
      this.formes.push({
        id: obj.id,
        name: obj.name,
        path: obj.path,
        clicked: false,
      });
    });
  }
  // select / unselected formes
  addForme(id, name, path, clicked, index) {
    if (clicked) {
      this.formes[index] = { id: id, name: name, path: path, clicked: true };
    } else {
      this.formes[index] = { id: id, name: name, path: path, clicked: false };
    }
  }
  //
  closeUpdateWindow() {
    this.windowRef.close();
  }
  // Submit the product update form
  async onSubmit(form: NgForm) {
    let success = true;
    let idSN;
    let numLot: string;
    // créer / vérifier l'existance du Lot
    // créer un nouveau Format de lot
    if (form.value.newformatLot) {
      let res;
      try {
        res = (await this.gestionProduitService.CreateLot(form.value)).lot
          .numLot;
        numLot = res;
      } catch (e) {
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
    // créer / vérifier l'existance d'un client
    if (form.value.codeClient) {
      success =
        (await this.gestionProduitService.AddClient(form.value)) && success;
    }
    // créer / vérifier l'existance d'un fournisseur
    if (form.value.codeFournisseur) {
      success =
        (await this.gestionProduitService.AddFournisseur(form.value)) &&
        success;
    }
    // add formes
    let formes = "";
    this.formes.map((val) => {
      if (val.clicked) {
        formes += val.id + ";";
      }
    });

    // update un produit
    if (success && this.windowdata.ref) {
      const idEtiquette = await (
        await this.gestionProduitHttpService
          .getOneProduit(this.windowdata.ref)
          .toPromise()
      ).produit.idEtiquette;
      const { value: motif } = await Swal.fire({
        title: "Entrez votre motif de Modification",
        input: "text",
        inputLabel: "Motif de Modification",
        showCancelButton: true,
        inputValidator: (value) => {
          if (!value) {
            return "Vous devez écrire votre motif!";
          }
        },
      });
      if (motif) {
        const produitData = JSON.stringify(this.windowdata);
        await this.historiqueService
          .createHistoriqueProduit({
            refProd: this.windowdata.ref,
            data: produitData.replaceAll("'", '"'),
            motif: motif,
            operation: "Update",
            userMatricule: this.authService.user.getValue().matricule,
          })
          .toPromise();
      }
      success = await this.gestionProduitService.updateProduit(
        {
          ...form.value,
          ref: this.windowdata.ref,
          idEtiquette: idEtiquette || null,
        },
        this.windowdata.ref,
        numLot,
        this.windowdata.idSN,
        formes
      );
      if (success) {
        this.windowRef.close();
      } else
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Échec de la mise à jour du produit!",
        });
    }
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
          this.getFormes();
        })
        .catch((e) => {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Icon déja existe !",
          });
        });
    };
    reader.onerror = function (error) {};
  };
  // check lot format
  checkFormatLot(data: string) {
    data.match(/^(dd|MM|yyyy)(\-|\/|\s)(dd|MM|yyyy)(\-|\/|\s)?(dd|MM|yyyy)?$/gm)
      ? (this.formatLotValid = true)
      : (this.formatLotValid = false);
  }
}
