import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import {
  EtiquetteImprimeeData,
  EtiquetteImprimeeResultData,
  GetEtiquetteImprimeeResultData,
  GetPrintDetailResultData,
  GetTotalNumberEtiquetteImprimeeByDayResultData,
  GetTotalNumberEtiquetteImprimeeByMonthResultData,
  GetTotalNumberEtiquetteImprimeeResultData,
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
  GetEtiquettesImprimeesByMonthYear(month, year) {
    return this.http.get<GetTotalNumberEtiquetteImprimeeResultData>(
      `${environment.apiUrl}/api/v1/etiquetteImprimees`,
      {
        params: new HttpParams().set("year", year).set("month", month),
      }
    );
  }
  GetEtiquettesImprimeesByMonth(year) {
    return this.http.get<GetTotalNumberEtiquetteImprimeeByMonthResultData>(
      `${environment.apiUrl}/api/v1/etiquetteImprimees`,
      {
        params: new HttpParams()
          .set("year", year)
          .set("month", true)
          // .set("action", "Réimpression"),
          .set("action", "impression"),
      }
    );
  }
  GetEtiquettesImprimeesByDay(year) {
    return this.http.get<GetTotalNumberEtiquetteImprimeeByDayResultData>(
      `${environment.apiUrl}/api/v1/etiquetteImprimees`,
      {
        params: new HttpParams()
          .set("year", year)
          .set("day", "true")
          // .set("action", "Réimpression"),
          .set("action", "impression"),
      }
    );
  }
  GetTotalEtiquettesImprimees() {
    return this.http.get<GetTotalNumberEtiquetteImprimeeByDayResultData>(
      `${environment.apiUrl}/api/v1/etiquetteImprimees`,
      {
        params: new HttpParams().set("count", true),
      }
    );
  }
  GetTotalEtiquettesRéimprimees() {
    return this.http.get<GetTotalNumberEtiquetteImprimeeByDayResultData>(
      `${environment.apiUrl}/api/v1/etiquetteImprimees`,
      {
        params: new HttpParams()
          .set("count", true)
          .set("action", "Réimpression"),
      }
    );
  }
  GetTotalEtiquettesRéimprimeesWithSN() {
    return this.http.get<GetTotalNumberEtiquetteImprimeeByDayResultData>(
      `${environment.apiUrl}/api/v1/etiquetteImprimees`,
      {
        params: new HttpParams()
          .set("count", true)
          .set("action", "Réimpression")
          .set("SN", true),
      }
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
