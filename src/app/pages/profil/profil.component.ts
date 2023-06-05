import { Component, OnInit } from "@angular/core";
import { GestionUtilisateursHttpService } from "../GestionUtilisateursHttp.service";
import { LocalDataSource } from "ng2-smart-table";
import { AuthService } from "../../auth/authService.service";
import { UtilisateurData } from "../GestionUtilisateursHttp.data";
import Swal from "sweetalert2";
import { HistoriqueService } from "../HistoriqueHttp.service";

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
    private historiqueService: HistoriqueService
  ) {}

  //
  async ngOnInit() {
    this.avatarColor = this.authService.avatarColor;
    this.user = (
      await this.gestionUtilisateursHttpService
        .getOneUtilisateur(this.authService.user.getValue().matricule)
        .toPromise()
    ).utilisateur;
    this.avatarSrc = this.authService.generateAvatar(
      this.user?.nom.slice(0, 1) + this.user?.prenom.slice(0, 1),
      this.authService.avatarColor?.foregroundColor,
      this.authService.avatarColor?.backgroundColor
    );
    this.atelierName = (
      await this.gestionUtilisateursHttpService
        .getAtelierName(this.user.atelierLiecod)
        .toPromise()
    ).Atelier.Libelle_Atelier;
    const historique = (
      await this.historiqueService
        .getHistoriqueProduit(this.authService.user.getValue().matricule)
        .toPromise()
    ).historiqueProduit;
    this.source.load(
      historique.map((val) => {
        let d = new Date(val.updatedAt);
        let ye = new Intl.DateTimeFormat("en", {
          year: "numeric",
        }).format(d);
        let mo = new Intl.DateTimeFormat("en", {
          month: "2-digit",
        }).format(d);
        let da = new Intl.DateTimeFormat("en", {
          day: "2-digit",
        }).format(d);
        let h = new Intl.DateTimeFormat("fr", {
          hour: "2-digit",
        })
          .format(d)
          .replace(" h", "");
        let mm = new Intl.DateTimeFormat("en", {
          minute: "2-digit",
        }).format(d);
        let ss = new Intl.DateTimeFormat("en", {
          second: "2-digit",
        }).format(d);
        return { ...val, updatedAt: `${da}/${mo}/${ye} ${h}:${mm}:${ss}` };
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
    try {
      const res = await this.gestionUtilisateursHttpService
        .checkPassword(this.authService.user.getValue().matricule, this.oldPass)
        .toPromise();
      if (res.Status == "Success") {
        this.passwordIncorrect = true;
        if (
          this.newPass == this.confirNewPass &&
          this.newPass !== this.oldPass
        ) {
          const result = await this.gestionUtilisateursHttpService
            .updateUtilisateur(
              this.authService.user.getValue().matricule,
              this.newPass,
              this.imgdata
            )
            .toPromise();
          if (result.UtilisateurUpdated) {
            Swal.fire({
              icon: "success",
              title:
                "La sauvegarde du mot de passe a été effectuée avec succès.",
              showConfirmButton: false,
              timer: 1500,
            });
            this.isnewMotdePasse = false;
            this.authService.logOut();
          }
        }
      } else {
        this.passwordIncorrect = false;
      }
    } catch (error) {}
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
