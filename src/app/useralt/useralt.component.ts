import { Component, OnInit } from '@angular/core';
import { TableData } from 'src/app/shared/models/table-data';
import { BreadcrumbService } from '../breadcrumb.service';

@Component({
  selector: 'app-useralt',
  templateUrl: './useralt.component.html',
  styleUrls: ['./useralt.component.css']
})
export class UseraltComponent implements OnInit {
  data = new TableData('User', 'User');

  constructor(private breadcrumbService: BreadcrumbService) {
    this.breadcrumbService.setItems([
      { label: 'User' }
    ]);
  }

  ngOnInit() {}
}
