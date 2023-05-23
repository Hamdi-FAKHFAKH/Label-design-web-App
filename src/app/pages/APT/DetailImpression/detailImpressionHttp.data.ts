export interface EtiquetteImprimeeData {
  idEtiquette: string;
  refProd: string;
  nbrCopie: number;
  serialNumber: string;
  numOF: string;
  dateImp: string;
  userMatricule: string;
  state: string;
  withDataMatrix: boolean;
  action: string;
  MotifReimpression: string;
  formatLot: string;
}
export interface GetEtiquetteImprimeeResultData {
  Status: string;
  etiquettesImprimees: EtiquetteImprimeeData[];
}
export interface EtiquetteImprimeeResultData {
  Status: string;
  etiquetteImprimee: EtiquetteImprimeeData[];
}
