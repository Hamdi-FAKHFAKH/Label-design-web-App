import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import {
  CreateHistoriqueProduitResultData,
  GetHistoriqueProduitResponseResultData,
  HistoriqueProduitData,
} from "./HistoriqueHttp.data";
import { environment } from "./../../environments/environment";

@Injectable()
export class ProductHistoriqueService {
  constructor(private http: HttpClient) {}
  getHistoriqueProduit(userMatricule: string) {
    return this.http.get<GetHistoriqueProduitResponseResultData>(
      `${environment.apiUrl}/api/v1/historiqueProduits`,
      {
        params: new HttpParams().set("userMatricule", userMatricule),
      }
    );
  }
  createHistoriqueProduit(obj: HistoriqueProduitData) {
    return this.http.post<CreateHistoriqueProduitResultData>(
      `${environment.apiUrl}/api/v1/historiqueProduits`,
      obj
    );
  }
}
