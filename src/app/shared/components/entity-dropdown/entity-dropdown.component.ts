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


/*
 * structure:
 *  get entity-data
 *    filter seems to be the only feasible option. todo: ask enrico
 *  map data element to defined fieldname
 *
 * set output value
 *
 * how to make it more dynamic
 *  selected option doesn't have to be string. could be a number too. or a combined element
 *    (but then the dynamic table dialog like in the entity-dialog component would be more feasible.)
 */

  // @Input() optionLabel = 'Bitte Auswählen';
  @Input() propertyName: string;
  @Input() fieldName: string;
  @Input() allowNull = true;
  @Input() selectedOption = '';
  @Input() selectedOptionId: number;
  @Output() selectedOptionChange = new EventEmitter();
  @Output() selectedOptionIdChange = new EventEmitter();

  selectItems: SelectItem[];
  selectedItem: any;
  data: EntityData;

  constructor(private entityService: EntityService) { }

  ngOnInit() {
    console.log('[EntityDropdown-ngOnInit] propertyName: ', this.propertyName);
    console.log('[EntityDropdown-ngOnInit] fieldName: ', this.fieldName);
    this.getEntityData();
  }

  selectedItemChanged(event: any): void {
    console.log('[EntityDropdown-selectedItemChanged] event: ', event);
    console.log('[EntityDropdown-selectedItemChanged] event.value: ', event.value);
    this.selectedOptionChange.emit(event.value);
  }

  getEntityData(): void {
    console.log('[EntityDropdown-getEntityData] start: ');
    this.selectItems = [];
    this.entityService
          .filter(this.propertyName, 1, 100, '', '')
          .subscribe(
            entityData => {
              console.log('[EntityDropdown-getEntityData] entityData: ', entityData);
              this.data = entityData;
              const tempSelectItems: SelectItem[] = [];
              tempSelectItems.push({label: 'Kein Lieferant', value: null});
              this.selectItems = tempSelectItems.concat(this.data.data.map(entity => {
                  const selectItem = <SelectItem>{label: entity[this.fieldName], value: entity[this.fieldName]};
                  console.log('[EntityDropdown-getEntityData] selectItem: ', selectItem);
                  return selectItem;
                }));
              // this.selectItems = tempSelectItems;
              console.log('[EntityDropdown-getEntityData] selectItems: ', this.selectItems);
            }
          );
  }
}
