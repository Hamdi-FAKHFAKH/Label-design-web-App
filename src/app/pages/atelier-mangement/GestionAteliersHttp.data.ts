export interface AtelierData {
  Liecod: string;
  Libelle_Atelier: string;
  Unite_Production: string;
  createdAt?: string;
  updatedAt?: string;
}
export interface GetAllAteliersResultData {
  Status: string;
  Ateliers: AtelierData[];
}
export interface CreateAteliersResultData {
  Status: string;
  Atelier: AtelierData;
}
