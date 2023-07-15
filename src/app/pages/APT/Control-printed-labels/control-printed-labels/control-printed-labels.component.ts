import { Component, OnInit } from "@angular/core";
import { ImpressionHttpService } from "../../ImpressionEtiquette/impressionHttpService";
import { OFHttpData } from "../../ImpressionEtiquette/impressionServiceData";
import { DetailImpressionHttpService } from "../../DetailImpression/detailImpressionHttp.service";
import { EtiquetteImprimeeData } from "../../DetailImpression/detailImpressionHttp.data";
import { CheckPrintedLabelHttp } from "../checkPrintedLabelHttp.service";
import { AuthService } from "../../../../auth/authService.service";
import Swal from "sweetalert2";

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
      if (this.etiquettes.length > 0) {
        const etiquettesByQrcode = this.etiquettes.filter(
          (val) => val.dataMatrixData == data && val.serialNumber
        );
        const checkedetiquettesByQrcode = this.listOfCheckedLabel.find(
          (val) => val.dataMatrixData == data
        );
        // label duplicated and not exist in problem list
        if (checkedetiquettesByQrcode) {
          checkedetiquettesByQrcode.problem = "duplicated";
          checkedetiquettesByQrcode.checked = false;
          checkedetiquettesByQrcode.nbrDuplication = 1;
          this.nbrOfProblem++;
          this.listOfLabelsWithProblem.push(checkedetiquettesByQrcode);
          const index = this.listOfCheckedLabel.findIndex(
            (val) =>
              val.dataMatrixData == checkedetiquettesByQrcode.dataMatrixData
          );
          index >= 0 && this.listOfCheckedLabel.splice(index, 1);
          await this.checkPrintedLabelHttp
            .createVerificationEtiquette({
              dataMatrixData: data,
              problemId: 1,
              statut: "échec",
              userMatricule: this.authService.user.getValue().matricule,
            })
            .toPromise();
          // label duplicated and exist in problem list
        } else if (
          this.listOfLabelsWithProblem.some(
            (val) => val.dataMatrixData == data && val.problem == "duplicated"
          )
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
        }
        // label  not found
        else if (etiquettesByQrcode.length == 0) {
          this.listOfLabelsWithProblem.push({
            problem: "not Found",
            nbr: 1,
            title: data,
          });
          this.nbrOfProblem++;
          await this.checkPrintedLabelHttp
            .createVerificationEtiquette({
              dataMatrixData: data,
              problemId: 2,
              statut: "échec",
              userMatricule: this.authService.user.getValue().matricule,
            })
            .toPromise();
          // label exist
        } else {
          etiquettesByQrcode[0].checked = true;
          this.listOfCheckedLabel.push(etiquettesByQrcode[0]);
          const index = this.etiquettes.findIndex(
            (val) => val.dataMatrixData == etiquettesByQrcode[0].dataMatrixData
          );
          this.etiquettes.splice(index, 1);
          await this.checkPrintedLabelHttp
            .createVerificationEtiquette({
              dataMatrixData: data,
              problemId: null,
              statut: "valide",
              userMatricule: this.authService.user.getValue().matricule,
            })
            .toPromise();
        }
        // no more labels
      } else if (
        this.etiquettes.length == 0 &&
        this.listOfCheckedLabel.length > 0
      ) {
        Swal.fire({
          icon: "info",
          title:
            "La liste des étiquettes est vide. Vous avez terminé la vérification de toutes les étiquettes.",
        });
      } else {
        Swal.fire({
          icon: "error",
          title:
            "Veuillez vérifier la validité du numéro d'ordre de fabrication saisi.",
        });
      }
    }
  }
}
