import { Component, OnInit, Input, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { TreeNode, SelectItem } from 'primeng/api';
import { JmeleonActionsFacadeService } from '../../services/jmeleon-actions-facade.service';
import { Observable, Subscription } from 'rxjs';
import JMeleonActionTreeUtils from '../../utils/jml-action-tree.utils';

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
  disableEditing$: Observable<boolean>;

  subscription: Subscription[] = [];

  selectedSection: string;

  expandingOrCollapsingTreeIsActive: boolean;

  constructor(private facade: JmeleonActionsFacadeService) { }

  ngOnInit() {
    this.actionsTree$ = this.facade.actionGuiTreeForSelectedSection$;
    this.sections$ = this.facade.sections$;
    this.isLoading$ = this.facade.isLoading$;
    // this.subscription.push(this.actionsTree$.subscribe(tree => {
    //   // console.log('tree in component: ', tree);
    // }));
    this.subscription.push(this.facade.selectedTreeNodes$.subscribe(selectedTreeNodes => {
      // console.log('selectedActions: ', selectedTreeNodes);
      this.selectedActions = selectedTreeNodes;
    }));
    this.disableEditing$ = this.facade.disableEditing$;
    this.subscription.push(this.sections$.subscribe(() => {
      // const selection = this.selectedSection;
      this.selectedSection = null;
      // this.selectedSection = selection;
    }));

  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log('change: ', changes);
    if (changes.entryId) {
      // console.log('entryId: ', changes.entryId);
      this.facade.requestActionTreeFromBackend(this.entryId);
      this.facade.selectSection(null);
    }

  }

  ngOnDestroy(): void {
    this.subscription.forEach(sub => sub.unsubscribe());
  }


  nodeSelect(event) {
    // console.log('selected node: ', event.node);
    this.facade.addActionToRight(this.entryId, event.node, this.selectedActions);

  }
  nodeUnselect(event) {
    // console.log('unselected node: ', event.node);
    this.facade.removeActionFromRight(this.entryId, event.node, this.selectedActions);

  }

  sectionSelected(event) {
    // console.log('selection changed: ', event);
    this.facade.selectSection(event.value);
  }

  expandTrees(trees: TreeNode[]):void{
    this.expandingOrCollapsingTreeIsActive = true;
    trees.forEach(tree => JMeleonActionTreeUtils.expandOrCollapseTree(tree));
  }

  collapseTrees(trees: TreeNode[]):void{
    this.expandingOrCollapsingTreeIsActive = true;
    trees.forEach(tree => JMeleonActionTreeUtils.expandOrCollapseTree(tree, false));
  }

  nodeExpanded(event):void{
    // console.log('expanded: ', event);
  }
  nodeCollapsed(event):void{
    // console.log('collapsed: ', event);

  }
}
