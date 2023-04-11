/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import { Component, OnInit } from "@angular/core";
import { AnalyticsService } from "./@core/utils/analytics.service";
import { SeoService } from "./@core/utils/seo.service";
import { AuthService } from "./auth/authService.service";
import { take } from "rxjs/operators";

@Component({
  selector: "ngx-app",
  template: "<router-outlet></router-outlet>",
})
export class AppComponent implements OnInit {
  constructor(
    private analytics: AnalyticsService,
    private seoService: SeoService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.authService.autoLogIn();
    // this.authService.user.pipe(take(1)).subscribe((user) => {
    //   if (user) {
    //     this.authService.autoLogOut(user._tokenExpiration.getTime());
    //   }
    // });
    // this.authService.autoLogOut()
    this.analytics.trackPageViews();
    this.seoService.trackCanonicalChanges();
  }
}
