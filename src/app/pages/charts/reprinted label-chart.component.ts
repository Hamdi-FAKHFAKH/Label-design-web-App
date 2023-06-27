import { Component, OnDestroy } from "@angular/core";
import { NbThemeService, NbColorHelper } from "@nebular/theme";
import { DetailImpressionHttpService } from "../APT/DetailImpression/detailImpressionHttp.service";

@Component({
  selector: "ngx-reprinted-label-chart",
  template: ` <chart type="bar" [data]="data" [options]="options"></chart> `,
})
export class ReprintedLabelChartComponent implements OnDestroy {
  data: any;
  options: any;
  themeSubscription: any;

  constructor(
    private theme: NbThemeService,
    private detailImpressionHttpService: DetailImpressionHttpService
  ) {
    const labels = [
      "Janvier",
      "février",
      "mars",
      "avril",
      "mai",
      "juin",
      "juillet",
      "août",
      "septembre",
      "octobre",
      "novembre",
      "décembre",
    ];
    this.themeSubscription = this.theme.getJsTheme().subscribe((config) => {
      // GET Printed labels data
      const currentYear = new Date().getFullYear();
      this.detailImpressionHttpService
        .GetEtiquettesImprimeesByMonth(currentYear)
        .subscribe((obj) => {
          // const colors: any = config.variables;
          const chartjs: any = config.variables.chartjs;
          this.data = {
            axis: "y",
            labels: obj.etiquettesImprimees.map((val) => labels[val.month - 1]),
            datasets: [
              {
                data: obj.etiquettesImprimees.map((val) => val.total),
                label: "Series A",
                backgroundColor: "rgba(54, 162, 235, 0.2)",
                borderColor: "rgb(54, 162, 235)",
                borderWidth: 1,
              },
            ],
          };

          this.options = {
            scaleStepWidth: 20,
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
                    scaleStepWidth: 20,
                    display: true,
                    color: chartjs.axisLineColor,
                  },
                  ticks: {
                    // stepSize: 1,
                    precision: 0,
                    fontColor: chartjs.textColor,
                    grid: { tickWidth: 20, tickLength: 20 },
                  },
                },
              ],
            },
          };
        });
    });
  }

  ngOnDestroy(): void {
    this.themeSubscription.unsubscribe();
  }
}
