import { Component, OnInit, ViewChild, Input, SimpleChanges, OnChanges } from '@angular/core';
import { DynamicTableComponent } from '../../dynamic-table/dynamic-table.component';
import { TableData } from 'src/app/shared/models/table-data';
import { EntityService } from 'src/app/shared/services/entity.service';

@Component({
  selector: 'app-entity-logs',
  templateUrl: './entity-logs.component.html',
  styleUrls: ['./entity-logs.component.css']
})
export class EntityLogsComponent implements OnInit, OnChanges {
  @ViewChild('logsTable', {static: false}) logsTable: DynamicTableComponent;

  logTableData: TableData;

  @Input() ownerType: string;
  @Input() ownerId: number;

  constructor(private entityService: EntityService) { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.ownerId && !changes.ownerType) {
      this.logTableData.dataSource = this.entityService.getEntityDataFromUrl('/log/entries/' + this.ownerType + '/' + this.ownerId);
      this.logTableData.triggerRefresh.next();
    } else if (changes.ownerId && changes.ownerType) {
      const dataSource = this.entityService.getEntityDataFromUrl('/log/entries/' + this.ownerType + '/' + this.ownerId);
      this.logTableData = new TableData('Logs', 'LogEntry')
        .setScrollable()
        .setScrollHeight('175px')
        .hideAttachments()
        .hideButtons()
        .hideHeader()
        .hideHeadline()
        .setDataSource(dataSource)
        .disablePagination();
    }
  }


}
