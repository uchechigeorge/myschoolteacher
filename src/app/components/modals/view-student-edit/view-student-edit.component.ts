import { Component, OnInit, Input, ViewChildren, ViewChild } from '@angular/core';
import { ModalController, Platform, LoadingController, AlertController, ToastController } from '@ionic/angular';
import { MatSelect } from '@angular/material/select';
import { MatDatepicker } from '@angular/material/datepicker';

import { ISelectOptions, ISelectMultipleOptions, IEditInput } from 'src/app/models/list-models';
import { StudentService } from 'src/app/services/student.service';
import { CHECK_INTERNET_CON } from '../../login-form/login-form.component';
import { viewStudentEditModalID } from 'src/app/models/components-id';
import { EditDetailsInputComponent } from '../../edit-details-input/edit-details-input.component';

const LOADER_ID = "update-student-loader";

@Component({
  selector: 'app-view-student-edit',
  templateUrl: './view-student-edit.component.html',
  styleUrls: ['./view-student-edit.component.scss'],
})
export class ViewStudentEditComponent implements OnInit {

  @Input() studentId: string;

  public isLoading: boolean = true;
  public showError: boolean = false;
  public errMessage: string = "";
  
  public DP: string = '';
  @ViewChildren('inputs') detailInputs: EditDetailsInputComponent[];

  public isDeleting: boolean = false;

