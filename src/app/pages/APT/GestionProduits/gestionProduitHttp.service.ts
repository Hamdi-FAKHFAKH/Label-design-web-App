import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import {
  ClientData,
  FournisseurData,
  LotData,
  GetLotResponseData,
  GetSDTPRAResponseData,
  SerialNumberData,
  ProduitData,
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
  GetAllProduitDataResponseData,
} from "./GestionProduit.data";
import { environment } from "../../../../environments/environment.development";

@Injectable()
export class GestionProduitHttpService {
  constructor(private http: HttpClient) {}
  /**************************************************** Produit ***************************************************** */
  getAllProduits() {
    return this.http.get<GetAllProduitDataResponseData>(
      `${environment.apiUrl}/api/v1/Produits/allData`
    );
  }
  createProduit(obj: ProduitData) {
    return this.http.post<ProduitData>(
      `${environment.apiUrl}/api/v1/Produits`,
      obj
    );
  }
  updateProduit(obj: ProduitData, id: string) {
    console.log(`obj to update` + obj.ref);

    return this.http.put<updateProduitResponseData>(
      `${environment.apiUrl}/api/v1/Produits/${id}`,
      obj
    );
  }
  deleteProduit(id: string) {
    return this.http.delete<updateProduitResponseData>(
      `${environment.apiUrl}/api/v1/Produits/${id}`
    );
  }
  getOneProduit(id: string) {
    return this.http.get<getOneProduitResponseData>(
      `${environment.apiUrl}/api/v1/Produits/${id}`
    );
  }
  /****************************************************** SDTPRA ***************************************************************/
  getSDTPRA() {
    return this.http.get<GetSDTPRAResponseData>(
      `${environment.apiUrl}/api/v1/SDTPRAs`
    );
  }
  /***************************************************** Lot ******************************************************************/
  getLots() {
    return this.http.get<GetLotResponseData>(
      `${environment.apiUrl}/api/v1/lots`
    );
  }
  createLot(obj: LotData) {
    return this.http.post<GetOneLotResponseData>(
      `${environment.apiUrl}/api/v1/lots`,
      obj
    );
  }
  updateLot(obj: LotData, id: string) {
    return this.http.put<UpdateLotResponseData>(
      `${environment.apiUrl}/api/v1/lots/${id}`,
      obj
    );
  }
  getOneLot(id: string) {
    return this.http.get<GetOneLotResponseData>(
      `${environment.apiUrl}/api/v1/lots/${id}`
    );
  }
  /****************************************************** Client *************************************************************/
  createClient(obj: ClientData) {
    return this.http.post<ClientData>(
      `${environment.apiUrl}/api/v1/clients`,
      obj
    );
  }
  getClient(idClient: string) {
    return this.http.get<GetClientResponseData>(
      `${environment.apiUrl}/api/v1/clients/${idClient}`,
      {
        observe: `response`,
      }
    );
  }
  updateClient(idClient: string, obj: ClientData) {
    return this.http.put<GetClientResponseData>(
      `${environment.apiUrl}/api/v1/clients/${idClient}`,
      obj,
      {
        observe: `response`,
      }
    );
  }
  /******************************************************* Fournisseur ******************************************************* */
  createFournisseur(obj: FournisseurData) {
    return this.http.post<GetFournisseurResultData>(
      `${environment.apiUrl}/api/v1/fournisseurs`,
      obj,
      {
        observe: `response`,
      }
    );
  }
  getFournisseur(idFournisseur: string) {
    return this.http.get<GetFournisseurResultData>(
      `${environment.apiUrl}/api/v1/fournisseurs/${idFournisseur}`,
      {
        observe: `response`,
      }
    );
  }
  updateFournisseur(idFournisseur: string, obj: FournisseurData) {
    return this.http.put<GetFournisseurResultData>(
      `${environment.apiUrl}/api/v1/fournisseurs/${idFournisseur}`,
      obj,
      {
        observe: `response`,
      }
    );
  }
  /************************************************************* SerialNumber ***************************************************/
  createSerialNumber(obj: SerialNumberData) {
    return this.http.post<FournisseurData>(
      `${environment.apiUrl}/api/v1/serialNumbers`,
      obj
    );
  }
  getSerialNumber() {
    return this.http.get<GetSerialNumberResultData>(
      `${environment.apiUrl}/api/v1/serialNumbers`
    );
  }
  getOneSerialNumber(id: string) {
    return this.http.get<GetOneSerialNumberResultData>(
      `${environment.apiUrl}/api/v1/serialNumbers/${id}`
    );
  }
  createForm(obj: FormeData) {
    return this.http.post<CreateFormeResultData>(
      `${environment.apiUrl}/api/v1/forms`,
      obj
    );
  }
  getForms() {
    return this.http.get<GetFormeResultData>(
      `${environment.apiUrl}/api/v1/forms`
    );
  }
  getOneForm(id: string) {
    return this.http.get<CreateFormeResultData>(
      `${environment.apiUrl}/api/v1/forms/${id}`
    );
  }
}
