import { Component, OnInit } from "@angular/core";
import { LocalDataSource } from "ng2-smart-table";
import { GestionAteliersHttpService } from "./GestionAtelierHttp.service";
import { Utils } from "../formatDate";
import { NbWindowService } from "@nebular/theme";
import { CreateAtelierWindowComponent } from "./create-atelier-window/create-atelier-window.component";
import Swal from "sweetalert2";
import { UpdateAtelierWindowComponent } from "./update-atelier-window/update-atelier-window.component";

@Component({
  selector: "ngx-atelier-mangement",
  templateUrl: "./atelier-mangement.component.html",
  styleUrls: ["./atelier-mangement.component.scss", "./smart-table.css"],
})
export class AtelierMangementComponent implements OnInit {
  settings = {
    hideSubHeader: true,
    pager: { display: true },
    filter: false,
    mode: "external",
    actions: { position: "right", add: false },
    columns: {
      Liecod: {
        title: "Code Atelier",
        type: "string",
        filter: false,
      },
      Libelle_Atelier: {
        title: "Libelle d'atelier",
        type: "string",
        filter: false,
      },
      Unite_Production: {
        title: "Unité de Production ",
        type: "string",
        filter: false,
      },
      createdAt: {
        title: "Ajouté le",
        type: "string",
        filter: false,
      },
      updatedAt: {
        title: "Modifié le",
        type: "string",
        filter: false,
      },
    },
    edit: {
      inputClass: "edit",
      editButtonContent: '<i class="nb-edit"></i>',
      saveButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
      confirmSave: true,
    },
    delete: {
      deleteButtonContent: '<i class="nb-trash"></i>',
      confirmDelete: true,
    },
  };
  source: LocalDataSource = new LocalDataSource();
  constructor(
    private gestionAteliersHttpService: GestionAteliersHttpService,
    private utils: Utils,
    private windowService: NbWindowService
  ) {}

  async ngOnInit() {
    const ateliers = (
      await this.gestionAteliersHttpService.getAllAteliers().toPromise()
    ).Ateliers;
    this.source.load(
      ateliers.map((val) => {
        return {
          ...val,
          createdAt: this.utils.formatDate(val.createdAt),
          updatedAt: this.utils.formatDate(val.updatedAt),
        };
      })
    );
  }
  async onDeleteAtelier(data) {
    try {
      await this.gestionAteliersHttpService
        .removeAtelier(data.data.Liecod)
        .toPromise();
      Swal.fire({
        icon: "success",
        title: "Atelier Supprimé avec succès",
        showConfirmButton: false,
        timer: 1500,
      });
      const ateliers = (
        await this.gestionAteliersHttpService.getAllAteliers().toPromise()
      ).Ateliers;
      this.source.load(
        ateliers.map((val) => {
          return {
            ...val,
            createdAt: this.utils.formatDate(val.createdAt),
            updatedAt: this.utils.formatDate(val.updatedAt),
          };
        })
      );
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Échec de la suppression d'atelier",
      });
    }
  }
  openUpdateAtelierWindow(event) {
    const window = this.windowService.open(UpdateAtelierWindowComponent, {
      title: `Modifier Atelier`,
      closeOnBackdropClick: false,
      buttons: { minimize: true, fullScreen: false, maximize: false },
      context: { atelierdata: event.data },
    });
    window.onClose.toPromise().then(() => {
      this.gestionAteliersHttpService
        .getAllAteliers()
        .toPromise()
        .then(({ Ateliers }) => {
          this.source.load(
            Ateliers.map((val) => {
              return {
                ...val,
                updatedAt: this.utils.formatDate(val.createdAt),
                createdAt: this.utils.formatDate(val.updatedAt),
              };
            })
          );
        });
    });
  }
  onSearch(data) {}
  openAddAtelierWindow() {
    const window = this.windowService.open(CreateAtelierWindowComponent, {
      title: `Nouveau Atelier`,
      closeOnBackdropClick: false,
      buttons: { minimize: true, fullScreen: true, maximize: false },
    });
    window.onClose.toPromise().then(() => {
      this.gestionAteliersHttpService
        .getAllAteliers()
        .toPromise()
        .then(({ Ateliers }) => {
          this.source.load(
            Ateliers.map((val) => {
              return {
                ...val,
                updatedAt: this.utils.formatDate(val.createdAt),
                createdAt: this.utils.formatDate(val.updatedAt),
              };
            })
          );
        });
    });
  }
}
