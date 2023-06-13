import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import {
  CreateUtilisateurResultData,
  GetAllAtelierName,
  GetAllUAPs,
  GetAllUtilisateurResultData,
  UpdateUtilisateurResultData,
} from "./userHttp.data";
import { UtilisateurData } from "../GestionUtilisateursHttp.data";

@Injectable({ providedIn: "root" })
export class UserHttpService {
  constructor(private http: HttpClient) {}
  getAllUtilisateurs() {
    return this.http.get<GetAllUtilisateurResultData>(
      `${environment.apiUrl}/api/v1/utilisateurs`
    );
  }
  getAllUAPs() {
    return this.http.get<GetAllUAPs>(
      `${environment.apiUrl}/api/v1/Ateliers/UAP`
    );
  }
  getAllAtelierName(uap: string) {
    return this.http.get<GetAllAtelierName>(
      `${environment.apiUrl}/api/v1/Ateliers/Libelle_Atelier`,
      { params: new HttpParams().set("Unite_Production", uap) }
    );
  }
  createUtilisateur(obj: UtilisateurData) {
    return this.http.post<CreateUtilisateurResultData>(
      `${environment.apiUrl}/api/v1/utilisateurs`,
      obj
    );
  }
  deleteUtilisateur(matricule) {
    return this.http.delete<CreateUtilisateurResultData>(
      `${environment.apiUrl}/api/v1/utilisateurs/${matricule}`
    );
  }
  updateUtilisateur(matricule: string, obj: UtilisateurData) {
    return this.http.put<UpdateUtilisateurResultData>(
      `${environment.apiUrl}/api/v1/utilisateurs/${matricule}`,
      obj
    );
  }
}
