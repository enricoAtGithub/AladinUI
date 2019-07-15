import { Component, OnInit, ChangeDetectorRef, Input } from '@angular/core';
import { EntityConfiguration } from '../../models/entity-configuration';
import { Field } from '../../models/field';
import { EntityData } from '../../models/entity-data';
import { EntityService } from '../../services/entity.service';
import { LazyLoadEvent, DialogService, ConfirmationService } from 'primeng/primeng';
import { TableData } from '../../models/table-data';
import { AddEntityDialogComponent } from '../add-entity-dialog/add-entity-dialog.component';

@Component({
  selector: 'app-dynamic-table',
  templateUrl: './dynamic-table.component.html',
  styleUrls: ['./dynamic-table.component.css'],
  providers: [ConfirmationService]
})
export class DynamicTableComponent implements OnInit {
  @Input() tableData: TableData;

  configuration: EntityConfiguration;
  fields: Field[];
  loading = false;
  entityData: EntityData;
  selectedEntry: any;
  lastLazyLoadEvent: LazyLoadEvent;

  constructor(private entityService: EntityService, private cd: ChangeDetectorRef,
    private dialogService: DialogService, private confirmationService: ConfirmationService) {}

  ngOnInit() {
    this.configuration = new EntityConfiguration();
    this.entityData = new EntityData();
    this.entityService.getEntityConfigurations().subscribe(configs => {
      this.configuration = configs[this.tableData.configName];
      this.fields = this.configuration.fields.filter(field => field.visible === true);
    });
  }

  async loadLazy(event: LazyLoadEvent) {
    this.lastLazyLoadEvent = event;
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

  showAddEntityDialog() {
    const dialogRef = this.dialogService.open(AddEntityDialogComponent, {
      data: {
        config: this.configuration
      },
      header: 'Hinzufügen',
      width: '25%'
    });

    dialogRef.onClose.subscribe((submitted: boolean) => { if (submitted) { this.loadLazy(this.lastLazyLoadEvent); } });
  }

  updateEntity(data: any) {
    console.log(data);
  }

  deleteEntity(data: any) {
    this.confirmationService.confirm({
      message: 'Sind Sie sicher, dass Sie diesen Benutzer löschen wollen?',
      accept: () => {
        this.entityService.deleteEntity(this.configuration.type, data['id']).subscribe();
        this.loadLazy(this.lastLazyLoadEvent);
      }
    });
  }

}
