import { Component } from "@angular/core";
import { LocalDataSource } from "ng2-smart-table";

import { SmartTableData } from "../../../../@core/data/smart-table";
import { NbWindowService } from "@nebular/theme";
import { WindowFormComponent } from "../window-form/window-form.component";
import { GestionProduitHttpService } from "../gestionProduitHttp.service";
import { exhaustMap } from "rxjs/operators";
import { GestionProduitService } from "../GestionProduit.service";
@Component({
  selector: "ngx-smart-table",
  templateUrl: "./smart-table.component.html",
  styleUrls: ["./smart-table.css"],
})
export class SmartTableComponent {
  settings = {
    hideSubHeader: true,
    pager: { display: true },
    filter: false,
    actions: { position: "right", add: false },
    columns: {
      ref: {
        title: "Référence",
        type: "string",
        filter: false,
        class: "customformat",
      },
      nomProduit: {
        title: "Nom produit",
        type: "string",
        filter: false,
      },
      ref1: {
        title: "Référence 1",
        type: "string",
        filter: false,
      },
      ref2: {
        title: "Référence 2",
        type: "string",
        filter: false,
      },
      codeFournisseur: {
        title: "Code Fournisseur",
        type: "string",
        filter: false,
      },
      desFournisseur: {
        title: "Désignation fournisseur",
        type: "string",
        filter: false,
      },
      codeClient: {
        title: "Code Client ",
        type: "string",
        filter: false,
      },
      desClient: {
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
      withDataMatrix: {
        title: "Avec DataMatrix",
        type: "string",
        filter: false,
      },
      withOF: {
        title: "Avec OF",
        type: "boolean",
        filter: false,
      },
      withSN: {
        title: "Avec Numéro de Série",
        type: "string",
        filter: false,
      },
      idSN: {
        title: "ID Numéro de Série",
        type: "string",
        filter: false,
      },
      text1: {
        title: "Text1",
        type: "string",
        filter: false,
      },
      text2: {
        title: "Text2",
        type: "string",
        filter: false,
      },
      text3: {
        title: "Text3",
        type: "string",
        filter: false,
      },
      text4: {
        title: "Text4",
        type: "string",
        filter: false,
      },
      text5: {
        title: "Text5",
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
      confirmSave: true,
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
    private gestionProduitHttpService: GestionProduitHttpService,
    private gestionProduitService: GestionProduitService
  ) {
    this.gestionProduitHttpService.getAllProduits().subscribe((res) => {
      this.source.load(res.produits);
    });
  }
  async onEdit(event) {
    let success = true;
    console.log(event.newData);
    if (event.newData && event.newData.codeFournisseur) {
      this.gestionProduitService.AddFournisseur(event.newData);
    }
    // créer / vérifier l'existance d'un client
    if (event.newData && event.newData.codeClient) {
      success = await this.gestionProduitService.AddClient(event.newData);
    }

    if (success) {
      success = await this.gestionProduitService.updateProduit(
        event.newData,
        event.newData.ref
      );
      success && event.confirm.resolve();
    } else {
      alert("produit updated Failed");
      event.confirm.reject();
    }
  }

  async onDeleteConfirm(event) {
    console.log(event.data);

    if (window.confirm("Etes-vous sûr que vous voulez supprimer ce Produit?")) {
      (await this.gestionProduitService.deleteProduit(event.data.ref)) &&
        event.confirm.resolve();
    } else {
      event.confirm.reject();
    }
  }
  openWindowForm() {
    const window = this.windowService.open(WindowFormComponent, {
      title: `Nouveau Produit`,
      windowClass: "container",
      closeOnBackdropClick: false,
      buttons: { minimize: true, fullScreen: false, maximize: false },
    });
    window.onClose.subscribe((res) => {
      this.gestionProduitHttpService.getAllProduits().subscribe((res) => {
        this.source.load(res.produits);
      });
    });
  }
  onSearch(query: string = "") {
    if (query == "") {
      console.log("refech");
      this.source.reset(false);
    } else {
      this.source.setFilter(
        [
          // fields we want to include in the search
          {
            field: "ref",
            search: query,
          },
          {
            field: "nomProduit",
            search: query,
          },
          {
            field: "ref1",
            search: query,
          },
          {
            field: "ref2",
            search: query,
          },
        ],
        false
      );
    }

    // second parameter specifying whether to perform 'AND' or 'OR' search
    // (meaning all columns should contain search query or at least one)
    // 'AND' by default, so changing to 'OR' by setting false here
  }
}
