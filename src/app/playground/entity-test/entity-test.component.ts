import { Component, OnInit } from '@angular/core';
import { TableData } from 'src/app/shared/models/table-data';

@Component({
  selector: 'app-entity-test',
  templateUrl: './entity-test.component.html',
  styleUrls: ['./entity-test.component.css']
})
export class EntityTestComponent implements OnInit {
  data = new TableData('Test', 'Test');
  constructor() { }

  ngOnInit() {
  }

}
