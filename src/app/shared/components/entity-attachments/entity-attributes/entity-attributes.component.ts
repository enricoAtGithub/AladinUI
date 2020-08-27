import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { Attribute } from 'src/app/shared/models/attribute';
import { EntityService } from 'src/app/shared/services/entity.service';
import { AttributeGroup, AttributeGroupEntry } from 'src/app/shared/models/entity-configuration';
import { Store, select } from '@ngrx/store';
import { RootStoreState } from 'src/app/root-store/root-index';
import * as fromConfigSelectors from 'src/app/root-store/config-store/config.selectors';
import { SelectItem } from 'primeng/api';
import { InputText } from 'primeng/primeng';
import { TableData } from 'src/app/shared/models/table-data';
import { NgForm } from '@angular/forms';
import EntityUrlsUtils from 'src/app/shared/utils/entity-urls.util';
import { Observable } from 'rxjs';
import { SettingsService } from 'src/app/jmeleon/modules/settings/services/settings.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-entity-attributes',
  templateUrl: './entity-attributes.component.html',
  styleUrls: ['./entity-attributes.component.css']
})

export class EntityAttributesComponent implements OnInit, OnChanges {
  @Input() ownerType: string;
  @Input() ownerId: number;
  @Input() attrGroup: AttributeGroup;

  attributes: Attribute[];
  private attributeClones = new Map<number, Attribute>();
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
  currency$: Observable<string>;

  types = [
    { label: 'Long', value: 'Long' },
    { label: 'String', value: 'String' },
    { label: 'Boolean', value: 'Boolean' },
    { label: 'Date', value: 'Date' },
    { label: 'Color', value: 'Color' },
    { label: 'Icon', value: 'Icon' },
    { label: 'Reference', value: 'Reference' },
    { label: 'Float', value: 'Float' },
    { label: 'Currency', value: 'Currency' }

  ];

  constructor(
    private entityService: EntityService,
    private store$: Store<RootStoreState.State>,
    private settingsService: SettingsService
  ) { }

  ngOnInit() {
    // get all dtos for type "Reference"
    const configurations$ = this.store$.pipe(select(fromConfigSelectors.selectConfigs));
    configurations$.subscribe(configs => {
      this.dtoConfigs = Object.values(configs).map(config => this.configToSelectItem(config.type, config.type));
    });

    // get Currency from settings
    this.currency$ = this.settingsService.getSetting('CURRENCY').pipe(map(setting => setting.value));

    if (!this.attrGroup) { this.dtoTypeUnknown = true; }
  }

  ngOnChanges() {
    this.updateAttachments();
  }

  openAddAttributeDialog() {
    this.refDtoRepr = '';
    this.newAttribute = new Attribute();
    this.newAttribute.ownerType = this.ownerType;
    this.newAttribute.ownerId = this.ownerId;
    if (this.attrGroup) {
      this.newAttribute.attributeGroup = this.attrGroup.name;
      this.initAttributGroupData();
    }
    this.displayAddAttribute = true;
  }

  initAttributGroupData() {
    this.attrNames = [];
    this.attrGroup.attributes.forEach(element => {
      this.attrNames.push({ label: element.name, value: element.name });
    });
  }

  configToSelectItem(name: string, type: string): SelectItem {
    return { label: name, value: type };
  }

  updateAttachments() {
    let attrGr: string;
    if (this.attrGroup) { attrGr = this.attrGroup.name; } else { attrGr = 'null'; }
    this.entityService.getAttributes(this.ownerType, this.ownerId, attrGr).subscribe(response => {
      this.attributes = <Attribute[]>response;
      this.attributes.forEach(attr => { if (attr.attributeType === 'Date') { attr.dateValue = new Date(attr.value); } });
      // if attrType = 
      this.attributes.find(attr => attr.referenceType)
    });
  }

  addNewAttribute() {
    this.displayAddAttribute = false;
    // this.entityService.addAttachmentEntry('attribute', this.newAttribute).subscribe(() => this.updateAttachments());
    this.entityService.addAttribute(this.newAttribute).subscribe(() => this.updateAttachments());
  }

  onRowEditInit(attribute: Attribute, index: number) {
    this.attributeClones.set(index, { ...attribute });
  }

  onRowDelete(attribute: Attribute) {
    // this.entityService.removeAttachmentEntry('attribute', attribute['id']).subscribe(() =>
    //   this.attributes = this.attributes.filter(element => element['id'] !== attribute['id']));
    this.entityService.removeAttribute(attribute['id']).subscribe(() =>
      this.attributes = this.attributes.filter(element => element['id'] !== attribute['id']));
  }

  onRowEditSave(attribute: Attribute) {
    this.updatedRowData = attribute;
    // this.entityService.updateAttachmentEntry('attribute', attribute).subscribe(attr => Attribute.copyFrom(<Attribute>attr, this.updatedRowData));
    this.entityService.updateAttribute(attribute).subscribe(attr => Attribute.copyFrom(<Attribute>attr, this.updatedRowData));
  }

  onRowEditCancel(attribute: any, index: number) {
    this.attributes[index] = this.attributeClones.get(index);
    this.attributeClones.delete(index);
  }

  setType(attributeName: string) {
    this.refDtoRepr = '';
    const selectedAttribute: AttributeGroupEntry = this.attrGroup.attributes.find(obj => obj.name === attributeName);
    selectedAttribute.dtoType ? this.dtoTypeUnknown = false : this.dtoTypeUnknown = true;
    this.newAttribute.attributeType = selectedAttribute.type;
    this.newAttribute.referenceType = selectedAttribute.dtoType;
  }

  openEntitySelectionDialog_add(type: string, input: InputText) {
    this.entitySelectionTableData = new TableData(type, type)
      .hideHeader()
      .hideHeadline()
      .hideAttachments()
      .hideButtons()
      .setScrollable()
      .setScrollHeight('700px')
      .disableInlineEdit();
    this.header = type + ' auswählen';
    this.displayEntitySelectionDialog_add = true;
  }

  openEntitySelectionDialog_update(type: string, attribute: Attribute) {
    this.entitySelectionTableData = new TableData(type, type)
      .hideHeader()
      .hideHeadline()
      .hideAttachments()
      .hideButtons()
      .setScrollable()
      .setScrollHeight('700px')
      .disableInlineEdit();
    this.updatedRowData = attribute;
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

  onIconPickedAdd(icon) {
    if (icon !== 'fas fa-user') { this.newAttribute.stringValue = icon; }
  }

  onIconPickedEdit(icon, rowData) {
    if (icon !== 'fas fa-user') { rowData.stringValue = icon; }
  }

  generateRouteUrl = (entityType: string): string[] => EntityUrlsUtils.generateUrlForEntityType(entityType);
  generateRouteQueryParams = (entityType: string, id: number): Object => EntityUrlsUtils.generateQueryParamsForEntityType(entityType, id);

}
