import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Router } from "@angular/router";
import { catchError, map } from "rxjs/operators";
import { throwError } from "rxjs";
import { AuthService } from "../authService.service";
@Component({
  selector: "ngx-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent {
  @ViewChild("matricule", { read: ElementRef }) matriculeElement: ElementRef;
  @ViewChild("password", { read: ElementRef }) passwordElement: ElementRef;
  Password: String;
  Matricule: number;
  ErrorMsg: String;
  submited = false;
  constructor(private router: Router, private authService: AuthService) {}
  matriculeFormat: boolean = true;
  checkFormat(data: string) {
    console.log(data);

    this.matriculeFormat = !!data.match(/[0-9]{4}/gm);
  }
  onSubmit(form: NgForm) {
    this.submited = true;
    this.Matricule = form.value.matricule;
    this.Password = form.value.password;

    /************************************* LogIN **************************************** */
    this.authService
      .logIn(this.Matricule, this.Password)
      .pipe(
        catchError((error) => {
          // Here you can handle the error (bad request) and retrieve the HTTP status code
          const statusCode = error.status;
          console.log(error);

          if (statusCode == 400) {
            this.ErrorMsg = error.error.message;
            this.ErrorMsg.includes("Login incorrect")
              ? this.matriculeElement.nativeElement.focus()
              : this.passwordElement.nativeElement.focus();
          }
          return throwError(error);
        })
      )
      .subscribe((res) => {
        this.router.navigate(["/pages/Home"]);
      });
  }
}
