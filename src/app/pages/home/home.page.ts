import { Component, OnInit, ChangeDetectorRef, OnDestroy, ViewChild } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { Plugins } from "@capacitor/core";

import { StudentService } from 'src/app/services/student.service';
import { ICardDetail } from 'src/app/models/list-models';
import { ToastController, LoadingController, IonInfiniteScroll, ModalController } from '@ionic/angular';
import { CHECK_INTERNET_CON } from 'src/app/components/login-form/login-form.component';
import { MatButtonToggleChange } from '@angular/material/button-toggle';
import { Router } from '@angular/router';
import { resultsRoute, classesRoute } from 'src/app/models/app-routes';
import { AuthService } from 'src/app/services/auth.service';

const { Storage } = Plugins;

const LOADER_ID = "home-loader";

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {

  public details: TeacherDetail[] = [];
  public cards: ICardDetail[] = [];
  public isLoading = false;
  public errMessage = "";
  public showError = false;
  public pageNum = 1;
  public noMoreVaues = false;
  public pageMode: PageMode = PageMode.Classes;

  public noOfClasses: string = "_";
  public noOfCourses: string = "_";
  
  public mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;
  
  
  constructor(
    private classService: StudentService,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private modalCtrl: ModalController,
    private teacherService: AuthService,
    private router: Router,
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
  ) { 
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);

  }

  ngOnInit() {
  }

  async ionViewDidEnter() {
    await this.showLoading();
    this.reset();
    this.getCards();
    this.getTeacher();
    this.getCount();
  }

  async toggleBtnClick(e: MatButtonToggleChange) {
    this.cards = [];
    await this.showLoading();
    this.reset();
    this.displayCard(e.value);
  }

  displayCard(value: string) {
    if(value == 'classes') {
      this.pageMode = PageMode.Classes;
      this.getCards();
    }
    else if(value == 'courses') {
      this.pageMode = PageMode.Courses;
      this.getCards();
    }
  }

  async getCards() {
    switch (this.pageMode) {
      case PageMode.Classes:
        await this.getClasses();
        break;
      case PageMode.Courses:
        await this.getCourses();
        break;
      
      default:
        break;
    }
  }

  async getClasses() {
    
    const { value } = await Storage.get({ key: "teacherid" });
    this.classService.viewSubClass({
      updateType: "6",
      qString: value,
    })
    .subscribe(res => {
      if(res.statuscode == 200) {
        const response = res.dataResponse;

        response.forEach(subClass => {
          this.cards.push({
            showImage: false,
            altImage: "icon",
            cardData: subClass,
            details: {
              "Name": subClass.subClassName,
              "Parent Class": subClass.parentClassName,
            },
            btnClick: async () => {
              this.router.navigateByUrl(classesRoute);
            }
          });
        });

      this.noOfClasses = response[0]?.totalRows;
      this.errMessage = "";
      this.showError = false;
    }
      else if(res.statuscode == 204){
        if(this.pageNum == 1){
          this.errMessage = "No classes";
          this.showError = true;
        }
        else{
          this.noMoreVaues = true;
        }
      }
      else if(res.statuscode == 401) {
        this.errMessage = "Unauthorised";
        this.showError = true;
      }
      else {
        this.presentToast(res.status);
      }

      this.dismissLoader();
      
      this.isLoading = false;
    }, (err) => {
      this.dismissLoader();
      this.presentToast(CHECK_INTERNET_CON);
    });
  }

  async getCourses() {
    
    const { value } = await Storage.get({ key: "teacherid" });
    this.classService.viewCourse({
      updateType: "6",
      qString: value,
    })
    .subscribe(res => {
      if(res.statuscode == 200) {
        const response = res.dataResponse;

        response.forEach(course => {
          this.cards.push({
            showImage: false,
            altImage: "icon",
            cardData: course,
            details: {
              "Course": course.course,
              "Course Name": course.courseName,
              "Course Class": course.courseClass,
            },
            btnClick: async () => {
              this.router.navigateByUrl(resultsRoute);
            }
          });
        });

      this.noOfCourses = response[0]?.totalRows;
      this.errMessage = "";
      this.showError = false;
    }
      else if(res.statuscode == 204){
        if(this.pageNum == 1){
          this.errMessage = "No classes";
          this.showError = true;
        }
        else{
          this.noMoreVaues = true;
        }
      }
      else if(res.statuscode == 401) {
        this.errMessage = "Unauthorised";
        this.showError = true;
      }
      else {
        this.presentToast(res.status);
      }

      this.dismissLoader();
      
      this.isLoading = false;
    }, (err) => {
      this.dismissLoader();
      this.presentToast(CHECK_INTERNET_CON);
    })
  }

  async getTeacher() {
    const { value } = await Storage.get({ key: "teacherid" });
    this.teacherService.viewTeacher({
      updateType: "2",
      teacherId: value,
      pageNum: "1",
      pageSize: "1"
    })
    .subscribe(res => {
      if(res.statuscode == 200) {
        const response = res.dataResponse[0];

        this.details = [
          { value: response.fullName, label: 'Full Name', icon: 'person' },
          { value: response.phonenum, label: 'Phone', icon: 'call' },
          { value: response.email, label: 'Email', icon: 'mail' },
        ]        

      }
      else {
        this.presentToast(res.status);
      }

      this.dismissLoader();
      
      this.isLoading = false;
    }, (err) => {
      this.dismissLoader();
      this.presentToast(CHECK_INTERNET_CON);
    })
  }

  getCount() {
    this.teacherService.viewEntityCount({})
    .subscribe((res) => {
      if(res.statuscode == 200) {
        const response = res.dataResponse;
        this.noOfClasses = response.noOfClasses;
        this.noOfCourses = response.noOfCourses;
      }
    })
  }

  reset() {
    this.pageNum = 1;
    this.showError = false;
    this.errMessage = "";
    this.noMoreVaues = false;
    this.cards = [];
  }

  async refresh(e?) {
    this.pageNum = 1;
    this.cards = [];
    await this.getCards();
    this.getCount();
    
    e?.target.complete()
  }


  splitArr(arr: any[]): any[] {
    // pushes items of an array into an array where each child is an array with a max of a specified value
    let limit = this.mobileQuery?.matches ? 2 : 5;

    let splitArr: any[][] = [];
    let counter =  -1;
    arr.forEach((value, i) => {
      if(i % limit == 0){
        counter++;
        splitArr[counter] = [];
      }
      splitArr[counter].push(value);
    });

    return splitArr;
  }

  async showLoading() {
    this.isLoading = true;
    const loader = await this.loadingCtrl.create({
      message: 'Please wait',
      spinner: 'crescent',
      id: LOADER_ID,
    });

    return await loader.present();
  }

  dismissLoader() {
    this.isLoading = false;
    this.loadingCtrl.dismiss()
    .catch(() => {});
  }


  async presentToast(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      position: "bottom",
      duration: 3000
    });

    return await toast.present();
  }

  ngOnDestroy() {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }
}

class TeacherDetail {
  value: any;
  label?: string;
  icon?: string;
  readonly multipleValue?: boolean = typeof(this.value) == 'string'
}

enum PageMode {
  Classes,
  Courses,
  Details,
}