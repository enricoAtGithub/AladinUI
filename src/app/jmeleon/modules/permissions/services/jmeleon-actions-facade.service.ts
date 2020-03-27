import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { ActionTreeNode } from '../models/actions-tree-node.model';
import { JmeleonActionsForRightService } from './jmeleon-actions-for-right.service';
import { tap, map } from 'rxjs/operators';
import { TreeNode } from 'primeng/api';



const actionTreeNodeToTreeNode = (actionTreeNode: ActionTreeNode): TreeNode => {

  if (!actionTreeNode) {
    return null;
  }
  const isLeaf = !actionTreeNode.nodes || actionTreeNode.nodes.length < 1;

  const result: TreeNode = {
    label: actionTreeNode.name,
    data: 'generate full path',
    children: isLeaf ? [] : actionTreeNode.nodes.map(node => actionTreeNodeToTreeNode(node)),
    leaf: isLeaf,
    expanded: actionTreeNode.activated,
    partialSelected: actionTreeNode.activated === null
  };

  return result;
};

const generateTreeAndSelectedNodes = (actionTreeNode: ActionTreeNode, selectedTreeNodes: TreeNode[]): TreeNode => {

  if (!actionTreeNode) {
    return null;
  }
  const isLeaf = !actionTreeNode.nodes || actionTreeNode.nodes.length < 1;
  

  const guiTreeNode: TreeNode = {
    label: actionTreeNode.name,
    data: 'generate full path',
    children: [],
    leaf: isLeaf,
    expanded: actionTreeNode.activated,
    partialSelected: actionTreeNode.activated === null
  };

  if (actionTreeNode.activated === true){
    selectedTreeNodes.push(guiTreeNode);
  }
  guiTreeNode.children = isLeaf ? [] : actionTreeNode.nodes.map(node => generateTreeAndSelectedNodes(node, selectedTreeNodes));

  return guiTreeNode;
};

/**
 * This facade encapsulates backend-calls and business logic for the right-action-editor
 */
@Injectable({
  providedIn: 'root'
})
export class JmeleonActionsFacadeService {

  actionsTree$: Observable<ActionTreeNode>;
  private _actionTree: ActionTreeNode;

  actionGuiTree$: Observable<TreeNode[]>;
  selectedTreeNodes$: Observable<TreeNode[]>;


  private $actionTree = new BehaviorSubject<ActionTreeNode>(null);
  private $selectedTreeNodes = new BehaviorSubject<TreeNode[]>([]);
  private $rootLevelNodeNames = new BehaviorSubject<string[]>([]);

  private subscriptions: Subscription[];

  constructor(
    private jmlActionsForRightService: JmeleonActionsForRightService
  ) {

    this.actionsTree$ = this.$actionTree.asObservable();
    this.selectedTreeNodes$ = this.$selectedTreeNodes.asObservable();
    this.actionsTree$.pipe(
      tap(actionTree => this._actionTree = actionTree)
    );
    this.actionGuiTree$ = this.actionsTree$.pipe(
      // map(node => [actionTreeNodeToTreeNode(node)])
      map(node => {
        const selectedNodes: TreeNode[] = [];
        const result = [generateTreeAndSelectedNodes(node, selectedNodes)];
        console.log('gui tree: ', result);
        console.log('selected nodes: ', selectedNodes);
        this.$selectedTreeNodes.next(selectedNodes);
        return result;
      })

    );
  }

  updateActionTreeViaBackend(rightId: number): void {
    this.subscriptions.push(
      this.jmlActionsForRightService.getActionsForRight(rightId)
      // .pipe(
      //   tap(actionTree => this.$actionTree.next(actionTree))
      // )
      .subscribe(actionTree => this.$actionTree.next(actionTree))
    );
  }

  updateActionTreeViaUserAction(node: ActionTreeNode): void {
    // find node in tree (or is node in parameter enough)
    // traverse to parent and check activated flag
    // traverse to children and check activate flag

  }

  setTreeToDebugData(): void {
    const newTree: ActionTreeNode = JSON.parse(`
    {
      "name" : "root",
      "activated" : false,
      "nodes" : [ {
        "name" : "foobarac4f24",
        "activated" : false,
        "nodes" : [ {
          "name" : "Order",
          "activated" : false,
          "nodes" : [ {
            "name" : "create",
            "activated" : false,
            "nodes" : null
          }, {
            "name" : "read",
            "activated" : false,
            "nodes" : null
          } ]
        }, {
          "name" : "Resource",
          "activated" : false,
          "nodes" : [ {
            "name" : "create",
            "activated" : false,
            "nodes" : null
          }, {
            "name" : "read",
            "activated" : true,
            "nodes" : null
          } ]
        } ]
      } ]
    }
  `);
  console.log('new tree: ', newTree);
    this.$actionTree.next(newTree);
  }


}
