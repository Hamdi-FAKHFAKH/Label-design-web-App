import { Interface } from "readline";

export interface UtilisateurData {
  matricule: string;
  nom: string;
  prenom: string;
  role: string;
  atelierLiecod: string;
  statut: boolean;
  nomPC: string;
  créateur: string;
  modificateur: string;
  superUser: string;
  imgData: string;
  createdAt?: Date;
  updatedAt?: Date;
  UAP;
}
export interface GetAllUtilisateurResultData {
  Status: string;
  utilisateur: UtilisateurData[];
}
export interface GetAllUAPs {
  Status: string;
  UAPs: { Unite_Production: string }[];
}
export interface GetAllAtelierName {
  Status: string;
  ateliers: { Libelle_Atelier: string; Liecod: string }[];
}
export interface CreateUtilisateurResultData {
  Status: string;
  utilisateur: UtilisateurData;
}
export interface UpdateUtilisateurResultData {
  Status: string;
  numberOfAffectedRows: number;
  UtilisateurUpdated: UtilisateurData;
}
