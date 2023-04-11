import { Component } from "@angular/core";
import { LocalDataSource } from "ng2-smart-table";

import { SmartTableData } from "../../../../@core/data/smart-table";
import { NbWindowService } from "@nebular/theme";
import { WindowFormComponent } from "../window-form/window-form.component";
import { GestionProduitService } from "../gestionProduit.service";
@Component({
  selector: "ngx-smart-table",
  templateUrl: "./smart-table.component.html",
  styleUrls: ["./smart-table.css"],
})
export class SmartTableComponent {
  settings = {
    filter: false,
    actions: { position: "right", add: false },
    columns: {
      ref: {
        title: "Référence",
        type: "string",
        filter: false,
        width: "40px",
      },
      nomProduit: {
        title: "Nom produit",
        type: "string",
        filter: false,
        width: "80px",
      },
      prodes1: {
        title: "Référence 1",
        type: "string",
        filter: false,
      },
      prodes2: {
        title: "Référence 2",
        type: "string",
        filter: false,
      },
      codeFournisseur: {
        title: "Code Fournisseur",
        type: "string",
        filter: false,
      },
      DesFournisseur: {
        title: "Désignation fournisseur",
        type: "string",
        filter: false,
      },
      codeClient: {
        title: "Code Client ",
        type: "string",
        filter: false,
      },
      DesClient: {
        title: "Désignation Client",
        type: "string",
        filter: false,
      },
      numLot: {
        title: "N° Lot/Format ",
        type: "string",
        filter: false,
      },
      desLot: {
        title: "Désignation Lot",
        type: "string",
        filter: false,
      },
    },
    add: {
      addButtonContent: '<i class="nb-plus"></i>',
      createButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
    },
    edit: {
      inputClass: "edit",
      editButtonContent: '<i class="nb-edit"></i>',
      saveButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
    },
    delete: {
      deleteButtonContent: '<i class="nb-trash"></i>',
      confirmDelete: true,
    },
  };

  source: LocalDataSource = new LocalDataSource();

  constructor(
    private service: SmartTableData,
    private windowService: NbWindowService,
    private gestionProduitService: GestionProduitService
  ) {
    this.gestionProduitService.getAllProduits().subscribe((res) => {
      this.source.load(res.produits);
    });
    //this.source.load(data);
  }

  onDeleteConfirm(event): void {
    if (window.confirm("Etes-vous sûr que vous voulez supprimer le Produit?")) {
      event.confirm.resolve();
    } else {
      event.confirm.reject();
    }
  }
  openWindowForm() {
    this.windowService.open(WindowFormComponent, {
      title: `Nouveau Produit`,
      windowClass: "container",
      closeOnBackdropClick: false,
      buttons: { minimize: true, fullScreen: false, maximize: false },
    });
  }
  onSearch(query: string = "") {
    this.source.setFilter(
      [
        // fields we want to include in the search
        {
          field: "id",
          search: query,
        },
        {
          field: "firstName",
          search: query,
        },
        {
          field: "lastName",
          search: query,
        },
        {
          field: "Username",
          search: query,
        },
      ],
      false
    );
    // second parameter specifying whether to perform 'AND' or 'OR' search
    // (meaning all columns should contain search query or at least one)
    // 'AND' by default, so changing to 'OR' by setting false here
  }
}
// export interface NbWindowControlButtonsConfig {
//   minimize: boolean;
//   maximize: boolean;
//   fullScreen: boolean;
//   close: boolean; // <---   we need this
// }
