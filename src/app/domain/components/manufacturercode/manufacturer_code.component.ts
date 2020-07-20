import { Component, OnInit } from '@angular/core';
import { TableData } from 'src/app/shared/models/table-data';
import { BreadcrumbService } from 'src/app/breadcrumb.service';


@Component({
  selector: 'app-manufacturercode',
  templateUrl: './manufacturer_code.component.html',
  styleUrls: ['./manufacturer_code.component.css']
})
export class ManufacturerCodeComponent implements OnInit {
  data = new TableData('Hersteller-Codes', 'ManufacturerCode');
  
  constructor(private breadcrumbService: BreadcrumbService) {
    this.breadcrumbService.setItems([
        { label: 'ManufacturerCode' }
    ]);
  }


  ngOnInit() {
  }

}
