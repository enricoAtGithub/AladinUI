import { Injectable, Input } from '@angular/core';
import { DiagramsModule } from '../diagrams.module';
import { DiagramData } from '../models/diagram-data';

@Injectable({
  providedIn: DiagramsModule
})
export class DiagramService {

  constructor() { }

}
