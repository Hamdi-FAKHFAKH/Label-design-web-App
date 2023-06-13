export class User {
  constructor(
    public matricule: string,
    public role: string,
    public atelier: string,
    public UAP: string,
    private _token: string,
    private _tokenExpiration: Date
  ) {}
  get token() {
    if (!this._tokenExpiration || this._tokenExpiration < new Date()) {
      return null;
    } else {
      return this._token;
    }
  }
}
export enum roles {
  visitor = "Consultation",
  admin = "Administrateur",
  agentMethod = "Agent Methode",
  agentSaisie = "Agent de Saisie",
  responsableUAP = "Responsable UAP",
  directeur = "Directeur",
}
export enum Ateliers {
  APT = "S500",
  AIS = "S900",
  ASA = "S100",
  ASS = "S200",
  AMOU = "S800",
  ACF = "S600",
  AC = "S700",
  AMAN = "S601",
}
export enum UAP {
  UAP1 = "UAP1",
  UAP2 = "UAP2",
}
export let uaps = ["UAP1", "UAP2"];
