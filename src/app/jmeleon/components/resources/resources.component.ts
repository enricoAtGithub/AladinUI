import { Component, OnInit } from '@angular/core';
import { TableData } from 'src/app/shared/models/table-data';

@Component({
  selector: 'app-resources',
  templateUrl: './resources.component.html',
  styleUrls: ['./resources.component.css']
})
export class ResourcesComponent implements OnInit {
  // data = new TableData('Ressourcen', 'Resource');
  data = new TableData('Resource', 'Resource');


  constructor() { }

  ngOnInit() {
  }

}
