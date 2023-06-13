import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from "@angular/router";
import { Observable } from "rxjs";
import { AuthService } from "./authService.service";
import { map, take } from "rxjs/operators";
import { Ateliers, roles } from "./user";
// ********************************************** Protect Atelier Protection Thermique Route **************************************************/
@Injectable({ providedIn: "root" })
export class AptGuard implements CanActivate {
  constructor(private router: Router, private authService: AuthService) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | boolean
    | UrlTree
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree> {
    return this.authService.user.pipe(
      take(1),
      map((user) => {
        return user.role !== roles.agentSaisie && true;
      })
    );
  }
}
