import { Component, OnInit, ViewChild } from '@angular/core';
import { ICardDetail, IFilterCard, ISelectOptions } from 'src/app/models/list-models';
import { MatButtonToggleChange } from '@angular/material/button-toggle';
import { ModalController, ToastController, IonInfiniteScroll } from '@ionic/angular';
import { FormControl } from '@angular/forms';
import { Plugins } from "@capacitor/core";

import { ViewResultComponent } from 'src/app/components/modals/view-result/view-result.component';
import { viewResultModalID } from 'src/app/models/components-id';
import { StudentService } from 'src/app/services/student.service';
import { CHECK_INTERNET_CON } from 'src/app/components/login-form/login-form.component';
import { TEACHERID_KEY } from 'src/app/services/auth.service';

const { Storage } = Plugins;

@Component({
  selector: 'app-results',
  templateUrl: './results.page.html',
  styleUrls: ['./results.page.scss'],
})
export class ResultsPage implements OnInit {

  public formControl = new FormControl("");

  public cards: ICardDetail[] = [];
  public filterCards: ICardDetail[] = [];
  public searchMode: boolean = false;
  public searchString: string = '';
  public lastSearchString: string = '';
  public filterData: IFilterCard[] = [];
  public inputFirstLoad: boolean = true;

  public showError = false;
  public isLoading = true;
  public errMessage = "";
  public pageNum = 1;
  public noMoreValues = false;
  public noOfValues: number;
  public selectCourses: ISelectOptions[] = [];
  public PageTitle: "Students" | "Courses" = "Courses";

  @ViewChild('scroll') scroll: IonInfiniteScroll;

  constructor(
    private modalCtrl: ModalController,
    private studentService: StudentService,
    private toastCtrl: ToastController,
  ) { }

  ngOnInit() { }

  get courseId() {
    return this.formControl.value?.trim();
  }

  ionViewDidEnter() {
    this.isLoading = true;
    this.reset();
    this.getCourses();
  }

  async getCourses() {
    
    const { value } = await Storage.get({ key: TEACHERID_KEY });
    this.selectCourses = [];
    this.studentService.viewCourse({
      updateType: "6",
      pageSize: "20",
      pageNum: "1",
      qString: value,
    })
    .subscribe(res => {
      if(res.statuscode == 200) {
        const response = res.dataResponse;
        response.forEach(subClass => {
          this.selectCourses.push({
           text: subClass.course,
           value: subClass.courseId
        });
      });

      this.PageTitle = "Courses";
      this.noOfValues = response[0]?.totalRows;
      this.errMessage = "";
      this.showError = false;
    }
    else if(res.statuscode == 401){
      this.errMessage = res.status;
      this.showError = true;
    }

    else {
      this.presentToast(res.status);
    }
    this.isLoading = false;
  }, (err) => {
      this.isLoading = false;
      this.presentToast(CHECK_INTERNET_CON);
    })
  }

  async getStudents() {
    this.studentService.viewStudent({
      updateType: "5",
      pageSize: "20",
      pageNum: this.pageNum.toString(),
      qString: this.courseId
    })
    .subscribe(res => {
      if(res.statuscode == 200) {
        const response = res.dataResponse;
        
        response.forEach(student => {
          this.cards.push({
            cardData: student,
            details: {
              "Name": student.fullName,
              "Guardian": student.nextOfKin,
              "Contact": student.phonenum1 || student.phonenum2 ? (student.phonenum1 ? student.phonenum1 : student.phonenum2) : student.email
            },
            showImage: true,
            altImage: "icon",
            imageSrc: student.dpUrl,            

          });
        })

        this.PageTitle = "Students";
        this.noOfValues = response[0]?.totalRows;
        this.errMessage = "";
        this.showError = false;
      }

      else if(res.statuscode == 204){
        if(this.pageNum == 1){
          this.errMessage = "No students";
          this.showError = true;
        }
        else{
          this.noMoreValues = true;
        }
      }
      else if(res.statuscode == 401){
        this.errMessage = res.status;
        this.showError = true;
      }

      else {
        this.presentToast(res.status);
      }

      this.isLoading = false;
      
    }, (err) => {
      this.isLoading = false;
      this.presentToast(CHECK_INTERNET_CON);
    })
  }

