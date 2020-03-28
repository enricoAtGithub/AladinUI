import { Component, OnInit, Input, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { TreeNode, SelectItem } from 'primeng/api';
import JMeleonActionTreeUtils from '../../utils/jml-action-tree.utils';
import { JmeleonActionsFacadeService } from '../../services/jmeleon-actions-facade.service';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-right-actions-editor',
  templateUrl: './right-actions-editor.component.html',
  styleUrls: ['./right-actions-editor.component.css']
})
export class RightActionsEditorComponent implements OnInit, OnChanges, OnDestroy {

  @Input() entryId: number;

  actionsTree$: Observable<TreeNode[]>;
  selectedActions: TreeNode[];

  sections$: Observable<SelectItem[]>;
  isLoading$: Observable<boolean>;

  subscription: Subscription[] = [];

  selectedSection: string;

  constructor(private facade: JmeleonActionsFacadeService) { }

  ngOnInit() {
    // this.actionsTree = [];
    this.actionsTree$ = this.facade.actionGuiTreeForSelectedSection$;
    this.sections$ = this.facade.sections$;
    this.isLoading$ = this.facade.isLoading$;
    this.subscription.push(this.actionsTree$.subscribe(tree => {
      console.log('tree in component: ', tree);
    }));
    this.subscription.push(this.facade.selectedTreeNodes$.subscribe(selectedTreeNodes => {
      console.log('selectedActions: ', selectedTreeNodes);
      this.selectedActions = selectedTreeNodes;
    }))
    // this.facade.setTreeToDebugData();

  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.entryId){
      console.log('entryId: ', changes.entryId);
      this.facade.updateActionTreeViaBackend(this.entryId);
    }

  }

  ngOnDestroy(): void {
    this.subscription.forEach(sub => sub.unsubscribe());
  }

  
  nodeSelect(event) {
    //event.node = selected node
    // console.log('node selected: ', event);
  }
  nodeUnselect(event) {
    //event.node = selected node
    // console.log('node selected: ', event);
  }

  sectionSelected(event){
    console.log('selection changed: ', event);
    this.facade.selectSection(event.value);
  }

  // generateSelectedActions(roots: TreeNode[], selectedOnly = true):string[]{

  // }

  // generateSelectedActionsForName(currentNode: TreeNode, currentPath: string, selectedOnly = true): string[] {
  //   const result = [];
  //   if (!currentNode){
  //     return [];
  //   }
  //   if (!selectedOnly || currentNode.)
  //   result.push(currentPath + '.' + currentNode.label);
  //   if (!currentNode.leaf){

  //   }
  // }

}
