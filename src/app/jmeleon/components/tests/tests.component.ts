import { Component, OnInit } from '@angular/core';
import { TableData } from 'src/app/shared/models/table-data';

@Component({
  selector: 'app-tests',
  templateUrl: './tests.component.html',
  styleUrls: ['./tests.component.css']
})
export class TestsComponent implements OnInit {
  data = new TableData('Test', 'Test');
  constructor() { }

  ngOnInit() {
  }

}
