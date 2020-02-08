import { TestBed } from '@angular/core/testing';

import { FileUploadDownloadService } from './file-upload-download.service';

describe('FileUploadDownloadService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FileUploadDownloadService = TestBed.get(FileUploadDownloadService);
    expect(service).toBeTruthy();
  });
});
