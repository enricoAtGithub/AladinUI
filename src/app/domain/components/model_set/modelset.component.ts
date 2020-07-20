import { Component, OnInit } from '@angular/core';
import { TableData } from 'src/app/shared/models/table-data';
import { BreadcrumbService } from 'src/app/breadcrumb.service';


@Component({
  selector: 'app-modelset',
  templateUrl: './modelset.component.html',
  styleUrls: ['./modelset.component.css']
})
export class ModelSetComponent implements OnInit {
  data = new TableData('ModelSets', 'ModelSet');
  
  constructor(private breadcrumbService: BreadcrumbService) {
    this.breadcrumbService.setItems([
        { label: 'ModelSet' }
    ]);
  }


  ngOnInit() {
  }

}
