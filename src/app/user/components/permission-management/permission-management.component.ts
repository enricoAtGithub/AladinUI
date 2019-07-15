import { Component, OnInit } from '@angular/core';
import { BreadcrumbService } from 'src/app/breadcrumb.service';
import { TableData } from 'src/app/shared/models/table-data';

@Component({
  selector: 'app-permission-management',
  templateUrl: './permission-management.component.html',
  styleUrls: ['./permission-management.component.css']
})
export class PermissionManagementComponent implements OnInit {
  tableData = new TableData('Rechteverwaltung', 'SecurityRight');

  constructor(private breadcrumbService: BreadcrumbService) {
    this.breadcrumbService.setItems([
      { label: 'Rechteverwaltung' }
    ]);
  }

  ngOnInit() {
  }

}
