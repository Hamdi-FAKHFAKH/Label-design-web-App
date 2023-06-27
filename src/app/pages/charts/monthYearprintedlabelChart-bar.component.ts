import { Component, OnDestroy, OnInit } from "@angular/core";
import { NbThemeService, NbColorHelper } from "@nebular/theme";
import { DetailImpressionHttpService } from "../APT/DetailImpression/detailImpressionHttp.service";
import { EtiquetteImprimeeData } from "../APT/DetailImpression/detailImpressionHttp.data";

@Component({
  selector: "ngx-moth-year-printed-label-char",
  template: ` <chart type="bar" [data]="data" [options]="options"></chart> `,
})
export class monthYearPrintedlabelChartComponent implements OnDestroy {
  data: any;
  options: any;
  themeSubscription: any;
  printedLabels: {
    total: number;
  }[];
  nbrcopiesByMonthYear = [];
  monthsYear: { month: number; year: number }[] = [];
  constructor(
    private theme: NbThemeService,
    private detailImpressionHttpService: DetailImpressionHttpService
  ) {
    //get months list
    let date = new Date();
    if (date.getMonth() + 1 - 6 <= 0) {
      for (let i = 1; i <= date.getMonth() + 1; i++) {
        this.monthsYear.push({
          month: i,
          year: date.getFullYear(),
        });
      }
      for (let i = 12 + (date.getMonth() + 1 - 6) + 2; i <= 12; i++) {
        this.monthsYear.unshift({
          month: i,
          year: date.getFullYear() - 1,
        });
      }
    }
    //
    this.themeSubscription = this.theme.getJsTheme().subscribe((config) => {
      // get printed Labels
      this.monthsYear.forEach((val) => {
        this.detailImpressionHttpService
          .GetEtiquettesImprimeesByMonthYear(val.month, val.year)
          .subscribe((obj) => {
            this.nbrcopiesByMonthYear.push(obj.etiquettesImprimees[0].total);
            // chart configuration
            const colors: any = config.variables;
            const chartjs: any = config.variables.chartjs;
            this.data = {
              labels: this.monthsYear.map((val) => `${val.month}/${val.year}`),
              datasets: [
                {
                  data: this.nbrcopiesByMonthYear,
                  label: "Nombre d'étiquettes imprimées",
                  backgroundColor: NbColorHelper.hexToRgbA(
                    colors.primaryLight,
                    0.8
                  ),
                },
              ],
            };
            this.options = {
              maintainAspectRatio: false,
              responsive: true,
              legend: {
                labels: {
                  fontColor: chartjs.textColor,
                },
              },
              scales: {
                xAxes: [
                  {
                    gridLines: {
                      display: false,
                      color: chartjs.axisLineColor,
                    },
                    ticks: {
                      fontColor: chartjs.textColor,
                    },
                  },
                ],
                yAxes: [
                  {
                    gridLines: {
                      display: true,
                      color: chartjs.axisLineColor,
                    },
                    ticks: {
                      fontColor: chartjs.textColor,
                    },
                  },
                ],
              },
            };
          });
      });
      //--------------------------------------------------------------------------------------------------------
    });
  }
  ngOnDestroy(): void {
    this.themeSubscription.unsubscribe();
  }
}
