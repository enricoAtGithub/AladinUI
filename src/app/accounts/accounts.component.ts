import { Component, OnInit } from '@angular/core';
import { TableData } from '../shared/models/table-data';
import { BreadcrumbService } from '../breadcrumb.service';

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.css']
})
export class AccountsComponent implements OnInit {
  data = new TableData('Accounts', 'Account');

  constructor(private breadcrumbService: BreadcrumbService) {
    this.breadcrumbService.setItems([
      { label: 'Accounts' }
    ]);
  }

  ngOnInit() {
  }

}
