import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { GetProduitResponseData } from "../GestionProduits/GestionProduit.data";
import {
  ComposentHttpData,
  EtiquetteData,
  GetEtiquetteResponseData,
} from "./EtiquetteHttp.data";
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
  CreateComopsent(obj: ComposentHttpData) {
    return this.http.post(`http://localhost:3080/api/v1/Composent`, obj);
  }
}
