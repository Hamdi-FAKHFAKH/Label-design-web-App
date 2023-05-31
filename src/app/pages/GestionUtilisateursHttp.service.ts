import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import {
  CheckPassword,
  GetOneAtelierResultResponseData,
  GetOneUtilisateurResultResponseData,
  authData,
  updateUtilisateurResultData,
} from "./GestionUtilisateursHttp.data";

@Injectable()
export class GestionUtilisateursHttpService {
  constructor(private http: HttpClient) {}
  getOneUtilisateur(matricule: string) {
    return this.http.get<GetOneUtilisateurResultResponseData>(
      `http://localhost:3080/api/v1/utilisateur/${matricule}`
    );
  }
  getAtelierName(id: string) {
    return this.http.get<GetOneAtelierResultResponseData>(
      `http://localhost:3080/api/v1/Atelier/${id}`
    );
  }
  checkPassword(matricule: string, password: string) {
    return this.http.post<CheckPassword>(
      "http://localhost:3080/api/v1/checkPassword",
      {
        matricule: matricule,
        motDePasse: password,
      }
    );
  }
  updateUtilisateur(matricule, password) {
    return this.http.put<updateUtilisateurResultData>(
      `http://localhost:3080/api/v1/utilisateur/${matricule}`,
      {
        motDePasse: password,
      }
    );
  }
}
