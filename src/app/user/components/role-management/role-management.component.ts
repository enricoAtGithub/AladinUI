import { Component, OnInit } from '@angular/core';
import { BreadcrumbService } from 'src/app/breadcrumb.service';
import { TableData } from 'src/app/shared/models/table-data';

@Component({
  selector: 'app-role-management',
  templateUrl: './role-management.component.html',
  styleUrls: ['./role-management.component.css']
})
export class RoleManagementComponent implements OnInit {
  tableData = new TableData('Rollenverwaltung', 'SecurityRole');

  constructor(private breadcrumbService: BreadcrumbService) {
    this.breadcrumbService.setItems([
      { label: 'Rollenverwaltung' }
    ]);
  }

  ngOnInit() {
  }

}
