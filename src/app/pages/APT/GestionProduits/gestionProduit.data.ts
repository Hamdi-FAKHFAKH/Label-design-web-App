//---------------------------------------------------  Produit Data --------------------------------------------------------------
export interface GetProduitResponseData {
  status: string;
  produits: ProduitData[];
}
export interface updateProduitResponseData {
  Status: string;
  numberOfAffectedRows: number;
  ProduitUpdated?: ProduitData;
}
export interface ProduitData {
  ref: string;
  ref1: string;
  ref2: string;
  nomProduit: string;
  numLot: string;
  codeFournisseur: string;
  codeClient: string;
  idEtiquette: string;
  idSN: string;
  formes: string;
  withDataMatrix: boolean;
  withSN: boolean;
  withOF: boolean;
  text1: string;
  text2: string;
  text3: string;
  text4: string;
  text5: string;
  createur: string;
  modificateur: string;
  createdAt?: string;
  updateAt?: string;
}
//---------------------------------------------------   SDTPRA Data --------------------------------------------------------------
export interface GetSDTPRAResponseData {
  status: string;
  SDTPRA: string[];
}
export interface SDTPRAResponseData {
  status: string;
  SDTPRA: string[];
}

//---------------------------------------------------  LotData --------------------------------------------------------------
export interface GetLotResponseData {
  status: string;
  lots: string[];
}
export interface LotData {
  numLot: string;
  format: string;
  desLot: string;
  createur: String;
  modificateur: string;
}
//---------------------------------------------------   Client Data --------------------------------------------------------------
export interface ClientData {
  codeClient: string;
  desClient: string;
  createur: string;
  modificateur: string;
}
export interface GetClientResponseData {
  status: string;
  client: Array<ClientDataResult>;
}
export interface UpdateClientResponseData {
  Status: string;
  numberOfAffectedRows: number;
  ClientUpdated: ClientDataResult;
}
export interface ClientDataResult {
  codeClient: string;
  desClient: string;
  createur: string;
  modificateur: string;
  createdAt: string;
  updatedAt: string;
}
// -------------------------------------------------- Fournisseur Data -------------------------------------------------------
export interface FournisseurData {
  codeFournisseur: string;
  desFournisseur: string;
  createur: string;
  modificateur: string;
}
export interface FournisseurResultData {
  codeFournisseur: string;
  desFournisseur: string;
  createur: string;
  modificateur: string;
  createdAt: string;
  updatedAt: string;
}
export interface GetFournisseurResultData {
  status: string;
  client: Array<FournisseurResultData>;
}
export interface UpdateFournisseurResultData {
  Status: string;
  numberOfAffectedRows: number;
  UtilisateurUpdated: FournisseurResultData;
}
// -------------------------------------------------- SerialNumber Data-------------------------------------------------------
export interface SerialNumberData {
  idSN: string;
  suffix: string;
  prefix: string;
  nbrCaractere: number;
  typeCompteur: string;
  pas: number;
  format: string;
  createur: string;
  modificateur: string;
  createdAt?: string;
  updateAt?: string;
}
export interface GetSerialNumberResultData {
  status: string;
  serialNumber: Array<SerialNumberData>;
}
