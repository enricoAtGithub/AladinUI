import { Component, OnInit, Input } from '@angular/core';
import { Catalogue } from '../../models/catalogue';

@Component({
  selector: 'app-file-upload-dialog',
  templateUrl: './file-upload-dialog.component.html',
  styleUrls: ['./file-upload-dialog.component.css']
})
export class FileUploadDialogComponent implements OnInit {

  @Input() chooseLabel = 'Datei auswählen';
  @Input() uploadLabel = 'Hochladen';
  @Input() cancelLabel = 'Abbrechen';
  url: string;
  catalogue: Catalogue;
  showCatalogChooser = false;

  constructor() { }

  ngOnInit() {
    this.catalogue = new Catalogue();
    this.catalogue.name = 'TestCatalogue';
    this.catalogue.values.push('Test01', 'Test02');
  }

  onBeforeUpload(event: any) {
    console.log('onBeforeUpload');
  }

  onSend(event: any) {
    console.log('onSend');
  }

  onUpload(event: any) {
    console.log('onUpload');
  }

  onError(event: any) {
    console.log('onError');
  }

  onClear(event: any) {
    console.log('onClear');
  }

  onRemove(event: any) {
    console.log('onRemove');
  }

  onSelect(event: any) {
    console.log('onSelect');
  }

  onProgress(event: any) {
    console.log('onProgress');
  }

  onCatalogueItemSelected($event) {

  }





}
