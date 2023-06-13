import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import {
  CreateAteliersResultData,
  GetAllAteliersResultData,
} from "./GestionAteliersHttp.data";
import { AtelierData } from "../GestionUtilisateursHttp.data";
@Injectable({ providedIn: "root" })
export class GestionAteliersHttpService {
  constructor(private http: HttpClient) {}
  getAllAteliers() {
    return this.http.get<GetAllAteliersResultData>(
      `${environment.apiUrl}/api/v1/Ateliers`
    );
  }
  createAtelier(obj: AtelierData) {
    return this.http.post<CreateAteliersResultData>(
      `${environment.apiUrl}/api/v1/Ateliers`,
      obj
    );
  }
  removeAtelier(Liecod: string) {
    return this.http.delete<CreateAteliersResultData>(
      `${environment.apiUrl}/api/v1/Ateliers/${Liecod}`
    );
  }
  updateAtelier(obj: AtelierData, Liecod: string) {
    return this.http.put<CreateAteliersResultData>(
      `${environment.apiUrl}/api/v1/Ateliers/${Liecod}`,
      obj
    );
  }
}
