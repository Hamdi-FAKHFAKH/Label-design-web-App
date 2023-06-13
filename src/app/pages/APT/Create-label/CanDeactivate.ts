import { Injectable } from "@angular/core";
import { CanDeactivate } from "@angular/router";
import { Observable } from "rxjs";
import { SidebarComponent } from "./label-container/label-container.component";

export interface CanComponentDeactivate {
  canDeactivate: () => Observable<boolean> | Promise<boolean> | boolean;
}

@Injectable({ providedIn: "root" })
export class ConfirmNavigationGuard implements CanDeactivate<SidebarComponent> {
  constructor(private canComponentDeactivate: CanComponentDeactivate) {}
  canDeactivate(
    component: SidebarComponent
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.canComponentDeactivate.canDeactivate();
  }
}
