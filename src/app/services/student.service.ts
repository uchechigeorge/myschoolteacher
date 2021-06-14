import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Plugins } from "@capacitor/core";
import { Router } from '@angular/router';

import { API_HOST, TOKEN_KEY, TEACHERID_KEY, AuthService, TEACHERCREDENTIALS_KEY } from './auth.service';

// const ADDSTUDENT_API_ROUTE = `${API_HOST}/api/admin/add/addstudent.ashx`;
const VIEWSTUDENT_API_ROUTE = `${API_HOST}/api/teacher/view/viewactivestudent.ashx`;
const VIEWTERM_API_ROUTE = `${API_HOST}/api/teacher/view/viewterm.ashx`;
const VIEWSESSION_API_ROUTE = `${API_HOST}/api/teacher/view/viewsession.ashx`;
const VIEWSUBCLASS_API_ROUTE = `${API_HOST}/api/teacher/view/viewsubclass.ashx`;
const VIEWCLASS_API_ROUTE = `${API_HOST}/api/teacher/view/viewclass.ashx`;
const VIEWCOURSE_API_ROUTE = `${API_HOST}/api/teacher/view/viewcourse.ashx`;
const VIEWRESULT_API_ROUTE = `${API_HOST}/api/teacher/view/viewresult.ashx`;
const VIEWGRADES_API_ROUTE = `${API_HOST}/api/teacher/view/viewgrades.ashx`;

const UPDATEFIRSTNAME_API_ROUTE = `${API_HOST}/api/teacher/update/student/updatefname.ashx`;
const UPDATELASTNAME_API_ROUTE = `${API_HOST}/api/teacher/update/student/updatelname.ashx`;
const UPDATEOTHERNAME_API_ROUTE = `${API_HOST}/api/teacher/update/student/updateoname.ashx`;
const UPDATEEMAIL_API_ROUTE = `${API_HOST}/api/teacher/update/student/updateemail.ashx`;
const UPDATEGENDER_API_ROUTE = `${API_HOST}/api/teacher/update/student/updategender.ashx`;
const UPDATEPASSWORD_API_ROUTE = `${API_HOST}/api/teacher/update/student/updatepassword.ashx`;
const UPDATEPHONE_API_ROUTE = `${API_HOST}/api/teacher/update/student/updatephonenum.ashx`;
const UPDATENEXTOFKIN_API_ROUTE = `${API_HOST}/api/teacher/update/student/updatenextofkin.ashx`;
const UPDATEDOB_API_ROUTE = `${API_HOST}/api/teacher/update/student/updatedob.ashx`;
const UPDATEPIC_API_ROUTE = `${API_HOST}/api/teacher/update/student/updateprofilepic.ashx`;
const UPDATECLASS_API_ROUTE = `${API_HOST}/api/teacher/update/student/updatestudentclass.ashx`;
const UPDATECOURSE_API_ROUTE = `${API_HOST}/api/teacher/update/student/updatestudentcourse.ashx`;

const UPDATERESULTCA_API_ROUTE = `${API_HOST}/api/teacher/update/result/updateca.ashx`;
const UPDATERESULTEXAM_API_ROUTE = `${API_HOST}/api/teacher/update/result/updateexam.ashx`;
const UPDATERESULTGRADE_API_ROUTE = `${API_HOST}/api/teacher/update/result/updategrade.ashx`;
const ADDCLASSCOURSE_API_ROUTE = `${API_HOST}/api/teacher/update/class/addclasscourse.ashx`;
const VIEWSCRATCHCARD_API_ROUTE = `${API_HOST}/api/teacher/view/viewscratchcard.ashx`;
const UPDATESCRATCHCARD_API_ROUTE = `${API_HOST}/api/teacher/update/student/addscratchcard.ashx`;
const DELETESTUDENT_API_ROUTE = `${API_HOST}/api/teacher/delete/deletestudent.ashx`;

const { Storage } = Plugins;

