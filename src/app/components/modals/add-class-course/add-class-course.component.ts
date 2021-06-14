import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { IonInfiniteScroll, ModalController, ToastController, LoadingController } from '@ionic/angular';
import { StudentService } from 'src/app/services/student.service';
import { CHECK_INTERNET_CON } from '../../login-form/login-form.component';
import { ICardDetail } from 'src/app/models/list-models';
import { addClassCourseModalID } from 'src/app/models/components-id';

const LOADER_ID = "add-class-course-loader";

@Component({
  selector: 'app-add-class-course',
  templateUrl: './add-class-course.component.html',
  styleUrls: ['./add-class-course.component.scss'],
})
export class AddClassCourseComponent implements OnInit {

  @Input() public classId: string;

  public searchString: string = "";
  public lastSearchString: string = "";
  public cards: ICardDetail[] = [];
  public filterCards: ICardDetail[] = [];
  public searchMode: boolean = false;
  public inputFirstLoad: boolean = true;
  public showError = false;
  public isLoading = false;
  public errMessage = "";
  public pageNum = 1;
  public noMoreCourses = false;
  
  public hasClass = false;
  public className = "";
  
  @ViewChild('scroll') scroll: IonInfiniteScroll;

  constructor(
    private modalCtrl: ModalController,
    private courseService: StudentService,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
  ) { }

  ngOnInit() {}

  ionViewDidEnter() {
    this.getClass();
  }

  async loadData(e) {
    this.pageNum++;
    this.searchRemote(this.searchString.trim());
    if(this.noMoreCourses) {
      e.target.disabled = true;
    }
    else {
      e.target.complete();
    }
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
    this.courseService.viewCourse({
      updateType: "3",
      pageSize: "20",
      pageNum: this.pageNum.toString(),
      qString: searchString,
    })
      .subscribe(res => {
        if (res.statuscode == 200) {
          res.dataResponse.forEach(course => {
            this.filterCards.push({
              showImage: false,
              cardData: course,
              details: {
                "Course": course.coure,
                "Name": course.courseName,
                "Class": course.courseClass,
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
            this.noMoreCourses = true;
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

  async getClass() {
    await this.courseService.viewSubClass({
      updateType: "2",
      classId: this.classId,
      pageNum: "1",
      pageSize: "1",
    }).toPromise()
    .then(async (res) => {
      if(res.statuscode == 200) {
        const response = res.dataResponse as Array<any>;
        this.hasClass = true;
        this.className = response[0].subClassName;
      }
    });

  }

  async add(e) {
    await this.showLoading();

    this.courseService.addClassCourse({
      classId: this.classId,
      courseIds: [e.cardData.courseId],
    })
    .subscribe(async res => {
      if(res.statuscode == 200) {
        const response = res.dataResponse;
        await this.courseService.saveCredentials({
          teacherId: response.teacherId,
          token: response.token,
        });

        this.presentToast(`${ e.cardData.course } has been added to ${ this.className }`);
      }
      else {
        this.presentToast(res.status);
      }
      
      this.dismissLoading();
    }, err => {
      this.dismissLoading();
      this.presentToast(CHECK_INTERNET_CON);
    })
  }

  enterSearchMode() {
    this.searchMode = true;
    this.toggleSearchInput();
  }

  exitSearchMode() {
    this.searchMode = false;
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

  async showLoading(message?: string) {
    if(!message) message = "Uploading credentials";
    const loader = await this.loadingCtrl.create({
      id: LOADER_ID,
      message,
      spinner: "crescent",
    });

    return await loader.present();
  }

  async dismissLoading() {
    await this.loadingCtrl.dismiss();
  }

  dismissModal() {
    this.modalCtrl.dismiss('', '', addClassCourseModalID);
  }

}
