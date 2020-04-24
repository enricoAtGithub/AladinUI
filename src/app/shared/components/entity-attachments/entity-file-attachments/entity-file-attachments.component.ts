import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { TableData } from 'src/app/shared/models/table-data';
import { EntityService } from 'src/app/shared/services/entity.service';

@Component({
  selector: 'app-entity-file-attachments',
  templateUrl: './entity-file-attachments.component.html',
  styleUrls: ['./entity-file-attachments.component.css']
})
export class EntityFileAttachmentsComponent implements OnChanges {
  @Input() type: string;
  @Input() entryId: number;

  fileTableData: TableData;

  constructor(private entityService: EntityService) { }

  ngOnChanges() {
    if (!this.fileTableData) {
      const dataSource = this.entityService
        .postEntityDataFromUrl('/attachment/all', {mainType: 'File', ownerType: this.type, ownerId: this.entryId});
        this.fileTableData = new TableData('FileAttachment', 'FileAttachment')
          .setScrollable()
          .setScrollHeight('175px')
          .setDataSource(dataSource)
          .hideHeadline()
          .hideHeader()
          .disablePagination();
    } else if (this.entryId && this.type) {
      this.fileTableData.dataSource  = this.entityService
        .postEntityDataFromUrl('/attachment/all', {mainType: 'File', ownerType: this.type, ownerId: this.entryId});
      this.fileTableData.triggerRefresh.next();
    }
  }

  onFileAttached(event) {
    this.fileTableData.triggerRefresh.next();
  }

}
