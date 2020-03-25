import { Injectable } from '@angular/core';
import { JmeleonActionsForRightService } from './jmeleon-actions-for-right.service';
import { Observable, BehaviorSubject, Subscription } from 'rxjs';
import { ActionTreeNode } from '../models/actions-tree-node.model';


/**
 * This facade encapsulates backend-calls and business logic for the right-action-editor
 */
@Injectable({
  providedIn: 'root'
})
export class JmeleonActionsFacadeService {

  actionsTree$: Observable<ActionTreeNode>;
  private $actionTree = new BehaviorSubject<ActionTreeNode>(null);

  private subscriptions: Subscription[];

  constructor(
    private jmlActionsForRightService: JmeleonActionsForRightService
    ) {

    this.actionsTree$ = this.$actionTree.asObservable();
  }

  updateActionTree(rightId: number):void{

  }


}
