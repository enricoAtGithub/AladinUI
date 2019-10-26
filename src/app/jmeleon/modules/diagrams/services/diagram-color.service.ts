import { Injectable } from '@angular/core';
import { DiagramsModule } from '../diagrams.module';

@Injectable({
  providedIn: DiagramsModule
})
export class DiagramColorService {

  private barColors: [string, string][] = [

    ['#2955d9', '#6787e4'],
    ['#448c30', '#6cc454'],
    ['#f2be22', '#f9e39f'],
    ['#b35630', '#df9f86'],
    ['#694eca', '#1d1340'],
    ['#5cbae6', '#1c81b0'],
    ['#3a8699', '#90c7d5'],
    ['#b6d957', '#739121'],
    ['#fac364', '#f79f08'],
    ['#8cd3ff', '#008ee6'],
    ['#d998cb', '#a83e91'],
    ['#f2d249', '#bf9e0d'],
    ['#93b9c6', '#3e6775'],
    ['#ccc5a8', '#918555'],
    ['#52bacc', '#2f8d9d'],
    ['#dbdb46', '#95951d'],
    ['#98aafb', '#3a5df8'],

    ['#fff670', '#e6d600'],
    ['#99d3ff', '#0091ff'],
    ['#eb6851', '#cd3318']];

  constructor() { }

  getBarAndBorderColors(): [string, string][] {
    return this.barColors;
  }

  getBarColors(): string[] {
    return this.barColors.map(colorTuple => colorTuple[0]);
  }

  getBorderColors(): string[] {
    return this.barColors.map(colorTuple => colorTuple[1]);
  }
}
