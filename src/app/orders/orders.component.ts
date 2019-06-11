import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { BreadcrumbService } from '../breadcrumb.service';
import { EntityService } from '../entity.service';
import { EntityConfiguration } from '../shared/models/entity-configuration';
import { Field } from '../shared/models/field';
import { LazyLoadEvent } from 'primeng/primeng';
import { EntityData } from '../shared/models/entity-data';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {
  configuration: EntityConfiguration;
  fields: Field[];
  loading = false;
  entityData: EntityData;
  selectedEntry: any;

  constructor(private breadcrumbService: BreadcrumbService, private entityService: EntityService, private cd: ChangeDetectorRef) {
    this.breadcrumbService.setItems([
      { label: 'Aufträge' }
    ]);
  }

  ngOnInit() {
    this.configuration = new EntityConfiguration();
    this.entityData = new EntityData();
    this.entityService.getEntityConfigurations().subscribe(configs => {
      this.configuration = configs['Order'];
      this.fields = this.configuration.fields.filter(field => field.visible === true);
    });
  }

  async loadLazy(event: LazyLoadEvent) {
    this.loading = true;
    this.cd.detectChanges();

    let sorting = '';
    let qualifier = '';

    if (this.fields) {
      this.fields.forEach(field => {
        if (event.filters[<string>field.field]) {
          qualifier += 'LIKE(\'' + field.header + '\',\'%' +  event.filters[<string>field.field].value + '%\'),';
        }
      });
    }

    if (event.sortOrder === 1) {
      sorting += 'ASC(\'' + 'Auftragsnummer' + '\')';
    } else {
      sorting += 'DESC(\'' + 'Auftragsnummer' + '\')';
    }

    let page = 1;
    if (this.configuration.rowsPerPage) {
      page = event.first / <number>this.configuration.rowsPerPage + 1;
    }

    await this.entityService.filter('Order', page, 10, qualifier, sorting)
      .subscribe(data => this.entityData = data);

    this.loading = false;
  }

}
