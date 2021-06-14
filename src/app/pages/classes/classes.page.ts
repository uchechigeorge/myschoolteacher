import { Component, OnInit, ViewChild } from '@angular/core';
import { ICardDetail, IFilterCard, ISelectOptions } from 'src/app/models/list-models';
import { ModalController, ToastController, IonInfiniteScroll, PopoverController } from '@ionic/angular';
import { Plugins } from "@capacitor/core";
import { MatButtonToggleChange } from '@angular/material/button-toggle';
import { ViewStudentEditComponent } from 'src/app/components/modals/view-student-edit/view-student-edit.component';
import { viewStudentEditModalID, searchStudentModalID, addClassCourseModalID, viewClassCourseModalID } from 'src/app/models/components-id';
import { StudentService } from 'src/app/services/student.service';
import { CHECK_INTERNET_CON } from 'src/app/components/login-form/login-form.component';
import { FormControl } from '@angular/forms';
import { SearchStudentComponent } from 'src/app/components/modals/search-student/search-student.component';
import { ClassCoursePopoverComponent } from 'src/app/components/class-course-popover/class-course-popover.component';
import { AddClassCourseComponent } from 'src/app/components/modals/add-class-course/add-class-course.component';
import { ViewClassCourseComponent } from 'src/app/components/modals/view-class-course/view-class-course.component';

const { Storage } = Plugins;

@Component({
  selector: 'app-classes',
  templateUrl: './classes.page.html',
  styleUrls: ['./classes.page.scss'],
})
export class ClassesPage implements OnInit {

  public formControl = new FormControl("");

  public cards: ICardDetail[] = [];
  public filterCards: ICardDetail[] = [];
  public searchMode: boolean = false;
  public searchString: string = '';
  public lastSearchString: string = '';
  public inputFirstLoad: boolean = true;

  public showError = false;
  public isLoading = true;
  public errMessage = "";
  public pageNum = 1;
  public noMoreValues = false;
  public noOfValues: number;
  public selectClasses: ISelectOptions[] = [];
  public PageTitle: "Students" | "Classes" = "Classes";

  @ViewChild('scroll') scroll: IonInfiniteScroll; 

  constructor(
    private modalCtrl: ModalController,
    private studentService: StudentService,
    private toastCtrl: ToastController,
    private popoverCtrl: PopoverController,
  ) { }

  ngOnInit() { }

  ionViewDidEnter() {
    this.isLoading = true;
    this.reset();
    this.getClasses();
  }

  get subClassId() {
    return this.formControl.value?.trim();
  }

  async getClasses() {
    
    const { value } = await Storage.get({ key: "teacherid" });
    this.selectClasses = [];
    this.studentService.viewSubClass({
      updateType: "6",
      pageSize: "20",
      pageNum: "1",
      qString: value,
    })
    .subscribe(res => {
      if(res.statuscode == 200) {
        const response = res.dataResponse;
        response.forEach(subClass => {
          this.selectClasses.push({
           text: subClass.subClassName,
           value: subClass.subClassId
        });
      });

      this.PageTitle = "Classes";
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
      updateType: "4",
      pageSize: "20",
      pageNum: this.pageNum.toString(),
      qString: this.subClassId
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
    const subClass = this.formControl.value?.trim();
    this.isLoading = true;
    this.noOfValues = null;
    this.pageNum = 1;
    this.cards = [];

    if(this.subClassId == "") {
      this.getClasses();
    }
    else {
      this.getStudents();
    }

  }

  async refresh(e?) {
    if(this.isLoading || this.subClassId == "") {
      e?.target.complete();
      return;
    }
    
    const subClass = this.formControl.value?.trim();
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
    this.errMessage = "";
    this.showError = false;
    this.pageNum = 1;
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

  async searchRemote(searchString: string) {
    this.isLoading = true;
    
    const subClass = this.formControl.value?.trim();

    this.studentService.viewStudent({
      updateType: "4",
      pageSize: "10",
      pageNum: this.pageNum.toString(),
      qString: subClass,
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

  async showMenu(e) {
    const popover = await this.popoverCtrl.create({
      component: ClassCoursePopoverComponent,
      event: e,
      componentProps: {
        'options': [
          { 
            text: "View Courses", 
            handler: async () => {
              if(this.subClassId == "") return;
              
              const modal = await this.modalCtrl.create({
                component: ViewClassCourseComponent,
                id: viewClassCourseModalID,
                componentProps: {
                  classId: this.subClassId,
                }
              });

              await modal.present();

              this.popoverCtrl.dismiss();
            } 
          },
          { 
            text: "Add Courses", 
            handler: async () => {
              if(this.subClassId == "") return;

              const modal = await this.modalCtrl.create({
                component: AddClassCourseComponent,
                id: addClassCourseModalID,
                componentProps: {
                  classId: this.subClassId,
                }
              });

              await modal.present();

              this.popoverCtrl.dismiss();
            } 
          },
        ]
      }
    });

    await popover.present();
  }

  async add() {
    if(this.subClassId == "") return;

    const modal = await this.modalCtrl.create({
      component: SearchStudentComponent,
      id: searchStudentModalID,
      componentProps: {
        "classId": this.subClassId
      }
    });

    await modal.present();
    await modal.onWillDismiss();
    this.refresh();
  }

  async view(e) {
    const modal = await this.modalCtrl.create({
      component: ViewStudentEditComponent,
      id: viewStudentEditModalID,
      componentProps: {
        "studentId": e.cardData.studentId,
      }
    });

    await modal.present();
    await modal.onWillDismiss();
    this.refresh();
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
