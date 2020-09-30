import { Component, OnInit, OnDestroy } from '@angular/core';
import { TableData } from 'src/app/shared/models/table-data';
import { BreadcrumbService } from '../../../breadcrumb.service';
import { ActivatedRoute } from '@angular/router';
import { JmlNavigationService } from 'src/app/jmeleon/services/jml-navigation.service';
import { Observable, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-entity-view',
  templateUrl: './entity-view.component.html',
  styleUrls: ['./entity-view.component.css']
})
export class EntityViewComponent implements OnInit, OnDestroy {
  tableData: TableData;

  token$: Observable<string>;
  id$: Observable<string>;

  subscriptions: Subscription[] = [];

  constructor(
    private route: ActivatedRoute,
    private jmlNavigationService: JmlNavigationService,
    private breadcrumbService: BreadcrumbService) { }

  ngOnInit() {

    this.subscriptions.push(
      this.route.data.subscribe(data => {
        this.breadcrumbService.setItems([
          { label: data.displayName }
        ]);
        this.tableData = new TableData(data.displayName, data.entityType);
      })
    );
    this.token$ = this.jmlNavigationService.readToken(this.route).pipe(filter(token => !!token));
    this.id$ = this.jmlNavigationService.readId(this.route).pipe(filter(id => !!id));
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

}
