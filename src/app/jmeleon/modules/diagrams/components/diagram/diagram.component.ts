import { Component, OnInit, Input } from '@angular/core';
import { DiagramData } from '../../models/diagram-data';

@Component({
  selector: 'app-diagram',
  templateUrl: './diagram.component.html',
  styleUrls: ['./diagram.component.css']
})
export class DiagramComponent implements OnInit {

  @Input() showPanel = true;
  @Input() diagramData: DiagramData;
  header = '';

  constructor() { }

  ngOnInit() {
    if (!!this.diagramData) {
      this.header = this.diagramData.header;
    }
  }

}
