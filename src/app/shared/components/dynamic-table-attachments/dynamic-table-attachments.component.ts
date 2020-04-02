import { Component, OnInit, Input, ViewChild, SimpleChanges, OnChanges } from '@angular/core';
import { TableData } from '../../models/table-data';
import { GroupConfiguration } from '../../models/group-configuration';
import { EntityService } from '../../services/entity.service';
import { EntityConfiguration } from '../../models/entity-configuration';
import { Note } from 'src/app/shared/models/note';
import { DynamicTableComponent } from '../dynamic-table/dynamic-table.component';
import { Attribute } from '../../models/attribute';
import { DialogService } from 'primeng/api';

@Component({
  selector: 'app-dynamic-table-attachments',
  templateUrl: './dynamic-table-attachments.component.html',
  styleUrls: ['./dynamic-table-attachments.component.css']
})
export class DynamicTableAttachmentsComponent implements OnInit, OnChanges {
  @Input() configName: string;
  @Input() entryId: number;

  @ViewChild('notesTable', {static: false}) notesTable: DynamicTableComponent;
  @ViewChild('logsTable', {static: false}) logsTable: DynamicTableComponent;
  @ViewChild('fileTable', {static: false}) fileTable: DynamicTableComponent;

  configuration: EntityConfiguration;
  groupConfigsArray: GroupConfiguration[] = [];
  groupConfigurations: Map<string, GroupConfiguration> = new Map();
  // Contains all entities, that the currently selected entity is member of for each group relation
  groupMembers: Map<string, any> = new Map();
  // Contains all members available for each group relation
  allGroupMembers: Map<string, any> = new Map();
  // Contains all members which are not held by the selected entity for each group relation
  nonGroupMembers: Map<string, any> = new Map();

  logTableData: TableData;
  noteTableData: TableData;
  fileTableData: TableData;

  allNotes: any[];
  selectedNote: Note;

  isEmpty: boolean;

  attributes: any[];
  attributeClone: any;
  displayAddAttribute = false;
  newAttribute = new Attribute();

  types = [{label: 'Long', value: 'Long'}, {label: 'String', value: 'String'}, {label: 'Boolean', value: 'Boolean'}, {label: 'Date', value: 'Date'}, {label: 'Color', value: 'Color'}];

  constructor(private entityService: EntityService, public dialogService: DialogService) { }

  init() {
    this.entityService.getEntityConfigurations().subscribe(configs => {
      this.configuration = configs[this.configName];
      this.isEmpty = !this.configuration.components && this.configuration.groups === null;
      if (this.isEmpty) {
        return;
      }

      // Get relevant group configurations if available
      if (this.configuration.groups !== null) {
        this.entityService.getGroupConfigurations().subscribe((allConfigs: GroupConfiguration[]) => {
          for (const group of this.configuration.groups) {
            this.groupConfigurations.set(group, allConfigs[group]);
            this.groupConfigsArray.push(allConfigs[group]);
            this.entityService.filter(allConfigs[group].member, 1, 2147483647, '', '')
              .subscribe(allMembers => this.allGroupMembers.set(group, allMembers));
          }
        });
      }
    });
  }

