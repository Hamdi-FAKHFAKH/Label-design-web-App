import { Component, OnInit } from "@angular/core";
import { GestionUtilisateursHttpService } from "../GestionUtilisateursHttp.service";
import { LocalDataSource } from "ng2-smart-table";
import { AuthService } from "../../auth/authService.service";
import { UtilisateurData } from "../GestionUtilisateursHttp.data";
import Swal from "sweetalert2";
import { ProductHistoriqueService } from "../HistoriqueHttp.service";
import { Utils } from "../formatDate";

@Component({
  selector: "ngx-profil",
  templateUrl: "./profil.component.html",
  styleUrls: ["./profil.component.scss"],
})
export class ProfilComponent implements OnInit {
  imgdata: string;
  isnewMotdePasse: boolean = false;
  user: UtilisateurData;
  atelierName: string;
  confirNewPass;
  newPass: string;
  oldPass: string;
  avatarColor: {
    backgroundColor: string;
    foregroundColor: string;
  };
  passwordnotValid: boolean = true;
  passwordIncorrect: boolean = true;
  ConfirmpasswordnotValid: boolean = true;
  avatarSrc: string;
  // smart table settings
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
      updatedAt: { filter: false, title: "Date Time" },
      motif: {
        title: "Motif",
        filter: false,
      },
    },
  };
  source: LocalDataSource = new LocalDataSource();
  //
  constructor(
    private gestionUtilisateursHttpService: GestionUtilisateursHttpService,
    private authService: AuthService,
    private historiqueService: ProductHistoriqueService,
    private utils: Utils
  ) {}

  //
  async ngOnInit() {
    this.avatarColor = this.authService.avatarColor;
    this.user = (
      await this.gestionUtilisateursHttpService
        .getOneUtilisateur(this.authService.user.getValue().matricule)
        .toPromise()
    ).utilisateur;
    this.imgdata = this.user.imgData;
    this.avatarSrc = this.authService.generateAvatar(
      this.user?.nom.slice(0, 1) + this.user?.prenom.slice(0, 1),
      this.authService.avatarColor?.foregroundColor,
      this.authService.avatarColor?.backgroundColor
    );
    if (this.user.atelierLiecod) {
      this.atelierName = (
        await this.gestionUtilisateursHttpService
          .getAtelierName(this.user.atelierLiecod)
          .toPromise()
      ).Atelier.Libelle_Atelier;
    } else {
      this.atelierName = " Tous les ateliers";
    }

    const historique = (
      await this.historiqueService
        .getHistoriqueProduit(this.authService.user.getValue().matricule)
        .toPromise()
    ).historiqueProduit;
    this.source.load(
      historique.map((val) => {
        return { ...val, updatedAt: this.utils.formatDate(val.updatedAt) };
      })
    );
  }
  //
  getBase641 = (e) => {
    var file = e.target.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      /** ******* console ********** */
      this.imgdata = reader.result.toString();
    };
    reader.onerror = function (error) {};
  };

  async changeMotPasse() {
    if (this.newPass && this.oldPass && this.confirNewPass) {
      try {
        const res = await this.gestionUtilisateursHttpService
          .checkPassword(
            this.authService.user.getValue().matricule,
            this.oldPass
          )
          .toPromise();
        if (res.Status == "Success") {
          this.passwordIncorrect = true;
          if (
            this.newPass == this.confirNewPass &&
            this.newPass !== this.oldPass
          ) {
            const result = await this.gestionUtilisateursHttpService
              .updateUtilisateur(this.authService.user.getValue().matricule, {
                password: this.newPass,
              })
              .toPromise();
            if (result.UtilisateurUpdated) {
              Swal.fire({
                icon: "success",
                title:
                  "La sauvegarde du mot de passe a été effectuée avec succès.",
                showConfirmButton: false,
                timer: 1500,
              }).then(() => {
                this.authService.logOut();
                this.isnewMotdePasse = false;
              });
            }
          }
        } else {
          this.passwordIncorrect = false;
        }
      } catch (error) {}
    }
  }
  async saveImg() {
    try {
      if (this.imgdata) {
        await this.gestionUtilisateursHttpService
          .updateUtilisateur(this.authService.user.getValue().matricule, {
            imgData: this.imgdata,
          })
          .toPromise();
        Swal.fire({
          icon: "success",
          title: "La sauvegarde du mot de passe a été effectuée avec succès.",
          showConfirmButton: false,
          timer: 1500,
        }).then(() => {
          this.authService.logOut();
        });
      }
    } catch (error) {
      console.log(error);
    }
  }
  //
  onchangePassword() {
    this.passwordnotValid = !this.newPass || this.newPass.length < 4;
  }
  //
  onchangeConfirmPassword() {
    this.ConfirmpasswordnotValid = this.confirNewPass !== this.newPass;
  }
}
