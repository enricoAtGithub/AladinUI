import { Component, OnInit } from '@angular/core';
import { TableData } from '../shared/models/table-data';
import { BreadcrumbService } from '../breadcrumb.service';
import { JmlNavigationService } from '../jmeleon/services/jml-navigation.service';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.css']
})
export class AccountsComponent implements OnInit {
  data = new TableData('Accounts', 'Account');

  token$: Observable<string>;
  id$: Observable<string>;

  constructor(
    private breadcrumbService: BreadcrumbService,
    private jmlNavigationService: JmlNavigationService,
    private route: ActivatedRoute) {
    this.breadcrumbService.setItems([
      { label: 'Accounts' }
    ]);
  }

  ngOnInit() {
    this.token$ = this.jmlNavigationService.readToken(this.route).pipe(filter(token => !!token));
    this.id$ = this.jmlNavigationService.readId(this.route).pipe(filter(id => !!id));
  }

}
