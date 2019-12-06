import { Injectable, Input } from '@angular/core';
import { DiagramsModule } from '../diagrams.module';
import { DiagramData } from '../models/diagram-data';
import { DiagramColorService } from './diagram-color.service';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AppConfig } from 'src/app/shared/app-config';

@Injectable({
  // providedIn: DiagramsModule
  providedIn: 'root'
})
export class DiagramService {

  constructor(
    private diagramColorService: DiagramColorService,
    private http: HttpClient
    ) { }


  public getBaseUrl() {
    return AppConfig.getBaseUrl() + '/storage';
  }
  // just temporary
  public getCapacityData(): Observable<DiagramData> {
    const url = `${this.getBaseUrl()}/capacity`;
    return this.http.get<DiagramData>(url);
  }


}
