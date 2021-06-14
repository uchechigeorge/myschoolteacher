import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StudentPageRoutingModule } from './student-routing.module';

import { StudentPage } from './student.page';
import { ComponentsModule } from 'src/app/components/components.module';
import { MaterialModule } from 'src/app/helpers/material.module';
import { SharedDirectivesModule } from 'src/app/directives/shared-directives.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StudentPageRoutingModule,
    MaterialModule,
    ComponentsModule,
  ],
  declarations: [StudentPage]
})
export class StudentPageModule {}
