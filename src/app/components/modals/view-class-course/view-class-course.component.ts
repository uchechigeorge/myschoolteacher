import { Component, OnInit, Input } from '@angular/core';
import { ICardDetail } from 'src/app/models/list-models';
import { ModalController, ToastController } from '@ionic/angular';
import { StudentService } from 'src/app/services/student.service';
import { CHECK_INTERNET_CON } from '../../login-form/login-form.component';
import { AuthService } from 'src/app/services/auth.service';
import { viewClassCourseModalID, addClassCourseModalID } from 'src/app/models/components-id';
import { AddClassCourseComponent } from '../add-class-course/add-class-course.component';

@Component({
  selector: 'app-view-class-course',
  templateUrl: './view-class-course.component.html',
  styleUrls: ['./view-class-course.component.scss'],
})
export class ViewClassCourseComponent implements OnInit {

  @Input() classId: string;

  public cards: ICardDetail[] = [];
  public filterCards: ICardDetail[] = [];
  public searchMode: boolean = false;
  public searchString: string = '';
  public lastSearchString: string = '';
  public inputFirstLoad: boolean = true;

  public isLoading: boolean = true;
  public errMessage: string = "";
  public showError: boolean = false;
  public pageNum: number = 1;
  public noOfCourses: number;
  public noMoreCourses: boolean = false;

  constructor(
    private courseService: StudentService,
    private teacherService: AuthService,
    private modalCtrl: ModalController,
    private toastCtrl: ToastController,
  ) { }

  ngOnInit() {
  }

  ionViewDidEnter() {
    this.getCourses();
  }

  getCards() {
    return this.cards;
  }

  async refresh(e?) {
    if(this.isLoading) {
      e?.target.complete()
      return;
    };

    this.isLoading = true;
    this.pageNum = 1;

    if(this.searchMode) {
      this.filterCards = [];
      this.search();
    }
    else {
      this.cards = [];
      await this.getCourses();
    }
    e?.target.complete()
  }

  async loadData(e) {
    this.pageNum++;
    if(this.searchMode){
      // await this.searchRemote(this.searchString.trim());
    }
    else {
      await this.getCourses();
    }

    if(this.noMoreCourses) {
      e.target.disabled = true;
    }
    else {
      e.target.complete();
    }

  }

  async getCourses() {
    this.courseService.viewCourse({
      updateType: "7",
      pageSize: "20",
      pageNum: this.pageNum.toString(),
      qString: this.classId
    })
    .subscribe(async (res) => {
      if(res.statuscode == 200){
        res.dataResponse.forEach(async (course) => {
          this.cards.push({
            showImage: false,
            cardData: course,
            details: {
              "Name": course.courseName,
              "Class": course.courseClass,
              "Teacher(s)": "",
            }
          });
        });

        this.noOfCourses = res.dataResponse[0].totalRows;
        this.cards.forEach(async card => {
          const courseTeachers = (await this.getTeachers(card.cardData.courseId)) as Array<any>;
          card.details = {
            "Name": card.cardData.courseName,
            "Class": card.cardData.courseClass,
            "Teacher(s)": courseTeachers.length <= 1 ? courseTeachers[0].fullName : courseTeachers[0].fullName + " and " + (courseTeachers.length - 1).toString() + " other(s)",
          }
        });

        this.errMessage = "";
        this.showError = false;
      }
      else if(res.statuscode == 204){
        if(this.pageNum == 1){
          this.errMessage = "No courses";
          this.showError = true;
        }
        else{
          this.noMoreCourses = true;
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

  async getTeachers(courseId: string): Promise<any> {
    const value = await this.teacherService.viewTeacher({
      updateType: "5",
      pageSize: "20",
      pageNum: "1",
      qString: courseId,
    }).toPromise()
    .then(async (res) => {
      if(res.statuscode == 200) {
        const response = res.dataResponse;
        return response;
      }
      else {
        return [{}];
      }
    }, err => {
      return [{}];
    });

    return value;
  }

  enterSearchMode() {
    this.searchMode = true;
    this.toggleSearchInput();
  }

  exitSearchMode() {
    this.searchMode = false;
  }

  search() {
    if(this.searchString.trim() == "") {
      this.lastSearchString = this.searchString;
      this.filterCards = [];
      return;
    }

    // this.filterCards = this.cards.filter(card => {
    //   const details = Object.values(card.details);
    //   return details.some(detail => {
    //     let regEx = new RegExp(this.searchString.trim(), 'gi');
    //     let result = regEx.test(detail);
    //     return result;
    //   });
    // });

    this.lastSearchString = this.searchString.trim();
  }

  async view(e) {
    // const modal = await this.modalCtrl.create({
    //   component: ViewCourseComponent,
    //   id: viewCourseModalID,
    //   componentProps: {
    //     "courseId": e.cardData?.courseId,
    //   }
    // });

    // await modal.present();
    // await modal.onWillDismiss();
    // this.refresh();
  }

  async add() {
    const modal = await this.modalCtrl.create({
      component: AddClassCourseComponent,
      id: addClassCourseModalID,
      componentProps: {
        classId: this.classId
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

  async presentToast(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      position: "bottom",
      duration: 3000
    });

    return await toast.present();
  }

  dismissModal() {
    this.modalCtrl.dismiss('', '', viewClassCourseModalID);
  }

  ionViewWillEnter() {
    this.inputFirstLoad = true;
  }
}

