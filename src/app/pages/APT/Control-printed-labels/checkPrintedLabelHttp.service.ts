import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import {
  GetOneHistoriqueVérificationEtiquetteResultData,
  HistoriqueVérificationEtiquette,
} from "./checkPrintedLabelHttp.data";
import { environment } from "../../../../environments/environment.development";

@Injectable()
export class CheckPrintedLabelHttp {
  constructor(private http: HttpClient) {}
  createVerificationEtiquette(obj: HistoriqueVérificationEtiquette) {
    return this.http.post<GetOneHistoriqueVérificationEtiquetteResultData>(
      `${environment.apiUrl}/api/v1/historiqueVerificationEtiquettes`,
      obj
    );
  }
}
