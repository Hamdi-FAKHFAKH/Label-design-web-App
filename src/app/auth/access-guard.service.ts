import { Injectable } from "@angular/core";
import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from "@angular/router";
import { Observable } from "rxjs";
import { AuthService } from "./authService.service";
import { map, take } from "rxjs/operators";
import { Ateliers, UAP, roles } from "./user";
// ********************************************** Protect Route **************************************************/
@Injectable({ providedIn: "root" })
export class AccessGuard implements CanActivate {
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
        console.log(user.role);
        console.log(user.atelier);

        return user.atelier == Ateliers.APT ||
          user.role == roles.admin ||
          (user.role == roles.responsableUAP && user.UAP === UAP.UAP1) ||
          user.role == roles.visitor
          ? true
          : user.atelier == Ateliers.ASS
          ? this.router.createUrlTree(["pages/ass"])
          : user.atelier == Ateliers.AIS
          ? this.router.createUrlTree(["pages/ais"])
          : user.role == roles.admin;
      })
    );
  }
}
