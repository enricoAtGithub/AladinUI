import { TestBed, async, inject } from '@angular/core/testing';

import { UserManagementGuard } from './user-management.guard';

describe('UserManagementGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UserManagementGuard]
    });
  });

  it('should ...', inject([UserManagementGuard], (guard: UserManagementGuard) => {
    expect(guard).toBeTruthy();
  }));
});
