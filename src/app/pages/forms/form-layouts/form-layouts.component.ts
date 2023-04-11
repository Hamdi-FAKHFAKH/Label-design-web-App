import { Component, OnInit } from "@angular/core";

@Component({
  selector: "ngx-form-layouts",
  styleUrls: ["./form-layouts.component.scss"],
  templateUrl: "./form-layouts.component.html",
})
export class FormLayoutsComponent implements OnInit {
  matriculeblur: boolean;
  passwordblur: boolean;
  password: String;
  matricule: number;
  matriculeValid() {
    return this.matriculeblur && this.matricule && this.matricule === 12345;
  }
  ngOnInit(): void {
    this.matriculeblur = false;
  }
}
