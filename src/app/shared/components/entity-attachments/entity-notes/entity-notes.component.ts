import { Component, OnChanges, Input } from '@angular/core';
import { TableData } from 'src/app/shared/models/table-data';
import { EntityService } from 'src/app/shared/services/entity.service';
import { Note } from 'src/app/shared/models/note';

@Component({
  selector: 'app-entity-notes',
  templateUrl: './entity-notes.component.html',
  styleUrls: ['./entity-notes.component.css']
})
export class EntityNotesComponent implements OnChanges {
  @Input() type: string;
  @Input() entryId: number;

  noteTableData: TableData;
  selectedNote: Note;
  allNotes: any[];

  constructor(private entityService: EntityService) { }

  ngOnChanges() {
    if (!this.noteTableData) {
      const dataSource = this.entityService.getEntityDataFromUrl('/note/entries/' + this.type + '/' + this.entryId);
      this.noteTableData = new TableData('Note', 'Note', false, false, false, true, false,
        dataSource, '175px', false);
    } else {
      this.selectedNote = undefined;
      this.noteTableData.dataSource  = this.entityService
        .getEntityDataFromUrl('/note/entries/' + this.type + '/' + this.entryId);
      this.noteTableData.triggerRefresh.next();
    }

    this.entityService.getAttachments('note', this.type, this.entryId).subscribe(response =>
      this.allNotes = response['data']);
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
    this.entityService.getAttachments('note', this.type, this.entryId).subscribe(response =>
      this.allNotes = response['data']);

    this.noteTableData.triggerRefresh.next();
  }

  createEmptyNote() {
    this.selectedNote = new Note();
    this.selectedNote.ownerType = this.type;
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
      this.selectedNote.note = note['note'];
      this.selectedNote.subject = note['subject'];
      this.selectedNote.category = note['categoryName'];
      this.selectedNote.id = note['id'];
    }
  }
}
