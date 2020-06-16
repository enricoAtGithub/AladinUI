import { Component, OnInit, OnDestroy } from '@angular/core';
import { DynamicDialogRef, DynamicDialogConfig, InputText, DialogService, SelectItem } from 'primeng/primeng';
import { EntityConfiguration } from '../../models/entity-configuration';
import { FormGroup, NgForm } from '@angular/forms';
import { EntityService } from '../../services/entity.service';
import { CatalogueService } from 'src/app/user/services/catalogue.service';
import { TableData } from '../../models/table-data';
import { Observable, BehaviorSubject, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

import { Store, select } from '@ngrx/store';
import { RootStoreState } from 'src/app/root-store/root-index';
import * as fromConfigSelectors from 'src/app/root-store/config-store/selectors';
import { Field } from '../../models/field';
import { SettingsService } from 'src/app/jmeleon/modules/settings/services/settings.service';
import DateTimeUtils from '../../utils/date-time.utils';
import { CodeEditorComponent } from '../code-editor/code-editor.component';
import { Entity } from '../../models/entity-data';

@Component({
  selector: 'app-entity-dialog',
  templateUrl: './entity-dialog.component.html',
  styleUrls: ['./entity-dialog.component.css']
})

export class EntityDialogComponent implements OnInit, OnDestroy {
  configuration: EntityConfiguration;
  catalogueOptions: Map<string, any[]> = new Map();
  update: Boolean;
  entity: any;
  mainId: number;
  displayEntitySelectionDialog = false;
  entitySelectionTableData: TableData;
  entitySelectionContext: { field: string, textModule: any };
  displayScrollPanel = false;
  defaultCache: Object = new Object();
  codeCache: Object = new Object();
  subscriptions: Subscription[] = [];
  currency: string;
  dtoConfigs: SelectItem[];

  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private entityService: EntityService,
    private catalogueService: CatalogueService,
    private store$: Store<RootStoreState.State>,
    private settingsService: SettingsService,
    private dialogService: DialogService,
  ) { }

  configToSelectItem(name: string, type: string): SelectItem {
    return {label: name, value: type};
  }

  ngOnInit() {
    const configurations$ = this.store$.pipe(select(fromConfigSelectors.selectConfigs));
    configurations$.subscribe(configs => {
      this.dtoConfigs = Object.values(configs).map(config => this.configToSelectItem(config.type, config.type));
    });
    
    const data = this.config.data;
    let $config: Observable<EntityConfiguration>;
    if (data['config']) {
      $config = new BehaviorSubject<EntityConfiguration>(data['config']).asObservable();
    } else if (data['configName']) {
      $config = this.store$.pipe(
        select(fromConfigSelectors.selectConfigs),
        map(configs => configs[data['configName']])
      );
    } else {
      console.log('[entity-dialog] no config supplied');
      return;
    }

    this.mainId = data['mainId'];
    this.subscriptions.push(
      $config.subscribe(config => {
        this.configuration = config;
        this.update = this.config.data['update'];

        this.subscriptions.push(this.settingsService.getSetting('CURRENCY').subscribe(setting => this.currency = setting.value));

        this.configuration.fields.forEach(field => {
          if (field.type === 'CatalogueEntry') {
            this.subscriptions.push(
              this.catalogueService.getCatalogue(field.defaultCatalogue).subscribe(catalogue => {
                const values = catalogue.values.map(e => ({ label: e['name'], value: e['id'] }));
                this.catalogueOptions.set(field.defaultCatalogue, values);
              })
            );
          }
        });

        let $entity: Observable<any>;
        if (data['entity']) {
          $entity = new BehaviorSubject(data['entity']).asObservable();
        } else if (data['entityId']) {
          $entity = this.entityService.getEntity(this.configuration.type, data['entityId']).pipe(map(res => res.fields));
        } else if (this.update) {
          console.log('[entity-dialog] no entity supplied');
          return;
        }

        if ($entity) {
          this.subscriptions.push(
            $entity.subscribe(entity => {
              this.entity = entity;
              this.configuration.fields.forEach(field => {
                if (field.type === 'Date') {
                  if (this.entity[field.field] != null) {
                    this.entity[field.field] = DateTimeUtils.convertApiDateTimeStringToDate(this.entity[field.field]);
                  }
                }
              });
              this.displayScrollPanel = this.shouldDisplayScrollPanel();
            })
          );
        } else {
          // in case of create get default values
          this.configuration.fields.forEach(field => {
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
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  entitySelected(entity: any, form: NgForm) {
    form.control.patchValue({ [this.entitySelectionContext.field]: entity['id'] });
    this.entitySelectionContext.textModule['value'] = entity['_repr_'];
    this.displayEntitySelectionDialog = false;
  }

  openEntitySelectionDialog(field: any, input: InputText) {
    this.entitySelectionContext = { field: field['field'], textModule: input };
    this.entitySelectionTableData = new TableData(field['type'], field['type'])
      .hideHeader()
      .hideHeadline()
      .hideAttachments()
      .hideButtons()
      .setScrollable()
      .setScrollHeight('700px');
    this.displayEntitySelectionDialog = true;
  }

  openCodeEditor(field: Field, input: InputText, form: NgForm) {
    const selectionContext = { field: field.field, textModule: input };
    // edited code needs to be cached
    if ((this.update) && (!this.codeCache.hasOwnProperty(field.header))) { this.codeCache[field.header] = this.entity[field.field]; }

    const dialogRef = this.dialogService.open(CodeEditorComponent, {
      data: {
        syntax: field.type,
        code: this.codeCache[field.header]
      },
      header: 'Script bearbeiten',
      width: '90%'
    });

    dialogRef.onClose.subscribe((editedCode: string) => {
      if (editedCode) {
        form.control.patchValue({ [selectionContext.field]: editedCode });
        selectionContext.textModule['value'] = '<' + field.type + '>*';
        this.codeCache[field.header] = editedCode;
      }
    });
  }

  nullField(field: Field, form: NgForm) {
    form.control.patchValue({ [field.field]: null });
    this.codeCache[field.header] = '';
  }

  onSubmit(entityForm: FormGroup) {
    this.configuration.fields.forEach(field => {
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
      }
    });

    if (this.mainId) {
      entityForm.value['mainId'] = this.mainId;
    }

    if (this.update) {
      this.ref.close(this.entityService.updateEntity(this.configuration.type, this.entity['id'], entityForm.value));
    } else {
      this.ref.close(this.entityService.createEntity(this.configuration.type, entityForm.value));
    }
  }

  shouldDisplayScrollPanel() {
    let editableFields = 0;
    let editOrMandFields = 0;
    this.configuration.fields.forEach(field => {
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

}
