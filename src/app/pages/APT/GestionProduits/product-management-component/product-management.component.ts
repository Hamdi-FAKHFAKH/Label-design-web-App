import { Component } from "@angular/core";
import { LocalDataSource } from "ng2-smart-table";

import { NbWindowService } from "@nebular/theme";
import { ProductCreationWindowComponent } from "../create-product/product-creation-window.component";
import { GestionProduitHttpService } from "../GestionProduitHttp.service";
import { exhaustMap } from "rxjs/operators";
import { GestionProduitService } from "../GestionProduit.service";
import { UpdateProduitComponent } from "../update-product/update-produit.component";
import Swal from "sweetalert2";
import { HistoriqueService } from "../../../HistoriqueHttp.service";
import { AuthService } from "../../../../auth/authService.service";
@Component({
  selector: "ngx-smart-table",
  templateUrl: "./product-management.component.html",
  styleUrls: ["./smart-table.css", "./product-management.component.scss"],
})
export class ProductMangementComponent {
  settings = {
    hideSubHeader: true,
    pager: { display: true },
    filter: false,
    mode: "external",
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
      formatLot: {
        title: "Format Lot",
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
    private windowService: NbWindowService,
    private gestionProduitHttpService: GestionProduitHttpService,
    private gestionProduitService: GestionProduitService,
    private historiqueService: HistoriqueService,
    private authService: AuthService
  ) {
    this.gestionProduitHttpService.getAllProduits().subscribe((res) => {
      const tableData = [];
      res.produits.forEach((val) => {
        tableData.push(val);
      });
      this.source.load(tableData);
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
      // success = await this.gestionProduitService.updateProduit(
      //   event.newData,
      //   event.newData.ref
      // );
      success && event.confirm.resolve();
    } else {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Echec de Mise a jour le produit!",
      });
      event.confirm.reject();
    }
  }
  // delete Product
  async onDeleteConfirm(event) {
    Swal.fire({
      title: "Es-tu sûr?",
      text: "Vous ne pourrez pas revenir en arrière !!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Oui, supprimez-le !",
      cancelButtonText: "Annuler",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const { value: motif } = await Swal.fire({
            title: "Entrez votre motif de suppression",
            input: "text",
            inputLabel: "Motif de Suppression",
            showCancelButton: true,
            inputValidator: (value) => {
              if (!value) {
                return "Vous devez écrire votre motif!";
              }
            },
          });
          console.log(motif);
          if (motif) {
            const produitData = JSON.stringify(event.data);
            await this.historiqueService
              .createHistoriqueProduit({
                refProd: event.data.ref,
                data: produitData.replaceAll("'", '"'),
                motif: motif,
                operation: "Delete",
                userMatricule: this.authService.user.getValue().matricule,
              })
              .toPromise();
            await this.gestionProduitService.deleteProduit(event.data.ref);
            Swal.fire({
              title: "Supprimer!",
              text: "Produit supprimé!",
              icon: "success",
              confirmButtonColor: "#3085d6",
            }).then(() => {
              this.gestionProduitHttpService
                .getAllProduits()
                .subscribe((res) => {
                  this.source.load(res.produits);
                });
              this.source.refresh();
            });
          }
        } catch (e) {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Echec de la suppression du produit",
          });
        }
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Echec de la suppression du produit",
        });
      }
    });
  }
  // open the product creation window
  openCreateProductWindow() {
    const window = this.windowService.open(ProductCreationWindowComponent, {
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
  //open the product update window
  openUpdateProductWindow(event) {
    const window = this.windowService.open(UpdateProduitComponent, {
      title: `Modification Produit`,
      windowClass: "container",
      closeOnBackdropClick: false,
      buttons: { minimize: true, fullScreen: false, maximize: false },
      context: { windowdata: event.data },
    });
    window.onClose.subscribe((res) => {
      this.gestionProduitHttpService.getAllProduits().subscribe((res) => {
        this.source.load(res.produits);
      });
    });
  }
  // search data
  onSearch(query: string = "") {
    if (query == "") {
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
