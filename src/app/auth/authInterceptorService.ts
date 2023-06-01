import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from "@angular/common/http";
import { Observable } from "rxjs";
import { AuthService } from "./authService.service";
import { Injectable } from "@angular/core";
import { exhaustMap, take } from "rxjs/operators";
//*************************************** Inject token in the header of all request HTTP ************************************* */
@Injectable()
export class authInterceptorService implements HttpInterceptor {
  constructor(private authService: AuthService) {}
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return this.authService.user.pipe(
      take(1),
      exhaustMap((user) => {
        if (!user) {
          return next.handle(req);
        }
        const newReq = req.clone({
          setHeaders: {
            "Content-Type": "application/json; charset=utf-8",
            Accept: "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        });
        return next.handle(newReq);
      })
    );
  }
}
