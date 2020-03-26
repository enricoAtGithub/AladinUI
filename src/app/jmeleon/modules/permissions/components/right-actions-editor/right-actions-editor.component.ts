import { Component, OnInit, Input, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-right-actions-editor',
  templateUrl: './right-actions-editor.component.html',
  styleUrls: ['./right-actions-editor.component.css']
})
export class RightActionsEditorComponent implements OnInit, OnChanges, OnDestroy {

  @Input() entryId: number;

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {

  }

  ngOnDestroy(): void {

  }

}
