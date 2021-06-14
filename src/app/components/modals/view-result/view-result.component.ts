import { Component, OnInit, Input, ViewChildren } from '@angular/core';
import { ModalController, LoadingController, ToastController } from '@ionic/angular';
import { viewResultModalID } from 'src/app/models/components-id';
import { IEditInput, ISelectOptions } from 'src/app/models/list-models';
import { StudentService } from 'src/app/services/student.service';
import { CHECK_INTERNET_CON } from '../../login-form/login-form.component';
import { EditDetailsInputComponent } from '../../edit-details-input/edit-details-input.component';

const LOADER_ID = "update-result-loader";

@Component({
  selector: 'app-view-result',
  templateUrl: './view-result.component.html',
  styleUrls: ['./view-result.component.scss'],
})
export class ViewResultComponent implements OnInit {

  @Input() studentId: string;
  @Input() courseId: string;

  public DP: string;
  public isLoading: boolean = true;
  public showError: boolean = false;
  public errMessage: string = "";

  @ViewChildren('inputs') detailInputs: EditDetailsInputComponent[];


  public selectGrades: ISelectOptions[] = [];

  public details: IEditInput[] = [
    {
      id: EditInput.StudentName,
      model: "",
      label: 'Student Name',
      icon: 'person',
      type: 'text',
      noEdit: true,
      inputChange: (e) => {
        
      },
      updateInput: async () => {
        return false;
      }
    },
    {
      id: EditInput.Course,
      model: "",
      label: 'Course',
      icon: 'book',
      type: 'text',
      noEdit: true,
      inputChange: (e) => {
        
      },
      updateInput: async () => {
        return false;
      }
    },
    {
      id: EditInput.CA,
      model: "",
      label: 'Continuous Assesment',
      icon: 'book',
      type: 'number',
      inputChange: (e) => {
        this.getInput(EditInput.CA).model = e.model;
      },
      updateInput: async () => {
        await this.showLoading();
        let value = await this.studentService.updateResultCA({ studentId: this.studentId, courseId: this.courseId, ca: this.getInput(EditInput.CA).model })
        .toPromise()
        .then(res => {
          return this.proceed(res);
        }, (err) => {
          this.dismissLoading();
          this.presentToast(CHECK_INTERNET_CON);
          return false;
        });
        
        return value;
      }
    },
    {
      id: EditInput.Exam,
      model: '',
      label: 'Exam',
      icon: 'school',
      type: 'number',
      inputChange: async (e) => {
        this.getInput(EditInput.Exam).model = e.model;

      },
      updateInput: async () => {
        await this.showLoading();
        let value = await this.studentService.updateResultExam({ studentId: this.studentId, courseId: this.courseId, exam: this.getInput(EditInput.Exam).model })
        .toPromise()
        .then(res => {
          return this.proceed(res);
        }, (err) => {
          this.dismissLoading();
          this.presentToast(CHECK_INTERNET_CON);
          return false;
        });
        
        return value;
      }
    },
    {
      id: EditInput.Total,
      model: '',
      label: 'Total',
      icon: 'money',
      type: 'number',
      noEdit: true,
      inputChange: (e) => {
        
      },
      updateInput: async () => {
        return false;
      }
    },
    {
      id: EditInput.Grade,
      model: '',
      label: 'Grade',
      icon: 'grade',
      type: 'select',
      selectMultiple: false,
      selectOptions: [],
      inputChange: (e) => {
        this.getInput(EditInput.Grade).model = e.model;
      },
      updateInput: async () => {
        await this.showLoading();
        let value = await this.studentService.updateResultGrade({ studentId: this.studentId, courseId: this.courseId, gradeId: this.getInput(EditInput.Grade).model })
        .toPromise()
        .then(res => {
          return this.proceed(res);
        }, (err) => {
          this.dismissLoading();
          this.presentToast(CHECK_INTERNET_CON);
          return false;
        });
        
        return value;
      }
    },
  ]

  constructor(
    private modalCtrl: ModalController,
    private studentService: StudentService,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
  ) { }

  ngOnInit() { 
  }
  
  ionViewDidEnter() {
    this.getResults();
    this.getGrades();
  }

