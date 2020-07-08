import { Component, OnInit, Input, SimpleChanges, OnChanges } from '@angular/core';
import { TableData } from 'src/app/shared/models/table-data';

@Component({
  selector: 'app-entity-subtypes',
  templateUrl: './entity-subtypes.component.html',
  styleUrls: ['./entity-subtypes.component.css']
})
export class EntitySubtypesComponent implements OnInit, OnChanges {
  tableData: TableData;

  @Input() subtype: string;
  @Input() ownerId: number;

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.subtype) {
      this.tableData = new TableData('', changes.subtype.currentValue)
        .setScrollable()
        .setScrollHeight('222px')
        //.hideHeader()
        .hideHeadline()
        .disablePagination();
    }
  }

}
