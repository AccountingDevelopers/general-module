import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserDepartmentsComponent } from './user-departments.component';
import { ModuleHeaderModule } from 'ng-accounting';
import { ButtonModule } from 'primeng/button'
import { TreeTableModule } from 'primeng/treetable';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TreeSelectModule } from 'primeng/treeselect';

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
    ReactiveFormsModule,
    TreeSelectModule,
    FormsModule
  ],
  exports: [
    UserDepartmentsComponent
  ]
})
export class UserDepartmentsModule { }
