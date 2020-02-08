import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-artefact-list',
  templateUrl: './artefact-list.component.html',
  styleUrls: ['./artefact-list.component.css']
})
export class ArtefactListComponent implements OnInit {

  @Input() documentTypeForHeader = 'Dokumente';

  constructor() { }

  ngOnInit() {
  }

}
