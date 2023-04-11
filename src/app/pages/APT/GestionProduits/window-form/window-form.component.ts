import { Component, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { NbWindowRef } from "@nebular/theme";
import { GestionProduitService } from "../gestionProduit.service";

@Component({
  templateUrl: "./window-form.component.html",
  styleUrls: ["window-form.component.scss"],
})
export class WindowFormComponent implements OnInit {
  formes: { nom: string; class: string; clicked: boolean }[] = [
    {
      nom: "square",
      class: "",
      clicked: false,
    },
  ];
  proRef: String[] = [];
  lotData: string[] = [];
  constructor(
    public windowRef: NbWindowRef,
    private gestionProduitService: GestionProduitService
  ) {}

  ngOnInit(): void {
    this.gestionProduitService.getSDTPRA().subscribe((res) => {
      for (const i in res.SDTPRA) {
        this.proRef.push(res.SDTPRA[i]);
      }
    });
    this.gestionProduitService.getLots().subscribe((res) => {
      for (const i in res.lots) {
        this.lotData.push(res.lots[i]);
      }
      console.log(this.lotData);
    });
  }
  close() {
    this.windowRef.close();
  }
  onSubmit(form: NgForm) {
    console.log(form.value);
    // const lotData = {
    //   numLot: form.value.numLot ? form.value.numLot : null,
    //   format: form.value.formatLot ? form.value.formatLot : null,
    //   desLot: form.value.desLot ? form.value.desLot : null,
    // };7
    let numLot: string;
    if (form.value.numLot) {
      numLot = form.value.numLot;
    }
    if (form.value.newformatLot && form.value.newNumLot) {
      this.gestionProduitService
        .createLot({
          numLot: form.value.newNumLot,
          format: form.value.newformatLot,
          desLot: form.value.desLot || null,
          createur: null,
          modificateur: null,
        })
        .subscribe((res) => {
          console.log(res);

          this.windowRef.close();
        });
    }
    if (form.value.codeClient && form.value.desClient) {
      this.gestionProduitService.createClient({
        codeClient: form.value.codeClient,
        desClient: form.value.desClient,
        createur: null,
        modificateur: null,
      });
    }
    if (form.value.codeFournisseur && form.value.desFournisseur) {
      this.gestionProduitService.createClient({
        codeClient: form.value.codeClient,
        desClient: form.value.desClient,
        createur: null,
        modificateur: null,
      });
    }
  }
}
