import { Component, OnDestroy } from "@angular/core";
import { NbThemeService, NbColorHelper } from "@nebular/theme";
import { DetailImpressionHttpService } from "../APT/DetailImpression/detailImpressionHttp.service";
@Component({
  selector: "ngx-reprinted-label-linechart",
  template: ` <chart type="line" [data]="data"></chart> `,
})
export class ReprintedLabelLineChartComponent {
  data: any;
  options: any;
  themeSubscription: any;

  constructor(
    private theme: NbThemeService,
    private detailImpressionHttpService: DetailImpressionHttpService
  ) {
    this.themeSubscription = this.theme.getJsTheme().subscribe((config) => {
      // GET Printed labels data
      const currentYear = new Date().getFullYear();
      this.detailImpressionHttpService
        .GetEtiquettesImprimeesByDay(currentYear)
        .subscribe((obj) => {
          // const colors: any = config.variables;
          const chartjs: any = config.variables.chartjs;
          this.data = {
            axis: "y",
            labels: obj.etiquettesImprimees.map(
              (val) =>
                `${
                  val.day.toString().length < 2
                    ? 0 + val.day.toString()
                    : val.day
                }/${val.month}`
            ),
            datasets: [
              {
                data: obj.etiquettesImprimees.map((val) => val.total),
                label: "Étiquettes réimprimées",
                borderColor: "rgb(75, 192, 192)",
                borderWidth: 1,
                fill: false,
                tension: 0.1,
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
                    precision: 0,
                    fontColor: chartjs.textColor,
                  },
                },
              ],
            },
          };
        });
    });
  }
}
