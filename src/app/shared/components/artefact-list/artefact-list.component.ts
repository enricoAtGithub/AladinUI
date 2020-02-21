import { Component, OnInit, Input } from '@angular/core';
import { AttachmentRequestData } from '../../models/attachment-request-data';
import { Observable } from 'rxjs';
import { AttachmentResponseData } from '../../models/attachment-response-data';
import { AttachmentService } from '../../services/attachment.service';
import { map, tap } from 'rxjs/operators';

@Component({
  selector: 'app-artefact-list',
  templateUrl: './artefact-list.component.html',
  styleUrls: ['./artefact-list.component.css']
})
export class ArtefactListComponent implements OnInit {

  @Input() documentTypeForHeader = 'Dokumente';
  // @Input() attachmentRequestData: AttachmentRequestData;
  @Input() mainType: string;
  @Input()   ownerType: string;
  @Input()   ownerId: number;
  @Input()   attachmentCategory?: string;

  attachments$: Observable<AttachmentResponseData>;
  header: {field: string, header: string}[];
  content: string[][];

  constructor(private attachmentService: AttachmentService) { }

  ngOnInit() {
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
        tap(attachment => {
          const {keys, values} = attachment.getDataKeysAndValues();
          this.header = keys.map(key => ({field: key, header: key}));
          this.content = values;
        })
      );
  }

}
