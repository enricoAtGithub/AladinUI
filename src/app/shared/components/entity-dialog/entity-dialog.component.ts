import { Component, OnInit } from '@angular/core';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/primeng';
import { EntityConfiguration } from '../../models/entity-configuration';
import { FormGroup } from '@angular/forms';
import { EntityService } from '../../services/entity.service';

@Component({
  selector: 'app-entity-dialog',
  templateUrl: './entity-dialog.component.html',
  styleUrls: ['./entity-dialog.component.css']
})
export class EntityDialogComponent implements OnInit {
  configuration: EntityConfiguration;
  update: Boolean;
  entity: any;
  test: String;

  constructor(public ref: DynamicDialogRef, public config: DynamicDialogConfig, private entityService: EntityService) { }

  ngOnInit() {
    this.configuration = this.config.data['config'];
    this.update = this.config.data['update'];
    if (this.update) {
      this.entity = this.config.data['entity'];
    }
  }

  onSubmit(entityForm: FormGroup) {
    this.configuration.fields.forEach(field => {
      if (field.type === 'Date') {
        const dateString: string = entityForm.value[<string>field.header];
        let date: Date = new Date();
        if (/\./gm.test(dateString)) {
          const dS: number[] = <number[]><unknown[]>dateString.match(/\d+/gm);
          date = new Date(dS[2], dS[1], dS[0], dS[3], dS[4]);
        } else {
          date = new Date(date);
        }
        entityForm.value[<string>field.header] = date.toISOString();
      }
    });

    if (this.update) {
      this.ref.close(this.entityService.updateEntity(this.configuration.type, this.entity['id'], entityForm.value));
    } else {
      this.ref.close(this.entityService.createEntity(this.configuration.type, entityForm.value));
    }
  }
}
