import { Component, OnInit } from '@angular/core';
import { DynamicDialogRef, DynamicDialogConfig, InputText } from 'primeng/primeng';
import { EntityConfiguration } from '../../models/entity-configuration';
import { FormGroup, NgForm } from '@angular/forms';
import { EntityService } from '../../services/entity.service';
import { CatalogueService } from 'src/app/user/services/catalogue.service';
import { TableData } from '../../models/table-data';

@Component({
  selector: 'app-entity-dialog',
  templateUrl: './entity-dialog.component.html',
  styleUrls: ['./entity-dialog.component.css']
})
export class EntityDialogComponent implements OnInit {
  configuration: EntityConfiguration;
  catalogueOptions: Map<string, any[]> = new Map();
  update: Boolean;
  entity: any;
  displayEntitySelectionDialog = false;
  entitySelectionTableData: TableData;
  entitySelectionContext: {field: string, textModule: any};

  constructor(public ref: DynamicDialogRef, public config: DynamicDialogConfig, private entityService: EntityService,
    private catalogueService: CatalogueService) { }

  ngOnInit() {
    this.configuration = this.config.data['config'];
    this.update = this.config.data['update'];

    this.entity = this.config.data['entity'];
    this.configuration.fields.forEach(field => {
      if (field.type === 'Date' && this.update) {
        if (this.entity[field.field] != null) {
          this.entity[field.field] = new Date(this.entity[field.field]);
        }
      }
      if (field.type === 'CatalogueEntry') {
        this.catalogueService.getCatalogue(field.defaultCatalogue).subscribe(catalogue => {
          const values = catalogue.values.map(e => ({label: e['name'], value: e['id']}));
          this.catalogueOptions.set(catalogue.name, values);
        });
      }
    });
  }

  entitySelected(entity: any, form: NgForm) {
    form.control.patchValue({[this.entitySelectionContext.field]: entity['id']});
    this.entitySelectionContext.textModule['value'] = entity['_repr_'];
    this.displayEntitySelectionDialog = false;
  }

  openEntitySelectionDialog(field: any, input: InputText) {
    this.entitySelectionContext = {field: field['field'], textModule: input};
    this.entitySelectionTableData = new TableData(field['type'], field['type'], false, false, false, true, true, undefined, '700px', false);
    this.displayEntitySelectionDialog = true;
  }

  nullField(field: any, form: NgForm) {
    form.control.patchValue({[field['field']]: null});
  }

  onSubmit(entityForm: FormGroup) {
    this.configuration.fields.forEach(field => {
      if (field.type === 'int') {
        if (entityForm.value[field.field] === '') {
          entityForm.value[field.field] = null;
        }
      } else if (field.type === 'Date') {
        if (entityForm.value[field.field] != null) {
          entityForm.value[field.field] = new Date(entityForm.value[field.field]).toISOString();
        }
      }
    });

    if (this.update) {
      this.ref.close(this.entityService.updateEntity(this.configuration.type, this.entity['id'], entityForm.value));
    } else {
      this.ref.close(this.entityService.createEntity(this.configuration.type, entityForm.value));
    }
  }

  shouldDisplayScrollPanel(): boolean {
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
