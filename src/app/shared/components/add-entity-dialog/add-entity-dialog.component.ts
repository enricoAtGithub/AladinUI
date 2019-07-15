import { Component, OnInit } from '@angular/core';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/primeng';
import { EntityConfiguration } from '../../models/entity-configuration';
import { FormGroup } from '@angular/forms';
import { EntityService } from '../../services/entity.service';

@Component({
  selector: 'app-add-entity-dialog',
  templateUrl: './add-entity-dialog.component.html',
  styleUrls: ['./add-entity-dialog.component.css']
})
export class AddEntityDialogComponent implements OnInit {
  configuration: EntityConfiguration;

  constructor(public ref: DynamicDialogRef, public config: DynamicDialogConfig, private entityService: EntityService) { }

  ngOnInit() {
    this.configuration = this.config.data['config'];
  }

  onSubmit(entityForm: FormGroup) {
    this.ref.close(this.entityService.createEntity(this.configuration.type, entityForm.value));
  }
}
