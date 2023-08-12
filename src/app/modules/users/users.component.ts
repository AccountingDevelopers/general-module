import { Subscription } from 'rxjs'
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AccSystemService, AccUsersService, convertArrayToTree, convertTreeToArray } from 'ng-accounting';
import { FormControl, FormGroup } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';

@Component({
    selector: 'app-users',
    templateUrl: './users.component.html',
    styleUrls: ['./users.component.scss'],
    providers: [ConfirmationService]
})
export class UsersComponent implements OnInit, OnDestroy {
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
        this.users = this.accSystemService.users
        this.init()
    }

    init() {
        this.departments = this.getDepartments(this.accSystemService.currentCompany.departments)
    }

    getDepartments(departments: any[] = []) {
        return departments.map((department, index: number) => {
            return {
                ...department,
                data: department._id,
                key: department._id
            }
        })
    }

    selectDepartment(selectedDeps: any, user: any) {
        this.loadingConfig.isLoadingData = true

        const departments = selectedDeps.map((department: any) => {
            return {
                ref: department._id
            }
        })

        user.departments = departments
        this.subscription.add(this.accUsersService.update(user).subscribe({
            next: ({ user }) => {
                const index = this.users.findIndex((usr: any) => user._id === usr._id)
                this.users.splice(index, 1, user)
                this.init()
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

    ngOnDestroy(): void {
        this.subscription.unsubscribe()
    }
}
