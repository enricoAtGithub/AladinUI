import { Component, OnInit, ViewChild } from '@angular/core';
import { TableData } from 'src/app/shared/models/table-data';
import { DynamicTableComponent } from 'src/app/shared/components/dynamic-table/dynamic-table.component';

@Component({
  selector: 'app-resources',
  templateUrl: './resources.component.html',
  styleUrls: ['./resources.component.css']
})
export class ResourcesComponent implements OnInit {
  @ViewChild('availabilities', {static: false}) availabilities: DynamicTableComponent;
  
  selectedResourceId: number;

  // data = new TableData('Ressourcen', 'Resource');
  data = new TableData('Ressourcen', 'Resource');
  availabilityData = new TableData('Verfügbarkeiten', 'ResourceAvailability');


  constructor() { }

  ngOnInit() {
  }

  resourceSelected(entity:any) {
    if (entity === undefined) {
      this.selectedResourceId = undefined;  
    } else {
      this.selectedResourceId = entity['id'];
      this.availabilities.refreshTableContents();
    }
  }
}
