import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { IonInfiniteScroll, ModalController, ToastController, LoadingController } from '@ionic/angular';
import { StudentService } from 'src/app/services/student.service';
import { ICardDetail } from 'src/app/models/list-models';
import { CHECK_INTERNET_CON } from '../../login-form/login-form.component';
import { searchStudentModalID } from 'src/app/models/components-id';

const LOADER_ID = "add-student-class-loader";

@Component({
  selector: 'app-search-student',
  templateUrl: './search-student.component.html',
  styleUrls: ['./search-student.component.scss'],
})
export class SearchStudentComponent implements OnInit {

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
  public noMoreStudents = false;
  
  public hasClass = false;
  public className = "";
  
  @ViewChild('scroll') scroll: IonInfiniteScroll;

  constructor(
    private modalCtrl: ModalController,
    private studentService: StudentService,
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
    if(this.noMoreStudents) {
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
    this.studentService.viewStudent({
      updateType: "12",
      pageSize: "20",
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

  async getClass() {
    await this.studentService.viewSubClass({
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

    this.studentService.updateClass({
      studentId: e.cardData.studentId,
      classId: this.classId,
    })
    .subscribe(async res => {
      if(res.statuscode == 200) {
        const response = res.dataResponse;
        this.studentService.saveCredentials({
          teacherId: response.teacherId,
          token: response.token,
        });

        this.presentToast(`${ e.cardData.fullName } has been added to ${ this.className }`);
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
    this.modalCtrl.dismiss('', '', searchStudentModalID);
  }

}