@Injectable({
  providedIn: 'root'
})
export class StudentService {

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private router: Router,
  ) { 
    this.loadToken();
  }

  get requestSubject() {
    return this.authService.requestSubject;
  }

  private async loadToken() {
    await this.authService.loadToken();
  }

  // addStudent(details: {
  //   firstName: string,
  //   lastName: string,
  //   otherNames?: string,
  //   nextOfKin?: string,
  //   email?: string,
  //   gender?: string,
  //   phoneNum1?: string,
  //   phoneNum2?: string,
  //   dob?: string,
  // }): Observable<any> {
  //   let body: any = {};
  //   body = {...this.requestSubject.getValue()};
  //   body.student = details;
  //   const bodyString = JSON.stringify(body);

  //   return this.http.post(ADDSTUDENT_API_ROUTE, bodyString);
  // }

  viewStudent(reqParams: {
    updateType?: string,
    studentId?: string,
    search?: string,
    pageSize?: string,
    pageNum?: string,
    qString?: string, 
    qStringb?: string, 
    qStringc?: string, 
  }
  ): Observable<any> {
    let body: any = {};
    body = {...this.requestSubject.getValue()};
    const bodyString = JSON.stringify(body);
    let params: { [param: string]: string | string[]; } = {};

    if(reqParams.updateType) params.updateType = reqParams.updateType; 
    if(reqParams.pageSize) params.pagesize = reqParams.pageSize;
    if(reqParams.pageNum) params.pagenum = reqParams.pageNum;
    if(reqParams.studentId) params.studentid = reqParams.studentId;
    if(reqParams.search) params.search = reqParams.search;
    if(reqParams.qString) params.qstring = reqParams.qString;
    if(reqParams.qStringb) params.qstringb = reqParams.qStringb;
    if(reqParams.qStringc) params.qstringc = reqParams.qStringc;
    
    return this.http.post(VIEWSTUDENT_API_ROUTE, bodyString, { params });
  }

  viewSubClass(reqParams: {
    updateType?: string,
    classId?: string,
    termId?: string,
    returnType?: string,
    pageSize?: string,
    pageNum?: string,
    qString?: string, 
    qStringb?: string, 
    qStringc?: string, 
  }): Observable<any>{
    let body: any = {};
    body = {...this.requestSubject.getValue()};
    const bodyString = JSON.stringify(body);
    let params: { [param: string]: string | string[]; } = {};
    
    if(reqParams.updateType) params.updatetype = reqParams.updateType; 
    if(reqParams.pageSize) params.pagesize = reqParams.pageSize;
    if(reqParams.pageNum) params.pagenum = reqParams.pageNum;
    if(reqParams.classId) params.classid = reqParams.classId;
    if(reqParams.termId) params.termid = reqParams.termId;
    if(reqParams.returnType) params.returntype = reqParams.returnType;
    if(reqParams.qString) params.qstring = reqParams.qString;
    if(reqParams.qStringb) params.qstringb = reqParams.qStringb;
    if(reqParams.qStringc) params.qstringc = reqParams.qStringc;

    return this.http.post(VIEWSUBCLASS_API_ROUTE, bodyString, { params });
  }

  viewClass(reqParams: {
    updateType?: string,
    classId?: string,
    termId?: string,
    search?: string,
    pageSize?: string,
    pageNum?: string,
    qString?: string, 
    qStringb?: string, 
    qStringc?: string, 
  }): Observable<any>{
    let body: any = {};
    body = {...this.requestSubject.getValue()};
    const bodyString = JSON.stringify(body);
    let params: { [param: string]: string | string[]; } = {};
    
    if(reqParams.updateType) params.updatetype = reqParams.updateType; 
    if(reqParams.pageSize) params.pagesize = reqParams.pageSize;
    if(reqParams.pageNum) params.pagenum = reqParams.pageNum;
    if(reqParams.classId) params.classid = reqParams.classId;
    if(reqParams.termId) params.termid = reqParams.termId;
    if(reqParams.search) params.search = reqParams.search;
    if(reqParams.qString) params.qstring = reqParams.qString;
    if(reqParams.qStringb) params.qstringb = reqParams.qStringb;
    if(reqParams.qStringc) params.qstringc = reqParams.qStringc;

    return this.http.post(VIEWCLASS_API_ROUTE, bodyString, { params });
  }


  viewCourse(reqParams: {
    updateType?: string,
    courseId?: string,
    termId?: string,
    search?: string,
    pageSize?: string,
    pageNum?: string,
    qString?: string, 
    qStringb?: string, 
    qStringc?: string, 
  }): Observable<any>{
    let body: any = {};
    body = {...this.requestSubject.getValue()};
    const bodyString = JSON.stringify(body);
    let params: { [param: string]: string | string[]; } = {};
    
    if(reqParams.updateType) params.updatetype = reqParams.updateType; 
    if(reqParams.pageSize) params.pagesize = reqParams.pageSize;
    if(reqParams.pageNum) params.pagenum = reqParams.pageNum;
    if(reqParams.courseId) params.courseid = reqParams.courseId;
    if(reqParams.termId) params.termid = reqParams.termId;
    if(reqParams.search) params.search = reqParams.search;
    if(reqParams.qString) params.qstring = reqParams.qString;
    if(reqParams.qStringb) params.qstringb = reqParams.qStringb;
    if(reqParams.qStringc) params.qstringc = reqParams.qStringc;

    return this.http.post(VIEWCOURSE_API_ROUTE, bodyString, { params });
  }

  viewSession(reqParams: {
    updateType?: string,
    sessionId?: string,
    search?: string,
    pageSize?: string,
    pageNum?: string,
    qString?: string, 
    qStringb?: string, 
    qStringc?: string, 
  }): Observable<any>{
    let body: any = {};
    body = {...this.requestSubject.getValue()};
    const bodyString = JSON.stringify(body);
    let params: { [param: string]: string | string[]; } = {};
    
    if(reqParams.updateType) params.updatetype = reqParams.updateType; 
    if(reqParams.pageSize) params.pagesize = reqParams.pageSize;
    if(reqParams.pageNum) params.pagenum = reqParams.pageNum;
    if(reqParams.sessionId) params.sessionid = reqParams.sessionId;
    if(reqParams.search) params.search = reqParams.search;
    if(reqParams.qString) params.qstring = reqParams.qString;
    if(reqParams.qStringb) params.qstringb = reqParams.qStringb;
    if(reqParams.qStringc) params.qstringc = reqParams.qStringc;
    
    return this.http.post(VIEWSESSION_API_ROUTE, bodyString, { params });
  }

  viewTerm(reqParams: {
    updateType?: string,
    termId?: string,
    search?: string,
    pageSize?: string,
    pageNum?: string,
    qString?: string, 
    qStringb?: string, 
    qStringc?: string, 
  }): Observable<any>{
    let body: any = {};
    body = {...this.requestSubject.getValue()};
    const bodyString = JSON.stringify(body);
    let params: { [param: string]: string | string[]; } = {};
    
    if(reqParams.updateType) params.updatetype = reqParams.updateType; 
    if(reqParams.pageSize) params.pagesize = reqParams.pageSize;
    if(reqParams.pageNum) params.pagenum = reqParams.pageNum;
    if(reqParams.termId) params.termid = reqParams.termId;
    if(reqParams.search) params.search = reqParams.search;
    if(reqParams.qString) params.qstring = reqParams.qString;
    if(reqParams.qStringb) params.qstringb = reqParams.qStringb;
    if(reqParams.qStringc) params.qstringc = reqParams.qStringc;
    
    return this.http.post(VIEWTERM_API_ROUTE, bodyString, { params });
  }

  viewResult(reqParams: {
    updateType?: string,
    termId?: string,
    search?: string,
    pageSize?: string,
    pageNum?: string,
    qString?: string, 
    qStringb?: string, 
    qStringc?: string, 
  }): Observable<any>{
    let body: any = {};
    body = {...this.requestSubject.getValue()};
    const bodyString = JSON.stringify(body);
    let params: { [param: string]: string | string[]; } = {};
    
    if(reqParams.updateType) params.updatetype = reqParams.updateType; 
    if(reqParams.pageSize) params.pagesize = reqParams.pageSize;
    if(reqParams.pageNum) params.pagenum = reqParams.pageNum;
    if(reqParams.termId) params.termid = reqParams.termId;
    if(reqParams.search) params.search = reqParams.search;
    if(reqParams.qString) params.qstring = reqParams.qString;
    if(reqParams.qStringb) params.qstringb = reqParams.qStringb;
    if(reqParams.qStringc) params.qstringc = reqParams.qStringc;
    
    return this.http.post(VIEWRESULT_API_ROUTE, bodyString, { params });
  }

  viewGrades(reqParams: {
    updateType?: string,
    gradeId?: string,
    search?: string,
    pageSize?: string,
    pageNum?: string,
    qString?: string, 
    qStringb?: string, 
    qStringc?: string, 
  }): Observable<any>{
    let body: any = {};
    body = {...this.requestSubject.getValue()};
    const bodyString = JSON.stringify(body);
    let params: { [param: string]: string | string[]; } = {};
    
    if(reqParams.updateType) params.updatetype = reqParams.updateType; 
    if(reqParams.pageSize) params.pagesize = reqParams.pageSize;
    if(reqParams.pageNum) params.pagenum = reqParams.pageNum;
    if(reqParams.gradeId) params.gradeid = reqParams.gradeId;
    if(reqParams.search) params.search = reqParams.search;
    if(reqParams.qString) params.qstring = reqParams.qString;
    if(reqParams.qStringb) params.qstringb = reqParams.qStringb;
    if(reqParams.qStringc) params.qstringc = reqParams.qStringc;

    return this.http.post(VIEWGRADES_API_ROUTE, bodyString, { params });
  }

  viewScratchCard(reqParams: {
    updateType?: string,
    studentId?: string,
    scratchCardId?: string,
    pageSize?: string,
    pageNum?: string,
    qString?: string, 
    qStringb?: string, 
    qStringc?: string, 
  }
  ): Observable<any> {
    let body: any = {};
    body = {...this.requestSubject.getValue()};
    const bodyString = JSON.stringify(body);
    let params: { [param: string]: string | string[]; } = {};

    if(reqParams.updateType) params.updateType = reqParams.updateType;
    if(reqParams.pageSize) params.pagesize = reqParams.pageSize;
    if(reqParams.pageNum) params.pagenum = reqParams.pageNum;
    if(reqParams.studentId) params.studentid = reqParams.studentId;
    if(reqParams.scratchCardId) params.scratchcardid = reqParams.scratchCardId;
    if(reqParams.qString) params.qstring = reqParams.qString;
    if(reqParams.qStringb) params.qstringb = reqParams.qStringb;
    if(reqParams.qStringc) params.qstringc = reqParams.qStringc;
    
    return this.http.post(VIEWSCRATCHCARD_API_ROUTE, bodyString, { params });
  }

  updateScratchCard(credentials: {studentid: string, scratchCardNumber: string}): Observable<any> {
    let body: any = {};
    body = {...this.requestSubject.getValue(), ...credentials};
    
    const bodyString = JSON.stringify(body);
    return this.http.post(UPDATESCRATCHCARD_API_ROUTE, bodyString);
  }

  updateFirstName(credentials: {studentid: string, firstName: string}): Observable<any> {
    let body: any = {};
    body = {...this.requestSubject.getValue(), ...credentials};
    
    const bodyString = JSON.stringify(body);
    return this.http.post(UPDATEFIRSTNAME_API_ROUTE, bodyString);
  }

  updateLastName(credentials: {studentid: string, lastName: string}): Observable<any> {
    let body: any = {};
    body = {...this.requestSubject.getValue(), ...credentials};
    
    const bodyString = JSON.stringify(body);
    return this.http.post(UPDATELASTNAME_API_ROUTE, bodyString);
  }

  updateOtherNames(credentials: {studentid: string, otherNames: string}): Observable<any> {
    let body: any = {};
    body = {...this.requestSubject.getValue(), ...credentials};
    
    const bodyString = JSON.stringify(body);
    return this.http.post(UPDATEOTHERNAME_API_ROUTE, bodyString);
  }

  updateNextOfKin(credentials: {studentid: string, nextOfKin: string}): Observable<any> {
    let body: any = {};
    body = {...this.requestSubject.getValue(), ...credentials};
    
    const bodyString = JSON.stringify(body);
    return this.http.post(UPDATENEXTOFKIN_API_ROUTE, bodyString);
  }

  updateEmail(credentials: {studentid: string, email: string}): Observable<any> {
    let body: any = {};
    body = {...this.requestSubject.getValue(), ...credentials};
    
    const bodyString = JSON.stringify(body);
    return this.http.post(UPDATEEMAIL_API_ROUTE, bodyString);
  }

  updateGender(credentials: {studentid: string, gender: string}): Observable<any> {
    let body: any = {};
    body = {...this.requestSubject.getValue(), ...credentials};
    
    const bodyString = JSON.stringify(body);
    return this.http.post(UPDATEGENDER_API_ROUTE, bodyString);
  }

  updatePassword(credentials: {studentid: string, password: string}): Observable<any> {
    let body: any = {};
    body = {...this.requestSubject.getValue(), ...credentials};
    
    const bodyString = JSON.stringify(body);
    return this.http.post(UPDATEPASSWORD_API_ROUTE, bodyString);
  }

  updateDOB(credentials: {studentid: string, dob: string}): Observable<any> {
    let body: any = {};
    body = {...this.requestSubject.getValue(), ...credentials};
    
    const bodyString = JSON.stringify(body);
    return this.http.post(UPDATEDOB_API_ROUTE, bodyString);
  }

  updatePhoneNumber(credentials: {studentid: string, phoneNumber: string[]}): Observable<any> {
    let body: any = {};
    body = {...this.requestSubject.getValue(), ...credentials};
    
    const bodyString = JSON.stringify(body);
    return this.http.post(UPDATEPHONE_API_ROUTE, bodyString);
  }

  updateProfilePic(formData: any, credentials: { studentid: string }): Observable<any> {
    let params: { [param: string]: string | string[]; } = {};
    params.teacherid = this.requestSubject.getValue().teacherId;
    params.token = this.requestSubject.getValue().token;
    params.studentid = credentials.studentid;

    return this.http.post(UPDATEPIC_API_ROUTE, formData, { params });
  }

  updateClass(credentials: { studentId: string, classId: string }): Observable<any> {
    let body: any = {};
    body = {...this.requestSubject.getValue(), ...credentials};
    const bodyString = JSON.stringify(body);
    return this.http.post(UPDATECLASS_API_ROUTE, bodyString);
  }
  
  updateCourse(credentials: { studentId: string, courseIds: string[] }): Observable<any> {
    let body: any = {};
    body = {...this.requestSubject.getValue(), ...credentials};
    const bodyString = JSON.stringify(body);
    return this.http.post(UPDATECOURSE_API_ROUTE, bodyString);
  }

  addClassCourse(credentials: { classId: string, courseIds: string[] }): Observable<any> {
    let body: any = {};
    body = {...this.requestSubject.getValue(), ...credentials};
    const bodyString = JSON.stringify(body);
    return this.http.post(ADDCLASSCOURSE_API_ROUTE, bodyString);
  }

  updateResultCA(credentials: { studentId: string, courseId: string, ca?: string, subClassId?: string, termId?: string }): Observable<any> {
    let body: any = {};
    body = {...this.requestSubject.getValue(), ...credentials};
    const bodyString = JSON.stringify(body);
    return this.http.post(UPDATERESULTCA_API_ROUTE, bodyString);
  }
  
  updateResultExam(credentials: { studentId: string, courseId: string, exam?: string, subClassId?: string, termId?: string }): Observable<any> {
    let body: any = {};
    body = {...this.requestSubject.getValue(), ...credentials};
    const bodyString = JSON.stringify(body);
    return this.http.post(UPDATERESULTEXAM_API_ROUTE, bodyString);
  }

  updateResultGrade(credentials: { studentId: string, courseId: string, gradeId?: string, subClassId?: string, termId?: string }): Observable<any> {
    let body: any = {};
    body = {...this.requestSubject.getValue(), ...credentials};
    const bodyString = JSON.stringify(body);
    return this.http.post(UPDATERESULTGRADE_API_ROUTE, bodyString);
  }



  // deleteStudent(credentials: { studentId: string }): Observable<any> {
  //   let body: any = {};
  //   body = {...this.requestSubject.getValue(), ...credentials};
  //   const bodyString = JSON.stringify(body);
  //   return this.http.post(DELETESTUDENT_API_ROUTE, bodyString);
  // }

  async saveCredentials(credentials: { teacherId?: string, token?: string, credentials?: any }) {
    await this.authService.saveCredentials(credentials);
  }
}
