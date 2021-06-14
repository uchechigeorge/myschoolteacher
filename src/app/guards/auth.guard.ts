import { Injectable } from '@angular/core';
import { CanLoad, Route, UrlSegment, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take, filter } from 'rxjs/operators';

import { AuthService } from '../services/auth.service';
import { loginRoute } from '../models/app-routes';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanLoad {

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  canLoad(): Observable<boolean> | Promise<boolean> | boolean {
    return this.authService.isAuthenticated.pipe(
      filter(value => value !== null), // filter out initial subject value
      take(1), // Otherwise, the observable doesn't complete!
      map(isAuthenticated => {

        if(isAuthenticated)
          return true;
        else {
          this.router.navigateByUrl(loginRoute, { replaceUrl: true });
          return false;
        }

      })
    )
  }
}
