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
export interface ComposentHttpData {
  id: string;
  refEtiquette: string;
  type: string;
  ordre: number;
  refItem: string;
  title: string; //titre a afficher
  format: string; //format de icon(shape)
  children: string;
  dataMatrixFormat: string;
  dataMatrixCode: string;
  height: string;
  width: string;
  color: string;
  "background-color": string;
  "border-style": string;
  "border-color": string;
  padding: string;
  "padding-top": string;
  "padding-bottom": string;
  "padding-right": string;
  "padding-left": string;
  "font-style": string;
  "text-decoration": string;
  margin: string;
  "margin-left": string;
  "margin-right": string;
  "margin-top": string;
  "margin-bottom": string;
  "font-family": string;
  bold: boolean;
  "font-size": string;
  // "text-decoration": string;
  underline: boolean;
  italic: boolean;
  "text-align": string;
  //  transform: rotate(35deg); => orinentation
  transform: string;
  "border-width": string;
  createur?: string;
  modificateur?: string;
  x?: number;
  y?: number;
}
export interface GetComposentResultData {
  Status: string;
  composents: ComposentHttpData[];
}
export interface GetOneComposentResultData {
  Status: string;
  composent: ComposentHttpData;
}
