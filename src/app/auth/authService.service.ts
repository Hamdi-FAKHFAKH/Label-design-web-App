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
  constructor(private http: HttpClient, private router: Router) {
    this.avatarColor =
      this.colorsAvatarProfil[this.between(0, this.colorsAvatarProfil.length)];
  }
  // observateur sur le user
  user = new BehaviorSubject<user>(null);
  TokenExpirationTimer;
  avatarColor;

  logIn(matricule, password) {
    return this.http
      .post<authData>("http://localhost:3080/api/v1/SignIn", {
        matricule: matricule,
        motDePasse: password,
      })
      .pipe(
        tap((resData: authData) => {
          console.log("resdata " + resData.tokenExpiration);

          const expireDate = new Date(
            new Date().getTime() + resData.tokenExpiration * 60 * 60 * 1000
          );
          console.log(matricule);

          const u = new user(matricule, resData.token, expireDate);
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
    console.log(userData.matricule);

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
  colorsAvatarProfil = [
    {
      backgroundColor: "#008080",
      forgroundColor: this.getContrastTextColor("#008080"),
    },
    {
      backgroundColor: "#4569af",
      foregroundColor: this.getContrastTextColor("#4569af"),
    },
    {
      backgroundColor: "#d95749",
      foregroundColor: this.getContrastTextColor("#d95749"),
    },
    {
      backgroundColor: "#98c1d9",
      foregroundColor: this.getContrastTextColor("#98c1d9"),
    },
    {
      backgroundColor: "#ec8c4f",
      foregroundColor: this.getContrastTextColor("#ec8c4f"),
    },
    {
      backgroundColor: "#ff7373",
      foregroundColor: this.getContrastTextColor("#ff7373"),
    },
  ];
  getContrastTextColor(hexColor) {
    function hexToRgb(hex) {
      var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
      hex = hex.replace(shorthandRegex, function (_, r, g, b) {
        return r + r + g + g + b + b;
      });
      var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result
        ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16),
          }
        : null;
    }
    var color = hexToRgb(hexColor);
    var brightness = (color.r * 299 + color.g * 587 + color.b * 114) / 1000;
    return brightness >= 128 ? "#000000" : "#FFFFFF";
  }
  between(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
  }
  generateAvatar(
    text: string,
    foregroundColor = "white",
    backgroundColor = "black"
  ) {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    canvas.width = 220;
    canvas.height = 220;

    // Draw background
    context.fillStyle = backgroundColor;
    context.fillRect(0, 0, canvas.width, canvas.height);

    // Draw text
    context.font = "bold 100px Assistant";
    context.fillStyle = foregroundColor;
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText(
      text.toString().toUpperCase(),
      canvas.width / 2,
      canvas.height / 2
    );

    return canvas.toDataURL("image/png");
  }
}
