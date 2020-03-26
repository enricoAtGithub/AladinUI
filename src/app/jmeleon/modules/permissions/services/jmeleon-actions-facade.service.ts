import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { ActionTreeNode } from '../models/actions-tree-node.model';
import { JmeleonActionsForRightService } from './jmeleon-actions-for-right.service';
import { tap } from 'rxjs/operators';


/**
 * This facade encapsulates backend-calls and business logic for the right-action-editor
 */
@Injectable({
  providedIn: 'root'
})
export class JmeleonActionsFacadeService {

  actionsTree$: Observable<ActionTreeNode>;
  private _actionTree: ActionTreeNode;

  private $actionTree = new BehaviorSubject<ActionTreeNode>(null);

  private subscriptions: Subscription[];

  constructor(
    private jmlActionsForRightService: JmeleonActionsForRightService
  ) {

    this.actionsTree$ = this.$actionTree.asObservable();
    this.actionsTree$.pipe(
      tap(actionTree => this._actionTree = actionTree)
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


}
