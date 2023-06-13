import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import {
  EtiquetteImprimeeData,
  EtiquetteImprimeeResultData,
  GetEtiquetteImprimeeResultData,
  GetPrintDetailResultData,
  UpdateEtiquetteImprimeeResultData,
} from "./detailImpressionHttp.data";
import { environment } from "../../../../environments/environment";

@Injectable()
export class DetailImpressionHttpService {
  constructor(private http: HttpClient) {}
  CreateEtiquetteImprimee(obj: EtiquetteImprimeeData) {
    return this.http.post<EtiquetteImprimeeResultData>(
      `${environment.apiUrl}/api/v1/etiquetteImprimees`,
      obj
    );
  }
  UpdateEtiquetteImprimee(obj: EtiquetteImprimeeData, id: string) {
    return this.http.put<UpdateEtiquetteImprimeeResultData>(
      `${environment.apiUrl}/api/v1/etiquetteImprimees/${id}`,
      obj
    );
  }
  GetALLEtiquettesImprimees() {
    return this.http.get<GetEtiquetteImprimeeResultData>(
      `${environment.apiUrl}/api/v1/etiquetteImprimees`
    );
  }
  GetALLEtiquettesByOF(ofnum: string) {
    return this.http.get<GetEtiquetteImprimeeResultData>(
      `${environment.apiUrl}/api/v1/etiquetteImprimees`,
      { params: new HttpParams().set(`numOF`, ofnum) }
    );
  }
  GetPrintDetail() {
    return this.http.get<GetPrintDetailResultData>(
      `${environment.apiUrl}/api/v1/etiquetteImprimees/printDetail`
    );
  }
}
