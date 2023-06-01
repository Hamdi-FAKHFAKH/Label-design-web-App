import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import {
  CreateHistoriqueProduitResultData,
  GetHistoriqueProduitResponseResultData,
  HistoriqueProduitData,
} from "./HistoriqueHttp.data";

@Injectable()
export class HistoriqueService {
  constructor(private http: HttpClient) {}
  getHistoriqueProduit(userMatricule: string) {
    return this.http.get<GetHistoriqueProduitResponseResultData>(
      `http://localhost:3080/api/v1/historiqueProduit/userMatricule/${userMatricule}`
    );
  }
  createHistoriqueProduit(obj: HistoriqueProduitData) {
    return this.http.post<CreateHistoriqueProduitResultData>(
      "http://localhost:3080/api/v1/historiqueProduit",
      obj
    );
  }
}
