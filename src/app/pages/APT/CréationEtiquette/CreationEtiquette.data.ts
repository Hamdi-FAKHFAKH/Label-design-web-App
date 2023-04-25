export interface EtiquetteData {
  id: string;
  id1: string;
  longeur: number;
  largeur: number;
  format: string;
  couleur: string;
  padding: number;
  createur: string;
  modificateur: string;
  createdAt?: Date;
  updatedAt?: Date;
}
export interface GetEtiquetteResponseData {
  Status: string;
  etiquette: EtiquetteData;
}
