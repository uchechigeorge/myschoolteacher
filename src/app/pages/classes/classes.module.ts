import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ClassesPageRoutingModule } from './classes-routing.module';

import { ClassesPage } from './classes.page';
import { ComponentsModule } from 'src/app/components/components.module';
import { MaterialModule } from 'src/app/helpers/material.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ClassesPageRoutingModule,
    ReactiveFormsModule,
    ComponentsModule,
    MaterialModule,
  ],
  declarations: [ClassesPage]
})
export class ClassesPageModule {}
