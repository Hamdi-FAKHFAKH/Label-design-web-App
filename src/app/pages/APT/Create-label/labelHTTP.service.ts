import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { GetProduitResponseData } from "../GestionProduits/GestionProduit.data";
import {
  ComposentHttpData,
  EtiquetteData,
  GetAllTagsResultData,
  GetComposentResultData,
  GetEtiquetteResponseData,
  GetOneComposentResultData,
} from "./labelHttp.data";
import { environment } from "../../../../environments/environment";
@Injectable()
export class LabeltHttpService {
  constructor(private http: HttpClient) {}
  getAllProduitWithEtiquette() {
    return this.http.get<GetProduitResponseData>(
      `${environment.apiUrl}/api/v1/Produits/`,
      { params: new HttpParams().set("withEtiquette", true) }
    );
  }
  CreateEtiquette(obj: EtiquetteData) {
    return this.http.post<EtiquetteData>(
      `${environment.apiUrl}/api/v1/etiquettes`,
      obj
    );
  }
  GetOneEtiquette(id: string) {
    return this.http.get<GetEtiquetteResponseData>(
      `${environment.apiUrl}/api/v1/etiquettes/${id}`
    );
  }
  UpdateEtiquette(id: string, obj: EtiquetteData) {
    return this.http.put(`${environment.apiUrl}/api/v1/etiquettes/${id}`, obj);
  }
  CreateComponent(obj: ComposentHttpData) {
    return this.http.post(`${environment.apiUrl}/api/v1/composents`, obj);
  }
  deleteComponentsByEtiquette(id: string) {
    return this.http.delete(`${environment.apiUrl}/api/v1/composents`, {
      params: new HttpParams().set("idEtiquette", id),
    });
  }
  GetAllComponentsByEtiquette(id: string) {
    return this.http.get<GetComposentResultData>(
      `${environment.apiUrl}/api/v1/composents`,
      { params: new HttpParams().set("idEtiquette", id) }
    );
  }
  GetOneComponent(id: string) {
    return this.http.get<GetOneComposentResultData>(
      `${environment.apiUrl}/api/v1/composents/${id}`
    );
  }
  GetAllTag() {
    return this.http.get<GetAllTagsResultData>(
      `${environment.apiUrl}/api/v1/tags`
    );
  }
}
