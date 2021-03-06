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

  @Input() ownerId: number;

  actionsTree$: Observable<TreeNode[]>;
  selectedActions: TreeNode[];

  sections$: Observable<SelectItem[]>;

  isLoading$: Observable<boolean>;
  disableEditing$: Observable<boolean>;

  subscription: Subscription[] = [];

  selectedSection: any;

  expandingOrCollapsingTreeIsActive: boolean;
  updatingSelectedAreaActive: boolean;

  constructor(private facade: JmeleonActionsFacadeService) { }

  ngOnInit() {
    this.actionsTree$ = this.facade.actionGuiTreeForSelectedSection$;
    this.sections$ = this.facade.sections$;
    this.isLoading$ = this.facade.isLoading$;
    this.subscription.push(this.facade.selectedTreeNodes$.subscribe(selectedTreeNodes => {
      this.selectedActions = selectedTreeNodes;
    }));
    this.disableEditing$ = this.facade.disableEditing$;
    this.subscription.push(this.sections$.subscribe(
      () => {
      this.selectedSection = null;
    }));

  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.ownerId) {
      this.facade.requestActionTreeFromBackend(this.ownerId);
      this.facade.selectSection(null);
    }

  }

  ngOnDestroy(): void {
    this.subscription.forEach(sub => sub.unsubscribe());
  }


  nodeSelect(event) {
    console.log('selected node: ', event.node);
    // this.updatingSelectedAreaActive = true;
    this.facade.addActionToRight(this.ownerId, event.node, this.selectedActions);

  }
  nodeUnselect(event) {
    // console.log('unselected node: ', event.node);
    // this.updatingSelectedAreaActive = true;
    this.facade.removeActionFromRight(this.ownerId, event.node, this.selectedActions);

  }

  sectionSelected(event) {
    // console.log('selection changed: ', event);
    // if (this.updatingSelectedAreaActive) {
    //   this.updatingSelectedAreaActive = false;
    //   return;
    // }
    this.facade.selectSection(event.value.key);
  }

  expandTrees(trees: TreeNode[]): void {
    this.expandingOrCollapsingTreeIsActive = true;
    trees.forEach(tree => JMeleonActionTreeUtils.expandOrCollapseTree(tree));
  }

  collapseTrees(trees: TreeNode[]): void {
    this.expandingOrCollapsingTreeIsActive = true;
    trees.forEach(tree => JMeleonActionTreeUtils.expandOrCollapseTree(tree, false));
  }

  nodeExpanded(event): void {
    // console.log('expanded: ', event);
  }
  nodeCollapsed(event): void {
    // console.log('collapsed: ', event);

  }
}
