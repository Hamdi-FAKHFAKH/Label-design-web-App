import { Component, OnInit } from "@angular/core";
import { LocalDataSource } from "ng2-smart-table";
import { UserHttpService } from "../userHttp.service";
import { UtilisateurData } from "../userHttp.data";
import { AuthService } from "../../../auth/authService.service";
import { CreateUserWindowComponent } from "../create-user-window/create-user-window.component";
import { NbWindowService } from "@nebular/theme";
import Swal from "sweetalert2";
import { UpdateUserWindowComponent } from "../update-user-window/update-user-window.component";
import { Utils } from "../../formatDate";
@Component({
  selector: "ngx-user-management",
  templateUrl: "./user-management.component.html",
  styleUrls: ["./user-management.component.scss", "./smart-table.css"],
})
export class UserManagementComponent implements OnInit {
  settings = {
    hideSubHeader: true,
    pager: { display: true },
    filter: false,
    mode: "external",
    actions: { position: "right", add: false },
    columns: {
      statut: {
        title: "Statut",
        type: "string",
        filter: false,
        editor: {
          type: "checkbox",
        },
      },
      matricule: {
        title: "Matricule",
        type: "string",
        filter: false,
      },
      nom: {
        title: "Nom",
        type: "string",
        filter: false,
      },
      prenom: {
        title: "Prénom ",
        type: "string",
        filter: false,
      },
      role: {
        title: "Rôle",
        type: "string",
        filter: false,
      },
      atelierLiecod: {
        title: "Atelier",
        type: "string",
        filter: false,
      },
      UAP: {
        title: "UAP",
        type: "string",
        filter: false,
      },
      créateur: {
        title: "Créateur",
        type: "string",
        filter: false,
      },
      modificateur: {
        title: "Modificateur",
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
  users: UtilisateurData[];
  source: LocalDataSource = new LocalDataSource();
  constructor(
    private userHttpService: UserHttpService,
    private authService: AuthService,
    private windowService: NbWindowService,
    private utils: Utils
  ) {}

  async ngOnInit() {
    this.users = (
      await this.userHttpService.getAllUtilisateurs().toPromise()
    ).utilisateur;
    this.users &&
      this.source.load(
        this.users
          .map((val) => {
            return {
              ...val,
              createdAt: this.utils.formatDate(val.createdAt),
              updatedAt: this.utils.formatDate(val.updatedAt),
              statut: val.statut ? "active" : "déactiver",
              atelierLiecod: val.atelierLiecod || "--",
              modificateur: val.modificateur || "--",
              UAP: val.UAP || "--",
            };
          })
          .filter((val) => !!val)
      );
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
            field: "matricule",
            search: query,
          },
          {
            field: "nom",
            search: query,
          },
          {
            field: "prenom",
            search: query,
          },
        ],
        false
      );
    }
  }
  openAddUserWindow() {
    const window = this.windowService.open(CreateUserWindowComponent, {
      title: `Nouveau Utilisateur`,
      closeOnBackdropClick: false,
      buttons: { minimize: true, fullScreen: true, maximize: false },
    });
    window.onClose.toPromise().then(() => {
      this.userHttpService
        .getAllUtilisateurs()
        .toPromise()
        .then(({ utilisateur }) => {
          this.source.load(this.fillSmartTable(utilisateur));
        });
    });
  }
  async onDeleteUser(event) {
    Swal.fire({
      title: "Es-tu sûr?",
      text: "Vous ne pourrez pas revenir en arrière !!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Oui, supprimez-le!",
      cancelButtonText: "Annuler",
    }).then(async (result) => {
      try {
        if (result.isConfirmed) {
          if (
            this.authService.user.getValue().matricule != event.data.matricule
          ) {
            const res = await this.userHttpService
              .deleteUtilisateur(event.data.matricule)
              .toPromise();
            Swal.fire({
              title: "Supprimer!",
              text: "Utilisateur supprimé!",
              icon: "success",
              confirmButtonColor: "#3085d6",
            });
            this.userHttpService
              .getAllUtilisateurs()
              .toPromise()
              .then(({ utilisateur }) => {
                this.source.load(this.fillSmartTable(utilisateur));
              });
          } else {
            Swal.fire({
              title: "Échec de Suppression!",
              text: "Il n'est pas possible de supprimer le compte courant.",
              icon: "error",
              confirmButtonColor: "#3085d6",
            });
          }
        } else {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Échec de la suppression d'utilisateur",
          });
        }
      } catch (e) {
        console.log(e);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Échec de la suppression d'utilisateur",
        });
      }
    });
  }
  openUpdateUserWindow(event) {
    const window = this.windowService.open(UpdateUserWindowComponent, {
      title: `Modifier Utilisateur`,
      closeOnBackdropClick: false,
      buttons: { minimize: true, fullScreen: false, maximize: false },
      context: { userdata: event.data },
    });
    window.onClose.subscribe(() => {
      this.authService.user.getValue().matricule == event.data.matricule &&
        this.authService.logOut();
      this.userHttpService
        .getAllUtilisateurs()
        .toPromise()
        .then(({ utilisateur }) => {
          this.source.load(this.fillSmartTable(utilisateur));
        });
    });
  }
  // this.utils.formatDate(date) {
  //   let d = new Date(date);
  //   let ye = new Intl.DateTimeFormat("en", {
  //     year: "numeric",
  //   }).format(d);
  //   let mo = new Intl.DateTimeFormat("en", {
  //     month: "2-digit",
  //   }).format(d);
  //   let da = new Intl.DateTimeFormat("en", {
  //     day: "2-digit",
  //   }).format(d);
  //   let h = new Intl.DateTimeFormat("fr", {
  //     hour: "2-digit",
  //   })
  //     .format(d)
  //     .replace(" h", "");
  //   let mm = new Intl.DateTimeFormat("en", {
  //     minute: "2-digit",
  //   }).format(d);
  //   let ss = new Intl.DateTimeFormat("en", {
  //     second: "2-digit",
  //   }).format(d);
  //   return `${da}/${mo}/${ye} ${h}:${mm}:${ss}`;
  // }
  fillSmartTable(utilisateur) {
    return utilisateur
      .map((val) => {
        return {
          ...val,
          createdAt: this.utils.formatDate(val.createdAt),
          updatedAt: this.utils.formatDate(val.updatedAt),
          statut: val.statut ? "active" : "déactiver",
          atelierLiecod: val.atelierLiecod || "--",
          modificateur: val.modificateur || "--",
          UAP: val.UAP || "--",
        };
      })
      .filter((val) => !!val);
  }
}
