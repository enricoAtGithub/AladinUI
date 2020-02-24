import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { SelectItem } from 'primeng/primeng';
import { EntityData } from '../../models/entity-data';
import { EntityService } from '../../services/entity.service';

@Component({
  selector: 'app-entity-dropdown',
  templateUrl: './entity-dropdown.component.html',
  styleUrls: ['./entity-dropdown.component.css']
})
export class EntityDropdownComponent implements OnInit {

  @Input() propertyName: string;
  @Input() fieldName: string;
  @Input() allowNull = true;
  @Input() selectedOptionId?: number;
  @Input() defaultNullValue: string;
  @Output() selectedOptionChanged = new EventEmitter();
  @Output() selectedOptionIdChanged = new EventEmitter();

  selectItems: SelectItem[];
  selectedItem: any;
  data: EntityData;

  constructor(private entityService: EntityService) { }

  ngOnInit() {
    this.getEntityData();
  }

  selectedItemChanged(event: any): void {
    // console.log('[EntityDropdown-selectedItemChanged] event: ', event);
    // console.log('[EntityDropdown-selectedItemChanged] event.value: ', !!event.value ? event.value[this.fieldName] : null);
    this.selectedOptionChanged.emit(!!event.value ? event.value[this.fieldName] : null);
    this.selectedOptionIdChanged.emit(!!event.value ? event.value['id'] : null);
  }

  getEntityData(): void {
    this.selectItems = [];
    this.entityService
          .filter(this.propertyName, 1, 100, '', '')
          .subscribe(
            entityData => {
              this.data = entityData;
              const tempSelectItems: SelectItem[] = [];
              tempSelectItems.push({label: this.defaultNullValue, value: null});
              this.selectItems = tempSelectItems.concat(this.data.data.map(entity => {
                  const selectItem = <SelectItem>{label: entity[this.fieldName], value: entity};
                  return selectItem;
                }));

              if (!!this.selectedOptionId) {
                this.selectedItem = entityData.data.find(data => data['id'] === this.selectedOptionId);
              } else {
                this.selectedItem = tempSelectItems[0].value;
              }
            }
          );
  }
}
