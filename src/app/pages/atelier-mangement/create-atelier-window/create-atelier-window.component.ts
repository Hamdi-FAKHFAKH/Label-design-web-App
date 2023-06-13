import { Component, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { NbWindowRef } from "@nebular/theme";
import { GestionAteliersHttpService } from "../GestionAtelierHttp.service";
import Swal from "sweetalert2";
import { uaps } from "../../../auth/user";

@Component({
  selector: "ngx-create-atelier-window",
  templateUrl: "./create-atelier-window.component.html",
  styleUrls: ["./create-atelier-window.component.scss"],
})
export class CreateAtelierWindowComponent implements OnInit {
  uaps;
  constructor(
    public windowRef: NbWindowRef,
    private gestionAteliersHttpService: GestionAteliersHttpService
  ) {}
  close() {
    this.windowRef.close();
  }

  ngOnInit(): void {
    this.uaps = uaps;
  }
  async onSubmit(form: NgForm) {
    const data: {
      codeAtelier: string;
      libelleAtelier: string;
      uniteProduction: string;
    } = form.value;

    try {
      await this.gestionAteliersHttpService
        .createAtelier({
          Libelle_Atelier: data.libelleAtelier,
          Liecod: data.codeAtelier,
          Unite_Production: data.uniteProduction,
        })
        .toPromise();
      Swal.fire({
        icon: "success",
        title: "Atelier enregistré avec succès",
        showConfirmButton: false,
        timer: 1500,
      });
      this.windowRef.close();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Échec de la création d'atelier",
      });
    }
  }
}
