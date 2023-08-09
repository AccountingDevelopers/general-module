import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserDepartmentsComponent } from './user-departments.component';
import { ModuleHeaderModule } from 'ng-accounting';
import { ButtonModule } from 'primeng/button'
import { TreeTableModule } from 'primeng/treetable';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    UserDepartmentsComponent
  ],
  imports: [
    CommonModule,
    ModuleHeaderModule,
    ButtonModule,
    TreeTableModule,
    DialogModule,
    InputTextModule,
    InputTextareaModule,
    ReactiveFormsModule
  ],
  exports: [
    UserDepartmentsComponent
  ]
})
export class UserDepartmentsModule { }
