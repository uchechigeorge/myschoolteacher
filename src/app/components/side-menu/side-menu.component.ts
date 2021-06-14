import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { MediaMatcher } from '@angular/cdk/layout';
import { MatSidenav } from '@angular/material/sidenav';
import { AlertController } from '@ionic/angular';
import { Plugins } from "@capacitor/core";

import { homeRoute, PageRoute, nonAuthRoutes, IAppPages, settingsRoute, loginRoute, resultsRoute, classesRoute, studentsRoute, notificationsRoute } from 'src/app/models/app-routes';
import { CustomRouteService } from 'src/app/services/custom-route.service';
import { AuthService, TEACHERCREDENTIALS_KEY, TOKEN_KEY, TEACHERID_KEY } from 'src/app/services/auth.service';
import { isDefaultImage } from 'src/app/models/list-models';
import { StudentService } from 'src/app/services/student.service';
import { asyncTimeOut } from 'src/app/models/storage-models';

const { Storage } = Plugins;

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss'],
})
export class SideMenuComponent implements OnInit {
  
  public appPages: IAppPages[] = [
    {
      title: 'Home',
      url: homeRoute,
      pageRoute: PageRoute.Home,
      icon: 'home',
      handler: () => {
        this.navigate(PageRoute.Home);
      }
    },
    {
      title: 'Result',
      url: resultsRoute,
      icon: 'bar-chart',
      pageRoute: PageRoute.Result,
      handler: () => {
        this.navigate(PageRoute.Result);
      }
    },
    {
      title: 'Class',
      url: classesRoute,
      icon: 'school',
      pageRoute: PageRoute.Classes,
      handler: () => {
        this.navigate(PageRoute.Classes);
      }
    },
    {
      title: 'Students',
      url: studentsRoute,
      icon: 'people',
      pageRoute: PageRoute.Students,
      handler: () => {
        this.navigate(PageRoute.Students);
      }
    },
    {
      title: 'Notifications',
      url: notificationsRoute,
      icon: 'notifications',
      pageRoute: PageRoute.Notifications,
      handler: () => {
        this.navigate(PageRoute.Notifications);
      }
    },
    {
      title: 'Settings',
      url: settingsRoute,
      icon: 'settings',
      pageRoute: PageRoute.Settings,
      handler: () => {
        this.navigate(PageRoute.Settings);
      }
    },
    {
      title: 'Log Out',
      url: loginRoute,
      icon: 'log-out',
      pageRoute: PageRoute.Login,
      handler: async () => {
        const alert = await this.alertCtrl.create({
          header: "Notice",
          message: "Log Out?",
          buttons: [
            {
              text: "Ok",
              handler: async () => {
                await this.authService.logout();
                this.sideNav.close()
                .then(() => {
                  this.closeMenu = true
                  this.navigate(PageRoute.Login);
                });
              },
            },
            {
              text: "Cancel",
              role: "cancel"
            }
          ]
        });
    
        return await alert.present();
      }
    },
  ];

  // public PageUrl: string = '';
  public PageTitle: string = '';
  @ViewChild('snav', { static: true }) sideNav: MatSidenav;
  public menuDisabled: boolean = true;
  public closeMenu: boolean = false;
  public hasImage: boolean = false;
  public imgSrc: string = '';
  public username: string = '';
  public activeTerm: string = '';
  public hasDetails: boolean = false;
  public hasTerm: boolean = false;
  public schoolName = '';

  mobileQuery: MediaQueryList;

  private _mobileQueryListener: () => void;
  private _pageUrl: string;

  get pageUrl() {
    return this._pageUrl;
  }

  set pageUrl(value) {
    if(this._pageUrl == "login" && value == "home" && !this.mobileQuery.matches) {
      this.sideNav.open();
    }
    this._pageUrl = value;
  }

  constructor(
    private router: Router,
    private authService: AuthService,
    private alertCtrl: AlertController,
    public customRoute: CustomRouteService,
    private termService: StudentService,
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);

    this.router.events.subscribe((val: NavigationEnd) => {
      if(!(val instanceof NavigationEnd)) return;

      this.pageUrl = val.urlAfterRedirects.replace('/', '');
      const page = this.appPages.find(page => page.url == this.pageUrl);
      this.PageTitle = page.title;
      this.checkSideMenu();
    });
  }

  ngOnInit() {
    asyncTimeOut(3000)
    .then(() => {
      if(!this.mobileQuery.matches && !this.menuDisabled){
        this.sideNav.open();
      }
    });

    this.getSettings();
  }

  navigate(pageRoute: PageRoute) {
    const page = this.appPages.find(page => page.pageRoute == pageRoute);
    const route = page.url;
    this.PageTitle = page.title;
    this.closeOnClick();

    this.router.navigate([ route ]);
  }

  getSettings() {
    this.authService.getSettings()
    .subscribe(res => {
      this.schoolName = res?.name;

    })
  }

  checkSideMenu() {
    this.menuDisabled = !nonAuthRoutes.some(route => route == this.pageUrl);
    this.closeMenu = this.menuDisabled;
    if(!nonAuthRoutes.some(route => route == this.pageUrl)) {
      this.sideNav.close();
      this.imgSrc = '';
      this.hasDetails = false;
      this.hasImage = false;
      this.hasTerm = false;
      this.activeTerm = '';
      this.username = '';
    }
  }

  imgErr() {
    this.hasImage = false;
  }
  
  imgLoaded() {
    if(isDefaultImage(this.imgSrc)) {
      this.hasImage = false;
    }
    else {
      this.hasImage = true;
    }
  }

  async menuOpened() {
    this.getDetails();
    this.getActiveTerm();
  }

  async getDetails() {
    if(this.hasDetails) return;

    const { value } = await Storage.get({ key: TEACHERCREDENTIALS_KEY });
    if(value) {
      const details = JSON.parse(value);
      this.imgSrc = details.dpUrl;
      this.username = details.username;
      this.hasDetails = true;
      
    }
    else {
      const { value } = await Storage.get({ key: TEACHERID_KEY });
      if(value) return;

      this.authService.viewTeacher({
        updateType: "2",
        teacherId: value,
        pageNum: "1",
        pageSize: "1",
      })
      .subscribe(async res => {
        if(res.statuscode == 200) {
          const response = res.dataResponse[0];
          this.authService.saveCredentials({
            credentials: JSON.stringify(response),
          });

          this.imgSrc = response.dpUrl;
          this.username = response.username;
          this.hasDetails = true;
        }
      })
    }
  }

  async getActiveTerm() {
    if(this.hasTerm) return;
    this.termService.viewTerm({
      updateType: "3",
      pageSize: "10",
      pageNum: "1",
    })
    .subscribe(res => {
      if(res.statuscode == 200) {
        const response = res.dataResponse[0];
        this.activeTerm = `${response.term}${this.getPosition(response.term)} term ${response.schoolYear}`;
        this.hasTerm = true;
      }
    }, err => { });
  }

  getPosition(value: number): string {
    if(value % 100 > 10 && value % 100 < 20) {
      return 'th';
    }
    else if(value % 10 == 1) {
      return 'st';
    }
    else if(value % 10 == 2) {
      return 'nd';
    }
    else if(value % 10 == 3) {
      return 'rd';
    }
    else if(!value){
      return '';
    }
    else {
      return 'th';
    }
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  closeOnClick() {
    if(this.mobileQuery.matches) {
      this.sideNav.close();
    }
  }

}
