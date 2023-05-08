import { Component, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { NbWindowRef } from "@nebular/theme";
import { GestionProduitHttpService } from "../GestionProduitHttp.service";
import { GestionProduitService } from "../GestionProduit.service";
import { SerialNumberData } from "../GestionProduit.data";

@Component({
  selector: "ngx-update-produit",
  templateUrl: "./update-produit.component.html",
  styleUrls: ["./update-produit.component.scss"],
})
export class UpdateProduitComponent implements OnInit {
  formes: { id: string; name: string; path: string; clicked: boolean }[];
  addForme(id, name, path, clicked, index) {
    if (clicked) {
      this.formes[index] = { id: id, name: name, path: path, clicked: true };
    } else {
      this.formes[index] = { id: id, name: name, path: path, clicked: false };
    }
    console.log(this.gestionProduitService.formes);
  }
  windowdata;
  produits: String[] = [];
  lotData: string[] = [];
  refProd: string;

  constructor(
    public windowRef: NbWindowRef,
    private gestionProduitHttpService: GestionProduitHttpService,
    private gestionProduitService: GestionProduitService
  ) {}

  ngOnInit(): void {
    this.formes = this.gestionProduitService.formes;
    this.gestionProduitService.getFormes();
    this.gestionProduitHttpService.getSDTPRA().subscribe((res) => {
      this.produits = res.SDTPRA;
      // console.log(this.produits[0]);
    });
    this.gestionProduitHttpService.getLots().subscribe((res) => {
      for (const i in res.lots) {
        this.lotData.push(res.lots[i]);
      }
      console.log(this.lotData);
    });
    this.refProd = this.windowdata.ref;
  }
  close() {
    this.windowRef.close();
  }
  async onSubmit(form: NgForm) {
    let success = true;
    let idSN;
    let numLot: string;

    if (form.value.numLot) {
      numLot = form.value.numLot;
    }
    // créer un nouveau Format de lot
    if (form.value.newformatLot && form.value.newNumLot) {
      const res = await this.gestionProduitService.CreateLot(form.value);
      if (res) {
        numLot = form.value.newNumLot;
      }
    }
    if (form.value.formatLot) {
      numLot = form.value.formatLot;
    }
    if ((form.value.numLot || form.value.formatLot) && form.value.desLot) {
      this.gestionProduitService.UpdateLot(
        { desLot: form.value.desLot },
        form.value.numLot || form.value.formatLot
      );
    }
    // créer / vérifier l'existance d'un client
    if (form.value.codeClient) {
      success =
        (await this.gestionProduitService.AddClient(form.value)) && success;
    }
    // créer / vérifier l'existance d'un fournisseur
    if (form.value.codeFournisseur) {
      success =
        (await this.gestionProduitService.AddFournisseur(form.value)) &&
        success;
    }
    // add formes
    let formes = "";
    this.formes.map((val) => {
      if (val.clicked) {
        formes += val.id + ";";
      }
    });

    // update un produit
    if (success && this.windowdata.ref && form.value.nomProduit) {
      const idEtiquette = await (
        await this.gestionProduitHttpService
          .getOneProduit(this.windowdata.ref)
          .toPromise()
      ).produit.idEtiquette;
      success = await this.gestionProduitService.updateProduit(
        {
          ...form.value,
          ref: this.windowdata.ref,
          idEtiquette: idEtiquette || null,
        },
        this.windowdata.ref,
        numLot,
        this.windowdata.idSN,
        formes
      );
      success ? this.windowRef.close() : alert("Produit creation Failed");
    }
  }
}
