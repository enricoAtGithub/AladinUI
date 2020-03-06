import { BreadcrumbService } from 'src/app/breadcrumb.service';
import { MenuItem } from 'primeng/primeng';
import { AuthService } from 'src/app/auth/services/auth.service';
import { Observable, of } from 'rxjs';
import { FileUploadDownloadService } from '../file-upload-download.service';
import { AttachmentService } from '../attachment.service';
import { AttachmentRequestData } from '../../models/attachment-request-data';
import { HttpResponseState } from '../../models/http/http-response-state';

export const breadcrumbServiceStub: Partial<BreadcrumbService> = {
    setItems(items: MenuItem[]) {}
};

export const authServiceStub: Partial<AuthService> = {
  changePassword(oldpass: string, newpass: string): Observable<boolean> {
    return of(true);
  }
};

export const fileServiceStub: Partial<FileUploadDownloadService> = {
  getUploadUrl() {return ''; }
};

export const attachmentServiceStub: Partial<AttachmentService> = {
  attachToEntity(attachmentData: AttachmentRequestData): Observable<HttpResponseState> {
    return of(<HttpResponseState>{});
  }
};


