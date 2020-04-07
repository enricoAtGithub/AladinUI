import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, empty } from 'rxjs';
import { ActionTreeNode } from '../models/actions-tree-node.model';
import { UrlCollection } from 'src/app/shared/url-collection';

@Injectable({
  providedIn: 'root'
})
export class JmeleonActionsForRightService {

  constructor(private http: HttpClient) { }

  setAllActions = (actionList: string[]): Observable<Object> =>
    this.http.post(UrlCollection.UserManagement.Actions.ADD(), actionList)

  getActionsForRight = (rightId: number): Observable<ActionTreeNode> =>
    this.http.get<ActionTreeNode>(UrlCollection.UserManagement.Right.ALL_ACTIONS(rightId))

  addActionToRight = (action: string, rightId: number): Observable<Object> =>
    this.http.post(UrlCollection.UserManagement.Right.ADD_ACTION(rightId), {name: action})

  removeActionFromRight = (action: string, rightId: number): Observable<Object> =>
  this.http.post(UrlCollection.UserManagement.Right.REMOVE_ACTION(rightId), {name: action})

}
