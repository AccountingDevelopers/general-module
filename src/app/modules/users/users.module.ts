import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModuleHeaderModule, TemplateRefModule } from 'ng-accounting';
import { UsersComponent } from './users.component';
import { ButtonModule } from 'primeng/button'
import { TableModule } from 'primeng/table';
import { UserCardComponent } from './user-card/user-card.component'
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { TreeSelectModule } from 'primeng/treeselect';

@NgModule({
  declarations: [UsersComponent, UserCardComponent],
  imports: [
    CommonModule,
    ModuleHeaderModule,
    ButtonModule,
    TableModule,
    FormsModule,
    InputTextModule,
    TreeSelectModule
  ],
  exports: [UsersComponent]
})
export class UsersModule { }
