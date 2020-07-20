import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavigationTarget } from '../models/navigation-target.model';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { EntityNavTarget } from '../models/entity-nav-target.model';

@Injectable({
  providedIn: 'root'
})
export class JmlNavigationService {

  public serializeRoute = (route: ActivatedRoute): Observable<NavigationTarget> =>
    route.url
      .pipe(
        map(segments => segments.join('')),
        map(url => new NavigationTarget(url))
      )

  // if we want to enable full browser navigation, all params should be read from the url params
  public serializeEntityRoute(route: ActivatedRoute, selectedEntityId?: number, selectedPage?: number, selectedTabId?: number): Observable<EntityNavTarget> {
    return route.url
    .pipe(
      map(segments => segments.join('')),
      map(url => new EntityNavTarget(url, selectedEntityId, selectedPage, selectedTabId))
    );
  }

  // public getEntityRoute(entityType: string, )


  // that won't work when the parameters were changed after component initialization

  // public serializeRoute = (route: ActivatedRoute): NavigationTarget =>
  //   new NavigationTarget(route.snapshot.url.join(''))

  // public serializeEntityRoute = (route: ActivatedRoute, selectedEntityId?: number, selectedPage?: number, selectedTabId?: number): EntityNavTarget =>
  //   new EntityNavTarget(route.snapshot.url.join(''), selectedEntityId, selectedPage, selectedTabId)
}
