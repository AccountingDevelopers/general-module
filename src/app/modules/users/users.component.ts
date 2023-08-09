import { Subscription } from 'rxjs'
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AccSystemService, AccUsersService } from 'ng-accounting';

@Component({
    selector: 'app-users',
    templateUrl: './users.component.html',
    styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
    constructor(private readonly accSystemService: AccSystemService, private readonly router: Router, private readonly accUsersService: AccUsersService) { }
    users: any[] = []
    departments: any[] = []
    subscription: Subscription = new Subscription()

    ngOnInit(): void {
        this.departments = this.getDepartments(this.accSystemService.currentCompany.departments)
        this.users = this.accSystemService.users
        this.users = this.users.reduce((acc, user) => {
            console.log(user);
            if (Array.isArray(user.departments)) {
                for (const department of user.departments) {
                    user.departments = [this.findInTree(this.departments, department)]
                }
            }

            acc.push(user)
            return acc
        }, [])

        console.log(this.users, this.departments)
    }

    getDepartments(departments: any[] = []) {
        if (!Array.isArray(departments)) {
            departments = [departments]
            console.log(this.users);
        }

        return departments.reduce((acc, department) => {
            acc.push({
                label: department.name,
                data: department._id,
                children: department.subdivisions
            })
            return acc
        }, [])
    }

    findInTree(nodes: any[] = [], data: string, parent?: any): any {
        if (!Array.isArray(nodes)) {
            nodes = [nodes]
        }

        for (const node of nodes) {
            if (node.data == data) {
                return node
            } else if (Array.isArray(node.children)) {
                let result = null
                let parentNode = {
                    ...node,
                    expanded: true,
                    parent: parent
                }

                for (let i = 0; result == null && i < node.children.length; i++) {
                    result = this.findInTree(node.children[i], data, parentNode)
                }

                if (result) {
                    return {
                        ...result,
                        parent: parentNode
                    }
                } else {
                    return parentNode
                }
            }

            return null
        }
    }

    selectDepartment(event: { node: any }, user: any) {
        const department = event.node.data
        user.departments = [{
            ref: department
        }]

        this.subscription.add(this.accUsersService.update(user).subscribe({
            next: ({ user }) => {
                const index = this.users.findIndex((usr: any) => user._id === usr._id)
                this.users.splice(index, 1, user)
            }
        }))
    }

    openCard(element: any) {
        this.router.navigate(['users', element._id])
    }
}
