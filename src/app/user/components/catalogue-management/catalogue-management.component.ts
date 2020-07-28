import { Component, OnInit, OnDestroy } from '@angular/core';
import { BreadcrumbService } from 'src/app/breadcrumb.service';
import { CatalogueService } from '../../services/catalogue.service';
import { TreeNode } from 'primeng/primeng';
import { DialogService, ConfirmationService } from 'primeng/api';
import { EntityDialogComponent } from 'src/app/shared/components/entity-dialog/entity-dialog.component';
import { Observable, Subscription } from 'rxjs';
import { EntityConfiguration } from 'src/app/shared/models/entity-configuration';

import { Store, select } from '@ngrx/store';
import { RootStoreState } from 'src/app/root-store/root-index';
import * as fromConfigSelectors from 'src/app/root-store/config-store/config.selectors';
import { Field } from 'src/app/shared/models/field';
import { EntityService } from 'src/app/shared/services/entity.service';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-catalogue-management',
  templateUrl: './catalogue-management.component.html',
  styleUrls: ['./catalogue-management.component.css'],
  providers: [ConfirmationService]
})
export class CatalogueManagementComponent implements OnInit, OnDestroy {
  allCatalogues: TreeNode[];

  catalogueConfig: EntityConfiguration;
  catalogueEntryConfig: EntityConfiguration;

  selectedEntryId: number;
  catalogueSelected = false;
  catalogueEntrySelected = false;
  subscriptions: Subscription[] = [];

  constructor(
    private breadcrumbService: BreadcrumbService,
    private catalogueService: CatalogueService,
    private dialogService: DialogService,
    private confirmationService: ConfirmationService,
    private store$: Store<RootStoreState.State>,
    private entityService: EntityService
  ) {
    this.breadcrumbService.setItems([
      { label: 'Katalogverwaltung' }
    ]);
  }

  ngOnInit() {
    this.loadCatalogues();
    const configurations$ = this.store$.pipe(select(fromConfigSelectors.selectConfigs));
    configurations$.subscribe(configs => { this.catalogueConfig = configs['Catalogue']; this.catalogueEntryConfig = configs['CatalogueEntry']; });
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  loadCatalogues() {
    this.catalogueService.getAllCatalogues().then(catalogues => this.allCatalogues = catalogues);
  }

  createCatalogue() {
    const dialogRef = this.dialogService.open(EntityDialogComponent, {
      data: {
        update: false,
        fields: this.catalogueConfig.fields,
        configType: this.catalogueConfig.type
      },
      header: 'Katalog erstellen',
      width: '500px'
    });

    // following code is refactored according https://medium.com/@paynoattn/3-common-mistakes-i-see-people-use-in-rx-and-the-observable-pattern-ba55fee3d031
    // this.subscriptions.push(
    //   dialogRef.onClose.subscribe((fields: Field[]) => {
    //     if (fields) {  // in case the dynamicDialog is closed via "x" at top right corner, nothing is returned
    //       this.entityService.createEntity(this.catalogueConfig.type, fields)
    //         .subscribe(() => this.loadCatalogues());
    //         }
    //       })
    // );

    this.subscriptions.push(
      dialogRef.onClose.pipe(
        switchMap((fields: Field[]) => fields ? this.entityService.createEntity(this.catalogueConfig.type, fields) : undefined))
        .subscribe(() => this.loadCatalogues())
    );

  }

  addEntry(catalogue: any) {
    const dialogRef = this.dialogService.open(EntityDialogComponent, {
      data: {
        update: false,
        entity: { catalogueId: { _repr_: catalogue['name'], id: catalogue['id'] } },
        fields: this.catalogueEntryConfig.fields,
        configType: this.catalogueEntryConfig.type
      },
      header: 'Eintrag erstellen',
      width: '500px'
    });

    this.subscriptions.push(
      dialogRef.onClose.pipe(
        switchMap((fields: Field[]) => fields ? this.entityService.createEntity(this.catalogueEntryConfig.type, fields) : undefined))
        .subscribe(() => this.loadCatalogues())
    );

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
    const dialogRef = this.dialogService.open(EntityDialogComponent, {
      data: {
        update: true,
        entity: data,
        fields: this.catalogueConfig.fields,
        configType: this.catalogueConfig.type
      },
      header: data['name'] + ' bearbeiten',
      width: '500px'
    });

    this.subscriptions.push(
      dialogRef.onClose.pipe(
        switchMap((fields: Field[]) => fields ? this.entityService.updateEntity(this.catalogueConfig.type, data['id'], fields) : undefined))
        .subscribe(() => this.loadCatalogues())
    );

  }

  updateCatalogueEntry(data: any, parent: any) {
    data['catalogueId'] = { _repr_: parent['name'], id: parent['id'] };
    const dialogRef = this.dialogService.open(EntityDialogComponent, {
      data: {
        update: true,
        entity: data,
        fields: this.catalogueEntryConfig.fields,
        configType: this.catalogueEntryConfig.type
      },
      header: data['name'] + ' bearbeiten',
      width: '500px'
    });

    this.subscriptions.push(
      dialogRef.onClose.pipe(
        switchMap((fields: Field[]) => fields ? this.entityService.updateEntity(this.catalogueEntryConfig.type, data['id'], fields) : undefined))
        .subscribe(() => this.loadCatalogues())
    );

  }

  nodeSelect(event: any) {
    if (event.node.children) {
      // If node has children it is a catalogue
      this.catalogueEntrySelected = false;
      this.catalogueSelected = true;
    } else {
      this.catalogueSelected = false;
      this.catalogueEntrySelected = true;
    }
    this.selectedEntryId = event.node.data.id;
  }

  nodeUnselect(event: any) {
    this.catalogueEntrySelected = false;
    this.catalogueSelected = false;
    this.selectedEntryId = undefined;
  }
}
