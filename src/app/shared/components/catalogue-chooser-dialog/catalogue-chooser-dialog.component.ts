import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Catalogue } from '../../models/catalogue';
import { CatalogueService } from '../../services/catalogue.service';
import { Subscription } from 'rxjs';
import { HttpResult } from '../../models/http/http-result';
import { map, tap } from 'rxjs/operators';
import { SelectItem } from 'primeng/primeng';

@Component({
  selector: 'app-catalogue-chooser-dialog',
  templateUrl: './catalogue-chooser-dialog.component.html',
  styleUrls: ['./catalogue-chooser-dialog.component.css']
})
export class CatalogueChooserDialogComponent implements OnInit, OnDestroy {

  _catalogueName: string;
  @Input()
    set catalogueName(catalogueName: string) {
      this._catalogueName = catalogueName;
    }
    get catalogueName() {
      return this._catalogueName;
    }
  @Input() header = '';
  @Input() preSelectedOption = '';
  @Input() visible = false;
  @Input() catalogueDisplayName = 'Element auswählen';
  @Input() showHeader = false;
  @Output() itemSelected = new EventEmitter<string>();

  catalogue: Catalogue;
  catalogueSubscription: Subscription;

  catalogItems: SelectItem[];

  selectedItem: string;
  errMsg: string;
  showErrMsg = false;

  constructor(private catalogueService: CatalogueService) { }

  ngOnInit() {
    this.catalogueSubscription = this.catalogueService.getCatalogue(this.catalogueName)
      .pipe(
        tap((httpResult: HttpResult<Catalogue>) => {
          if (!httpResult.success) {
            this.showErrorMessage(httpResult.errMsg);
          }
        }),
        map((httpResult: HttpResult<Catalogue>) => httpResult.result),
      ).subscribe(catalogue => {
        this.catalogue = catalogue;
        this.catalogItems = catalogue.values.map(value => <SelectItem>{label: value.name, value: value.name});
        if (!!this.preSelectedOption) {
          if (!catalogue.values.some(entry => entry.name === this.preSelectedOption)) {
            this.catalogItems.push({label: this.preSelectedOption, value: this.preSelectedOption});
          }
          this.selectedItem = this.preSelectedOption;
        } else {
          this.selectedItem = this.catalogItems[0].value;
        }
        this.onApplySelection();
      });
  }

  ngOnDestroy(): void {
    this.catalogueSubscription.unsubscribe();
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
