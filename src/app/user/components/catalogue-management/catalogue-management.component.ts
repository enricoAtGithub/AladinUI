import { Component, OnInit } from '@angular/core';
import { BreadcrumbService } from 'src/app/breadcrumb.service';
import { CatalogueService } from '../../services/catalogue.service';
import { TreeNode } from 'primeng/primeng';
import { NgForm } from '@angular/forms';
import { Catalogue } from 'src/app/shared/models/catalogue';
import { DialogService, ConfirmationService } from 'primeng/api';
import { EntityDialogComponent } from 'src/app/shared/components/entity-dialog/entity-dialog.component';
import { Observable } from 'rxjs';
import { EntityService } from 'src/app/shared/services/entity.service';
import { EntityConfiguration } from 'src/app/shared/models/entity-configuration';

@Component({
  selector: 'app-catalogue-management',
  templateUrl: './catalogue-management.component.html',
  styleUrls: ['./catalogue-management.component.css'],
  providers: [ ConfirmationService]
})
export class CatalogueManagementComponent implements OnInit {
  allCatalogues: TreeNode[];

  displayCreateCatalogue = false;
  displayAddEntry = false;
  catalogueToAddTo = '-1';

  catalogueConfig: EntityConfiguration;
  catalogueEntryConfig: EntityConfiguration;

  constructor(
    private breadcrumbService: BreadcrumbService,
    private catalogueService: CatalogueService,
    private dialogService: DialogService,
    private entityService: EntityService,
    private confirmationService: ConfirmationService
    ) {
    this.breadcrumbService.setItems([
      { label: 'Katalogverwaltung' }
    ]);
  }

  ngOnInit() {
    this.loadCatalogues();
    this.entityService.getEntityConfigurations().subscribe(configs => {this.catalogueConfig = configs['Catalogue']; this.catalogueEntryConfig = configs['CatalogueEntry']; });
  }

  loadCatalogues() {
    this.catalogueService.getAllCatalogues().then(catalogues => this.allCatalogues = catalogues);
  }

  showCreateCatalogueDialog() {
    this.displayCreateCatalogue = true;
  }

  createCatalogue(form: NgForm) {
    this.catalogueService.createCatalogue(form.value['name'], form.value['description']).subscribe((cat: Catalogue) => {
      this.displayCreateCatalogue = false;
      this.allCatalogues.push(<TreeNode>JSON.parse('{"data": ' + JSON.stringify(cat) + ' ,"children": []}'));
      this.allCatalogues = [...this.allCatalogues];
      form.resetForm();
    });
  }

  addEntry(form: NgForm) {
    this.catalogueService.addEntry(this.catalogueToAddTo, form.value['name'], form.value['description']).subscribe((entry) => {
      this.displayAddEntry = false;
      this.allCatalogues.find((node) => node.data.id === this.catalogueToAddTo).children.push(
        <TreeNode>JSON.parse('{"data": ' + JSON.stringify(entry) + '}'));
      this.allCatalogues = [...this.allCatalogues];
      form.resetForm();
    });
  }

  deleteCatalogue(catalogueId: string) {
    this.confirmationService.confirm({
      message: 'Sind Sie sicher, dass Sie diesen Katalog löschen wollen?',
      accept: () => {
        this.catalogueService.deleteCatalogue(catalogueId).subscribe(() => {
          this.allCatalogues = this.allCatalogues.filter((node) => node.data.id !== catalogueId);
        });
      }
    });
  }

  deleteEntry(catalogueId, entryId: string) {
    this.confirmationService.confirm({
      message: 'Sind Sie sicher, dass Sie diesen Eintrag löschen wollen?',
      accept: () => {
        this.catalogueService.removeEntry(entryId).subscribe(() => {
          const cat = this.allCatalogues.find((node) => node.data.id === catalogueId);
          cat.children = cat.children.filter((node) => node.data.id !== entryId);
          this.allCatalogues = [...this.allCatalogues];
        });
      }
    });
  }

  updateCatalogue(data: any) {
    console.log(data);
    const dialogRef = this.dialogService.open(EntityDialogComponent, {
      data: {
        update: true,
        entity: data,
        config: this.catalogueConfig
      },
      header: data['name'] + ' bearbeiten',
      width: '500px'
    });

    dialogRef.onClose.subscribe((result: Observable<Object>) => {
      if (result !== undefined) {
        result.subscribe(() => this.loadCatalogues());
      }
    });
  }

  updateCatalogueEntry(data: any, parent: any) {
    console.log(data);
    data['catalogueId'] = {_repr_: parent['name'], id: parent['id']};
    const dialogRef = this.dialogService.open(EntityDialogComponent, {
      data: {
        update: true,
        entity: data,
        config: this.catalogueEntryConfig
      },
      header: data['name'] + ' bearbeiten',
      width: '500px'
    });

    dialogRef.onClose.subscribe((result: Observable<Object>) => {
      if (result !== undefined) {
        result.subscribe(() => this.loadCatalogues());
      }
    });
  }

  showAddEntryDialog(catalogueId: string) {
    this.catalogueToAddTo = catalogueId;
    this.displayAddEntry = true;
  }

}
