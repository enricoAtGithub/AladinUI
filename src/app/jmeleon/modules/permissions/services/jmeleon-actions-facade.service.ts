import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { ActionTreeNode } from '../models/actions-tree-node.model';
import { JmeleonActionsForRightService } from './jmeleon-actions-for-right.service';
import { tap, map } from 'rxjs/operators';
import { TreeNode, SelectItem } from 'primeng/api';
import * as permissions from '../permissions';
import { ErrorNotificationService } from 'src/app/shared/services/error-notification.service';
import { ErrorMessage } from 'src/app/shared/models/error-message';
import JMeleonActionTreeUtils from '../utils/jml-action-tree.utils';
import { Tree } from 'primeng/tree';

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
  isLoading$: Observable<boolean>;
  enableEditing$: Observable<boolean>;

  private sectionDict: Record<string, [TreeNode[], TreeNode[]]>;
  private rightId: number;
  private _actionTreeRoot: ActionTreeNode;
  private _currentSection: string;


  private $actionTree = new BehaviorSubject<ActionTreeNode>(null);
  private $selectedTreeNodes = new BehaviorSubject<TreeNode[]>([]);
  private $actionGuiTreeForSelectedSection = new BehaviorSubject<TreeNode[]>([]);
  private $sections = new BehaviorSubject<SelectItem[]>([]);
  private $isLoading = new BehaviorSubject<boolean>(false);

  private subscriptions: Subscription[] = [];

  constructor(
    private jmlActionsForRightService: JmeleonActionsForRightService,
    private notificationService: ErrorNotificationService
  ) {

    this.actionsTree$ = this.$actionTree.asObservable();
    this.selectedTreeNodes$ = this.$selectedTreeNodes.asObservable();
    this.sections$ = this.$sections.asObservable();
    this.actionGuiTreeForSelectedSection$ = this.$actionGuiTreeForSelectedSection.asObservable();
    this.isLoading$ = this.$isLoading.asObservable();
    this.init();
  }

  init(): void {
    // this.enableEditing$ = this.actionsTree$.pipe(
    //   map(actionTree, )
    // )
    this.actionsTree$.pipe(
      tap(actionTree => {
        // console.log('root1:', actionTree);
        this._actionTreeRoot = actionTree;
        if (!!actionTree) {
          this.sectionDict = JMeleonActionTreeUtils.generateTreeDict(actionTree);
          const keys = Object.keys(this.sectionDict);
          // console.log('keys: ', keys);
          this.$sections.next(keys.map(key => ({label: key, value: key})));
        }
      }),
      map(node => {
        const selectedNodes: TreeNode[] = [];
        const result = [JMeleonActionTreeUtils.generateTreeAndSelectedNodes(node, selectedNodes)];
        this.$selectedTreeNodes.next(selectedNodes);
        return result;
      })

    ).subscribe();
  }

  requestActionTreeFromBackend(rightId: number): void {
    this.rightId = rightId;
    this.$isLoading.next(true);
    this.subscriptions.push(
      this.jmlActionsForRightService.getActionsForRight(rightId)
      .subscribe(actionTree => {
        this.$actionTree.next(actionTree);
        this.$isLoading.next(false);
      })
    );
  }

  selectSection(sectionName: string): void {

    this._currentSection = sectionName;
    this.$actionGuiTreeForSelectedSection.next(this.sectionDict[sectionName][0]);
    this.$selectedTreeNodes.next(this.sectionDict[sectionName][1]);
  }

  removeActionFromRight(rightId: number, node: TreeNode):void{
    const fullName = JMeleonActionTreeUtils.generateFullPathFromTreeNode(node, this._actionTreeRoot);
    this.subscriptions.push(this.jmlActionsForRightService.removeActionFromRight(fullName, rightId).subscribe(
      () => this.notificationService.addSuccessNotification(new ErrorMessage('success', 'Erfolg', 'Aktion wurde erfolgreich entfernt.'))
    ));
  }

  addActionToRight(rightId: number, node: TreeNode):void{
    const fullName = JMeleonActionTreeUtils.generateFullPathFromTreeNode(node, this._actionTreeRoot);
    this.subscriptions.push(this.jmlActionsForRightService.addActionToRight(fullName, rightId).subscribe(
      () => this.notificationService.addSuccessNotification(new ErrorMessage('success', 'Erfolg', 'Aktion wurde erfolgreich hinzugefügt.'))
    ));
  }



  syncGuiActionsWithServer(): void {
    // should this be blocked/blocking too? (with isLoading)
    this.subscriptions.push(
      this.jmlActionsForRightService.setAllActions(permissions.list).subscribe(
        () => this.notificationService.addSuccessNotification(new ErrorMessage('success', 'Erfolg', 'Aktionen wurden erfolgreich an den Server übermittelt.'))
      )
    );
  }


}
