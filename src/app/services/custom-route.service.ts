import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { PageRoute, homeRoute, settingsRoute, resultsRoute, classesRoute, loginRoute, studentsRoute, notificationsRoute } from '../models/app-routes';

@Injectable({
  providedIn: 'root'
})
export class CustomRouteService {

  public PageRoute: PageRoute;

  public PageUrl: string;

  constructor(
    private router: Router,
  ) {
    this.router.events.subscribe((val: NavigationEnd) => {
      if(!(val instanceof NavigationEnd)) return;

      this.PageRoute = this.convertStringToPageType(val.url);
      this.PageUrl = val.url;
    });
  }
  
  async getRoute() {
    return this.PageUrl;
  }

  convertStringToPageType(route: string): PageRoute {
    route = route.replace('/', '');
    switch(route) {
      case '':
        return PageRoute.Home;
      case homeRoute:
        return PageRoute.Home;
      case settingsRoute:
        return PageRoute.Settings;
      case notificationsRoute:
        return PageRoute.Notifications;
      case resultsRoute:
        return PageRoute.Result;
      case classesRoute:
        return PageRoute.Classes;
      case studentsRoute:
        return PageRoute.Students;
      case loginRoute:
        return PageRoute.Login;
      default:
        return PageRoute.None;
    }
  }

}