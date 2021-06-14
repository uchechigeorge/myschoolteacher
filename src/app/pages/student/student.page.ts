import { Component, OnInit, ViewChild } from '@angular/core';
import { ICardDetail, IFilterCard } from 'src/app/models/list-models';
import { ModalController, ToastController, IonInfiniteScroll } from '@ionic/angular';
import { ViewStudentComponent } from 'src/app/components/modals/view-student/view-student.component';
import { viewStudentModalID } from 'src/app/models/components-id';
import { CHECK_INTERNET_CON } from 'src/app/components/login-form/login-form.component';
import { StudentService } from 'src/app/services/student.service';

@Component({
  selector: 'app-student',
  templateUrl: './student.page.html',
  styleUrls: ['./student.page.scss'],
})
export class StudentPage implements OnInit {

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
  // Flag to check if data from server in exhausted, for disabling ion infinite scroll
  public noMoreStudents = false;
  public noOfStudents: number;

  @ViewChild('scroll') scroll: IonInfiniteScroll; 

  constructor(
    private studentService: StudentService,
    private modalCtrl: ModalController,
    private toastCtrl: ToastController,
  ) { 
  }

  ngOnInit() { }

  ionViewDidEnter() {
    this.isLoading = true;
    this.reset();
    this.getStudents();
  }

  enterSearchMode() {
    this.searchMode = true;
    this.toggleSearchInput();
  }

  exitSearchMode() {
    this.searchMode = false;
    this.errMessage = "";
    this.showError = false;
    this.pageNum = 1;
  }

  async refresh(e?) {
    if(this.isLoading) return;
    
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
    e?.target.complete()
  }

  async loadData(e) {
    this.pageNum++;
    if(this.searchMode){
      this.searchRemote(this.searchString.trim());
    }
    else {
      await this.getStudents();
    }
    if(this.noMoreStudents) {
      e.target.disabled = true;
    }
    else {
      e.target.complete();
    }

  }

  async getStudents() {
    this.studentService.viewStudent({
      updateType: "1",
      pageSize: "20",
      pageNum: this.pageNum.toString(),
    })
    .subscribe(async (res) => {
      if(res.statuscode == 200){
        res.dataResponse.forEach(async (student) => {
          this.cards.push({
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

        this.noOfStudents = res.dataResponse[0].totalRows;
      }
      else if(res.statuscode == 204){
        if(this.pageNum == 1){
          this.errMessage = "No students";
          this.showError = true;
        }
        else{
          this.noMoreStudents = true;
        }
      }
      else if(res.statuscode == 401) {
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
    this.studentService.viewStudent({
      updateType: "3",
      pageSize: "10",
      pageNum: this.pageNum.toString(),
      qString: searchString,
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
            this.noMoreStudents = true;
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
    this.searchMode = false;
    this.searchString = "";
    this.errMessage = "";
    this.showError = false;
    this.noMoreStudents = false;
    this.searchMode = false;
    this.searchString = "";
  }

  async view(e) {
    const modal = await this.modalCtrl.create({
      component: ViewStudentComponent,
      id: viewStudentModalID,
      componentProps: {
        "studentId": e.cardData.studentId,
      }
    });

    await modal.present();
    await modal.onWillDismiss()
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

