import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MaterialModule } from '../helpers/material.module';
import { WebcamModule } from 'ngx-webcam';

import { LoginTitleComponent } from './svgs/login-title/login-title.component';
import { LoginFormComponent } from './login-form/login-form.component';
import { LoginLogoComponent } from './svgs/login-logo/login-logo.component';
import { DetailCardComponent } from './detail-card/detail-card.component';
import { ExpansionCardsComponent } from './expansion-cards/expansion-cards.component';
import { ViewStudentComponent } from './modals/view-student/view-student.component';
import { ViewResultComponent } from './modals/view-result/view-result.component';
import { ModalHeaderComponent } from './modals/modal-header/modal-header.component';
import { EditDetailsInputComponent } from './edit-details-input/edit-details-input.component';
import { ViewStudentEditComponent } from './modals/view-student-edit/view-student-edit.component';
import { SharedDirectivesModule } from '../directives/shared-directives.module';
import { ForgotPasswordComponent } from './modals/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './modals/reset-password/reset-password.component';
import { ViewProfilePicComponent } from './view-profile-pic/view-profile-pic.component';
import { ProfilePictureComponent } from './modals/profile-picture/profile-picture.component';
import { DeskShotComponent } from './modals/desk-shot/desk-shot.component';
import { SearchStudentComponent } from './modals/search-student/search-student.component';
import { RecoveryEmailComponent } from './modals/recovery-email/recovery-email.component';
import { AddClassCourseComponent } from './modals/add-class-course/add-class-course.component';
import { ViewClassCourseComponent } from './modals/view-class-course/view-class-course.component';
import { ClassCoursePopoverComponent } from './class-course-popover/class-course-popover.component';
import { HomeCardComponent } from './home-card/home-card.component';
import { NotificationItemComponent } from './notification-item/notification-item.component';
import { SchoolTitleComponent } from './svgs/school-title/school-title.component';


@NgModule({
  declarations: [
    LoginFormComponent,
    LoginTitleComponent,
    LoginLogoComponent,
    SchoolTitleComponent,
    DetailCardComponent,
    ExpansionCardsComponent,
    ViewStudentComponent,
    ViewResultComponent,
    ModalHeaderComponent,
    ViewProfilePicComponent,
    EditDetailsInputComponent,
    ViewStudentEditComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    ProfilePictureComponent,
    DeskShotComponent,
    SearchStudentComponent,
    RecoveryEmailComponent,
    AddClassCourseComponent,
    ViewClassCourseComponent,
    ClassCoursePopoverComponent,
    HomeCardComponent,
    NotificationItemComponent,
  ],
  exports: [
    LoginFormComponent,
    LoginTitleComponent,
    SchoolTitleComponent,
    LoginLogoComponent,
    DetailCardComponent,
    ExpansionCardsComponent,
    ViewResultComponent,
    ViewResultComponent,
    ModalHeaderComponent,
    ViewProfilePicComponent,
    EditDetailsInputComponent,
    ViewStudentEditComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    ProfilePictureComponent,
    DeskShotComponent,
    SearchStudentComponent,
    RecoveryEmailComponent,
    AddClassCourseComponent,
    ViewClassCourseComponent,
    NotificationItemComponent,
    ClassCoursePopoverComponent,
    HomeCardComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
    WebcamModule,
    MaterialModule,
    SharedDirectivesModule,
  ]
})
export class ComponentsModule { }
