/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import { FormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgModule } from "@angular/core";
import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";
import { CoreModule } from "./@core/core.module";
import { ThemeModule } from "./@theme/theme.module";
import { AppComponent } from "./app.component";
import { AppRoutingModule } from "./app-routing.module";
import {
  NbChatModule,
  NbDatepickerModule,
  NbDialogModule,
  NbMenuModule,
  NbSidebarModule,
  NbToastrModule,
  NbWindowModule,
} from "@nebular/theme";
import { LoginComponent } from "./auth/login/login.component";
import { AuthGuard } from "./auth/auth-guard.service";
import { AuthService } from "./auth/authService.service";
import { CommonModule } from "@angular/common";
import { authInterceptorService } from "./auth/authInterceptorService";
import { GestionProduitHttpService } from "./pages/APT/GestionProduits/gestionProduitHttp.service";
import { GestionProduitService } from "./pages/APT/GestionProduits/GestionProduit.service";
// import { FormsModule } from "@angular/forms";
@NgModule({
  declarations: [AppComponent, LoginComponent],
  imports: [
    CommonModule,
    BrowserModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    NbSidebarModule.forRoot(),
    NbMenuModule.forRoot(),
    NbDatepickerModule.forRoot(),
    NbDialogModule.forRoot(),
    NbWindowModule.forRoot(),
    NbToastrModule.forRoot(),
    NbChatModule.forRoot({
      messageGoogleMapKey: "AIzaSyA_wNuCzia92MAmdLRzmqitRGvCF7wCZPY",
    }),
    CoreModule.forRoot(),
    ThemeModule.forRoot(),
  ],
  bootstrap: [AppComponent],
  providers: [
    AuthGuard,
    AuthService,
    GestionProduitHttpService,
    GestionProduitService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: authInterceptorService,
      multi: true,
    },
  ],
})
export class AppModule {}
