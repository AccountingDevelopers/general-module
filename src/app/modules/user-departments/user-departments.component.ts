import { AccCompaniesService, AccSystemService, AccUsersService, convertArrayToTree } from 'ng-accounting'
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-user-departments',
    templateUrl: './user-departments.component.html',
    styleUrls: ['./user-departments.component.scss']
})
export class UserDepartmentsComponent implements OnInit {
    constructor(private readonly accSystemService: AccSystemService, private readonly accCompaniesService: AccCompaniesService) { }

    departmentsDataTable: any[] = []
    departments: any[] = []

    isCreateDepartment: boolean = false
    subscription: Subscription = new Subscription()
    currentCompany!: any
    createDepartmentForm: FormGroup = new FormGroup({
        label: new FormControl(null, Validators.required),
        description: new FormControl(null, Validators.required),
        parentId: new FormControl(null, Validators.required)
    })

    ngOnInit(): void {
        this.init()
    }

    init(company: any = this.accSystemService.currentCompany) {
        this.currentCompany = company
        this.departmentsDataTable = convertArrayToTree(company.departments, { isWrapedInData: true })
    }


    onCreateDepartment() {
        this.departments = convertArrayToTree(this.currentCompany.departments)
        this.isCreateDepartment = true
    }

    createDepartment() {
        const data = this.createDepartmentForm.value
        data.parentId = data.parentId?._id
        this.currentCompany.departments.push(data)

        this.subscription.add(this.accCompaniesService.update(this.currentCompany).subscribe({
            next: ({ company }) => {
                this.init(company)
                this.createDepartmentForm.reset()
                this.isCreateDepartment = false
            }
        }))
    }

    setDepartment(departments: any[], data: any) {
        for (const department of departments) {
            if (department._id === data.parent) {
                department.children.push(data)
            } else if (Array.isArray(department.children)) {
                this.setDepartment(department.children, data)
            }
        }

        return departments
    }

    updateCompany() {
        this.subscription.add(this.accCompaniesService.update(this.currentCompany).subscribe({
            next: ({ company }) => {
                this.init(company)
            }
        }))
    }

    onDeleteDepartment(data: any) {
        const index = this.currentCompany.departments.findIndex((d: any) => d._id === data._id)
        if (index !== -1) {
            this.currentCompany.departments.splice(index, 1)
            this.updateCompany()
        }
    }
}
