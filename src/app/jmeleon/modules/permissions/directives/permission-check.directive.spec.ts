import { TestBed } from '@angular/core/testing';
import { PermissionCheckDirective } from './permission-check.directive';
import { JmeleonActionsPermissionService } from '../services/jmeleon-actions-permission.service';
import { JMeleonPermissionsService } from 'src/app/auth/services/jmeleon-permissions.service';
import { CommonModule } from '@angular/common';

class MockJmeleonActionsPermissionService {
  hasPermission = false;
  userHasPermissionForAction = (f: Function | Object): boolean => this.hasPermission;
}

describe('PermissionCheckDirective', () => {

  beforeEach(() => TestBed.configureTestingModule({
    declarations: [PermissionCheckDirective],
    providers: [{provide: JMeleonPermissionsService, useClass: MockJmeleonActionsPermissionService}],
    imports: [CommonModule]
  }));

  it('should create an instance', () => {

    const service: JmeleonActionsPermissionService = TestBed.get(JmeleonActionsPermissionService);
    // const directive = TestBed.get();
    // expect(directive).toBeTruthy();
  });
});

// function createTestComponent(template: string): ComponentFixture<TestHasRoleComponent> {
//   return TestBed.overrideComponent(TestHasRoleComponent, { set: { template: template } })
//       .createComponent(TestHasRoleComponent);
// }
