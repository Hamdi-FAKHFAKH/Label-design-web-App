import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import {
  EtiquetteImprimeeData,
  EtiquetteImprimeeResultData,
  GetEtiquetteImprimeeResultData,
} from "./detailImpressionHttp.data";

@Injectable()
export class DetailImpressionHttpService {
  constructor(private http: HttpClient) {}
  CreateEtiquetteImprimee(obj: EtiquetteImprimeeData) {
    return this.http.post<EtiquetteImprimeeResultData>(
      "http://localhost:3080/api/v1/etiquetteImprimee",
      obj
    );
  }
  GetALLEtiquettesImprimees() {
    return this.http.get<GetEtiquetteImprimeeResultData>(
      "http://localhost:3080/api/v1/etiquetteImprimee"
    );
  }
}