  ngOnInit() {
    if (this.configName !== undefined) {
      this.init();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.configName && changes.configName.previousValue === undefined && changes.configName.currentValue !== undefined) {
      this.init();
    }

    if (changes.entryId && this.configuration) {
      if (this.entryId === undefined || this.entryId === null) {
        this.selectedNote = undefined;
        this.logTableData = undefined;
        this.noteTableData = undefined;
        return;
      }

      if (this.configuration.components) {
        if (this.configuration.components.includes('LogEntries') && this.logsTable !== null) {
          if (!this.logTableData) {
            const dataSource = this.entityService.getEntityDataFromUrl('/log/entries/' + this.configuration.type + '/' + this.entryId);
            this.logTableData = new TableData('Logs', 'LogEntry', false, false, false, true, false,
              dataSource, '175px', false);
          } else {
            this.logTableData.dataSource  = this.entityService
              .getEntityDataFromUrl('/log/entries/' + this.configuration.type + '/' + this.entryId);
            this.logTableData.triggerRefresh.next();
          }
        }

        if (this.configuration.components.includes('Notes')) {
          if (!this.noteTableData) {
            const dataSource = this.entityService.getEntityDataFromUrl('/note/entries/' + this.configuration.type + '/' + this.entryId);
            this.noteTableData = new TableData('Note', 'Note', false, false, false, true, false,
              dataSource, '175px', false);
          } else {
            this.selectedNote = undefined;
            this.noteTableData.dataSource  = this.entityService
              .getEntityDataFromUrl('/note/entries/' + this.configuration.type + '/' + this.entryId);
            this.noteTableData.triggerRefresh.next();
          }
        }

        if (this.configuration.components.includes('FileAttachments')) {
          if (!this.fileTableData) {
            const dataSource = this.entityService
              .postEntityDataFromUrl('/attachment/all', {mainType: 'File', ownerType: this.configName, ownerId: this.entryId});
            this.fileTableData = new TableData(
              'FileAttachment', 'FileAttachment', false, false, true, true, false, dataSource, '175px', false);
          } else {
            this.fileTableData.dataSource  = this.entityService
              .postEntityDataFromUrl('/attachment/all', {mainType: 'File', ownerType: this.configName, ownerId: this.entryId});
            this.fileTableData.triggerRefresh.next();
          }
        }

        if (this.configuration.components.includes('Attributes')) {
          this.updateAttachments();
        }

        if (this.configuration.components.includes('Notes')) {
          this.entityService.getAttachments('note', this.configuration.type, this.entryId).subscribe(response =>
            this.allNotes = response['data']);
        }
      }

      if (this.groupConfigurations) {
        this.groupMembers.clear();

        this.groupConfigurations.forEach(groupConfig => {
          this.entityService.membersGroup(groupConfig.type, this.entryId).subscribe(members => {

            this.groupMembers.set(groupConfig.type, members.data);

            const memberIds: Set<number> = new Set(members.data.map( m => m.id ));

            // deep copy of entities + filtering for non-members
            this.nonGroupMembers.set(groupConfig.type, this.allGroupMembers.get(groupConfig.type).data
              .filter( (d: any) => !memberIds.has(d['id']))
              .map( (d: any) => ({ ...d }) ));
          });
        });
      }
    }
  }

  async addMembers(items: any[], groupTypeName: string) {
    items.forEach(item =>
      this.entityService.addMember(this.groupConfigurations.get(groupTypeName).type, this.entryId, item['id']).subscribe());
  }

  async removeMembers(items: any[], groupTypeName: string) {
    items.forEach(item =>
      this.entityService.removeMember(this.groupConfigurations.get(groupTypeName).type, this.entryId, item['id']).subscribe());
  }

  async removeNote() {
    if (this.selectedNote['id'] !== undefined) {
      this.entityService.removeAttachmentEntry('note', this.selectedNote['id']).subscribe(() => {
        this.loadNotes();
        this.selectedNote = undefined;
      });
    } else {
      this.selectedNote = undefined;
    }
  }

  async saveNote() {
    if (this.selectedNote['id'] !== undefined) {
      this.entityService.updateAttachmentEntry('note', this.selectedNote).subscribe(() => this.loadNotes());
    } else {
      this.entityService.addAttachmentEntry('note', this.selectedNote).subscribe(() => this.loadNotes());
    }
  }

  loadNotes() {
    this.entityService.getAttachments('note', this.configuration.type, this.entryId).subscribe(response =>
      this.allNotes = response['data']);

    this.notesTable.refreshTableContents();
  }

  createEmptyNote() {
    this.selectedNote = new Note();
    this.selectedNote.ownerType = this.configuration.type;
    this.selectedNote.ownerId = this.entryId;
  }

  noteSelected(entity: any) {
    if (entity === undefined) {
      this.selectedNote = undefined;
      return;
    }
    this.createEmptyNote();
    const note = this.allNotes.find(element => element['id'] === entity['id']);
    if (note) {
      this.selectedNote.note = note['Notiz'];
      this.selectedNote.subject = note['Subject'];
      this.selectedNote.category = note['Kategorie'];
      this.selectedNote.id = note['id'];
    }
  }

  onFileAttached(event) {
    this.fileTable.refreshTableContents();
  }

  openAddAttributeDialog() {
    this.newAttribute = new Attribute();
    this.newAttribute.ownerType = this.configuration.type;
    this.newAttribute.ownerId = this.entryId;
    this.displayAddAttribute = true;
  }

  updateAttachments() {
    this.entityService.getAttachments('attribute', this.configuration.type, this.entryId).subscribe(response => {
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
