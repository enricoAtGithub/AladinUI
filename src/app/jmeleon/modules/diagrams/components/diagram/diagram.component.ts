import { Component, OnInit, Input } from '@angular/core';
import { DiagramData } from '../../models/diagram-data';
import { DiagramService } from '../../services/diagram.service';

@Component({
  selector: 'app-diagram',
  templateUrl: './diagram.component.html',
  styleUrls: ['./diagram.component.css']
})
export class DiagramComponent implements OnInit {

  @Input() showPanel = true;
  @Input() diagramData: DiagramData;
  @Input() height: string;

  constructor() { }

  ngOnInit() {
  }

}
