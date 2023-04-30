export interface ComponetList {
  id: string;
  type: string;
  refItem: string;
  title: string;
  format?: string;
  children?: ComponetList[];
  style?: ComponentStyle;
  data: string;
}
export interface ComponentStyle {
  height?: string;
  width?: string;
  color?: string;
  "background-color"?: string;
  "border-style"?: string;
  "border-color"?: string;
  padding?: string;
  "padding-top"?: string;
  "padding-bottom"?: string;
  "padding-right"?: string;
  "padding-left"?: string;
  "font-style"?: string;
  "text-decoration"?: string;
  margin?: string;
  "margin-left"?: string;
  "margin-right"?: string;
  "margin-top"?: string;
  "margin-bottom"?: string;
  "font-family"?: string;
  bold?: boolean;
  "font-size"?: string;
  // "text-decoration"?: string;
  underline?: boolean;
  italic?: boolean;
  Capitale?: boolean;
  "text-align"?: string;
  "font-weight"?: string;
  //  transform: rotate(35deg); => orinentation
  transform?: string;
}
export enum ComponentTitle {
  ref = "Réference Produit",
  nomProduit = "Nom Produit",
  ref1 = "Référence 1",
  ref2 = "Référence 2",
  numLot = "Numéro de Lot",
  codeFournisseur = "Code Fournisseur",
  desFournisseur = "Désination Fournisseur",
  codeClient = "Code Client",
  desClient = "Désination Client",
  idSN = "Id Numéro de Série",
  text1 = "Text1",
  text2 = "Text2",
  text3 = "Text3",
  text4 = "Text4",
  text5 = "Text5",
}
