import { Component, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { NbWindowRef } from "@nebular/theme";
import { UserHttpService } from "../userHttp.service";
import { AuthService } from "../../../auth/authService.service";
import Swal from "sweetalert2";
import { roles } from "../../../auth/user";
@Component({
  selector: "ngx-create-user-window",
  templateUrl: "./create-user-window.component.html",
  styleUrls: ["./create-user-window.component.scss"],
})
export class CreateUserWindowComponent implements OnInit {
  // uaps list
  uaps: string[];
  //selected uap
  uap: string = "UAP1";
  //selected atelier
  atelier;
  // ateliers list
  ateliers: { Libelle_Atelier: string; Liecod: string }[];
  // selected user role
  role: string = roles.admin;
  // roles enum
  roles;
  constructor(
    public windowRef: NbWindowRef,
    private userHttpService: UserHttpService,
    private authService: AuthService
  ) {}

  async ngOnInit() {
    this.roles = roles;
    this.uaps = (await this.userHttpService.getAllUAPs().toPromise()).UAPs.map(
      (val) => val.Unite_Production
    );
    this.ateliers = (
      await this.userHttpService.getAllAtelierName(this.uap).toPromise()
    ).ateliers;
    this.atelier = this.ateliers[0].Liecod;
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
        .createUtilisateur({
          ...form.value,
          motDePasse: "12345",
          atelierLiecod: form.value.atelier || null,
          statut: form.value.active,
          créateur: this.authService.user.getValue().matricule.toString(),
          UAP: form.value.uap || null,
          nomPC: "",
        })
        .toPromise();
      Swal.fire({
        icon: "success",
        title: "Utilisateur enregistré avec succès",
        showConfirmButton: false,
        timer: 1500,
      });
      this.windowRef.close();
    } catch (error) {
      console.log(error);

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
