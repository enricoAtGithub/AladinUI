import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { EntityService } from '../../services/entity.service';
import { EntityConfiguration } from '../../models/entity-configuration';
import { DialogService } from 'primeng/api';

@Component({
  selector: 'app-dynamic-table-attachments',
  templateUrl: './dynamic-table-attachments.component.html',
  styleUrls: ['./dynamic-table-attachments.component.css']
})
export class DynamicTableAttachmentsComponent implements OnInit, OnChanges {
  @Input() configName: string;
  @Input() entryId: number;

  isEmpty: boolean;

  configuration: EntityConfiguration;

  constructor(private entityService: EntityService, public dialogService: DialogService) { }

  init() {
    this.entityService.getEntityConfigurations().subscribe(configs => {
      this.configuration = configs[this.configName];
      this.isEmpty = !this.configuration.components && this.configuration.groups === null;
    });
  }

  ngOnInit() {
    if (this.configName !== undefined) {
      this.init();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.configName) {
      this.init();
    }
  }

}
