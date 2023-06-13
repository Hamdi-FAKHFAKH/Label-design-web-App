//---------------------------------------------------  Produit Data --------------------------------------------------------------
export interface GetProduitResponseData {
  status: string;
  produits: ProduitData[];
}

export interface AllProduitData {
  codeClient: string;
  desClient: string;
  desFournisseur: string;
  formatLot: string;
  desLot: string;
  ref: string;
  nomProduit: string;
  ref1: string;
  ref2: string;
  numLot: string;
  codeFournisseur: string;
  idEtiquette: string;
  idSN: string;
  formes: string;
  Createur: null;
  Modificateur: null;
  withDataMatrix: boolean;
  datamatrixData: string;
  withSN: boolean;
  withOF: boolean;
  text1: string;
  text2: string;
  text3: string;
  text4: string;
  text5: string;
  createdAt: string;
  updatedAt: string;
  ProtypCod: string;
  prodes1: string;
  prodes2: string;
  suffix: string;
  prefix: string;
  nbrCaractere: number;
  typeCompteur: string;
  pas: number;
}
export interface GetAllProduitDataResponseData {
  status: string;
  produits: AllProduitData[];
}
export interface updateProduitResponseData {
  Status: string;
  numberOfAffectedRows: number;
  ProduitUpdated?: ProduitData;
}
export interface getOneProduitResponseData {
  Status: string;
  produit: ProduitData;
}
export interface ProduitData {
  ref: string;
  ref1?: string;
  ref2?: string;
  nomProduit?: string;
  numLot?: string;
  codeFournisseur?: string;
  datamatrixData?: string;
  codeClient?: string;
  idEtiquette?: string;
  idSN?: string;
  formes?: string;
  withDataMatrix?: boolean;
  withSN?: boolean;
  withOF?: boolean;
  text1?: string;
  text2?: string;
  text3?: string;
  text4?: string;
  text5?: string;
  createur?: string;
  modificateur?: string;
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
  SDTPRA: SDTPRAData[];
}
export interface SDTPRAData {
  proRef: string;
  protypCod: string;
  prodes1: string;
  prodes2: string;
}

//---------------------------------------------------  LotData --------------------------------------------------------------
export interface GetOneLotResponseData {
  Status: string;
  lot: LotData;
}
export interface GetLotResponseData {
  status: string;
  lots: string[];
}
export interface LotData {
  numLot?: string;
  format: string;
  desLot: string;
  createur: String;
  modificateur: string;
  createdAt?: string;
  updatedAt?: string;
}
export interface UpdateLotResponseData {
  Status: string;
  numberOfAffectedRows: string;
  LotUpdated: LotData;
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
  client: ClientDataResult;
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
  fournisseur: FournisseurResultData;
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
export interface GetOneSerialNumberResultData {
  status: string;
  serialNumber: SerialNumberData;
}
//---------------------------------------------------------- Forme ------------------------------------------------------
export interface FormeData {
  id: string;
  name: string;
  path: string;
  clicked: boolean;
}
export interface CreateFormeResultData {
  Status: string;
  form: FormeData;
}
export interface GetFormeResultData {
  Status: string;
  forms: FormeData[];
}
//---------------------------------------------------- lien Protype Atelier --------------------------------------------
export interface GetLienProTypeAteliersResultData {
  Status: string;
  lienProTypeAtelier: LienProTypeAteliersData[];
}
export interface LienProTypeAteliersData {
  ProtypCod: string;
  Liecod: string;
}
