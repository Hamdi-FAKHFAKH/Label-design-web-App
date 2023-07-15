import { Component, OnDestroy } from "@angular/core";
import { NbThemeService, NbColorHelper } from "@nebular/theme";
import { DetailImpressionHttpService } from "../APT/DetailImpression/detailImpressionHttp.service";
import { ProductHistoriqueService } from "../HistoriqueHttp.service";
import { AuthService } from "../../auth/authService.service";
@Component({
  selector: "ngx-product-history-linechart",
  template: ` <chart type="line" [data]="data"></chart> `,
})
export class ProductHistoryComponent {
  data: any;
  options: any;
  themeSubscription: any;

  constructor(
    private theme: NbThemeService,
    private detailImpressionHttpService: DetailImpressionHttpService,
    private historiqueService: ProductHistoriqueService,
    private authService: AuthService
  ) {
    // get product history date

    this.themeSubscription = this.theme.getJsTheme().subscribe((config) => {
      const currentYear = new Date().getFullYear();
      this.historiqueService
        .getHistoriqueProduitByOperation(authService.user.getValue().matricule)
        .subscribe((obj) => {
          // GET Printed labels data
          const date: { day: number; month: number; year: number }[] = [];
          obj.historiqueProduit.forEach((val) => {
            if (
              !date.some(
                (d) =>
                  d.day == val.day && d.month == val.month && d.year == val.year
              )
            ) {
              date.push({ day: val.day, month: val.month, year: val.year });
            }
          });
          // console.log(date);

          //set create ,update, delete list
          const createList = [];
          const updateList = [];
          const deleteList = [];
          date.forEach((val) => {
            let productList = obj.historiqueProduit.filter(
              (d) =>
                d.day == val.day && d.month == val.month && d.year == val.year
            );
            productList.some((d) => d.operation == "Create")
              ? createList.push(
                  productList.find((d) => d.operation == "Create").total
                )
              : createList.push(0);
            productList.some((d) => d.operation == "Update")
              ? updateList.push(
                  productList.find((d) => d.operation == "Update").total
                )
              : updateList.push(0);
            productList.some((d) => d.operation == "Delete")
              ? deleteList.push(
                  productList.find((d) => d.operation == "Delete").total
                )
              : deleteList.push(0);
          });

          // const colors: any = config.variables;
          const chartjs: any = config.variables.chartjs;
          this.data = {
            axis: "y",
            labels: date.map((val) => `${val.day}/${val.month}/${val.year}`),
            datasets: [
              {
                data: createList,
                label: "Création",
                borderColor: "rgb(75, 192, 192)",
                borderWidth: 1,
                fill: false,
                tension: 0.1,
              },
              {
                data: updateList,
                label: "Modification",
                borderColor: "#36A2EB",
                borderWidth: 1,
                fill: false,
                tension: 0.1,
              },
              {
                data: deleteList,
                label: "Suppression",
                borderColor: "#FF6384",
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
                    precision: 0,
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
                    stepsize: 1,
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
