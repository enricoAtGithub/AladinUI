import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AttachmentRequestData } from '../../models/attachment-request-data';
import { Observable } from 'rxjs';
import { AttachmentResponseData } from '../../models/attachment-response-data';
import { AttachmentService } from '../../services/attachment.service';
import { map, tap } from 'rxjs/operators';
import { UrlCollection } from '../../url-collection';
import { EntityService } from '../../services/entity.service';
import { DialogService } from 'primeng/primeng';
import { PictureDialogComponent } from '../picture-dialog/picture-dialog.component';

@Component({
  selector: 'app-attachment-list',
  templateUrl: './attachment-list.component.html',
  styleUrls: ['./attachment-list.component.css']
})
export class AttachmentListComponent implements OnInit {

  // either receive attachment data from parent (for scenario with additional display like image galleria )
  // or define request data and this component requests the data.
  @Input() receiveDataFromParent = false;

  @Input() documentTypeForHeader = 'Dokumente';
  @Input() mainType: string;
  @Input() ownerType: string;
  @Input() ownerId: number;
  @Input() attachmentCategory?: string;
  @Input() showPictureViewerOpenButton = false;

  @Input() attachment: AttachmentResponseData;
  @Output() attachmentRemoved = new EventEmitter<AttachmentRequestData>();



  attachments$: Observable<AttachmentResponseData>;
  header: {field: string, header: string}[];
  content: string[][];
  content2: any[];
  selectedImageName = 'Image';
  displayImageViewer = false;

  constructor(
    private attachmentService: AttachmentService,
    private entityService: EntityService,
    private dialogService: DialogService) { }


  ngOnInit() {
    if (this.receiveDataFromParent) {
      this.readAttachmentData(this.attachment);
    } else {
      this.requestAttachmentData();
    }
  }


  requestAttachmentData() {
    const attachmentRequestData = {
      mainType: this.mainType,
      ownerType: this.ownerType,
      ownerId: this.ownerId,
      attachmentCategory: this.attachmentCategory
    };
    this.attachments$ = this.attachmentService.getAllAttachments(attachmentRequestData)
      .pipe(
        // add err mgmt.
        map(response => response.result),
        tap(attachment => this.readAttachmentData(attachment))
      );
  }

  readAttachmentData(attachment: AttachmentResponseData): void {
    const {keys, values} = attachment.getDataKeysAndValues();
    this.header = keys
      .filter(key => key !== 'id')
      .map(key => ({field: key, header: key}));
    this.content = values;
    this.content2 = values.map(row => {
      const attObj = {};
      keys.forEach((key, pos) => {
        attObj[key] = row[pos];
      });
      // console.log('[attachment-list] attObj: ', attObj);
      return attObj;
    });
    // console.log('[attachment-list] header: ', this.header);
    // console.log('[attachment-list] content: ', this.content);
  }

  /**
   * Method to request data update from parent element.
   *
   * @memberof AttachmentListComponent
   */
  public updateData(): void {
    this.requestAttachmentData();
  }

  downloadUrl(id: number): string {
    return UrlCollection.Files.generateDownloadUrl(id);
  }

  detachAndDeleteEntity(id: number): void {
    console.log('[AttachmentListComponent-detachAndDeleteEntity]');
    // detach
      // 	{
      //      "mainType" : "File",
      //      "mainId" : 12,
      //      "ownerType" : "Glass",
      //      "ownerId" : 9
      // }
      const attachmentRequest: AttachmentRequestData = {
        mainType: this.mainType,
        mainId: id,
        ownerType: this.ownerType,
        ownerId: this.ownerId
      };
      this.attachmentService.detachFromEntity(attachmentRequest).subscribe(_ => {
        // delete
        this.entityService.deleteEntity(this.mainType, id).subscribe(_ => {
          console.log(`successfully deleted ${this.mainType}`);
          this.updateData();
          this.attachmentRemoved.emit(attachmentRequest);
        });
      });
  }

  openImage(id: number): void {
    // this.selectedImageName = this.content2[id];
    // this.displayImageViewer = true;
    // console.log('content: ', this.content2[id]);
    console.log('[AttachmentListComponent-openImage] id: ', id);
    console.log('[AttachmentListComponent-openImage] content: ', JSON.stringify(this.content2));
    const attachment = this.content2.find(element => element.id === id);
    const dialogRef = this.dialogService.open(PictureDialogComponent, {
      data: {
        fileId: id
      },
      header: `${attachment.Dateiname} - ${attachment.Typ}`
    });
    dialogRef.onClose.subscribe(event => {
      // anything?
    });
  }

  showImage(): void {
  }

}
