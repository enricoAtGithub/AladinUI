import { Component, OnInit, Input, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { TableData } from 'src/app/shared/models/table-data';
import { EntityService } from 'src/app/shared/services/entity.service';
import { Subscription } from 'rxjs';
import { AttachmentCategory } from 'src/app/shared/models/entity-configuration';
import { EntityData } from 'src/app/shared/models/entity-data';


@Component({
  selector: 'app-entity-file-attachments',
  templateUrl: './entity-file-attachments.component.html',
  styleUrls: ['./entity-file-attachments.component.css']
})
export class EntityFileAttachmentsComponent implements OnInit, OnChanges, OnDestroy {
  @Input() ownerType: string;
  @Input() ownerId: number;
  @Input() categories: AttachmentCategory[];

  subscriptions: Subscription[] = [];
  fileTableData: TableData[];
  showZombieAttachmentTab: boolean;

  constructor(
    private entityService: EntityService
  ) { }

  ngOnInit() {
    this.fileTableData = [];
    this.showZombieAttachmentTab = false;

    if (this.categories) {                               // initialze FileTable for each category
      const attachmentCatHrid: string[] = [];
      this.categories.forEach(category => {
        this.initFileTable(category.attachmentCatHrid);
        attachmentCatHrid.push(category.attachmentCatHrid);
      });
      this.initFileTable(null, attachmentCatHrid);
    } else {                                             // no categories
      this.initFileTable();
    }
  }

  // no param set: no attachment category defined => get all file attachments
  // only catHrid is set: get file attachments for category
  // only excludedCats[] is set: get all file attachments excluding the ones belonging to the specified categories ("zombie attachments")
  initFileTable(catHrid?: string, excludedCats?: string[]) {
    const dataSource$ = this.entityService
      .postEntityDataFromUrl('/attachment/all', {
        attachmentType: 'File', attachmentCategory: catHrid, ownerType: this.ownerType,
        ownerId: this.ownerId, excludeAttachmentCategories: excludedCats
      });

    if (excludedCats) {
      this.subscriptions.push(
        dataSource$.subscribe(entityData => {
          entityData.data.length === 0 ? this.showZombieAttachmentTab = false : this.showZombieAttachmentTab = true;
        })
      );
    }

    const tableData = new TableData('FileAttachment', 'FileAttachment')
      .setScrollable()
      .setScrollHeight('175px')
      .setDataSource(dataSource$)
      .hideHeadline()
      .hideHeader()
      .disablePagination();

    this.fileTableData.push(tableData);
  }

  // called when any data-bound property of a directive changes, e.g. when another entity is selected
  ngOnChanges(changes: SimpleChanges) {
    if (!changes.ownerId.firstChange) { this.ngOnInit(); }
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

}
