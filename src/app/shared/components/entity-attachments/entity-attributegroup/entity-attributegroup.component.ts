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

@Component({
  selector: 'app-entity-attributegroup',
  templateUrl: './entity-attributegroup.component.html',
  styleUrls: ['./entity-attributegroup.component.css']
})

export class EntityAttributeGroupComponent implements OnChanges {
  @Input() owner: string;
  @Input() entryId: number;
  @Input() attrGroup: AttributeGroup;

  attributes: any[];
  private attributeClone: any;
  displayAddAttribute = false;
  newAttribute = new Attribute();
  attrNames: object[] = [];
  refDtoRepr: string;
  dtoTypeUnknown = false;
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

  ngOnChanges() {
    this.updateAttachments();
  }

  openAddAttributeDialog() {
    this.newAttribute = new Attribute();
    this.newAttribute.ownerType = this.owner;
    this.newAttribute.ownerId = this.entryId;
    if (this.attrGroup) {
      this.newAttribute.attributeGroup = this.attrGroup.hrid;
      this.initAttributGroupData();
    }
    this.displayAddAttribute = true;

    // get all dtos for type "Reference"
    const configurations$ = this.store$.pipe(select(fromConfigSelectors.selectConfigs));
    configurations$.subscribe(configs => {
      this.dtoConfigs = Object.values(configs).map(config => this.configToSelectItem(config.type, config.type));
    });
  }

  initAttributGroupData() {
    this.attrNames = [];
    this.refDtoRepr = '';
    this.attrGroup.attributes.forEach(element => {
      this.attrNames.push({ label: element.name, value: element.name });
    });
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

  setType(attributeName: string) {
    const selectedAttribute: AttributeGroupEntries = this.attrGroup.attributes.find(obj => obj.name === attributeName);
    selectedAttribute.dtoType ? this.dtoTypeUnknown = false : this.dtoTypeUnknown = true;
    this.newAttribute.attributeType = selectedAttribute.type;
    this.newAttribute.stringValue = selectedAttribute.dtoType;
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

  openEntitySelectionDialog_update(type: string, rowData: any) {
    this.entitySelectionTableData = new TableData(type, type)
      .hideHeader()
      .hideHeadline()
      .hideAttachments()
      .hideButtons()
      .setScrollable()
      .setScrollHeight('700px');
    this.updatedRowData = rowData;
    this.header = type + ' auswählen';
    this.displayEntitySelectionDialog_update = true;
  }

  entitySelected_add(entity: any, form: NgForm) {
    form.controls['Wert'].setValue(entity['_repr_'], { emitEvent: true });
    this.newAttribute.referenceId = entity['id'];
    this.displayEntitySelectionDialog_add = false;
  }

  entitySelected_update(entity: any, form: NgForm) {
    this.updatedRowData.value = entity['_repr_'];
    this.updatedRowData.referenceId = entity['id'];
    this.displayEntitySelectionDialog_update = false;
  }

}
