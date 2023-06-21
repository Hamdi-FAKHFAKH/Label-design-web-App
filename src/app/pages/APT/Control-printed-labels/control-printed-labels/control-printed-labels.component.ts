import { Component, OnInit } from "@angular/core";
import { ImpressionHttpService } from "../../ImpressionEtiquette/impressionHttpService";
import { OFHttpData } from "../../ImpressionEtiquette/impressionServiceData";
import { DetailImpressionHttpService } from "../../DetailImpression/detailImpressionHttp.service";
import { EtiquetteImprimeeData } from "../../DetailImpression/detailImpressionHttp.data";
import { CheckPrintedLabelHttp } from "../checkPrintedLabelHttp.service";
import { AuthService } from "../../../../auth/authService.service";

@Component({
  selector: "ngx-control-printed-labels",
  templateUrl: "./control-printed-labels.component.html",
  styleUrls: [
    "./control-printed-labels.component.scss",
    "./control-printed-labels.css",
  ],
})
export class ControlPrintedLabelsComponent implements OnInit {
  ofData: OFHttpData[];
  oFnumbers: String[];
  etiquettes: EtiquetteImprimeeData[];
  listOfCheckedLabel: EtiquetteImprimeeData[] = [];
  listOfLabelsWithProblem = [];
  nbrOfProblem = 0;

  constructor(
    private impressionHttpService: ImpressionHttpService,
    private detailImpressionHttpService: DetailImpressionHttpService,
    private checkPrintedLabelHttp: CheckPrintedLabelHttp,
    private authService: AuthService
  ) {}

  async ngOnInit() {
    this.ofData = (await this.impressionHttpService.GetAllOF().toPromise()).of;
    await this.findOF("");
  }
  async findOF(data: string) {
    if (!data) {
      this.oFnumbers = this.ofData.slice(0, 20).map((val) => val.ofnum);
    } else {
      this.oFnumbers = this.ofData
        .filter((val) => val.ofnum.startsWith(data))
        .map((val) => val.ofnum)
        .slice(0, 20);
      this.etiquettes = (
        await this.detailImpressionHttpService
          .GetALLEtiquettesByOF(data)
          .toPromise()
      ).etiquettesImprimees.map((val) => {
        return { ...val, checked: false };
      });
    }
  }
  // check the validity of dataMatrix
  async checkDataMatrix(data: string) {
    if (data) {
      if (this.etiquettes) {
        const etiquettesByQrcode = this.etiquettes.filter(
          (val) => val.dataMatrixData == data && val.serialNumber
        );
        const checkedetiquettesByQrcode = this.listOfCheckedLabel.filter(
          (val) => val.dataMatrixData == data
        );
        if (checkedetiquettesByQrcode.length > 0) {
          checkedetiquettesByQrcode[0].problem = "duplicated";
          checkedetiquettesByQrcode[0].checked = false;
          if (
            !this.listOfLabelsWithProblem.some(
              (val) => val.dataMatrixData == data
            )
          ) {
            checkedetiquettesByQrcode[0].nbrDuplication = 1;
            this.nbrOfProblem++;
            this.listOfLabelsWithProblem.push(checkedetiquettesByQrcode[0]);
          }
          this.listOfCheckedLabel.splice(
            this.listOfCheckedLabel.findIndex(
              (val) => val.id == checkedetiquettesByQrcode[0].id
            ),
            1
          );
          await this.checkPrintedLabelHttp
            .createVerificationEtiquette({
              dataMatrixData: data,
              problemId: 1,
              statut: "échec",
              userMatricule: this.authService.user.getValue().matricule,
            })
            .toPromise();
        } else if (
          this.listOfLabelsWithProblem.some((val) => val.dataMatrixData == data)
        ) {
          this.listOfLabelsWithProblem.find((val) => val.dataMatrixData == data)
            .nbrDuplication++;
          this.nbrOfProblem++;
          await this.checkPrintedLabelHttp
            .createVerificationEtiquette({
              dataMatrixData: data,
              problemId: 1,
              statut: "échec",
              userMatricule: this.authService.user.getValue().matricule,
            })
            .toPromise();
        } else if (
          etiquettesByQrcode.length == 0 &&
          !this.listOfLabelsWithProblem.some(
            (val) => val.dataMatrixData == data
          )
        ) {
          // const notFoundEtiquetteMsg = this.listOfLabelsWithProblem.find(
          //   (val) => val.problem == "not Found"
          // );
          await this.checkPrintedLabelHttp
            .createVerificationEtiquette({
              dataMatrixData: data,
              problemId: 2,
              statut: "échec",
              userMatricule: this.authService.user.getValue().matricule,
            })
            .toPromise();
          this.listOfLabelsWithProblem.push({
            problem: "not Found",
            nbr: 1,
            title: data,
          });
          this.nbrOfProblem++;
        } else {
          etiquettesByQrcode[0].checked = true;
          this.listOfCheckedLabel.push(etiquettesByQrcode[0]);
          this.etiquettes.splice(
            this.etiquettes.findIndex(
              (val) => val.id == etiquettesByQrcode[0].id
            ),
            1
          );
          await this.checkPrintedLabelHttp
            .createVerificationEtiquette({
              dataMatrixData: data,
              problemId: null,
              statut: "valide",
              userMatricule: this.authService.user.getValue().matricule,
            })
            .toPromise();
        }
      }
    }
  }
}
