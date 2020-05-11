import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { Attribute } from 'src/app/shared/models/attribute';
import { EntityService } from 'src/app/shared/services/entity.service';

@Component({
  selector: 'app-entity-attributes',
  templateUrl: './entity-attributes.component.html',
  styleUrls: ['./entity-attributes.component.css']
})
export class EntityAttributesComponent implements OnChanges {
  @Input() type: string;
  @Input() entryId: number;

  attributes: any[];
  attributeClone: any;
  displayAddAttribute = false;
  newAttribute = new Attribute();

  types = [
    {label: 'Long', value: 'Long'},
    {label: 'String', value: 'String'},
    {label: 'Boolean', value: 'Boolean'},
    {label: 'Date', value: 'Date'},
    {label: 'Color', value: 'Color'},
    {label: 'Icon', value: 'Icon'},
  ];

  constructor(private entityService: EntityService) { }

  ngOnChanges() {
    this.updateAttachments();
  }

  openAddAttributeDialog() {
    this.newAttribute = new Attribute();
    this.newAttribute.ownerType = this.type;
    this.newAttribute.ownerId = this.entryId;
    this.displayAddAttribute = true;
  }

  updateAttachments() {
    this.entityService.getAttachments('attribute', this.type, this.entryId).subscribe(response => {
      this.attributes = response['data'];
      this.attributes.forEach(attr => {if (attr['attributeType'] === 'Date') {attr['DateValue'] = new Date(attr['Value']); }});
    });
  }

  addNewAttribute() {
    this.displayAddAttribute = false;
    this.entityService.addAttachmentEntry('attribute', this.newAttribute).subscribe(() => this.updateAttachments());
  }

  onRowEditInit(attribute: any) {
    this.attributeClone = {...attribute};
  }

  onRowDelete(attribute: any) {
    this.entityService.removeAttachmentEntry('attribute', attribute['id']).subscribe(() =>
      this.attributes = this.attributes.filter(element => element['id'] !== attribute['id']));
  }

  onRowEditSave(attribute: any) {
    const type: string = attribute['attributeType'];
    this.entityService.updateAttachmentEntry('attribute', {id: attribute['id'], name: attribute['name'], attributeType: type,
      longValue: attribute['longValue'],
      stringValue: attribute['stringValue'],
      booleanValue: attribute['booleanValue'],
      dateValue: attribute['dateValue']
    }).subscribe();
  }

  onRowEditCancel(attribute: any, index: number) {
      this.attributes[index] = this.attributeClone;
  }

}
