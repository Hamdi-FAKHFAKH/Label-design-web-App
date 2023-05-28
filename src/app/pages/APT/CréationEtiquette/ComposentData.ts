export interface LabelItem {
  id: string;
  type: string;
  refItem: string;
  title: string; //titre a afficher
  format?: string; //format de icon(shape)
  children?: LabelItem[];
  style?: ComponentStyle;
  data: string;
  dataMatrixFormat?: string;
  dataMatrixCode?: string;
  x?: number;
  y?: number;
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
  "text-align"?: string;
  "font-weight"?: string;
  //  transform: rotate(35deg); => orinentation
  transform?: string;
  "border-width"?: string;
}
export enum ComponentTitle {
  ref = "Réference Produit",
  nomProduit = "Nom Produit",
  ref1 = "Référence 1",
  ref2 = "Référence 2",
  numLot = "Numéro de Lot",
  formatLot = "Format de Lot",
  codeFournisseur = "Code Fournisseur",
  desFournisseur = "Désination Fournisseur",
  codeClient = "Code Client",
  desClient = "Désination Client",
  SN = "Numéro de Série",
  withDataMatrix = "DataMatrix",
  text1 = "Text1",
  text2 = "Text2",
  text3 = "Text3",
  text4 = "Text4",
  text5 = "Text5",
  forms = "Icon",
  OF = "Ordre de Fabrication (OF)",
}
