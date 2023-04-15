import { Injectable } from "@angular/core";
import { GestionProduitHttpService } from "./gestionProduitHttp.service";
import { v4 as uuidv4 } from "uuid";
@Injectable()
export class GestionProduitService {
  constructor(private gestionProduitHttpService: GestionProduitHttpService) {}
  AddProduit() {}

  async AddClient(data) {
    const client = await this.gestionProduitHttpService
      .getClient(data.codeClient)
      .toPromise();
    if (client.status == 204) {
      const createdClient = await this.gestionProduitHttpService
        .createClient({
          codeClient: data.codeClient,
          desClient: data.desClient || null,
          createur: null,
          modificateur: null,
        })
        .toPromise();
      console.log("client created " + createdClient);
      return !!createdClient;
    } else if (client.status == 200) {
      console.log("client Finded");
      const ClientUpdated = await this.gestionProduitHttpService
        .updateClient(data.codeClient, {
          codeClient: data.codeClient,
          desClient: data.desClient || null,
          createur: null,
          modificateur: null,
        })
        .toPromise();
      return !!ClientUpdated;
    } else {
      console.log("client Erreur");
      return false;
    }
  }

  async AddFournisseur(data) {
    const forn = await this.gestionProduitHttpService
      .getFournisseur(data.codeFournisseur)
      .toPromise();
    if (forn.status == 204) {
      const fornCreated = await this.gestionProduitHttpService
        .createFournisseur({
          codeFournisseur: data.codeFournisseur,
          desFournisseur: data.desFournisseur || null,
          createur: null,
          modificateur: null,
        })
        .toPromise();
      console.log("for created " + fornCreated.status);
      return !!fornCreated;
    } else if (forn.status == 200) {
      console.log("Forn Finded");
      const fornUpdated = await this.gestionProduitHttpService
        .updateFournisseur(data.codeFournisseur, {
          codeFournisseur: data.codeFournisseur,
          desFournisseur: data.desFournisseur || null,
          createur: null,
          modificateur: null,
        })
        .toPromise();
      return !!fornUpdated;
    } else {
      console.log("Forn Error");
      return false;
    }
  }

  async AddLot(data) {
    const res = await this.gestionProduitHttpService
      .createLot({
        numLot: data.newNumLot,
        format: data.newformatLot,
        desLot: data.desLot || null,
        createur: null,
        modificateur: null,
      })
      .toPromise();
    return !!res;
  }

  async AddSerialNumber(data, format) {
    const idSN: string = uuidv4();
    const res = await this.gestionProduitHttpService
      .getSerialNumber()
      .toPromise();
    for (const i in res.serialNumber) {
      if (res.serialNumber[i].format.localeCompare(format) == 0) {
        return res.serialNumber[i].idSN;
      }
    }
    const SN = await this.gestionProduitHttpService
      .createSerialNumber({
        idSN: idSN,
        suffix: data.suffix,
        prefix: data.prefix,
        nbrCaractere: parseFloat(data.nbrCaractere),
        typeCompteur: data.typeCompteur,
        createur: null,
        modificateur: null,
        pas: data.pas,
        format: format,
      })
      .toPromise();
    return idSN;
  }

  async CreateProduit(data, numLot, idSN) {
    const produit = await this.gestionProduitHttpService
      .createProduit({
        ref: data.ref,
        ref1: data.ref1 || null,
        ref2: data.ref2 || null,
        codeClient: data.codeClient || null,
        codeFournisseur: data.codeFournisseur || null,
        nomProduit: data.nomProduit,
        idEtiquette: null,
        formes: null,
        idSN: idSN || null,
        numLot: numLot || null,
        withDataMatrix: data.withDataMatrix || false,
        withOF: data.withOF || false,
        withSN: data.withSN || false,
        text1: data.text1,
        text2: data.text2,
        text3: data.text3,
        text4: data.text4,
        text5: data.text5,
        createur: null,
        modificateur: null,
      })
      .toPromise();
    return !!produit;
  }
  async updateProduit(data, id) {
    const produitUpdated = await this.gestionProduitHttpService
      .updateProduit(
        {
          ref: data.ref,
          ref1: data.ref1,
          ref2: data.ref2,
          codeClient: data.codeClient || null,
          codeFournisseur: data.codeFournisseur || null,
          nomProduit: data.nomProduit,
          idEtiquette: null,
          formes: null,
          idSN: data.withSN != "" && data.idSN ? data.idSN : null,
          numLot: data.numLot || null,
          withDataMatrix: data.withDataMatrix || false,
          withOF: data.withOF || false,
          withSN: data.withSN || false,
          text1: data.text1,
          text2: data.text2,
          text3: data.text3,
          text4: data.text4,
          text5: data.text5,
          createur: null,
          modificateur: null,
        },
        id
      )
      .toPromise();
    return !!produitUpdated;
  }
  async deleteProduit(id: string) {
    const res = await this.gestionProduitHttpService
      .deleteProduit(id)
      .toPromise();
    return !!res;
  }
}
