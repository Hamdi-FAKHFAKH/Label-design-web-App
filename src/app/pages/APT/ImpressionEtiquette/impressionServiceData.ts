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
export interface PrintData {
  copies: number;
  filePath: string;
  printerName: string;
}
export interface FileExist {
  exist: boolean;
  message: string;
}
export interface FileDeleted {
  deleted: boolean;
  message: string;
}
