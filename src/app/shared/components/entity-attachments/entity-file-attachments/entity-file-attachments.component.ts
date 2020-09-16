import { Component, OnInit, Input, OnChanges, OnDestroy } from '@angular/core';
import { TableData } from 'src/app/shared/models/table-data';
import { EntityService } from 'src/app/shared/services/entity.service';
import { Observable, Subscription } from 'rxjs';
import { AttachmentCategory } from 'src/app/shared/models/entity-configuration';

@Component({
  selector: 'app-entity-file-attachments',
  templateUrl: './entity-file-attachments.component.html',
  styleUrls: ['./entity-file-attachments.component.css']
})
export class EntityFileAttachmentsComponent implements OnInit, OnChanges, OnDestroy {
  @Input() ownerType: string;
  @Input() ownerId: number;
  @Input() categories: AttachmentCategory[];

  fileTableData: TableData[] = [];
  subscriptions: Subscription[] = [];

  constructor(
    private entityService: EntityService
    ) { }

  ngOnInit() {
    // for each category we have a separate entry in fileTableData[]
    if (this.categories) {
      this.categories.forEach(category => {
        this.initFileTable(category.attachmentCatHrid);
      });
    } else {
      this.initFileTable();
    }
  }

  initFileTable(categoryHrid?: string) {
    const dataSource = this.entityService
      .postEntityDataFromUrl('/attachment/all', {attachmentType: 'File', attachmentCategory: categoryHrid, ownerType: this.ownerType, ownerId: this.ownerId});

    const tableData = new TableData('FileAttachment', 'FileAttachment')
    .setScrollable()
    .setScrollHeight('175px')
    .setDataSource(dataSource)
    .hideHeadline()
    .hideHeader()
    .disablePagination();

    this.fileTableData.push(tableData);
  }

  refreshFileTable(idx: number) {
    let categoryHrid: string;
    this.categories ? categoryHrid = this.categories[idx].attachmentCatHrid : categoryHrid = undefined;
      this.fileTableData[idx].dataSource  = this.entityService
        .postEntityDataFromUrl('/attachment/all', {attachmentType: 'File', attachmentCategory: categoryHrid, ownerType: this.ownerType, ownerId: this.ownerId});
      this.fileTableData[idx].triggerRefresh.next();
  }

  // called when any data-bound property of a directive changes
  // this means it is called when selecting another main entity
  ngOnChanges() {
    if (this.ownerId && this.ownerType) {
      if (this.fileTableData) {
        this.fileTableData.forEach((tableData, index) => {
          this.refreshFileTable(index);
        });
      }
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

}
