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
  @Input() mainType: string;
  @Input() mainId: number;

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
        .postEntityDataFromUrl('/attachment/all', {attachmentType: 'File', ownerType: this.mainType, ownerId: this.mainId});
        this.fileTableData = new TableData('FileAttachment', 'FileAttachment')
          .setScrollable()
          .setScrollHeight('175px')
          .setDataSource(dataSource)
          .hideHeadline()
          .hideHeader()
          .disablePagination();
    } else if (this.mainId && this.mainType) {
      this.fileTableData.dataSource  = this.entityService
        .postEntityDataFromUrl('/attachment/all', {attachmentType: 'File', ownerType: this.mainType, ownerId: this.mainId});
      this.fileTableData.triggerRefresh.next();
    }
  }

  addFileAttachment(mainId: number, mainType: string) {
    const dialogRef = this.dialogService.open(FileUploadDialogComponent, {
      data: {
        catalogueName: 'FileTypes',
        catalogueDisplayName: 'Dateityp',
        createAttachment: true,
        mainId: mainId,
        mainType: mainType
      },
      header: 'Datei hochladen',
      width: '800px'
    });

    this.subscriptions.push(
      dialogRef.onClose.subscribe(() => this.fileTableData.triggerRefresh.next()));
  }
}
