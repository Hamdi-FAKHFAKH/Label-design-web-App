import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import {
  CheckPassword,
  GetOneAtelierResultResponseData,
  GetOneUtilisateurResultResponseData,
  authData,
  updateUtilisateurResultData,
} from "./GestionUtilisateursHttp.data";
import { environment } from "../../environments/environment";

@Injectable()
export class GestionUtilisateursHttpService {
  constructor(private http: HttpClient) {}
  getOneUtilisateur(matricule: string) {
    return this.http.get<GetOneUtilisateurResultResponseData>(
      `${environment.apiUrl}/api/v1/utilisateurs/${matricule}`
    );
  }
  getAtelierName(id: string) {
    return this.http.get<GetOneAtelierResultResponseData>(
      `${environment.apiUrl}/api/v1/Ateliers/${id}`
    );
  }
  checkPassword(matricule: string, password: string) {
    return this.http.post<CheckPassword>(
      `${environment.apiUrl}/api/v1/checkPassword`,
      {
        matricule: matricule,
        motDePasse: password,
      }
    );
  }
  updateUtilisateur(matricule, obj) {
    return this.http.put<updateUtilisateurResultData>(
      `${environment.apiUrl}/api/v1/utilisateurs/${matricule}`,
      obj
    );
  }
}
