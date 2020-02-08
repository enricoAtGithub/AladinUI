import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Catalogue } from '../../models/catalogue';
import { CatalogueService } from '../../services/catalogue.service';
import { Observable, Subscription } from 'rxjs';
import { HttpResult } from '../../models/http/http-result';
import { map, tap } from 'rxjs/operators';
// import { EventEmitter } from 'events';

@Component({
  selector: 'app-catalogue-chooser-dialog',
  templateUrl: './catalogue-chooser-dialog.component.html',
  styleUrls: ['./catalogue-chooser-dialog.component.css']
})
export class CatalogueChooserDialogComponent implements OnInit, OnDestroy {


  @Input() catalogueName: string;
  @Input() header = '';
  @Input() description = 'Element auswählen';
  @Input() preSelectedOption = '';
  @Input() visible = false;
  @Output() itemSelected = new EventEmitter<string>();
  catalogue$: Observable<Catalogue>;
  selectedItem: string;
  errMsg: string;
  showErrMsg = false;
  // catalogueSubscription: Subscription;

  constructor(private catalogueService: CatalogueService) { }

  ngOnInit() {
    this.catalogue$ = this.catalogueService.getCatalogue(this.catalogueName)
      .pipe(
        tap((httpResult: HttpResult<Catalogue>) => {
          if (!httpResult.success) {
            this.showErrorMessage(httpResult.errMsg);
          }
        }),
        map((httpResult: HttpResult<Catalogue>) => httpResult.result)
      );

    if (this.preSelectedOption !== '') {
      this.selectedItem = this.preSelectedOption;
    }
  }

  ngOnDestroy(): void {
    throw new Error('Method not implemented.');
  }

  showErrorMessage(errMsg: string) {
    this.errMsg = errMsg;
    this.showErrMsg = true;
  }

  selectItem(event: { value: string; }) {
    this.selectedItem = event.value;
  }

  onApplySelection() {
    this.itemSelected.emit(this.selectedItem);
    this.visible = false;
  }

}
