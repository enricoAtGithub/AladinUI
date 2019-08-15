import { Component, OnInit } from '@angular/core';
import { BreadcrumbService } from 'src/app/breadcrumb.service';
import { CatalogueService } from '../../services/catalogue.service';
import { Catalogue } from 'src/app/shared/models/catalogue';
import { TreeNode } from 'primeng/primeng';

@Component({
  selector: 'app-catalogue-management',
  templateUrl: './catalogue-management.component.html',
  styleUrls: ['./catalogue-management.component.css']
})
export class CatalogueManagementComponent implements OnInit {
  allCatalogues: TreeNode[];

  constructor(private breadcrumbService: BreadcrumbService, private catalogueService: CatalogueService) {
    this.breadcrumbService.setItems([
      { label: 'Katalogverwaltung' }
    ]);
  }

  ngOnInit() {
    this.catalogueService.getAllCatalogues().then(catalogues => this.allCatalogues = catalogues);
  }

}
