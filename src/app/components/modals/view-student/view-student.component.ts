import { Component, OnInit, ChangeDetectorRef, OnDestroy, Input } from '@angular/core';
import { viewStudentModalID } from 'src/app/models/components-id';
import { ModalController, ToastController } from '@ionic/angular';
import { ApiDataService } from 'src/app/services/api-data.service';
import { MediaMatcher } from '@angular/cdk/layout';
import { StudentService } from 'src/app/services/student.service';
import { CHECK_INTERNET_CON } from '../../login-form/login-form.component';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-view-student',
  templateUrl: './view-student.component.html',
  styleUrls: ['./view-student.component.scss'],
})
export class ViewStudentComponent implements OnInit, OnDestroy {

  @Input() studentId: string;

  public FirstName: string = 'Walter';
  public LastName: string = 'Collins';
  public OtherNames: string = 'Soro-Soke Jinwu Ming';
  public Gender: string = 'Male';
  public studentClass: string = 'SS 2A';
  public PhoneNumber1: string = '';
  public PhoneNumber2: string = '';
  public DOB: string = '';
  public DP: string;

  public isLoading: boolean = true;
  public showError: boolean = false;
  public errMessage: string = "";
  

  public details: StudentDetail[] = [
    {
      id: StudentDetailType.FirstName,
      value: "",
      label: 'First Name',
      icon: 'person',
    },
    {
      id: StudentDetailType.LastName,
      value: "",
      label: 'Last Name',
      icon: 'person',
    },
    {
      id: StudentDetailType.OtherNames,
      value: "",
      label: 'Other Names',
      icon: 'person',
    },
    {
      id: StudentDetailType.Gender,
      value: "",
      label: 'Gender',
      icon: 'man',
    },
    {
      id: StudentDetailType.StudentClass,
      value: "",
      label: 'Class',
      icon: 'school',
    },
    {
      id: StudentDetailType.NextOfKin,
      value: "",
      label: "Next Of Kin",
      icon: 'man',
    },
    {
      id: StudentDetailType.PhoneNumber,
      value: "",
      label: "Guardians\' Phone Number",
      icon: 'call',
    },
    {
      id: StudentDetailType.Email,
      value: "",
      label: 'Email',
      icon: 'mail',
    },
    {
      id: StudentDetailType.DOB,
      value: "",
      label: 'Date of Birth',
      icon: 'calendar',
    },
  ]

  public courseDataSource = new MatTableDataSource<ICourseTableData>([]);

  public courseTableData: { position?: number, course: string }[] = [];
  public displayColumns: string[] = ['position', 'course'];
  
  public mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;

  constructor(
    private modalCtrl: ModalController,
    private studentService: StudentService,
    private toastCtrl: ToastController,
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
  ) { 
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnInit() {
  }

  ionViewDidEnter() {
    this.getStudents();
    this.getClass();
    this.getCourses();
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
        let response = res.dataResponse[0];
       
        this.getInput(StudentDetailType.FirstName).value = response.firstName;
        this.getInput(StudentDetailType.LastName).value = response.lastName;
        this.getInput(StudentDetailType.OtherNames).value = response.otherNames;
        this.getInput(StudentDetailType.NextOfKin).value = response.nextOfKin;
        this.getInput(StudentDetailType.Email).value = response.email;
        
        this.DP = response.dpUrl;
        
        let phoneNumbers = [];
        if(response.phonenum1) phoneNumbers.push(response.phonenum1);
        if(response.phonenum2) phoneNumbers.push(response.phonenum2);
        this.getInput(StudentDetailType.PhoneNumber).value = phoneNumbers;
        
        if(response.gender != "male" && response.gender != "female") {
          this.getInput(StudentDetailType.Gender).value = "Rather not say";
        }
        else {
          let gender = response.gender as string;
          gender = gender.slice(0, 1).toUpperCase() + gender.slice(1);
          this.getInput(StudentDetailType.Gender).value = gender;
        }

        const hasDate = !(response?.dob == null || response?.dob == "");

        if(hasDate) {
          const date = new Date(response.dob);
          this.getInput(StudentDetailType.DOB).value = date.toLocaleDateString();
        }
  
        this.errMessage = "";
        this.showError = false;
                
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


  async getClass() {
    await this.studentService.viewSubClass({
      updateType: "5",
      pageNum: "1",
      pageSize: "1",
      qString: this.studentId,
    }).toPromise()
    .then(async (res) => {
      if(res.statuscode == 200) {
        const response = res.dataResponse as Array<any>;
        this.getInput(StudentDetailType.StudentClass).value = response[0]?.subClassName;
      }
    });
  }

  async getCourses() {
    await this.studentService.viewCourse({
      updateType: "5",
      pageNum: "1",
      pageSize: "1",
      qString: this.studentId,
    }).toPromise()
    .then(async (res) => {
      if(res.statuscode == 200) {
        const response = res.dataResponse as Array<any>;
        let courses: ICourseTableData[] = [];
        response.forEach((course, i) => {
          courses.push({
            course: course.course,
            position: i + 1,
          });
        })

        this.courseDataSource = new MatTableDataSource(courses);
      }
    });

  }

  getInput(id: StudentDetailType) {
    return this.details?.find(detail => detail.id == id);
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

  async presentToast(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      position: "bottom",
      duration: 3000
    });

    return await toast.present();
  }

  dismissModal() {
    this.modalCtrl.dismiss('', '', viewStudentModalID);
  }

  ngOnDestroy() {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }
}

class StudentDetail {
  id?: any;
  value: any;
  label?: string;
  icon?: string;
  readonly multipleValue?: boolean = typeof(this.value) == 'string'
}

enum StudentDetailType {
  FirstName,
  LastName,
  OtherNames,
  NextOfKin,
  PhoneNumber,
  Gender,
  Email,
  StudentClass,
  DOB,
}

interface ICourseTableData{
  position?: number,
  course: string
}