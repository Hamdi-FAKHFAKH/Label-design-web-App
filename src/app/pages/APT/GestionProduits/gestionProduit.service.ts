import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import {
  ClientData,
  LotCreateData,
  LotData,
  ProduitData,
  SDTPRAData,
} from "./gestionProduit.data";
import { map } from "rxjs/operators";

@Injectable()
export class GestionProduitService {
  constructor(private http: HttpClient) {}
  getAllProduits() {
    return this.http.get<ProduitData>(
      "http://localhost:3080/api/v1/Produits/allData"
    );
  }
  getSDTPRA() {
    return this.http.get<SDTPRAData>("http://localhost:3080/api/v1/SDTPRA");
  }
  getLots() {
    return this.http.get<LotData>("http://localhost:3080/api/v1/lot");
  }
  createLot(obj: LotCreateData) {
    return this.http.post<LotData>("http://localhost:3080/api/v1/lot", obj);
  }
  createClient(obj: ClientData) {
    return this.http.post<ClientData>(
      "http:/localhost:3080/api/v1/client",
      obj
    );
  }
  createFournisseur(obj: ClientData) {
    return this.http.post<ClientData>(
      "http:/localhost:3080/api/v1/client",
      obj
    );
  }
}
