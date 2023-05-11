import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable()
export class ImpressionService {
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
    return this.http.get(`https://localhost:5001/printer`);
  }
}
export interface GetOneOFResultData {
  Status: string;
  of: OFHttpData;
}
export interface GetOFResultData {
  Status: string;
  of: OFHttpData[];
}
export interface OFHttpData {
  ofnum: string;
  proref: string;
  liecod: string;
  createdAt: string;
  updatedAt: string;
}
