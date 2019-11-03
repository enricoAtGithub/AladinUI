import { Component, OnInit } from '@angular/core';
import { DynamicDialogRef, DynamicDialogConfig, InputText, InputTextModule } from 'primeng/primeng';
import { EntityConfiguration } from '../../models/entity-configuration';
import { FormGroup, ControlContainer, NgForm } from '@angular/forms';
import { EntityService } from '../../services/entity.service';
import { CatalogueService } from 'src/app/user/services/catalogue.service';
import { TableData } from '../../models/table-data';
import { Observable, Subject } from 'rxjs';
import { first } from 'rxjs/operators';

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
  $selectedEntity = new Subject<number>();

  constructor(public ref: DynamicDialogRef, public config: DynamicDialogConfig, private entityService: EntityService,
    private catalogueService: CatalogueService) { }

  ngOnInit() {
    this.configuration = this.config.data['config'];
    this.update = this.config.data['update'];

    this.entity = this.config.data['entity'];
    this.configuration.fields.forEach(field => {
      if (field.type === 'Date' && this.update) {
        this.entity[field.header] = new Date(this.entity[field.header]);
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

  openEntitySelectionDialog(field: any, form: NgForm, inn: any) {
    this.entitySelectionTableData = new TableData(field['type'], field['type'], false, false, false, true, true, undefined, '700px', false);
    this.displayEntitySelectionDialog = true;
    this.$selectedEntity.pipe(first()).subscribe(selectedId => {
      form.control.patchValue({[field['header']]: selectedId});
      this.displayEntitySelectionDialog = false;
    });
  }

  onSubmit(entityForm: FormGroup) {
    this.configuration.fields.forEach(field => {
      if (field.type === 'Date') {
        entityForm.value[field.header] = new Date(entityForm.value[field.header]).toISOString();
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
