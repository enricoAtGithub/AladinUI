import { TestBed } from '@angular/core/testing';
import { BranchFlags, action, GuiAction } from '../models/node-types.model';
import JMeleonActionsUtils from './jmeleon-actions.utils';

class TestActionTree1 {
  static dto = class {
      static $dtoType = class {
          static $dtoField = class {
              // ensure, that none-flag does not influence the evaluation of the tree
              static flags: BranchFlags = BranchFlags.None;
              static create = action();
              static read = action();
              static write = action();
              static delete = action();
              static test2 = '';
          };
      };
      static test = class {
          static flags: BranchFlags = BranchFlags.IgnoreNodeInActionList;
          static subTest = class {
            static read = action();

         };
      };
      static same1 = class {
          static test = class {
              static read = action();
          };
      };

      static same2 = class {
          static test = class {
          };
      };
  };
}


describe('JMeleonActionsUtils', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should cast a bit-flag enum back to enum', () => {
      const testObj = {
          // tslint:disable-next-line: no-bitwise
          flags: BranchFlags.IgnoreNodeInActionList | BranchFlags.None
      };
      const testAny = <any> testObj;
      const branchFlags = <BranchFlags> testAny['flags'];
      // tslint:disable-next-line: no-bitwise
      expect(branchFlags).toEqual(BranchFlags.IgnoreNodeInActionList | BranchFlags.None);
      expect(branchFlags).not.toEqual(BranchFlags.None);
  });

//   it('should build action list from action tree - 01', () => {
//       const result = JMeleonActionsUtils.generateActionObjectMapFromTree(TestActionTree1).map(element => element[1]);
//     //   console.log('hould build action list from action tree - 01 - result: ', result);
//       expect(result).not.toBeNull();
//       expect(result.length).toEqual(14, 'should be 14 elements in the result list');

//     const i = 0;


//     expect(result.includes('dto.*')).toBeTruthy();
//     expect(result.includes('dto.$dtoType.*')).toBeTruthy();
//     expect(result.includes('dto.$dtoType.$dtoField.*')).toBeTruthy();
//     expect(result.includes('dto.$dtoType.$dtoField.create')).toBeTruthy();
//     expect(result.includes('dto.$dtoType.$dtoField.read')).toBeTruthy();
//     expect(result.includes('dto.$dtoType.$dtoField.write')).toBeTruthy();
//     expect(result.includes('dto.$dtoType.$dtoField.delete')).toBeTruthy();
//     expect(result.includes('dto.test.subTest.*')).toBeTruthy();
//     expect(result.includes('dto.test.subTest.*')).toBeTruthy();
//     expect(result.includes('dto.same1.*')).toBeTruthy();
//     expect(result.includes('dto.same1.test.*')).toBeTruthy();
//     expect(result.includes('dto.same1.test.read')).toBeTruthy();
//     expect(result.includes('dto.same2.*')).toBeTruthy();
//     expect(result.includes('dto.same2.test.*')).toBeTruthy();

//       // this one has the ignore flag
//       expect(result.includes('..dto.test')).not.toBeTruthy();

//     });
});
