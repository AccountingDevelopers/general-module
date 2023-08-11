import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModuleHeaderModule, ArrayToTreeModule } from 'ng-accounting';
import { UsersComponent } from './users.component';
import { ButtonModule } from 'primeng/button'
import { TableModule } from 'primeng/table';
import { UserCardComponent } from './user-card/user-card.component'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { TreeSelectModule } from 'primeng/treeselect';
import { DialogModule } from 'primeng/dialog';
import { CheckboxModule } from 'primeng/checkbox';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@NgModule({
  declarations: [UsersComponent, UserCardComponent],
  imports: [
    CommonModule,
    ModuleHeaderModule,
    ButtonModule,
    TableModule,
    FormsModule,
    InputTextModule,
    TreeSelectModule,
    DialogModule,
    CheckboxModule,
    ReactiveFormsModule,
    ConfirmDialogModule,
    ArrayToTreeModule
  ],
  exports: [UsersComponent]
})
export class UsersModule { }
