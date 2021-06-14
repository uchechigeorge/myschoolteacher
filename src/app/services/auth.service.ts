import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Plugins } from "@capacitor/core";
import { map, tap, switchMap } from 'rxjs/operators';
import { Observable, BehaviorSubject, from } from 'rxjs';
import { loginRoute } from '../models/app-routes';
import { Router } from '@angular/router';

const { Storage } = Plugins;

export const LOCAL_HOST = "http://localhost:58003";
export const REMOTE_HOST = "https://testucheapi.profeworld.com";
export const API_HOST = REMOTE_HOST;

export const TEACHERCREDENTIALS_KEY = "credentials";
export const TEACHERID_KEY = "teacherid";
export const TOKEN_KEY = "token";

const LOGIN_API_ROUTE = `${API_HOST}/api/teacher/auth/login.ashx`;

const RESETPASSWORD_API_ROUTE = `${API_HOST}/api/teacher/auth/resetpassword.ashx`;
const CONFIRMPASSWORD_API_ROUTE = `${API_HOST}/api/teacher/auth/confirmpassword.ashx`;
const UPDATEEMAIL_API_ROUTE = `${API_HOST}/api/teacher/auth/updateemail.ashx`;
const VIEWTEACHER_API_ROUTE = `${API_HOST}/api/teacher/view/viewteacher.ashx`;
const VIEWFBID_API_ROUTE = `${API_HOST}/api/teacher/view/viewfbalert.ashx`;
const VIEWNOTIFICATION_API_ROUTE = `${API_HOST}/api/teacher/view/viewnotification.ashx`;
const VIEWENTITYCOUNT_API_ROUTE = `${API_HOST}/api/teacher/view/viewentitycount.ashx`;

