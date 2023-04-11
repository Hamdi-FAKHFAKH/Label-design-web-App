export interface ProduitData {
  status: string;
  produits: string[];
}
export interface SDTPRAData {
  status: string;
  SDTPRA: string[];
}
export interface LotData {
  status: string;
  lots: string[];
}
export interface LotCreateData {
  numLot: string;
  format: string;
  desLot: string;
  createur: String;
  modificateur: string;
}
export interface ClientData {
  codeClient: string;
  desClient: string;
  createur: string;
  modificateur: string;
}
export interface FournisseurData {
  codeFournisseur: string;
  desFournisseur: string;
  createur: string;
  modificateur: string;
}