  onSelectChanged() {

    this.isLoading = true;
    this.noOfValues = null;
    this.pageNum = 1;
    this.cards = [];

    if(this.courseId == "") {
      this.getCourses();
    }
    else {
      this.getStudents();
    }

  }

  enterSearchMode() {
    this.searchMode = true;
    if(this.inputFirstLoad == true) {
      this.inputFirstLoad = false;
    }

    this.errMessage = "";
    this.showError = false;
  }

  exitSearchMode() {
    this.searchMode = false;
    this.searchString = '';
    this.errMessage = "";
    this.showError = false;
    this.pageNum = 1;
    this.scroll.disabled = false;
    this.noMoreValues = false;
  }

  search() {
    if(this.searchString.trim() == "") {
      this.lastSearchString = this.searchString;
      this.filterCards = [];
      return;
    }

    this.pageNum = 1;
    this.filterCards = [];
    this.scroll.disabled = false;
    this.searchRemote(this.searchString.trim());
    this.lastSearchString = this.searchString.trim();
  }

  reset() {
    this.pageNum = 1;
    this.scroll.disabled = false;
    this.cards = [];
    this.filterCards = [];
    this.formControl.setValue("");
    this.searchMode = false;
    this.searchString = "";
    this.errMessage = "";
    this.showError = false;
    this.noMoreValues = false;
    this.searchMode = false;
    this.searchString = "";
  }

  async searchRemote(searchString: string) {
    this.isLoading = true;
    
    const subClass = this.formControl.value?.trim();

    this.studentService.viewStudent({
      updateType: "5",
      pageSize: "20",
      pageNum: this.pageNum.toString(),
      qString: this.courseId,
      qStringc: searchString,
    })
      .subscribe(res => {
        if (res.statuscode == 200) {
          res.dataResponse.forEach(student => {
            this.filterCards.push({
              showImage: true,
              altImage: "icon",
              cardData: student,
              imageSrc: student.dpUrl,
              details: {
                "Name": student.fullName,
                "Guardian": student.nextOfKin,
                "Contact": student.phonenum1 || student.phonenum2 ? (student.phonenum1 ? student.phonenum1 : student.phonenum2) : student.email
              }
            });
          });
          this.showError = false;
          
        }
        else if (res.statuscode == 204) {
          if (this.pageNum == 1) {
            this.errMessage = "Oops, no result ☹😝";
            this.showError = true;
            this.filterCards = [];
          }
          else {
            this.noMoreValues = true;
          }
        }
        else if (res.statuscode == 401) {
          this.errMessage = "Unauthorised";
          this.showError = true;
        }
        else {
          this.presentToast(res.status);
        }

        this.isLoading = false;

      }, (err) => {
        this.isLoading = false;

        this.presentToast(CHECK_INTERNET_CON);
      }) 
  }

  async refresh(e?) {
    if(this.isLoading || this.courseId == "") {
      e?.target.complete();
      return;
    }
    
    this.isLoading = true;
    this.pageNum = 1;
    if(this.searchMode) {
      this.filterCards = [];
      this.search();
    }
    else {
      this.cards = [];
      await this.getStudents();
    }
    e?.target.complete();
  }

  async loadData(e) {
    this.pageNum++;
    if(this.searchMode){
      this.searchRemote(this.searchString.trim());
    }
    else {
      await this.getStudents();
    }
    if(this.noMoreValues) {
      e.target.disabled = true;
    }
    else {
      e.target.complete();
    }

  }


  async view(e) {
    const modal = await this.modalCtrl.create({
      component: ViewResultComponent,
      id: viewResultModalID,
      componentProps: {
        studentId: e.cardData.studentId,
        courseId: this.courseId
      }
    });

    await modal.present();

  }

  toggleSearchInput() {
    if(this.inputFirstLoad == true) {
      this.inputFirstLoad = false;
    }
  }

  ionViewWillEnter() {
    this.inputFirstLoad = true;
  }

  async presentToast(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      position: "bottom",
      duration: 3000
    });

    return await toast.present();
  }
}
