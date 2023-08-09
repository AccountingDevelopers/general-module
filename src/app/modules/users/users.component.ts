import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AccSystemService } from 'ng-accounting';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  constructor(private readonly accSystemService: AccSystemService, private readonly router: Router) {}
  users: any[] = []

  ngOnInit(): void {
    this.users = this.accSystemService.users
  }

  getDepartmentsLabel(departments: any[]) {
    return 'Без отдела'
  }

  openCard(element: any) {
    this.router.navigate(['users', element._id])
  }
}
