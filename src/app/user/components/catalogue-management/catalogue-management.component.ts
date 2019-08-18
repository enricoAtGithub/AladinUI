import { Component, OnInit } from '@angular/core';
import { BreadcrumbService } from 'src/app/breadcrumb.service';
import { CatalogueService } from '../../services/catalogue.service';
import { TreeNode } from 'primeng/primeng';
import { NgForm } from '@angular/forms';
import { Catalogue } from 'src/app/shared/models/catalogue';

@Component({
  selector: 'app-catalogue-management',
  templateUrl: './catalogue-management.component.html',
  styleUrls: ['./catalogue-management.component.css']
})
export class CatalogueManagementComponent implements OnInit {
  allCatalogues: TreeNode[];

  displayCreateCatalogue = false;
  displayAddEntry = false;
  catalogueToAddTo = '-1';

  constructor(private breadcrumbService: BreadcrumbService, private catalogueService: CatalogueService) {
    this.breadcrumbService.setItems([
      { label: 'Katalogverwaltung' }
    ]);
  }

  ngOnInit() {
    this.catalogueService.getAllCatalogues().then(catalogues => this.allCatalogues = catalogues);
  }

  showCreateCatalogueDialog() {
    this.displayCreateCatalogue = true;
  }

  createCatalogue(form: NgForm) {
    this.catalogueService.createCatalogue(form.value['name'], form.value['description']).subscribe((cat: Catalogue) => {
      this.allCatalogues.push(<TreeNode>JSON.parse('{"data": ' + JSON.stringify(cat) + ' ,"children": []}'));
      this.allCatalogues = [...this.allCatalogues];
    });
  }

  addEntry(form: NgForm) {
    this.catalogueService.addEntry(this.catalogueToAddTo, form.value['name'], form.value['description']).subscribe((entry) => {
      this.allCatalogues.find((node) => node.data.id === this.catalogueToAddTo).children.push(
        <TreeNode>JSON.parse('{"data": ' + JSON.stringify(entry) + '}'));
      this.allCatalogues = [...this.allCatalogues];
    });
  }

  deleteCatalogue(catalogueId: string) {
    this.catalogueService.deleteCatalogue(catalogueId).subscribe(() => {
      this.allCatalogues = this.allCatalogues.filter((node) => node.data.id !== catalogueId);
    });
  }

  deleteEntry(catalogueId, entryId: string) {
    console.log(catalogueId);
    this.catalogueService.removeEntry(entryId).subscribe(() => {
      const cat = this.allCatalogues.find((node) => node.data.id === catalogueId);
      cat.children = cat.children.filter((node) => node.data.id !== entryId);
      this.allCatalogues = [...this.allCatalogues];
    });
  }

  showAddEntryDialog(catalogueId: string) {
    this.catalogueToAddTo = catalogueId;
    this.displayAddEntry = true;
  }

  test(row) {
    console.log(row);
    return true;
  }

}
