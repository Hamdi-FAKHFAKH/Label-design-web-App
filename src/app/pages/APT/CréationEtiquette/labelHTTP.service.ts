import { HttpClient } from "@angular/common/http";
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
@Injectable()
export class LabeltHttpService {
  constructor(private http: HttpClient) {}
  getAllProduitWithEtiquette() {
    return this.http.get<GetProduitResponseData>(
      "http://localhost:3080/api/v1/Produits/withEtiquette"
    );
  }
  CreateEtiquette(obj: EtiquetteData) {
    return this.http.post<EtiquetteData>(
      "http://localhost:3080/api/v1/etiquette",
      obj
    );
  }
  GetOneEtiquette(id: string) {
    return this.http.get<GetEtiquetteResponseData>(
      `http://localhost:3080/api/v1/etiquette/${id}`
    );
  }
  UpdateEtiquette(id: string, obj: EtiquetteData) {
    return this.http.put(`http://localhost:3080/api/v1/etiquette/${id}`, obj);
  }
  CreateComponent(obj: ComposentHttpData) {
    return this.http.post(`http://localhost:3080/api/v1/Composent`, obj);
  }
  deleteComponentsByEtiquette(id: string) {
    return this.http.delete(
      `http://localhost:3080/api/v1/composent/byEtiquette/${id}`
    );
  }
  GetAllComponentsByEtiquette(id: string) {
    return this.http.get<GetComposentResultData>(
      `http://localhost:3080/api/v1/composent/byEtiquette/${id}`
    );
  }
  GetOneComponent(id: string) {
    return this.http.get<GetOneComposentResultData>(
      `http://localhost:3080/api/v1/composent/${id}`
    );
  }
  GetAllTag() {
    return this.http.get<GetAllTagsResultData>(
      `http://localhost:3080/api/v1/tag`
    );
  }
}
