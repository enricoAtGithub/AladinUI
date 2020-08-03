import { Component, OnInit, Input, OnChanges, OnDestroy } from '@angular/core';
import { TableData } from 'src/app/shared/models/table-data';
import { EntityService } from 'src/app/shared/services/entity.service';
import { DialogService } from 'primeng/primeng';
import { FileUploadDialogComponent } from '../../file-upload-dialog/file-upload-dialog.component';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-entity-file-attachments',
  templateUrl: './entity-file-attachments.component.html',
  styleUrls: ['./entity-file-attachments.component.css']
})
export class EntityFileAttachmentsComponent implements OnChanges, OnDestroy {
  @Input() ownerType: string;
  @Input() ownerId: number;

  fileTableData: TableData;
  subscriptions: Subscription[] = [];

  constructor(
    private entityService: EntityService,
    private dialogService: DialogService
    ) { }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  ngOnChanges() {
    if (!this.fileTableData) {
      const dataSource = this.entityService
        .postEntityDataFromUrl('/attachment/all', {attachmentType: 'File', ownerType: this.ownerType, ownerId: this.ownerId});
        this.fileTableData = new TableData('FileAttachment', 'FileAttachment')
          .setScrollable()
          .setScrollHeight('175px')
          .setDataSource(dataSource)
          .hideHeadline()
          .hideHeader()
          .disablePagination();
    } else if (this.ownerId && this.ownerType) {
      this.fileTableData.dataSource  = this.entityService
        .postEntityDataFromUrl('/attachment/all', {attachmentType: 'File', ownerType: this.ownerType, ownerId: this.ownerId});
      this.fileTableData.triggerRefresh.next();
    }
  }

  addFileAttachment() {
    const dialogRef = this.dialogService.open(FileUploadDialogComponent, {
      data: {
        catalogueName: 'FILE_TYPES',
        catalogueDisplayName: 'Dateityp',
        createAttachment: true,
        ownerId: this.ownerId,
        ownerType: this.ownerType
      },
      header: 'Datei hochladen',
      width: '800px'
    });

    this.subscriptions.push(
      dialogRef.onClose.subscribe(() => this.fileTableData.triggerRefresh.next()));
  }
}
