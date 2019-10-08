import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { TableData } from '../../models/table-data';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { GroupConfiguration } from '../../models/group-configuration';
import { EntityService } from '../../services/entity.service';
import { GroupMembers } from '../../models/group-members';
import { EntityData } from '../../models/entity-data';
import { EntityConfiguration } from '../../models/entity-configuration';
import { map } from 'rxjs/operators';
import { DynamicTableComponent } from '../dynamic-table/dynamic-table.component';
import { select, Store } from '@ngrx/store';
import { RootStoreState } from 'src/app/root-store/root-index';
import { Note } from '../../models/note';

@Component({
  selector: 'app-dynamic-table-attachments',
  templateUrl: './dynamic-table-attachments.component.html',
  styleUrls: ['./dynamic-table-attachments.component.css']
})
export class DynamicTableAttachmentsComponent implements OnInit {
  @Input() configName: string;
  @Input() $configuration: Observable<EntityConfiguration>;
  @Input() $entryId: Observable<number>;
  @Input() entryId: number;

  @ViewChild('notesTable', {static: false}) notesTable: DynamicTableComponent;
  @ViewChild('logsTable', {static: false}) logsTable: DynamicTableComponent;

  configuration: EntityConfiguration;
  groupConfigsArray: GroupConfiguration[] = [];
  groupConfigurations: Map<string, GroupConfiguration> = new Map();
  // Contains all entities, that the currently selected entity is member of for each group relation
  groupMembers: Map<string, GroupMembers> = new Map();
  // Contains all members available for each group relation
  allGroupMembers: Map<string, EntityData> = new Map();
  // Contains all members which are not held by the selected entity for each group relation
  nonGroupMembers: Map<string, EntityData> = new Map();

  logTableData: TableData;
  noteTableData: TableData;

  $noteSelectedEntry: Subject<number> = new Subject();
  allNotes: any[];
  selectedNote: Note;

  isEmpty: boolean;

  constructor(private entityService: EntityService, private store$: Store<RootStoreState.State>) { }

  ngOnInit() {
    if (this.configName !== undefined && this.$configuration === undefined) {
      this.$configuration = this.entityService.getEntityConfigurations().pipe(map(configs => configs[this.configName]));
    }

    this.$configuration.subscribe(config => {
      this.configuration = config;

      this.isEmpty = (!this.configuration.components && this.configuration.groups === null);
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

      if (this.entryId !== undefined && this.$entryId === undefined) {
        this.$entryId = new BehaviorSubject(this.entryId).asObservable();
      }

      this.$entryId.subscribe(entryId => {
        this.entryId = entryId;

        if (this.entryId === undefined) {
          this.selectedNote = undefined;
          return;
        }

        this.logTableData = new TableData('Logs', 'LogEntry', false, false, false, true, false,
        '/log/entries/' + this.configuration.type + '/' + this.entryId, '175px');

        this.noteTableData = new TableData('Note', 'Note', false, false, false, true, false,
        '/note/entries/' + this.configuration.type + '/' + this.entryId, '175px');

        if (this.configuration.components && this.configuration.components.includes('Notes')) {
          this.entityService.getAttachments('note', this.configuration.type, this.entryId).subscribe(response =>
            this.allNotes = response['data']);

          this.$noteSelectedEntry.subscribe(selectedEntry => {
            if (selectedEntry === undefined) {
              this.selectedNote = undefined;
              return;
            }
            this.createEmptyNote();
            const note = this.allNotes.find(element => element['id'] === selectedEntry);
            if (note) {
              this.selectedNote.note = note['Notiz'];
              this.selectedNote.subject = note['Subject'];
              this.selectedNote.category = note['Kategorie'];
              this.selectedNote.id = note['id'];
            }
          });
        }

        if (this.groupConfigurations) {
          this.groupMembers.clear();
          this.allGroupMembers.forEach((value, key) => this.nonGroupMembers.set(key, {...value}));

          this.groupConfigurations.forEach(groupConfig => {
            this.entityService.membersGroup(groupConfig.type, entryId).subscribe(members => {
              this.groupMembers.set(groupConfig.type, members);

              // Filter out the members which the groupholder already has
              members.data.forEach(e => {
                this.nonGroupMembers.get(groupConfig.type).data = this.nonGroupMembers.get(groupConfig.type).data.filter((value) => {
                  if (value['id'] === e['id']) { return false; }
                  return true;
                });
              });
            });
          });
        }
      });
    });
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
      this.entityService.removeAttachmentEntry('note', this.selectedNote['id']).subscribe(() => this.loadNotes());
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

}
