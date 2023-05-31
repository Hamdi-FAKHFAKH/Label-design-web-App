import { Component, OnDestroy, OnInit, HostListener } from "@angular/core";
import {
  NbMediaBreakpointsService,
  NbMenuService,
  NbSidebarService,
  NbThemeService,
} from "@nebular/theme";

import { UserData } from "../../../@core/data/users";
import { LayoutService } from "../../../@core/utils";
import { map, takeUntil } from "rxjs/operators";
import { Subject, Subscribable, Subscription } from "rxjs";
import { AuthService } from "../../../auth/authService.service";
import { CookieService } from "ngx-cookie-service";
import { GestionUtilisateursHttpService } from "../../../pages/GestionUtilisateursHttp.service";
import { UtilisateurData } from "../../../pages/GestionUtilisateursHttp.data";
import { Router } from "@angular/router";

@Component({
  selector: "ngx-header",
  styleUrls: ["./header.component.scss"],
  templateUrl: "./header.component.html",
})
export class HeaderComponent implements OnInit, OnDestroy {
  private destroy$: Subject<void> = new Subject<void>();
  user: UtilisateurData;
  private userSub: Subscription;
  authenticated: boolean;
  avatarColor;
  generateAvatar;
  themes = [
    {
      value: "default",
      name: "Light",
    },
    {
      value: "dark",
      name: "Dark",
    },
    {
      value: "cosmic",
      name: "Cosmic",
    },
    {
      value: "corporate",
      name: "Corporate",
    },
  ];

  currentTheme = "default";
  smallDevice = false;
  avatarSrc;
  userMenu = [{ title: "Profile" }, { title: "Log out" }];

  constructor(
    private sidebarService: NbSidebarService,
    private menuService: NbMenuService,
    private themeService: NbThemeService,
    private userService: UserData,
    private layoutService: LayoutService,
    private breakpointService: NbMediaBreakpointsService,
    private authService: AuthService,
    private cookieService: CookieService,
    private gestionUtilisateursHttpService: GestionUtilisateursHttpService,
    public router: Router
  ) {}

  async ngOnInit() {
    this.generateAvatar = this.authService.generateAvatar;
    this.avatarColor = this.authService.avatarColor;
    this.user = (
      await this.gestionUtilisateursHttpService
        .getOneUtilisateur(this.authService.user.getValue().matricule)
        .toPromise()
    ).utilisateur;
    this.avatarSrc = this.generateAvatar(
      this.user?.nom.slice(0, 1) + this.user?.prenom.slice(0, 1),
      this.avatarColor?.foregroundColor,
      this.avatarColor?.backgroundColor
    );
    this.avatarColor = this.authService.avatarColor;
    const loadedTheme: string = this.cookieService.get("theme");
    if (loadedTheme) {
      this.themeService.changeTheme(loadedTheme);
    }
    this.currentTheme = this.themeService.currentTheme;
    this.userSub = this.authService.user.subscribe((user) => {
      this.authenticated = !!user;
      console.log(this.authenticated);
    });
    this.themeService
      .onThemeChange()
      .pipe(
        map(({ name }) => name),
        takeUntil(this.destroy$)
      )
      .subscribe((themeName) => (this.currentTheme = themeName));
  }
  @HostListener("window:resize", ["$event"])
  onResize(event) {
    if (window.innerWidth < 700 && window.innerHeight < 1020) {
      this.smallDevice = true;
    } else {
      this.smallDevice = false;
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  changeTheme(themeName: string) {
    this.themeService.changeTheme(themeName);
    this.cookieService.set("theme", this.currentTheme, 4, "/");
  }

  toggleSidebar(): boolean {
    this.sidebarService.toggle(true, "menu-sidebar");
    this.layoutService.changeLayoutSize();

    return false;
  }

  navigateHome() {
    this.menuService.navigateHome();
    return false;
  }
  logOut() {
    this.authService.logOut();
  }
}
