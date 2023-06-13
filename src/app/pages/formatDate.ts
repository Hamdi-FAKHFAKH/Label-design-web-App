import { Injectable } from "@angular/core";
@Injectable({ providedIn: "root" })
export class Utils {
  formatDate(date) {
    let d = new Date(date);
    let ye = new Intl.DateTimeFormat("en", {
      year: "numeric",
    }).format(d);
    let mo = new Intl.DateTimeFormat("en", {
      month: "2-digit",
    }).format(d);
    let da = new Intl.DateTimeFormat("en", {
      day: "2-digit",
    }).format(d);
    let h = new Intl.DateTimeFormat("fr", {
      hour: "2-digit",
    })
      .format(d)
      .replace(" h", "");
    let mm = new Intl.DateTimeFormat("en", {
      minute: "2-digit",
    }).format(d);
    let ss = new Intl.DateTimeFormat("en", {
      second: "2-digit",
    }).format(d);
    return `${da}/${mo}/${ye} ${h}:${mm}:${ss}`;
  }
}
