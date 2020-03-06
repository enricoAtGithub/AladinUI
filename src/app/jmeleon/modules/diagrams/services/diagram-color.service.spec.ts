import { TestBed } from '@angular/core/testing';

import { DiagramColorService } from './diagram-color.service';
import { DiagramData } from '../models/diagram-data';

describe('DiagramColorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DiagramColorService = TestBed.get(DiagramColorService);
    expect(service).toBeTruthy();
  });

  it('should add color to diagram data', () => {
    const service: DiagramColorService = TestBed.get(DiagramColorService);
    const data = {
      datasets: [
        {
          label: 'test',
          data: [1, 2, 3],
          backgroundColor: null,
          borderColor: null
        },
        {
          label: 'test',
          data: [1, 2, 3],
          backgroundColor: null,
          borderColor: null
        },
        {
          label: 'test',
          data: [1, 2, 3],
          backgroundColor: null,
          borderColor: null
        }
      ]
    };
    const diagramData: DiagramData = {
      header: '',
      type: '',
      options: null,
      data
    };
    service.checkAndSetChartColors(diagramData);
    expect(!!diagramData.data.datasets[0].backgroundColor).toBeTruthy();

  });

});
