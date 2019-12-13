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
  entitySelectionContext: {header: string, textModule: any};

  constructor(public ref: DynamicDialogRef, public config: DynamicDialogConfig, private entityService: EntityService,
    private catalogueService: CatalogueService) { }

  ngOnInit() {
    this.configuration = this.config.data['config'];
    this.update = this.config.data['update'];

    this.entity = this.config.data['entity'];
    this.configuration.fields.forEach(field => {
      if (field.type === 'Date' && this.update) {
        if (this.entity[field.header] != null) {
          this.entity[field.header] = new Date(this.entity[field.header]);
        }
      }
      if (field.type === 'CatalogueEntry') {
        this.catalogueService.getCatalogue(field.defaultCatalogue).subscribe(catalogue => {
          this.catalogueOptions.set(catalogue.name, catalogue.values);
          if (this.update) {
            this.entity[field.header] = catalogue.values.find(element => element['id'] === this.entity[field.header]);
          }
        });
      }
    });
  }

  entitySelected(entity: any, form: NgForm) {
    form.control.patchValue({[this.entitySelectionContext.header]: entity['id']});
    this.entitySelectionContext.textModule['value'] = entity['_repr_'];
    this.displayEntitySelectionDialog = false;
  }

  openEntitySelectionDialog(field: any, input: InputText) {
    this.entitySelectionContext = {header: field['header'], textModule: input};
    this.entitySelectionTableData = new TableData(field['type'], field['type'], false, false, false, true, true, undefined, '700px', false);
    this.displayEntitySelectionDialog = true;
  }

  nullField(field: any, form: NgForm) {
    form.control.patchValue({[field['header']]: null});
  }

  onSubmit(entityForm: FormGroup) {
    this.configuration.fields.forEach(field => {
      if (field.type === 'Date') {
        if (entityForm.value[field.header] != null) {
          entityForm.value[field.header] = new Date(entityForm.value[field.header]).toISOString();
        }
      }
      if (field.type === 'CatalogueEntry') {
        entityForm.value[field.header] = entityForm.value[field.header]['id'];
      }
    });

    if (this.update) {
      this.ref.close(this.entityService.updateEntity(this.configuration.type, this.entity['id'], entityForm.value));
    } else {
      this.ref.close(this.entityService.createEntity(this.configuration.type, entityForm.value));
    }
  }
}
