import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import {
  GetOneHistoriqueVérificationEtiquetteResultData,
  HistoriqueVérificationEtiquette,
} from "./checkPrintedLabelHttp.data";

@Injectable()
export class CheckPrintedLabelHttp {
  constructor(private http: HttpClient) {}
  createVérificationEtiquette(obj: HistoriqueVérificationEtiquette) {
    return this.http.post<GetOneHistoriqueVérificationEtiquetteResultData>(
      `http://localhost:3080/api/v1/historiqueVerificationEtiquette`,
      obj
    );
  }
}
