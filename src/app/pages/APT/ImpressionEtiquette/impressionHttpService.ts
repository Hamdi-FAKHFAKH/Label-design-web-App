import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import {
  FileDeleted,
  FileExist,
  GetOFResultData,
  GetOneOFResultData,
  PrintData,
} from "./impressionServiceData";

@Injectable()
export class ImpressionHttpService {
  constructor(private http: HttpClient) {}
  GetRefProduitByOF(ofnum) {
    return this.http.get<GetOneOFResultData>(
      `http://localhost:3080/api/v1/OF/${ofnum}`
    );
  }
  GetAllOF() {
    return this.http.get<GetOFResultData>(`http://localhost:3080/api/v1/OF`);
  }
  GetPrinterList() {
    return this.http.get<string[]>(`https://localhost:5001/printer`);
  }
  PrintLabel(obj: PrintData) {
    return this.http.post(`https://localhost:5001/print`, obj, {
      observe: "response",
    });
  }
  CheckFileExistence(obj) {
    return this.http.post<FileExist>(
      `http://localhost:3080/api/v1/LabelFile/`,
      obj
    );
  }
  DeleteFile(obj) {
    return this.http.delete<FileDeleted>(
      `http://localhost:3080/api/v1/LabelFile/`,
      { body: obj }
    );
  }
}
