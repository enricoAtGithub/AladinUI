import { Component, OnInit, ChangeDetectorRef, Input } from '@angular/core';
import { EntityConfiguration } from '../shared/models/entity-configuration';
import { Field } from '../shared/models/field';
import { EntityData } from '../shared/models/entity-data';
import { EntityService } from 'src/app/entity.service';
import { LazyLoadEvent } from 'primeng/primeng';
import { TableData } from './table-data';

@Component({
  selector: 'app-dynamic-table',
  templateUrl: './dynamic-table.component.html',
  styleUrls: ['./dynamic-table.component.css']
})
export class DynamicTableComponent implements OnInit {
  @Input() tableData: TableData;

  configuration: EntityConfiguration;
  fields: Field[];
  loading = false;
  entityData: EntityData;
  selectedEntry: any;

  constructor(private entityService: EntityService, private cd: ChangeDetectorRef) {}

  ngOnInit() {
    this.configuration = new EntityConfiguration();
    this.entityData = new EntityData();
    this.entityService.getEntityConfigurations().subscribe(configs => {
      this.configuration = configs[this.tableData.configName];
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

      const sort = this.fields.find(field => {if (field.field === event.sortField) {return true; }});

      if (sort) {
        if (event.sortOrder === 1) {
          sorting += 'ASC(\'' + sort.header + '\')';
        } else {
          sorting += 'DESC(\'' + sort.header + '\')';
        }
      }
    }

    let page = 1;
    if (this.configuration.rowsPerPage) {
      page = event.first / <number>this.configuration.rowsPerPage + 1;
    }

    await this.entityService.filter(this.tableData.configName, page, 10, qualifier, sorting)
      .subscribe(data => this.entityData = data);

    this.loading = false;
  }

}
