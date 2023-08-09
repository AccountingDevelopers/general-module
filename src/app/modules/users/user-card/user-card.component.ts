import { Subscription } from 'rxjs'
import { AccUsersService } from 'ng-accounting'
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-user-card',
  templateUrl: './user-card.component.html',
  styleUrls: ['./user-card.component.scss']
})
export class UserCardComponent implements OnInit {
  constructor(private readonly route: ActivatedRoute, private readonly accUsersService: AccUsersService) { }
  selectedUser!: any
  subscription: Subscription = new Subscription()

  ngOnInit(): void {
    if (this.route.snapshot.paramMap.has('id')) {
      const id = this.route.snapshot.paramMap.get('id') as string
      this.subscription.add(this.accUsersService.getById(id).subscribe({
        next: ({ user }) => {
          this.selectedUser = user
        }
      }))
    }
  }
}
