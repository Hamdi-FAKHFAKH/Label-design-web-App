import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import {
  FileDeleted,
  FileExist,
  GetOFResultData,
  GetOneOFResultData,
  PrintData,
} from "./impressionServiceData";
import { environment } from "../../../../environments/environment";

@Injectable()
export class ImpressionHttpService {
  constructor(private http: HttpClient) {}
  GetRefProduitByOF(ofnum) {
    return this.http.get<GetOneOFResultData>(
      `${environment.apiUrl}/api/v1/OFs/${ofnum}`
    );
  }
  GetAllOF() {
    return this.http.get<GetOFResultData>(`${environment.apiUrl}/api/v1/OFs`);
  }
  GetPrinterList() {
    return this.http.get<string[]>(`${environment.microServiceUrl}/printer`);
  }
  PrintLabel(obj: PrintData) {
    return this.http.post(`${environment.microServiceUrl}/print`, obj, {
      observe: "response",
    });
  }
  CheckFileExistence(path) {
    return this.http.get<FileExist>(`${environment.apiUrl}/api/v1/LabelFile`, {
      params: new HttpParams().set("path", path),
    });
  }
  DeleteFile(path) {
    return this.http.delete<FileDeleted>(
      `${environment.apiUrl}/api/v1/LabelFile`,
      { params: new HttpParams().set("path", path) }
    );
  }

  sendPdfFileToServer(formData) {
    return this.http.post(`${environment.apiUrl}/api/v1/LabelFile`, formData);
  }
}
