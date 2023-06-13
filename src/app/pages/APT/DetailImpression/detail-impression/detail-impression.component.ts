import { Component, OnInit } from "@angular/core";
import { LocalDataSource } from "ng2-smart-table";
import { DetailImpressionHttpService } from "../detailImpressionHttp.service";
import {
  EtiquetteImprimeeData,
  PrintDetailData,
} from "../detailImpressionHttp.data";
import { AuthService } from "../../../../auth/authService.service";
import Swal from "sweetalert2";
import { ImpressionHttpService } from "../../ImpressionEtiquette/impressionHttpService";
import { Utils } from "../../../formatDate";

@Component({
  selector: "ngx-detail-impression",
  templateUrl: "./detail-impression.component.html",
  styleUrls: ["./detail-impression.component.scss", "./smart-table.css"],
})
export class DetailImpressionComponent implements OnInit {
  constructor(
    private detailImpressionHttp: DetailImpressionHttpService,
    private authService: AuthService,
    private impressionHttpService: ImpressionHttpService,
    private utils: Utils
  ) {}
  printDetail: PrintDetailData[];
  settings = {
    hideSubHeader: true,
    pager: { display: true },
    filter: false,
    mode: "external",
    actions: { position: "right", add: false },
    columns: {
      numOF: {
        title: "N° OF",
        type: "string",
        filter: false,
      },
      refProd: {
        title: "Référence Produit",
        type: "string",
        filter: false,
      },
      formatLot: {
        title: "Format de Lot",
        type: "string",
        filter: false,
      },
      serialNumber: {
        title: "Numéro de Série",
        type: "string",
        filter: false,
      },
      withDataMatrix: {
        title: "Code QR",
        type: "string",
        filter: false,
      },
      nbrCopie: {
        title: "Nombre d'étiquettes",
        type: "string",
        filter: false,
      },
      action: {
        title: "Impression/Réimpression",
        type: "string",
        filter: false,
      },
      dateImpr: {
        title: "Date d'impression",
        type: "string",
        filter: false,
      },
      dateReimpr: {
        title: "Dérniere date de réimpression",
        type: "string",
        filter: false,
      },
      imprUserMatricule: {
        title: "Utilisateur d'impression",
        type: "string",
        filter: false,
      },
      reImprUserMatricule: {
        title: "Utilisateur de réimpression",
        type: "string",
        filter: false,
      },
    },
    edit: {
      inputClass: "edit",
      editButtonContent: '<i class="fa-solid fa-print fa-xs" > </i>',
      confirmSave: true,
    },
    delete: {
      inputClass: "success",
      deleteButtonContent: '<i class="fas fa-search fa-xs" ></i>',
      confirmDelete: true,
    },
  };

  source: LocalDataSource = new LocalDataSource();

  async ngOnInit() {
    this.printDetail = (
      await this.detailImpressionHttp.GetPrintDetail().toPromise()
    ).printDetail;
    this.source.load(this.getSmartTableData(this.printDetail));
  }
  search(data) {}
  async print(data) {
    const printerList: string[] = await this.impressionHttpService
      .GetPrinterList()
      .toPromise();
    const printedLabelData: EtiquetteImprimeeData = data.data;
    if (printedLabelData.serialNumber !== "-") {
      Swal.fire({
        title: "Réimpression ",
        html:
          "<label style='margin:10px 0px'>Motif de réimpression</label>" +
          '<input id="motif" class="form-control"/>' +
          "<label style='margin:10px 0px'>Imprimante</label>" +
          `<select id="imprimante" class="form-control">
        <option>
        ${printerList.join("</option><option>")}
        </option>
        </select>`,
        inputAttributes: {
          autocapitalize: "off",
        },
        showCancelButton: true,
        confirmButtonText: "Imprimer",
        showLoaderOnConfirm: true,
        preConfirm: () => {
          return this.impressionHttpService
            .PrintLabel({
              copies: 1,
              filePath: printedLabelData.filePath,
              printerName: (<HTMLInputElement>(
                document.getElementById("imprimante")
              )).value,
            })
            .toPromise()
            .then(() => {
              this.detailImpressionHttp
                .CreateEtiquetteImprimee({
                  dataMatrixData: printedLabelData.dataMatrixData,
                  filePath: printedLabelData.filePath,
                  idEtiquette: printedLabelData.idEtiquette,
                  formatLot: printedLabelData.formatLot,
                  numOF: printedLabelData.numOF,
                  refProd: printedLabelData.refProd,
                  serialNumber: printedLabelData.serialNumber,
                  withDataMatrix: printedLabelData.withDataMatrix,
                  state: printedLabelData.state,
                  action: "Réimpression",
                  date: new Date(),
                  userMatricule: this.authService.user.getValue().matricule,
                  nbrCopie: 1,
                  motifReimpression: (<HTMLInputElement>(
                    document.getElementById("motif")
                  )).value,
                })
                .toPromise()
                .then((response) => {
                  if (!response.etiquetteImprimee) {
                    throw new Error(response.Status);
                  }
                  return response.etiquetteImprimee;
                });
            })
            .catch((error) => {
              Swal.showValidationMessage(`Request failed: ${error}`);
            });
        },
        allowOutsideClick: () => !Swal.isLoading(),
      }).then((result) => {
        if (result.isConfirmed) {
          this.detailImpressionHttp
            .GetPrintDetail()
            .toPromise()
            .then((val) => {
              this.source.load(this.getSmartTableData(val.printDetail));
            });
        }
      });
    }
  }
  getSmartTableData(val: PrintDetailData[]) {
    return val.map((val) => {
      return {
        ...val,
        dateImpr: this.utils.formatDate(val.dateImpr),
        dateReimpr:
          +val.nbrCopie > 1 ? this.utils.formatDate(val.dateReimpr) : "-",
        action:
          +val.nbrCopie > 1 && val.serialNumber !== "-"
            ? "Réimpression"
            : "Impression",
      };
    });
  }
  onSearch(query: string = "") {
    if (query == "") {
      this.source.reset(false);
    } else {
      this.source.setFilter(
        [
          // fields we want to include in the search
          {
            field: "numOF",
            search: query,
          },
          {
            field: "refProd",
            search: query,
          },
          {
            field: "dateImp",
            search: query,
          },
          {
            field: "userMatricule",
            search: query,
          },
        ],
        false
      );
    }
  }
}
