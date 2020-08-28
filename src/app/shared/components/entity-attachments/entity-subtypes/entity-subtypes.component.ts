import { Component, OnInit, Input, SimpleChanges, OnChanges, Output, EventEmitter } from '@angular/core';
import { TableData } from 'src/app/shared/models/table-data';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-entity-subtypes',
  templateUrl: './entity-subtypes.component.html',
  styleUrls: ['./entity-subtypes.component.css']
})
export class EntitySubtypesComponent implements OnInit, OnChanges {
  tableData: TableData;

  @Input() subtype: string;
  @Input() mainId: number;
  @Input() refreshTrigger: Subject<any>;

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.subtype) {
      this.tableData = new TableData('', changes.subtype.currentValue)
        .setScrollable()
        //.setScrollHeight('222px')
        .hideHeader()
        .hideHeadline()
        //.disablePagination();
    }
  }

  onEntityOperation() {
    if (this.refreshTrigger) {
      this.refreshTrigger.next(null);
    }
  }

}
