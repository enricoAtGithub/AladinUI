import { Component, OnInit, Input } from '@angular/core';
import { AttachmentRequestData } from '../../models/attachment-request-data';
import { Observable } from 'rxjs';
import { AttachmentResponseData } from '../../models/attachment-response-data';
import { AttachmentService } from '../../services/attachment.service';
import { map, tap } from 'rxjs/operators';

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

  @Input() attachment: AttachmentResponseData;

  attachments$: Observable<AttachmentResponseData>;
  header: {field: string, header: string}[];
  content: string[][];
  content2: any[];

  constructor(private attachmentService: AttachmentService) { }

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
    this.header = keys.map(key => ({field: key, header: key}));
    this.content = values;
    this.content2 = values.map(row => {
      const attObj = {};
      keys.forEach((key, pos) => {
        attObj[key] = row[pos];
      });
      console.log('[attachment-list] attObj: ', attObj);
      return attObj;
    });
    console.log('[attachment-list] header: ', this.header);
    console.log('[attachment-list] content: ', this.content);
  }

}
