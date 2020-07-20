import { Component, OnInit } from '@angular/core';
import { TableData } from 'src/app/shared/models/table-data';
import { BreadcrumbService } from 'src/app/breadcrumb.service';


@Component({
  selector: 'app-manufacturer',
  templateUrl: './manufacturer.component.html',
  styleUrls: ['./manufacturer.component.css']
})
export class ManufacturerComponent implements OnInit {
  data = new TableData('Hersteller', 'Manufacturer');
  
  constructor(private breadcrumbService: BreadcrumbService) {
    this.breadcrumbService.setItems([
        { label: 'Manufacturer' }
    ]);
  }


  ngOnInit() {
  }

}
