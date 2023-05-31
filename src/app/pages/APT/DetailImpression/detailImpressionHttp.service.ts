import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import {
  EtiquetteImprimeeData,
  EtiquetteImprimeeResultData,
  GetEtiquetteImprimeeResultData,
  GetPrintDetailResultData,
  UpdateEtiquetteImprimeeResultData,
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
  UpdateEtiquetteImprimee(obj: EtiquetteImprimeeData, id: string) {
    return this.http.put<UpdateEtiquetteImprimeeResultData>(
      `http://localhost:3080/api/v1/etiquetteImprimee/${id}`,
      obj
    );
  }
  GetALLEtiquettesImprimees() {
    return this.http.get<GetEtiquetteImprimeeResultData>(
      "http://localhost:3080/api/v1/etiquetteImprimee"
    );
  }
  GetALLEtiquettesByOF(ofnum: string) {
    return this.http.get<GetEtiquetteImprimeeResultData>(
      `http://localhost:3080/api/v1/etiquetteImprimee/findByOF/${ofnum}`
    );
  }
  GetALLEtiquettesByQRcode(qrcodeData: string) {
    return this.http.post<GetEtiquetteImprimeeResultData>(
      `http://localhost:3080/api/v1/etiquetteImprimee/findByQrcode`,
      { qrcodeData: qrcodeData }
    );
  }
  GetPrintDetail() {
    return this.http.get<GetPrintDetailResultData>(
      "http://localhost:3080/api/v1/etiquetteImprimee/printDetail"
    );
  }
}