  async getResults() {
    this.studentService.viewResult({
      updateType: "1",
      pageSize: "10",
      pageNum: "1",
      qString: this.studentId,
      qStringb: this.courseId
    })
    .subscribe(res => {
      if(res.statuscode == 200){
        let response = res.dataResponse[0];
       
        this.getInput(EditInput.CA).model = response.ca;
        this.getInput(EditInput.Exam).model = response.exam;
        this.getInput(EditInput.StudentName).model = response.studentName;
        this.getInput(EditInput.Total).model = response.total;
        this.getInput(EditInput.Course).model = response.course;
        this.getInput(EditInput.Grade).model = response.gradeId;
        
        const totalValue = this.detailInputs.find(d => d.id == EditInput.Total);
        if(totalValue)
          totalValue.formValue = response.total;

        this.DP = response.studentDP;
        this.isLoading = false;
      }
      else if(res.statuscode == 204) {
        this.getStudent();
      }
      else if(res.statuscode == 401) {
        this.errMessage = "Unauthorised";
        this.showError = true;
        this.isLoading = false;
      }
      else {
        this.presentToast(res.status);
        this.isLoading = false;
      }


    }, (err) => {
      this.isLoading = false;

      this.presentToast(CHECK_INTERNET_CON);
    });
  }

  getStudent() {
    this.studentService.viewStudent({
      updateType: "2",
      pageNum: "1",
      pageSize: "1",
      studentId: this.studentId
    })
    .subscribe(async (res) => {
      if(res.statuscode = 200) {
        const response = res.dataResponse[0];
        this.getInput(EditInput.StudentName).model = response.fullName;
        this.DP = response.dpUrl;
        this.getCourse();
      }
      else {
        this.presentToast(res.status);
      }
    }, (err) => {
      this.isLoading = false;

      this.presentToast(CHECK_INTERNET_CON);
    });
  }

  getCourse() {
    this.studentService.viewCourse({
      updateType: "2",
      pageNum: "1",
      pageSize: "1",
      courseId: this.courseId
    })
    .subscribe(async (res) => {
      if(res.statuscode = 200) {
        const response = res.dataResponse[0];
        this.getInput(EditInput.Course).model = response.course;
        this.DP = response.dpUrl;

        this.isLoading = false;
      }
      else {
        this.presentToast(res.status);
      }
    }, (err) => {
      this.isLoading = false;

      this.presentToast(CHECK_INTERNET_CON);
    });
  }

  getGrades() {
    this.studentService.viewGrades({
      updateType: "10",
      pageSize: "20",
      pageNum: "1",
    }).
    subscribe(async (res) => {
      if(res.statuscode == 200) {
        const response = res.dataResponse;

        const selectGrades = [];
        response.forEach(grade => {
          selectGrades.push({
            text: grade.grade + ` (${ grade.minValue } - ${ grade.maxValue })`,
            value: grade.gradeId
          });
        });

        this.getInput(EditInput.Grade).selectOptions = selectGrades;
      }
    })
  }

  async proceed(res: any) {
    if(res.statuscode == 200) {
      this.dismissLoading();

      await this.studentService.saveCredentials({
        teacherId: res.dataResponse.teacherId,
        token: res.dataResponse.token
      });
      await this.getResults();
      this.getGrade();  
      
      this.presentToast("Successful");
      return true;
    }
    else {
      this.dismissLoading();
      this.presentToast(res.status);
      return false;
    }
  }

  getGrade() {
    this.studentService.viewGrades({
      updateType: "5",
      qString: (parseFloat(this.getInput(EditInput.CA).model || 0) + parseFloat(this.getInput(EditInput.Exam).model || 0)).toString(),
    })
    .subscribe(async (res) => {
      if(res.statuscode == 200) {
        const response = res.dataResponse[0];
        const gradeId = response.gradeId;

        await this.showLoading();
        let value = await this.studentService.updateResultGrade({ studentId: this.studentId, courseId: this.courseId, gradeId })
        .toPromise()
        .then(async (res) => {
          if(res.statuscode == 200) {

            await this.studentService.saveCredentials({
              teacherId: res.dataResponse.teacherId,
              token: res.dataResponse.token
            });
          }

          await this.getResults();
          this.dismissLoading();
        }, (err) => {
          this.dismissLoading();
          this.presentToast(CHECK_INTERNET_CON);
        });
        
        
      }
    })
  }

  getInput(id: EditInput) {
    return this.details?.find(detail => detail.id == id);
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

  async presentToast(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      position: "bottom",
      duration: 3000
    });

    return await toast.present();
  }


  dismissModal() {
    this.modalCtrl.dismiss('', '', viewResultModalID);
  }
}

enum EditInput{
  StudentName,
  Course,
  Term,
  CA,
  Exam,
  Total,
  Grade,
}