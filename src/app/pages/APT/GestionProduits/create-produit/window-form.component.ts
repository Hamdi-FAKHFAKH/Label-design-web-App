import { Component, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { NbWindowRef } from "@nebular/theme";
import { GestionProduitHttpService } from "../GestionProduitHttp.service";
import { saveAs } from "file-saver";
import { Observable, forkJoin } from "rxjs";
import { GestionProduitService } from "../GestionProduit.service";
import { SerialNumberData } from "../GestionProduit.data";
import { v4 as uuidv4 } from "uuid";
@Component({
  templateUrl: "./window-form.component.html",
  styleUrls: ["window-form.component.scss"],
})
export class WindowFormComponent implements OnInit {
  formes: { id: string; name: string; path: string; clicked: boolean }[];
  addForme(id, name, path, clicked, index) {
    if (clicked) {
      this.formes[index] = { id: id, name: name, path: path, clicked: true };
    } else {
      this.formes[index] = { id: id, name: name, path: path, clicked: false };
    }
    console.log(this.gestionProduitService.formes);
  }
  produits: String[] = [];
  lotData: string[] = [];
  SerialNumberData: SerialNumberData[];
  selectedSerialNumber: SerialNumberData;
  addNewSerialNumber: boolean;
  format;
  constructor(
    public windowRef: NbWindowRef,
    private gestionProduitHttpService: GestionProduitHttpService,
    private gestionProduitService: GestionProduitService
  ) {}

  async ngOnInit() {
    this.gestionProduitService.formes.map((val) => {
      val.clicked = false;
    });
    this.formes = this.gestionProduitService.formes;
    const { SDTPRA } = await this.gestionProduitHttpService
      .getSDTPRA()
      .toPromise();
    this.produits = SDTPRA;
    this.gestionProduitHttpService.getLots().subscribe((res) => {
      for (const i in res.lots) {
        this.lotData.push(res.lots[i]);
      }
      console.log(this.lotData);
    });
    this.gestionProduitHttpService.getSerialNumber().subscribe((res) => {
      this.SerialNumberData = res.serialNumber;
    });
    this.addNewSerialNumber = false;
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
    // créer un SerialNumber
    if (
      form.value.withSN &&
      form.value.prefix &&
      form.value.suffix &&
      form.value.nbrCaractere &&
      form.value.typeCompteur &&
      form.value.pas &&
      this.addNewSerialNumber
    ) {
      this.format =
        form.value.prefix +
        "-" +
        form.value.suffix +
        `{NC : ${form.value.nbrCaractere}}` +
        `{Type : ${form.value.typeCompteur}}` +
        `{pas : ${form.value.pas}}`;
      // console.log("ddddd{{nc:20}}sdds".split(/[\{\}]+/));

      idSN = await this.gestionProduitService.AddSerialNumber(
        form.value,

        this.format
      );
    }
    if (!this.addNewSerialNumber && form.value.FormatSN) {
      idSN = this.selectedSerialNumber.idSN;
    }
    // vérifier si produit déja créer
    const prod = await this.gestionProduitHttpService
      .getAllProduits()
      .toPromise();
    for (const p in prod.produits) {
      if (prod.produits[p]["ref"] == form.value.ref) {
        alert("Produit existe déja");
        success = false;
      }
    }
    //add formes
    let formes = "";
    this.formes.map((val) => {
      if (val.clicked) {
        formes += val.id + ";";
      }
    });
    // créer un produit
    if (success && form.value.ref && form.value.nomProduit) {
      success = await this.gestionProduitService.CreateProduit(
        form.value,
        numLot,
        idSN,
        formes
      );
      success ? this.windowRef.close() : alert("Produit creation Failed");
    }
  }
  SelectSn(val) {
    this.selectedSerialNumber = this.SerialNumberData[val];
  }
  addSN(event) {
    this.addNewSerialNumber = event.target.checked;
    console.log(event.target.checked);
    console.log(this.selectedSerialNumber);
  }
  getBase641 = (e) => {
    var file = e.target.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      /** ******* console ********** */
      console.log("name");
      console.log(e.target.files[0]);
      console.log(reader.result.toString());
      this.gestionProduitHttpService
        .createForm({
          id: uuidv4(),
          name: e.target.files[0].name.substring(
            0,
            e.target.files[0].name.indexOf(".")
          ),
          clicked: false,
          path: reader.result.toString(),
        })
        .toPromise()
        .then((val) => {
          console.log("image saved");
          // this.gestionProduitService.formes.push({
          //   name: e.target.files[0].name.substring(
          //     0,
          //     e.target.files[0].name.indexOf(".")
          //   ),
          //   clicked: false,
          //   path: reader.result.toString(),
          // });
          this.gestionProduitService.getFormes();
        })
        .catch((e) => {
          alert("Icon déja existe");
        });
    };
    reader.onerror = function (error) {
      console.log("Error: ", error);
    };
  };
}
