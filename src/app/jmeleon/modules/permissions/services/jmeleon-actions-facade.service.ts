import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { ActionTreeNode } from '../models/actions-tree-node.model';
import { JmeleonActionsForRightService } from './jmeleon-actions-for-right.service';
import { tap, map } from 'rxjs/operators';
import { TreeNode, SelectItem } from 'primeng/api';



const generateTreeAndSelectedNodes = (actionTreeNode: ActionTreeNode, selectedTreeNodes: TreeNode[]): TreeNode => {

  if (!actionTreeNode) {
    return null;
  }
  const isLeaf = !actionTreeNode.nodes || actionTreeNode.nodes.length < 1;

  actionTreeNode.description = isLeaf ? 'todo: add description mechanism' : null;

  const guiTreeNode: TreeNode = {
    label: actionTreeNode.name,
    data: actionTreeNode,
    children: [],
    leaf: isLeaf,
    expanded: actionTreeNode.activated || !isLeaf && actionTreeNode.activated === null,
    partialSelected: !isLeaf && actionTreeNode.activated === null
    // icon
  };
  // if (!isLeaf && actionTreeNode.nodes.some(node => ))

  if (actionTreeNode.activated === true) {
    selectedTreeNodes.push(guiTreeNode);
  }
  guiTreeNode.children = isLeaf ? [] : actionTreeNode.nodes.map(node => generateTreeAndSelectedNodes(node, selectedTreeNodes));

  return guiTreeNode;
};

// const actionNodeIsPartialSelected = (node: ActionTreeNode, firstFoundActivation?: boolean = null): boolean => {

//   const childnode.nodes.map(n => )
//   for(const child of node.nodes){
//     if (firstFoundActivation !== null && child.activated !== null && firstFoundActivation !== child.activated){
//       return true;
//     }
//   }


//   return true;
// }

const generateTreeDict = (rootActionNode: ActionTreeNode): Record<string, [TreeNode[], TreeNode[]]> => {

  // dict with tuple: [tree-data, selected-nodes]
  const result: Record<string, [TreeNode[], TreeNode[]]> = {};
  // console.log('root: ', rootActionNode);
  const sectionNodes = rootActionNode.nodes;
  // console.log('root2: ', rootActionNode);

  sectionNodes.forEach(sectionNode => {
    const secondLevelNodes = sectionNode.nodes;
    const selectedNodes: TreeNode[] = [];

    const secondLevelGuiNodes = secondLevelNodes.map(slNode => {
      const guiNodes = generateTreeAndSelectedNodes(slNode, selectedNodes);
      return guiNodes;
    });
    result[sectionNode.name] = [secondLevelGuiNodes, selectedNodes];
  });

  console.log(result);

  return result;
};

/**
 * This facade encapsulates backend-calls and business logic for the right-action-editor
 */
@Injectable({
  providedIn: 'root'
})
export class JmeleonActionsFacadeService {

  actionsTree$: Observable<ActionTreeNode>;
  actionGuiTreeForSelectedSection$: Observable<TreeNode[]>;
  selectedTreeNodes$: Observable<TreeNode[]>;
  sections$: Observable<SelectItem[]>;

  sectionDict: Record<string, [TreeNode[], TreeNode[]]>;

  private $actionTree = new BehaviorSubject<ActionTreeNode>(null);
  private $selectedTreeNodes = new BehaviorSubject<TreeNode[]>([]);
  private $actionGuiTreeForSelectedSection = new BehaviorSubject<TreeNode[]>([]);
  private $sections = new BehaviorSubject<SelectItem[]>([]);

  private subscriptions: Subscription[] = [];

  constructor(
    private jmlActionsForRightService: JmeleonActionsForRightService
  ) {

    this.actionsTree$ = this.$actionTree.asObservable();
    this.selectedTreeNodes$ = this.$selectedTreeNodes.asObservable();
    this.sections$ = this.$sections.asObservable();
    this.actionGuiTreeForSelectedSection$ = this.$actionGuiTreeForSelectedSection.asObservable();

    this.actionsTree$.pipe(
      tap(actionTree => {
        console.log('root1:', actionTree);
        if (!!actionTree){
          this.sectionDict = generateTreeDict(actionTree);
          const keys = Object.keys(this.sectionDict);
          console.log('keys: ', keys);
          this.$sections.next(keys.map(key => ({label: key, value: key})));
        }
      }),
      map(node => {
        const selectedNodes: TreeNode[] = [];
        const result = [generateTreeAndSelectedNodes(node, selectedNodes)];
        // console.log('gui tree: ', result);
        // console.log('selected nodes: ', selectedNodes);
        this.$selectedTreeNodes.next(selectedNodes);
        return result;
      })

    ).subscribe();
  }

  updateActionTreeViaBackend(rightId: number): void {
    // this.subscriptions.push(
    //   this.jmlActionsForRightService.getActionsForRight(rightId)
    //   // .pipe(
    //   //   tap(actionTree => this.$actionTree.next(actionTree))
    //   // )
    //   .subscribe(actionTree => this.$actionTree.next(actionTree))
    // );
    this.setTreeToDebugData();
  }

  selectSection(sectionName: string): void {

    this.$actionGuiTreeForSelectedSection.next(this.sectionDict[sectionName][0]);
    this.$selectedTreeNodes.next(this.sectionDict[sectionName][1]);
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
      },
      {
        "name" : "second",
        "activated" : false,
        "nodes" : [ {
          "name" : "Order2",
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
          "name" : "Resource2",
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
    console.log('setTreeToDebugData-new tree: ', newTree);
    this.$actionTree.next(newTree);
    console.log('setTreeToDebugData-actionTree: ', this.$actionTree);
    // this.$actionTree.next(newTree);
  }


}
