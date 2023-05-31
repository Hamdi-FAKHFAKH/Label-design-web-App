export interface GetHistoriqueProduitResponseResultData {
  Status: string;
  historiqueProduit: HistoriqueProduitData[];
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
