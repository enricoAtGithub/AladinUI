import { TestBed, async, inject } from '@angular/core/testing';

import { PlaygroundGuard } from './playground.guard';

describe('PlaygroundGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PlaygroundGuard]
    });
  });

  it('should ...', inject([PlaygroundGuard], (guard: PlaygroundGuard) => {
    expect(guard).toBeTruthy();
  }));
});
