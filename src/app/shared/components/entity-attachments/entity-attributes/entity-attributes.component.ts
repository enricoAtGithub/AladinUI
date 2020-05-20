import { Component, OnInit, Input, OnChanges, ViewChild } from '@angular/core';
import { Attribute } from 'src/app/shared/models/attribute';
import { EntityService } from 'src/app/shared/services/entity.service';
import { AttributeGroup, AttributeGroupEntries } from 'src/app/shared/models/entity-configuration';
import { Store, select } from '@ngrx/store';
import { RootStoreState } from 'src/app/root-store/root-index';
import * as fromConfigSelectors from 'src/app/root-store/config-store/selectors';
import { SelectItem } from 'primeng/api';
import { InputText } from 'primeng/primeng';
import { TableData } from 'src/app/shared/models/table-data';
import { NgForm } from '@angular/forms';
import { Entity } from 'src/app/shared/models/entity-data';

@Component({
  selector: 'app-entity-attributes',
  templateUrl: './entity-attributes.component.html',
  styleUrls: ['./entity-attributes.component.css']
})

export class EntityAttributesComponent implements OnInit, OnChanges {
  @Input() owner: string;
  @Input() entryId: number;

  attributes: any[];
  private attributeClone: any;
  displayAddAttribute = false;
  newAttribute = new Attribute();
  refDtoRepr: string;
  dtoConfigs: SelectItem[];
  displayEntitySelectionDialog_add = false;
  displayEntitySelectionDialog_update = false;
  entitySelectionTableData: TableData;
  updatedRowData: Attribute;
  header: string;

  types = [
    { label: 'Long', value: 'Long' },
    { label: 'String', value: 'String' },
    { label: 'Boolean', value: 'Boolean' },
    { label: 'Date', value: 'Date' },
    { label: 'Color', value: 'Color' },
    { label: 'Icon', value: 'Icon' },
    { label: 'Reference', value: 'Reference' }
  ];

  constructor(
    private entityService: EntityService,
    private store$: Store<RootStoreState.State>
  ) { }

  ngOnInit() {
    // get all dtos for type "Reference"
    const configurations$ = this.store$.pipe(select(fromConfigSelectors.selectConfigs));
    configurations$.subscribe(configs => {
      this.dtoConfigs = Object.values(configs).map(config => this.configToSelectItem(config.type, config.type));
    });
  }

  ngOnChanges() {
    this.updateAttachments();
  }

  resetRowData(rowData: Attribute) {
    this.updatedRowData = rowData;
    this.updatedRowData.booleanValue = false;
    this.updatedRowData.stringValue = null;
    this.updatedRowData.longValue = null;
    this.updatedRowData.dateValue = null;
    this.updatedRowData.stringValue = '';
    this.updatedRowData.value = '';
  }

  openAddAttributeDialog() {
    this.newAttribute = new Attribute();
    this.newAttribute.ownerType = this.owner;
    this.newAttribute.ownerId = this.entryId;
    this.displayAddAttribute = true;
  }

  configToSelectItem(name: string, type: string): SelectItem {
    return { label: name, value: type };
  }

  updateAttachments() {
    this.entityService.getAttachments('attribute', this.owner, this.entryId).subscribe(response => {
      this.attributes = response['data'];
      this.attributes.forEach(attr => { if (attr['attributeType'] === 'Date') { attr['DateValue'] = new Date(attr['Value']); } });
    });
  }

  addNewAttribute() {
    this.displayAddAttribute = false;
    this.entityService.addAttachmentEntry('attribute', this.newAttribute).subscribe(() => this.updateAttachments());
  }

  onRowEditInit(attribute: Attribute) {
    this.attributeClone = { ...attribute };
  }

  onRowDelete(attribute: any) {
    this.entityService.removeAttachmentEntry('attribute', attribute['id']).subscribe(() =>
      this.attributes = this.attributes.filter(element => element['id'] !== attribute['id']));
  }

  onRowEditSave(attribute: Attribute) {
    const type: string = attribute['attributeType'];
    this.entityService.updateAttachmentEntry('attribute', {
      id: attribute['id'], name: attribute['name'], attributeType: type,
      longValue: attribute['longValue'],
      stringValue: attribute['stringValue'],
      booleanValue: attribute['booleanValue'],
      dateValue: attribute['dateValue'],
      attributeGroup: attribute['attributeGroup'],
      referenceId: attribute['referenceId'],
      referenceType: attribute['referenceType']
    }).subscribe();
  }

  onRowEditCancel(attribute: any, index: number) {
    this.attributes[index] = this.attributeClone;
  }

  openEntitySelectionDialog_add(type: string, input: InputText) {
    this.entitySelectionTableData = new TableData(type, type)
      .hideHeader()
      .hideHeadline()
      .hideAttachments()
      .hideButtons()
      .setScrollable()
      .setScrollHeight('700px');
    this.header = type + ' auswählen';
    this.displayEntitySelectionDialog_add = true;
  }

  openEntitySelectionDialog_update(type: string, rowData: Attribute) {
    this.entitySelectionTableData = new TableData(type, type)
      .hideHeader()
      .hideHeadline()
      .hideAttachments()
      .hideButtons()
      .setScrollable()
      .setScrollHeight('700px');
    this.header = type + ' auswählen';
    this.updatedRowData = rowData;
    this.displayEntitySelectionDialog_update = true;
  }

  entitySelected_add(entity: Entity, form: NgForm) {
    form.controls['Wert'].setValue(entity['_repr_'], { emitEvent: true });
    this.newAttribute.referenceId = entity['id'];
    this.displayEntitySelectionDialog_add = false;
  }

  entitySelected_update(entity: Entity, form: NgForm) {
    this.updatedRowData.value = entity['_repr_'];
    this.updatedRowData.referenceId = entity['id'];
    this.displayEntitySelectionDialog_update = false;
  }

}