const FORGOTPASSWORD_API_ROUTE = `${API_HOST}/api/teacher/auth/forgotpassword.ashx`;
const UPDATENOTIFICATIONSTATE_API_ROUTE = `${API_HOST}/api/teacher/auth/updatenotificationstate.ashx`;
const ADDFBID_API_ROUTE = `${API_HOST}/api/teacher/auth/addfbid.ashx`;

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public isAuthenticated: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);

  private requestToken: { teacherId?: string, token?: string } = {};
  public requestSubject: BehaviorSubject<{ teacherId?: string, token?: string }> = new BehaviorSubject<{ teacherid: string, token: string }>(null);

  constructor(
    private http: HttpClient,
    private router: Router,
  ) { 
    this.loadToken();
  }

  getSettings(): Observable<any> {
    return this.http.get('./assets/settings.json');
  }

  async loadToken() {
    const tokenStore = await Storage.get({ key: TOKEN_KEY });
    const teacheridStore = await Storage.get({ key: TEACHERID_KEY });

    const token = JSON.parse(`"${tokenStore.value}"`);
    const teacherid = JSON.parse(`"${teacheridStore.value}"`);

    const tokenValid = token && token != "undefined" && token != "null";
    const teacherIdValid = teacherid && teacherid != "undefined" && teacherid != "null";
    
    if(tokenValid && teacherIdValid) {
      this.isAuthenticated.next(true);
      this.requestSubject.next({ teacherId: teacherid, token });
    }
    else {
      this.isAuthenticated.next(false);
      this.router.navigateByUrl(loginRoute, { replaceUrl: true });
    }
  }

  login(credentials: { username: string, password: string }): Observable<any> {
    const httpBody = JSON.stringify(credentials);
    return this.http.post(LOGIN_API_ROUTE, httpBody);
  }

  updateEmail(credentials: { email?: string }): Observable<any> {
    let body: any = {};
    body = {...this.requestSubject.getValue(), ...credentials};
    const bodyString = JSON.stringify(body);
    return this.http.post(UPDATEEMAIL_API_ROUTE, bodyString);
  }

  updateNotificationState(credentials: { state: boolean }): Observable<any> {
    let body: any = {};
    body = {...this.requestSubject.getValue(), ...credentials};
    const bodyString = JSON.stringify(body);
    return this.http.post(UPDATENOTIFICATIONSTATE_API_ROUTE, bodyString);
  }

  viewTeacher(reqParams: {
    updateType?: string,
    teacherId?: string,
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
    if(reqParams.teacherId) params.teacherid = reqParams.teacherId;
    if(reqParams.search) params.search = reqParams.search;
    if(reqParams.qString) params.qstring = reqParams.qString;
    if(reqParams.qStringb) params.qstringb = reqParams.qStringb;
    if(reqParams.qStringc) params.qstringc = reqParams.qStringc;
    
    return this.http.post(VIEWTEACHER_API_ROUTE, bodyString, { params });
  }

  viewNotifications(reqParams: {
    updateType?: string,
    notificationId?: string,
    postId?: string,
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
    if(reqParams.notificationId) params.notificationid = reqParams.notificationId;
    if(reqParams.postId) params.postid = reqParams.postId;
    if(reqParams.qString) params.qstring = reqParams.qString;
    if(reqParams.qStringb) params.qstringb = reqParams.qStringb;
    if(reqParams.qStringc) params.qstringc = reqParams.qStringc;

    return this.http.post(VIEWNOTIFICATION_API_ROUTE, bodyString, { params });
  }

  viewFBId(reqParams: {
    updateType?: string,
    postId?: string,
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
    if(reqParams.postId) params.postid = reqParams.postId;
    if(reqParams.search) params.search = reqParams.search;
    if(reqParams.qString) params.qstring = reqParams.qString;
    if(reqParams.qStringb) params.qstringb = reqParams.qStringb;
    if(reqParams.qStringc) params.qstringc = reqParams.qStringc;

    return this.http.post(VIEWFBID_API_ROUTE, bodyString, { params });
  }
  
  viewEntityCount(reqParams?: {
    updateType?: string,
    termId?: string,
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
    if(reqParams.qString) params.qstring = reqParams.qString;
    if(reqParams.qStringb) params.qstringb = reqParams.qStringb;
    if(reqParams.qStringc) params.qstringc = reqParams.qStringc;

    return this.http.post(VIEWENTITYCOUNT_API_ROUTE, bodyString, { params });
  }

  resetPassword(credentials: { oldPassword: string, newPassword: string }): Observable<any> {
    let body: any = {};
    body = {...this.requestSubject.getValue(), ...credentials};
    const bodyString = JSON.stringify(body);
    return this.http.post(RESETPASSWORD_API_ROUTE, bodyString);
  }

  confirmPassword(credentials: { password: string }): Observable<any> {
    let body: any = {};
    body = {...this.requestSubject.getValue(), ...credentials};
    const bodyString = JSON.stringify(body);
    return this.http.post(CONFIRMPASSWORD_API_ROUTE, bodyString);
  }

  forgotPassword(credentials: { username: string }): Observable<any> {
    let body: any = {};
    body = {...credentials};
    const bodyString = JSON.stringify(body);
    return this.http.post(FORGOTPASSWORD_API_ROUTE, bodyString);
  }

  addFirebaseId(credentials: { notificationToken: string, device?: string, state?: boolean }): Observable<any> {
    let body: any = {};
    body = {...this.requestSubject.getValue(), ...credentials};
    const bodyString = JSON.stringify(body);
    return this.http.post(ADDFBID_API_ROUTE, bodyString);
  }

  async logout(): Promise<any> {
    this.isAuthenticated.next(false);
    Storage.remove({ key: TOKEN_KEY });
    Storage.remove({ key: TEACHERID_KEY });
    Storage.remove({ key: TEACHERCREDENTIALS_KEY });

    this.router.navigateByUrl(loginRoute);

  }

  async saveCredentials(credentials: { teacherId?: string, token?: string, credentials?: any }) {
    if(credentials.teacherId) {
      await Storage.set({ key: TEACHERID_KEY, value: credentials.teacherId });
      this.requestToken.teacherId = credentials.teacherId;
    }  
    if(credentials.token) {
      await Storage.set({ key: TOKEN_KEY, value: credentials.token });
      this.requestToken.token = credentials.token;
    }
    if(credentials.credentials){
      await Storage.set({ key: TEACHERCREDENTIALS_KEY, value: credentials.credentials });
    }

    this.requestSubject.next(this.requestToken);
  }
}