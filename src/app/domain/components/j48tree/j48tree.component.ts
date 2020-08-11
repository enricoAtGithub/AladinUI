import { Component, OnInit } from '@angular/core';
import { BreadcrumbService } from 'src/app/breadcrumb.service';
import { TableData } from 'src/app/shared/models/table-data';

@Component({
  selector: 'app-j48tree',
  templateUrl: './j48tree.component.html',
  styleUrls: ['./j48tree.component.css']
})
export class J48TreeComponent implements OnInit {
  data = new TableData('J48 Bäumes', 'J48Tree');
  
  constructor(private breadcrumbService: BreadcrumbService) {
    this.breadcrumbService.setItems([
        { label: 'J48Tree' }
    ]);
  }


  ngOnInit() {
  }

}
