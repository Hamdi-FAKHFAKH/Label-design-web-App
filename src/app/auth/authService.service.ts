import { Injectable } from "@angular/core";
import { user } from "./user";
import { HttpClient } from "@angular/common/http";
import { catchError, tap } from "rxjs/operators";
import { BehaviorSubject, Subject, throwError } from "rxjs";
import { Router } from "@angular/router";
import { CookieService } from "ngx-cookie-service";

interface authData {
  Status: string;
  msg: string;
  token: string;
  matricule: string;
  tokenExpiration: number;
}

@Injectable()
export class AuthService {
  constructor(private http: HttpClient, private router: Router) {}
  // observateur sur le user
  user = new BehaviorSubject<user>(null);
  TokenExpirationTimer;

  logIn(matricule, password) {
    return this.http
      .post<authData>("http://localhost:3080/api/v1/SignIn", {
        Matricule: matricule,
        MotDePasse: password,
        tokenExpiration: "3h",
      })
      .pipe(
        tap((resData: authData) => {
          console.log("resdata " + resData.tokenExpiration);

          const expireDate = new Date(
            new Date().getTime() + resData.tokenExpiration * 60 * 60 * 1000
          );
          const u = new user(resData.matricule, resData.token, expireDate);
          this.user.next(u);
          this.autoLogOut(resData.tokenExpiration * 60 * 60 * 1000);
          localStorage.setItem("userData", JSON.stringify(u));
        })
      );
  }
  logOut() {
    this.user.next(null);
    this.router.navigate(["/auth"]);
    localStorage.removeItem("userData");
    this.TokenExpirationTimer && clearTimeout(this.TokenExpirationTimer);
    this.TokenExpirationTimer = null;
  }
  autoLogIn() {
    const userData: {
      matricule: string;
      _token: string;
      _tokenExpiration: Date;
    } = JSON.parse(localStorage.getItem("userData"));
    const loggedUser = new user(
      userData.matricule,
      userData._token,
      userData._tokenExpiration
    );
    if (!loggedUser.token) {
      return;
    }
    this.user.next(loggedUser);
    const remainingExpirationTime =
      new Date(userData._tokenExpiration).getTime() - new Date().getTime();
    this.autoLogOut(remainingExpirationTime);
    this.router.navigate(["/home"]);
  }
  autoLogOut(expirationTime: number) {
    this.TokenExpirationTimer = setTimeout(() => this.logOut(), expirationTime);
  }
}
