import { Injectable } from '@angular/core';
import { DiagramsModule } from '../diagrams.module';
import { DiagramData } from '../models/diagram-data';

@Injectable({
  // providedIn: DiagramsModule
  providedIn: 'root'
})
export class DiagramColorService {

  private readonly barColors: [string, string][] = [

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

  checkAndSetChartColors(diagramData: DiagramData): void {
    let currentColorId = 0;
    let colorUsed = false;

    if (!diagramData || !diagramData.data || !diagramData.data.datasets) {
      console.log('[DiagramColorService-checkAndSetChartColors] no diagram data', diagramData);
      return;
    }

    diagramData.data.datasets.forEach((dataset, index, arr) => {
      colorUsed = false;
      if (dataset.backgroundColor === null) {
        colorUsed = true;
        arr[index].backgroundColor = this.barColors[currentColorId % this.barColors.length][0];
      }
      if (dataset.borderColor === null) {
        colorUsed = true;
        arr[index].borderColor = this.barColors[currentColorId % this.barColors.length][1];
      }
      if (colorUsed) {
        currentColorId++;
      }
    });
  }
}
