import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  CanDeactivate,
  RouterStateSnapshot,
  UrlTree,
} from "@angular/router";
import { Observable } from "rxjs";
import { SidebarComponent } from "./label-container/label-container.component";
import { DragDropService } from "./drag-drop.service";
import Swal from "sweetalert2";
import { map } from "rxjs/operators";
@Injectable()
export class ConfirmNavigationGuard implements CanDeactivate<SidebarComponent> {
  constructor(private dragdropService: DragDropService) {}
  canDeactivate(
    component: SidebarComponent,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState?: RouterStateSnapshot
  ):
    | boolean
    | UrlTree
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree> {
    // if (!this.dragdropService.savedLabel.getValue()) {
    return Swal.fire({
      icon: "warning",
      title:
        "Avant de quitter, veuillez enregistrer les modifications que vous avez apportées.",
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: "OK",
      denyButtonText: `Continuer sans enregistrement`,
    }).then((result) => {
      if (result.isConfirmed) {
        return false;
      } else if (result.isDenied) {
        return true;
      }
    });
    // } else {
    //   return true;
    // }
  }
}
