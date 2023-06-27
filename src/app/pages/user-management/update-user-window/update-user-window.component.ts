import { Component, OnInit } from "@angular/core";
import { NbWindowRef } from "@nebular/theme";
import { UserHttpService } from "../userHttp.service";
import { AuthService } from "../../../auth/authService.service";
import { roles } from "../../../auth/user";
import { NgForm } from "@angular/forms";
import { UtilisateurData } from "../userHttp.data";
import Swal from "sweetalert2";
@Component({
  selector: "ngx-update-user-window",
  templateUrl: "./update-user-window.component.html",
  styleUrls: ["./update-user-window.component.scss"],
})
export class UpdateUserWindowComponent implements OnInit {
  // uaps list
  uaps: string[];
  //selected uap
  uap: string;
  //selected atelier
  atelier;
  // ateliers list
  ateliers: { Libelle_Atelier: string; Liecod: string }[];
  // selected user role
  role: string = "administrator";
  // roles enum
  roles;
  //
  userdata;
  constructor(
    public windowRef: NbWindowRef,
    private userHttpService: UserHttpService,
    private authService: AuthService
  ) {}

  async ngOnInit() {
    console.log(this.userdata);

    this.role = this.userdata.role;
    this.atelier = this.userdata.atelierLiecod;
    this.uap = this.userdata.UAP;
    this.roles = roles;
    this.uaps = (await this.userHttpService.getAllUAPs().toPromise()).UAPs.map(
      (val) => val.Unite_Production
    );
    if (this.uap) {
      this.ateliers = (
        await this.userHttpService.getAllAtelierName(this.uap).toPromise()
      ).ateliers;
    }
  }
  //close product creation window
  close() {
    this.windowRef.close();
  }
  // on uap select
  async onUAPselect() {
    this.ateliers = (
      await this.userHttpService.getAllAtelierName(this.uap).toPromise()
    ).ateliers;
    this.atelier = this.ateliers[0].Liecod;
  }
  // Submit the product creation form
  async onSubmit(form: NgForm) {
    try {
      await this.userHttpService
        .updateUtilisateur(this.userdata.matricule, {
          ...form.value,
          atelierLiecod: form.value.atelier || null,
          statut: form.value.active,
          // modificateur: this.authService.user.getValue().matricule.toString(),
          UAP: form.value.uap || null,
        })
        .toPromise();
      Swal.fire({
        icon: "success",
        title: "utilisateur modifié avec succès",
        showConfirmButton: false,
        timer: 1500,
      }).then(() => {
        this.windowRef.close();
      });
    } catch (error) {
      error.error.erreur.name == "SequelizeUniqueConstraintError" &&
        Swal.fire({
          icon: "error",
          title: "L'enregistrement de l'utilisateur a échoué",
          text: "Matricule doit être unique",
          showConfirmButton: false,
          timer: 1500,
        });
      error.error.erreur.errors[0].message == "Validation len on nom failed" &&
        Swal.fire({
          icon: "error",
          title: "L'enregistrement de l'utilisateur a échoué",
          text: "Nom d'utilisateur invalid",
          showConfirmButton: false,
          timer: 1500,
        });
      error.error.erreur.errors[0].message ==
        "Validation len on prenom failed" &&
        Swal.fire({
          icon: "error",
          title: "L'enregistrement de l'utilisateur a échoué",
          text: "Prénom d'utilisateur invalid",
          showConfirmButton: false,
          timer: 1500,
        });
    }
  }
}
