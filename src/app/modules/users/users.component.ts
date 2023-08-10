import { Subscription } from 'rxjs'
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AccSystemService, AccUsersService } from 'ng-accounting';
import { FormControl, FormGroup } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';

@Component({
    selector: 'app-users',
    templateUrl: './users.component.html',
    styleUrls: ['./users.component.scss'],
    providers: [ConfirmationService]
})
export class UsersComponent implements OnInit {
    constructor(public readonly accSystemService: AccSystemService, private readonly router: Router, private readonly accUsersService: AccUsersService, private readonly confirmationService: ConfirmationService) { }

    users: any[] = []
    selectedUser!: any
    departments: any[] = []
    subscription: Subscription = new Subscription()
    loadingConfig: any = {
        isLoadingData: false
    }
    dialogsStage = {
        isEditUser: false
    }
    userRightsForm: FormGroup = new FormGroup({
        system: new FormGroup({
            access: new FormControl(false)
        })
    })

    ngOnInit(): void {
        this.departments = this.getDepartments(this.accSystemService.currentCompany.departments)
        this.users = this.accSystemService.users
        this.initUsers()
    }

    initUsers() {
        this.users = this.users.reduce((acc, user) => {
            if (Array.isArray(user.departments)) {
                console.log(this.findInTree(this.departments, user.departments, []));
                user.departments = this.findInTree(this.departments, user.departments, [])
            }

            acc.push(user)
            return acc
        }, [])
    }

    getDepartments(departments: any[] = []) {
        if (!Array.isArray(departments)) {
            departments = [departments]
            console.log(this.users);
        }

        return departments.reduce((acc, department) => {
            if (department) {
                acc.push({
                    key: department._id,
                    label: department.name,
                    data: department._id,
                    children: department.subdivisions
                })
            }

            return acc
        }, [])
    }

    findInTree(nodes: any[] = [], dataArray: any[], result: any[], parent?: any): any {
        if (!Array.isArray(nodes)) {
            nodes = [nodes]
        }

        for (const node of nodes) {
            for (const data of dataArray) {
                if (node.data && data._id) {
                    if (node.data === data._id) {
                        result.push({
                            key: data._id,
                            label: data.name,
                            data: data._id,
                            children: []
                        })
                    } else if (Array.isArray(data.supervision) && data.supervision.length > 0) {
                        this.findInTree(node.supervision, [data], result, node)
                    }
                }
            }
        }

        return result
    }

    selectDepartment(departments: any[], user: any) {
        this.loadingConfig.isLoadingData = true
        user.departments = departments.map((dep: any) => {
            return {
                ref: dep.data
            }
        })

        this.subscription.add(this.accUsersService.update(user).subscribe({
            next: ({ user }) => {
                const index = this.users.findIndex((usr: any) => user._id === usr._id)
                this.users.splice(index, 1, user)
                this.initUsers()
                this.loadingConfig.isLoadingData = false
            }
        }))
    }

    openCard(element: any) {
        this.router.navigate(['users', element._id])
    }

    onEdit(user: any) {
        this.selectedUser = user
        this.userRightsForm.patchValue(user.rights)
        this.dialogsStage.isEditUser = true
    }

    updateUser() {
        this.loadingConfig.isLoadingData = true
        this.selectedUser.rights = this.userRightsForm.value
        this.subscription.add(this.accUsersService.update(this.selectedUser).subscribe({
            next: ({ user }) => {
                const index = this.users.findIndex((usr: any) => user._id === usr._id)
                this.users.splice(index, 1, user)
                this.initUsers()
                this.selectedUser = false
                this.dialogsStage.isEditUser = false
                this.loadingConfig.isLoadingData = false
            }
        }))
    }

    onDelete(user: any) {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete this user?',
            header: 'Delete user',
            icon: 'pi pi-exclamation-triangle',
            accept: () => this.deleteUser(user)
        })
    }

    deleteUser(user: any) {
        this.subscription.add(this.accUsersService.delete(user._id).subscribe({
            next: () => {
                this.accSystemService.init()
            }
        }))
    }
}
