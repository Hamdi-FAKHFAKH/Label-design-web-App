export interface UtilisateurData {
  matricule: string;
  nom: string;
  prenom: string;
  roles: string;
  nomPC: string;
  superUser: string;
  atelierLiecod: string;
  statut: boolean;
}
export interface GetOneUtilisateurResultResponseData {
  Status: string;
  utilisateur: UtilisateurData;
}
export interface GetOneAtelierResultResponseData {
  Status: string;
  Atelier: AtelierData;
}
export interface AtelierData {
  Liecod: string;
  Libelle_Atelier: string;
  Unite_Production: string;
}
export interface authData {
  Status: string;
  msg: string;
  token: string;
  matricule: string;
  tokenExpiration: number;
}
export interface updateUtilisateurResultData {
  Status: string;
  numberOfAffectedRows: number;
  UtilisateurUpdated: UtilisateurData;
}
export interface CheckPassword {
  Status: string;
  msg: string;
}
