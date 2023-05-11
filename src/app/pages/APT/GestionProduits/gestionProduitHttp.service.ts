import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import {
  ClientData,
  FournisseurData,
  LotData,
  GetLotResponseData,
  GetProduitResponseData,
  GetSDTPRAResponseData,
  SerialNumberData,
  ProduitData,
  ClientDataResult,
  FournisseurResultData,
  GetClientResponseData,
  GetFournisseurResultData,
  GetSerialNumberResultData,
  updateProduitResponseData,
  UpdateLotResponseData,
  getOneProduitResponseData,
  GetOneSerialNumberResultData,
  FormeData,
  CreateFormeResultData,
  GetFormeResultData,
  GetOneLotResponseData,
} from "./GestionProduit.data";

@Injectable()
export class GestionProduitHttpService {
  constructor(private http: HttpClient) {}
  /**************************************************** Produit ***************************************************** */
  getAllProduits() {
    return this.http.get<GetProduitResponseData>(
      "http://localhost:3080/api/v1/Produits/allData"
    );
  }
  createProduit(obj: ProduitData) {
    return this.http.post<ProduitData>(
      "http://localhost:3080/api/v1/Produits",
      obj
    );
  }
  updateProduit(obj: ProduitData, id: string) {
    console.log("obj to update" + obj.ref);

    return this.http.put<updateProduitResponseData>(
      `http://localhost:3080/api/v1/Produits/${id}`,
      obj
    );
  }
  deleteProduit(id: string) {
    return this.http.delete<updateProduitResponseData>(
      `http://localhost:3080/api/v1/Produits/${id}`
    );
  }
  getOneProduit(id: string) {
    return this.http.get<getOneProduitResponseData>(
      `http://localhost:3080/api/v1/Produits/${id}`
    );
  }
  /****************************************************** SDTPRA ***************************************************************/
  getSDTPRA() {
    return this.http.get<GetSDTPRAResponseData>(
      "http://localhost:3080/api/v1/SDTPRA"
    );
  }
  /***************************************************** Lot ******************************************************************/
  getLots() {
    return this.http.get<GetLotResponseData>(
      "http://localhost:3080/api/v1/lot"
    );
  }
  createLot(obj: LotData) {
    return this.http.post<GetLotResponseData>(
      "http://localhost:3080/api/v1/lot",
      obj
    );
  }
  updateLot(obj: LotData, id: string) {
    return this.http.put<UpdateLotResponseData>(
      `http://localhost:3080/api/v1/lot/${id}`,
      obj
    );
  }
  getOneLot(id: string) {
    return this.http.get<GetOneLotResponseData>(
      `http://localhost:3080/api/v1/lot/${id}`
    );
  }
  /****************************************************** Client *************************************************************/
  createClient(obj: ClientData) {
    return this.http.post<ClientData>(
      "http://localhost:3080/api/v1/client",
      obj
    );
  }
  getClient(idClient: string) {
    return this.http.get<GetClientResponseData>(
      `http://localhost:3080/api/v1/client/${idClient}`,
      {
        observe: "response",
      }
    );
  }
  updateClient(idClient: string, obj: ClientData) {
    return this.http.put<GetClientResponseData>(
      `http://localhost:3080/api/v1/client/${idClient}`,
      obj,
      {
        observe: "response",
      }
    );
  }
  /******************************************************* Fournisseur ******************************************************* */
  createFournisseur(obj: FournisseurData) {
    return this.http.post<GetFournisseurResultData>(
      "http://localhost:3080/api/v1/fournisseur",
      obj,
      {
        observe: "response",
      }
    );
  }
  getFournisseur(idFournisseur: string) {
    return this.http.get<GetFournisseurResultData>(
      `http://localhost:3080/api/v1/fournisseur/${idFournisseur}`,
      {
        observe: "response",
      }
    );
  }
  updateFournisseur(idFournisseur: string, obj: FournisseurData) {
    return this.http.put<GetFournisseurResultData>(
      `http://localhost:3080/api/v1/fournisseur/${idFournisseur}`,
      obj,
      {
        observe: "response",
      }
    );
  }
  /************************************************************* SerialNumber ***************************************************/
  createSerialNumber(obj: SerialNumberData) {
    return this.http.post<FournisseurData>(
      "http://localhost:3080/api/v1/serialNumber",
      obj
    );
  }
  getSerialNumber() {
    return this.http.get<GetSerialNumberResultData>(
      "http://localhost:3080/api/v1/serialNumber"
    );
  }
  getOneSerialNumber(id: string) {
    return this.http.get<GetOneSerialNumberResultData>(
      `http://localhost:3080/api/v1/serialNumber/${id}`
    );
  }
  createForm(obj: FormeData) {
    return this.http.post<CreateFormeResultData>(
      "http://localhost:3080/api/v1/forms",
      obj
    );
  }
  getForms() {
    return this.http.get<GetFormeResultData>(
      "http://localhost:3080/api/v1/forms"
    );
  }
  getOneForm(id: string) {
    return this.http.get<CreateFormeResultData>(
      `http://localhost:3080/api/v1/forms/${id}`
    );
  }
}
