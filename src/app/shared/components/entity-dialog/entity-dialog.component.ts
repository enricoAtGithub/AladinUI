import { Component, OnInit, OnDestroy } from '@angular/core';
import { DynamicDialogRef, DynamicDialogConfig, InputText, SelectItem } from 'primeng/primeng';
import { FormGroup, NgForm } from '@angular/forms';
import { EntityService } from '../../services/entity.service';
import { CatalogueService } from 'src/app/user/services/catalogue.service';
import { TableData } from '../../models/table-data';
import { Observable, BehaviorSubject, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

import { Store, select } from '@ngrx/store';
import { RootStoreState } from 'src/app/root-store/root-index';
import * as fromConfigSelectors from 'src/app/root-store/config-store/config.selectors';
import { Field } from '../../models/field';
import { SettingsService } from 'src/app/jmeleon/modules/settings/services/settings.service';
import DateTimeUtils from '../../utils/date-time.utils';


@Component({
  selector: 'app-entity-dialog',
  templateUrl: './entity-dialog.component.html',
  styleUrls: ['./entity-dialog.component.css']
})

export class EntityDialogComponent implements OnInit, OnDestroy {
  catalogueOptions: Map<string, any[]> = new Map();
  update: Boolean;
  entity: any;
  mainId: number;
  displayEntitySelectionDialog = false;
  entitySelectionTableData: TableData;
  entitySelectionContext: { field: string, textModule: any };
  codeSelCntxt: { field: Field, textModule: any };
  displayScrollPanel = false;
  defaultCache: Object = new Object();
  subscriptions: Subscription[] = [];
  currency$: Observable<string>;
  dtoConfigs: SelectItem[];
  syntax: string;
  code: string;
  showCodeEditor = false;
  fields: Field[];
  configType: string;

  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private entityService: EntityService,
    private catalogueService: CatalogueService,
    private store$: Store<RootStoreState.State>,
    private settingsService: SettingsService
  ) { }

  ngOnInit() {
    // get fields to be displayed
    const data = this.config.data;
    if (data['fields']) {
      this.fields = data['fields'];
    } else {
      console.log('[entity-dialog] no fields supplied');
      return;
    }

    this.configType = data['configType'];


    // get items for fields with type 'CatalogueEntry'
    this.fields.forEach(field => {
      if (Field.isCatalogueEntry(field)) {
        this.subscriptions.push(
          this.catalogueService.getCatalogue(field.defaultCatalogue).subscribe(catalogue => {
            const values = catalogue.values.map(e => ({ label: e['name'], value: e['id'] }));
            this.catalogueOptions.set(field.defaultCatalogue, values);
          })
        );
      }
    });

    // get Currency from settings
    this.currency$ = this.settingsService.getSetting('CURRENCY').pipe(map(setting => setting.value));

    this.update = this.config.data['update'];

    // mainId required in case of subtypes (identifies its parent)
    this.mainId = data['mainId'];

    // get entity
    let $entity: Observable<any>;
    if (data['entity']) {
      $entity = new BehaviorSubject(data['entity']).asObservable();
    } else if (data['entityId']) {
      $entity = this.entityService.getEntity(this.configType, data['entityId']).pipe(map(res => res.fields));
    } else if (this.update) {
      console.log('[entity-dialog] no entity supplied');
      return;
    }

    // get entity details
    if ($entity) {
      this.subscriptions.push(
        $entity.subscribe(entity => {
          this.entity = entity;
          this.fields.forEach(field => {
            if (field.type === 'Date') {
              if (this.entity[field.field] != null) {
                this.entity[field.field] = DateTimeUtils.convertApiDateTimeStringToDate(this.entity[field.field]);
              }
            }
          });
          this.displayScrollPanel = this.shouldDisplayScrollPanel();
        })
      );
      // no entity specified => get default values
    } else {
      this.fields.forEach(field => {
        if (field.defaultValue) {
          if (!this.defaultCache.hasOwnProperty(field.field)) {
            if (typeof field.defaultValue === 'string' && field.defaultValue.startsWith('${')) {
              this.subscriptions.push(
                this.entityService.eval(field.defaultValue).subscribe(response => {
                  this.defaultCache[field.field] = response['result'];
                  if (field.type === 'Date') { this.defaultCache[field.field] = DateTimeUtils.convertApiDateTimeStringToDate(this.defaultCache[field.field]); }
                }));
            } else {
              this.defaultCache[field.field] = field.defaultValue;
              if (field.type === 'Date') { this.defaultCache[field.field] = DateTimeUtils.convertApiDateTimeStringToDate(this.defaultCache[field.field]); }
            }
          }
        } else {
          this.defaultCache[field.field] = undefined;
        }
      });
    }

    // get all dtoConfigs for field.type === 'dtoType' (e.g. for Script Actions)
    const configurations$ = this.store$.pipe(select(fromConfigSelectors.selectConfigs));
    this.subscriptions.push(
      configurations$.subscribe(configs => {
        this.dtoConfigs = Object.values(configs).map(config => this.configToSelectItem(config.type, config.type));
      })
    );

  }

  configToSelectItem(name: string, type: string): SelectItem {
    return { label: name, value: type };
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  entitySelected(entity: any, form: NgForm) {
    form.control.patchValue({ [this.entitySelectionContext.field]: entity['id'] });
    this.entitySelectionContext.textModule['value'] = entity['_repr_'];
    this.displayEntitySelectionDialog = false;
  }

  openEntitySelectionDialog(field: Field, input: InputText) {
    this.entitySelectionContext = { field: field.field, textModule: input };
    this.entitySelectionTableData = new TableData(field.referenceType, field.referenceType)
      .hideHeader()
      .hideHeadline()
      .hideAttachments()
      .hideButtons()
      .setScrollable()
      .disableInlineEdit()
      .setScrollHeight('700px');
    this.displayEntitySelectionDialog = true;
  }

  openCodeEditor(field: Field, input: InputText, form: NgForm) {
    this.codeSelCntxt = { field: field, textModule: input };
    this.syntax = field.type;
    this.code = form.control.get(this.codeSelCntxt.field.field).value;
    this.showCodeEditor = true;
  }

  onEdited(editedCode: string, form: NgForm) {
    if (editedCode) {
      form.control.patchValue({ [this.codeSelCntxt.field.field]: editedCode });
      this.codeSelCntxt.textModule['value'] = '<' + this.codeSelCntxt.field.type + '>*';
    }
    this.showCodeEditor = false;
  }

  nullField(field: Field, form: NgForm) {
    form.control.patchValue({ [field.field]: null });
  }

  onSubmit(entityForm: FormGroup) {
    this.fields.forEach(field => {
      if (this.entity && entityForm.value[field.field] === undefined) {
        entityForm.value[field.field] = this.entity[field.field];
      } else if (field.type === 'int') {
        if (entityForm.value[field.field] === '') {
          entityForm.value[field.field] = null;
        }
      } else if (field.type === 'Date') {
        if (entityForm.value[field.field] != null) {
          entityForm.value[field.field] = new Date(entityForm.value[field.field]).toISOString();
        }
      } else if (entityForm.value[field.field] === undefined) {
        entityForm.value[field.field] = null;
      }
    });

    if (this.mainId) {
      entityForm.value['mainId'] = this.mainId;
    }

    this.ref.close(<Field[]>entityForm.value);
  }

  shouldDisplayScrollPanel() {
    let editableFields = 0;
    let editOrMandFields = 0;
    this.fields.forEach(field => {
      if (field.mandatory) {
        editOrMandFields++;
      } else if (field.editable) {
        editOrMandFields++;
        editableFields++;
      }
    });

    if (this.update) {
      return editableFields >= 12;
    } else {
      return editOrMandFields >= 12;
    }
  }

  _isCatalogueEntry(field: Field): boolean {
    return Field.isCatalogueEntry(field);
  }

  _isEntityReference(field: Field): boolean {
    return Field.isEntityReference(field);
  }
}