  public details: IEditInput[] = [
    {
      id: EditInputs.FirstName,
      model: "",
      label: 'First Name',
      hasHeader: true,
      headerTitle: 'Name',
      icon: 'person',
      type: 'text',
      valiators: ['required', 'maxLength'],
      inputChange: (e) => {
        this.getInput(EditInputs.FirstName).model = e.model?.trim();
      },
      updateInput: async () => {
        await this.showLoading();
        let value = await this.studentService.updateFirstName({ studentid: this.studentId, firstName: this.getInput(EditInputs.FirstName).model?.trim() })
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
      id: EditInputs.LastName,
      model: '',
      label: 'Last Name',
      icon: 'person',
      type: 'text',
      valiators: ['required', 'maxLength'],
      inputChange: (e) => {
        this.getInput(EditInputs.LastName).model = e.model?.trim();
      },
      updateInput: async () => {
        await this.showLoading();
        let value = await this.studentService.updateLastName({ studentid: this.studentId, lastName: this.getInput(EditInputs.LastName).model?.trim() })
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
      id: EditInputs.OtherNames,
      model: '',
      label: 'Other Names',
      icon: 'person',
      type: 'text',
      valiators: ['maxLength'],
      inputChange: (e) => {
        this.getInput(EditInputs.OtherNames).model = e.model?.trim();
      },
      updateInput: async () => {
        await this.showLoading();
        let value = await this.studentService.updateOtherNames({ studentid: this.studentId, otherNames: this.getInput(EditInputs.OtherNames).model?.trim() })
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
      id: EditInputs.Gender,
      model: '',
      label: 'Gender',
      icon: 'person',
      type: 'select',
      valiators: ['maxLength'],
      selectOptions: this.getGenderOptions(),
      selectMultiple: false,
      inputChange: (e) => {
        this.getInput(EditInputs.Gender).model = e.model?.trim();
      },
      updateInput: async () => {
        await this.showLoading();
        let value = await this.studentService.updateGender({ studentid: this.studentId, gender: this.getInput(EditInputs.Gender).model?.trim() })
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
      id: EditInputs.UserName,
      model: '',
      label: 'Username',
      icon: 'account_circle',
      type: 'text',
      noEdit: true,
      hasHeader: true,
      headerTitle: 'User Login Credentials',
      valiators: ['required', 'maxLength'],
      inputChange: (e) => {
        
      },
      updateInput: async () => {
        return true;
      }
    },
    {
      id: EditInputs.Password,
      model: 'setpassword',
      label: 'Password',
      icon: 'vpn_key',
      type: 'password',
      valiators: ['required', 'maxLength'],
      inputChange: (e) => {
        this.getInput(EditInputs.Password).model = e.model?.trim();
      },
      updateInput: async () => {
        await this.showLoading();
        let value = await this.studentService.updatePassword({ studentid: this.studentId, password: this.getInput(EditInputs.Password).model?.trim() })
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
      id: EditInputs.ScratchCard,
      model: '',
      label: 'Scratch Card',
      icon: 'credit_card',
      type: 'text',
      valiators: ['maxLength'],
      noEdit: true,
      showSecondaryBtn: true,
      secondaryIcon: "restart_alt",
      inputChange: (e) => {
        this.getInput(EditInputs.ScratchCard).model = e.model?.trim();
      },
      secondaryBtnCLick: async () => {
        await this.showLoading();

        const scratchCardNumber = this.generateScratchCard();

        await this.studentService.updateScratchCard({ studentid: this.studentId, scratchCardNumber })
        .toPromise()
        .then(res => {
          if(res.statuscode == 200) {
            this.detailInputs.find(d => d.id == EditInputs.ScratchCard).formValue = this.formatCardNo(scratchCardNumber);
          }

          return this.proceed(res);
        }, (err) => {
          this.dismissLoading();
          this.presentToast(CHECK_INTERNET_CON);
          return false;
        });
      },
      updateInput: async () => {
        
      }
    },
    {
      id: EditInputs.Courses,
      model: '',
      label: 'Course',
      icon: 'book',
      type: 'select',
      selectOptions: [],
      selectMultiple: true,
      multipleSelectOptions: true,
      inputChange: (e) => {
        this.getInput(EditInputs.Courses).model = e.model;
      },
      updateInput: async () => {
        await this.showLoading();
        let value = await this.studentService.updateCourse({ studentId: this.studentId, courseIds: this.getInput(EditInputs.Courses).model })
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
      id: EditInputs.NextOfKin,
      model: '',
      label: 'Next of Kin/Guardian',
      icon: 'escalator_warning',
      type: 'text',
      headerTitle: 'Other Details',
      hasHeader: true,
      valiators: ['maxLength'],
      inputChange: (e) => {
        this.getInput(EditInputs.NextOfKin).model = e.model?.trim();
      },
      updateInput: async () => {
        await this.showLoading();
        let value = await this.studentService.updateNextOfKin({ studentid: this.studentId, nextOfKin: this.getInput(EditInputs.NextOfKin).model })
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
      id: EditInputs.PhoneNumber1,
      model: '',
      label: 'Guardians Phone Number 1',
      icon: 'phone',
      type: 'number',
      valiators: ['negative', 'maxLength'],
      inputChange: (e) => {
        this.getInput(EditInputs.PhoneNumber1).model = e.model?.trim();
      },
      updateInput: async () => {
        await this.showLoading();
        let value = await this.studentService.updatePhoneNumber({ studentid: this.studentId, phoneNumber: [
          this.getInput(EditInputs.PhoneNumber1).model?.trim(),
          this.getInput(EditInputs.PhoneNumber2).model?.trim(),
        ]
        })
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
      id: EditInputs.PhoneNumber2,
      model: '',
      label: 'Guardians Phone Number 2',
      icon: 'phone',
      type: 'number',
      valiators: ['negative', 'maxLength'],
      inputChange: (e) => {
        this.getInput(EditInputs.PhoneNumber2).model = e.model?.trim();
      },
      updateInput: async () => {
        await this.showLoading();
        let value = await this.studentService.updatePhoneNumber({ studentid: this.studentId, phoneNumber: [
          this.getInput(EditInputs.PhoneNumber1).model?.trim(),
          this.getInput(EditInputs.PhoneNumber2).model?.trim(),
        ]
        })
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
      id: EditInputs.Email,
      model: '',
      label: 'Guardians Email',
      icon: 'email',
      type: 'email',
      valiators: ['email', 'maxLength'],
      inputChange: (e) => {
        this.getInput(EditInputs.Email).model = e.model?.trim();
      },
      updateInput: async () => {
        await this.showLoading();
        let value = await this.studentService.updateEmail({ studentid: this.studentId, email: this.getInput(EditInputs.Email).model?.trim() })
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
      id: EditInputs.DOB,
      model: '',
      label: 'Date of Birth',
      icon: 'cake',
      type: 'date',
      valiators: ['maxLength'],
      inputChange: (e) => {
        this.getInput(EditInputs.DOB).model = e.model;
      },
      updateInput: async () => {
        const dateString = this.getInput(EditInputs.DOB).model;
        const date = new Date(dateString);
        const dob = dateString ? date.toLocaleDateString() : "";
        
        await this.showLoading();
        let value = await this.studentService.updateDOB({ studentid: this.studentId, dob })
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

  @ViewChildren(MatSelect) selectElems: MatSelect[];
  @ViewChild(MatDatepicker) datePicker: MatDatepicker<any>;

  constructor(
    private platform: Platform,
    private modalCtrl: ModalController,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private studentService: StudentService,
  ) { 
    this.setBackBtnPriority();
  }


  ionViewWillEnter() {
    this.getStudents();
    this.getClasses();
    this.getCourses();
    this.getScratchCard();
  }

  ngOnInit() {
    
  }

  getInput(id: EditInputs) {
    return this.details?.find(detail => detail.id == id);
  }

  async getScratchCard() {
    this.studentService.viewScratchCard({
      updateType: "1",
      studentId: this.studentId,
    })
    .subscribe(async (res) => {
      if(res.statuscode == 200) {
        const response = res.dataResponse as Array<any>;
        const cardNo = response[0].scratchCardNo;

        const input = this.detailInputs.find(d => d.id == EditInputs.ScratchCard);

        if(input)
          input.formValue = this.formatCardNo(cardNo);
        else 
          this.getScratchCard();
        return response;
      }
    });

  }

  async getStudents() {
    this.studentService.viewStudent({
      updateType: "2",
      pageSize: "10",
      pageNum: "1",
      studentId: this.studentId,
    })
    .subscribe(res => {
      if(res.statuscode == 200){
        let studentData = res.dataResponse[0];
       
        this.getInput(EditInputs.FirstName).model = studentData.firstName;
        this.getInput(EditInputs.LastName).model = studentData.lastName;
        this.getInput(EditInputs.OtherNames).model = studentData.otherNames;
        this.getInput(EditInputs.Gender).model = studentData.gender;
        this.getInput(EditInputs.UserName).model = studentData.username;
        this.getInput(EditInputs.Password).model = "somepassword";
        this.getInput(EditInputs.NextOfKin).model = studentData.nextOfKin;
        this.getInput(EditInputs.PhoneNumber1).model = studentData.phonenum1;
        this.getInput(EditInputs.PhoneNumber2).model = studentData.phonenum2;
        this.getInput(EditInputs.Email).model = studentData.email;
        this.getInput(EditInputs.DOB).model = studentData.dob;
        this.DP = studentData.dpUrl;
                
      }
      else if(res.statuscode == 204){
       this.presentToast("Unkwown error. Try Again");
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

  async getCourses() {
    let selectCourses: ISelectMultipleOptions[] = [];
    const courses = await this.studentService.viewCourse({
      updateType: "10"
    }).toPromise()
    .then(async (res) => {
      if(res.statuscode) {
        const response = res.dataResponse as Array<any>;;
        return response;
      }
    });

    const studentCourse = await this.studentService.viewCourse({
      updateType: "5",
      pageNum: "1",
      pageSize: "1",
      qString: this.studentId,
    }).toPromise()
    .then(async (res) => {
      if(res.statuscode == 200) {
        const response = res.dataResponse as Array<any>;
        return response;
      }
    });

    if(!courses) return;
    
    const classes = await this.studentService.viewClass({
      updateType: "10",
    }).toPromise()
    .then(async (res) => {
      if(res.statuscode == 200) {
        const response = res.dataResponse as Array<any>;
        return response;
      }
    });
    
    classes.forEach(c => {
      c.courses = [];
      courses.forEach(s => {
        if(s.classId == c.classId)
          c.courses.push(s);
      });
    });

    if(!courses || !classes) return;
    
    classes.forEach(c => {
        if(c.courses.length > 0){ 
        selectCourses.push({
          label: c.className,
          options: c.courses.map(course => {
            return {
              text: course.course,
              value: course.courseId,
            }
          }),
        });
      }
    });

    this.getInput(EditInputs.Courses).selectOptions = selectCourses;
    if(studentCourse){
      this.getInput(EditInputs.Courses).model = studentCourse.map((course) => course.courseId);
    }
    return selectCourses;
  }

  async getClasses() {
    const selectClasses: ISelectMultipleOptions[] = [];
    const classes = await this.studentService.viewClass({
      updateType: "10",
    }).toPromise()
    .then(async (res) => {
      if(res.statuscode == 200) {
        const response = res.dataResponse as Array<any>;
        return response;
      }
    });

    const subClasses = await this.studentService.viewSubClass({
      updateType: "10",
    }).toPromise()
    .then(async (res) => {
      if(res.statuscode == 200) {
        const response = res.dataResponse as Array<any>;
        return response;
      }
    });

    if(!classes || !subClasses) return;

    const studentClass = await this.studentService.viewSubClass({
      updateType: "5",
      pageNum: "1",
      pageSize: "1",
      qString: this.studentId,
    }).toPromise()
    .then(async (res) => {
      if(res.statuscode == 200) {
        const response = res.dataResponse as Array<any>;
        return response[0];
      }
    });

    classes.forEach(c => {
      c.subClasses = [];
      subClasses.forEach(s => {
        if(s.parentClassId == c.classId)
          c.subClasses.push(s);
      });
    });

    classes.forEach(c => {
      if(c.subClasses.length > 0){
        selectClasses.push({
          label: c.className,
          options: c.subClasses.map(s => {
            return {
              text: s.subClassName,
              value: s.subClassId,
            }
          })
        })
      }
    });
    
    return {selectClasses, classes};
  }

  getGenderOptions(): ISelectOptions[] {
    return [
      { text: 'Male', value: 'male' },
      { text: 'Female', value: 'female' },
      { text: "Rather not say", value: "custom" }
    ]
  }

  refresh(e) {
    
  }

  proceed(res: any) {
    if(res.statuscode == 200) {
      this.dismissLoading();

      this.studentService.saveCredentials({
        teacherId: res.dataResponse.teacherId,
        token: res.dataResponse.token
      });
      this.presentToast("Successful");
      return true;
    }
    else {
      this.dismissLoading();
      this.presentToast(res.status);
      return false;
    }
  }

  delete() {
    if(this.isDeleting) return;

    this.isDeleting = true;

    this.studentService.updateClass({ studentId: this.studentId, classId: "" })
    .subscribe(async (res) => {
      if(res.statuscode == 200) {

        await this.studentService.saveCredentials({
          teacherId: res.dataResponse.teacherId,
          token: res.dataResponse.token
        });
        await this.presentToast("Successful");
        this.dismissModal();
      }
      else {
        await this.presentToast(res.status);
      }
      
      this.isDeleting = false;
    }, err => {
      this.presentToast(CHECK_INTERNET_CON);
      this.isDeleting = false;
    })
  }

  async showDeleteAlert() {
    const alert = await this.alertCtrl.create({
      header: "Alert",
      message: "Are you sure want to remove?",
      buttons: [
        { text: "Yes", handler: () => this.delete() },
        { text: "Cancel", role: "cancel" }
      ]
    });

    await alert.present();
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

  generateScratchCard() {
    let cardNo = '';
    const chars = "QWERTYUIOPASDFGHJKLZXCVBNM0123456789";
    
    for (let i = 0; i < 16; i++) {
      let index = Math.floor(Math.random() * 36)
      cardNo += chars[index];
    }

    return cardNo;
  }

  formatCardNo(cardNo: string) {
    let cardArr = cardNo.split('');

    let newCardArr = [];
    cardArr.forEach((val, i) => {
      if(i % 4 == 0 && i != 0) {
        newCardArr.push("-");
      }
      newCardArr.push(val);
    });

    let newCardNo = newCardArr.join('');
    return newCardNo;
  }

  async presentToast(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      position: "bottom",
      duration: 3000
    });

    return await toast.present();
  }

  setBackBtnPriority() {
    this.platform.backButton.subscribeWithPriority(205, () => {
      if(this.datePicker.opened)
        this.datePicker.close();
    });
    this.platform.backButton.subscribeWithPriority(200, () => {
      this.selectElems.forEach(elem => {
        if(elem.panelOpen)
          elem.close();
      })
    });
  }

  dismissModal() {
    this.modalCtrl.dismiss('', '', viewStudentEditModalID);
  }
}

enum EditInputs{
  FirstName,
  LastName,
  OtherNames,
  Gender,
  DOB,
  Email,
  NextOfKin,
  PhoneNumber1,
  PhoneNumber2,
  UserName,
  Password,
  ScratchCard,
  Courses,
  Class,
}