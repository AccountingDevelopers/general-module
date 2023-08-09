import { AccCompaniesService, AccSystemService, AccUsersService } from 'ng-accounting'
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

    departments: any[] = []
    isCreateDepartment: boolean = false
    subscription: Subscription = new Subscription()
    currentCompany!: any
    createDepartmentForm: FormGroup = new FormGroup({
        name: new FormControl(null, Validators.required),
        description: new FormControl(null, Validators.required)
    })

    ngOnInit(): void {
        this.init()
    }

    init(company: any = this.accSystemService.currentCompany) {
        this.currentCompany = company
        this.departments = this.convertDepartments(company.departments)
        console.log(this.departments);
    }

    convertDepartments(departments: any[] = []) {
        return departments.reduce((acc: any[], department: any, index: number) => {
            acc.push({
                data: {
                    key: index,
                    label: department.name,
                    _id: department._id,
                    createdAt: department.createdAt
                },
                children: this.convertDepartments(department.subdivisions)
            })
            return acc
        }, [])
    }

    onCreateDepartment() {
        this.isCreateDepartment = true
    }

    createDepartment() {
        this.currentCompany.departments.push(this.createDepartmentForm.value)
        this.subscription.add(this.accCompaniesService.update(this.currentCompany).subscribe({
            next: ({ company }) => {
                this.init(company)
                this.isCreateDepartment = false
            }
        }))
    }
}
