import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { BreadcrumbService } from 'src/app/breadcrumb.service';
import { JmlNavigationService } from 'src/app/jmeleon/services/jml-navigation.service';
import { TableData } from 'src/app/shared/models/table-data';

@Component({
  selector: 'app-role-management',
  templateUrl: './role-management.component.html',
  styleUrls: ['./role-management.component.css']
})
export class RoleManagementComponent implements OnInit, OnDestroy {
  tableData: TableData;

  token$: Observable<string>;
  id$: Observable<string>;

  entryId: number;
  isSingleRole: boolean;

  subscriptions: Subscription[] = [];

  constructor(
    private route: ActivatedRoute,
    private jmlNavigationService: JmlNavigationService,
    private breadcrumbService: BreadcrumbService) { }

  ngOnInit() {
    this.breadcrumbService.setItems([{ label: 'Rollenverwaltung' }]);
    this.tableData = new TableData('Rollenverwaltung', 'SecurityRole').hideAttachments();

    this.token$ = this.jmlNavigationService.readToken(this.route).pipe(filter(token => !!token));
    this.id$ = this.jmlNavigationService.readId(this.route).pipe(filter(id => !!id));
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  onEntitySelection(entry) {
    if (!entry) {
      this.isSingleRole = undefined;
      this.entryId = undefined;
    } else {
      this.isSingleRole = entry.typeId && entry.typeId._repr_ === 'Einzelrolle';
      this.entryId = entry.id;
    }
  }

}
