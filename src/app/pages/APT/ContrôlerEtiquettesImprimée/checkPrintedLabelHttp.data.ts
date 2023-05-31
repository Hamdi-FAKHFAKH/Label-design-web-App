export interface HistoriqueVérificationEtiquette {
  id?: string;
  problemId: number;
  dataMatrixData: string;
  userMatricule: string;
}
export interface GetOneHistoriqueVérificationEtiquetteResultData {
  Status: string;
  historiqueProduit: HistoriqueVérificationEtiquette;
}
