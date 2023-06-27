export interface GetHistoriqueProduitResponseResultData {
  Status: string;
  historiqueProduit: HistoriqueProduitData[];
}
export interface GetHistoriqueProduitByOperationResponseResultData {
  Status: string;
  historiqueProduit: HistoriqueProduitByOperationData[];
}
export interface HistoriqueProduitData {
  id?: string;
  refProd: string;
  operation: string;
  motif: string;
  data: string;
  userMatricule: string;
  updatedAt?: Date;
}
export interface HistoriqueProduitData {
  refProd: string;
  operation: string;
  motif: string;
  data: string;
  userMatricule: string;
}
export interface HistoriqueProduitByOperationData {
  total: number;
  operation: string;
  day: number;
  month: number;
  year: number;
}
export interface CreateHistoriqueProduitResultData {
  Status: string;
  historiqueProduit: HistoriqueProduitData;
}
