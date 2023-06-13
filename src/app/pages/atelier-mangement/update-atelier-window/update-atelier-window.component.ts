import { Component, OnInit } from "@angular/core";
import { NbWindowRef } from "@nebular/theme";
import { GestionAteliersHttpService } from "../GestionAtelierHttp.service";
import { NgForm } from "@angular/forms";
import Swal from "sweetalert2";

@Component({
  selector: "ngx-update-atelier-window",
  templateUrl: "./update-atelier-window.component.html",
  styleUrls: ["./update-atelier-window.component.scss"],
})
export class UpdateAtelierWindowComponent implements OnInit {
  atelierdata: {
    Liecod: string;
    Libelle_Atelier: string;
    Unite_Production: string;
  };
  constructor(
    public windowRef: NbWindowRef,
    private gestionAteliersHttpService: GestionAteliersHttpService
  ) {}

  close() {
    this.windowRef.close();
  }

  ngOnInit(): void {
    console.log(this.atelierdata);
  }
  async onSubmit(form: NgForm) {
    const data: {
      Liecod: string;
      Libelle_Atelier: string;
      Unite_Production: string;
    } = form.value;

    try {
      await this.gestionAteliersHttpService
        .updateAtelier(data, this.atelierdata.Liecod)
        .toPromise();
      Swal.fire({
        icon: "success",
        title: "Atelier mise à jour avec succès",
        showConfirmButton: false,
        timer: 1500,
      });
      this.windowRef.close();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Échec de la mise à jour d'atelier",
      });
    }
  }
}
