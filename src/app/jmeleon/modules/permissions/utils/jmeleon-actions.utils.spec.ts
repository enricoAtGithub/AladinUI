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

  it('should build action list from action tree - 01', () => {
      const result = JMeleonActionsUtils.generateActionObjectMapFromTree(TestActionTree1).map(element => element[1]);
      expect(result).not.toBeNull();
      expect(result.length).toEqual(15, 'should be 15 elements in the result list');

    let i = 0;

    // console.log('result: ', result);
    // the position is not relevant. check for included should be enough.
      expect(result[i++]).toEqual('.');
      expect(result[i++]).toEqual('..dto');
      expect(result[i++]).toEqual('..dto.$dtoType');
      expect(result[i++]).toEqual('..dto.$dtoType.$dtoField');
      expect(result[i++]).toEqual('..dto.$dtoType.$dtoField.create');
      expect(result[i++]).toEqual('..dto.$dtoType.$dtoField.read');
      expect(result[i++]).toEqual('..dto.$dtoType.$dtoField.write');
      expect(result[i++]).toEqual('..dto.$dtoType.$dtoField.delete');
      expect(result[i++]).toEqual('..dto.test.subTest');
      expect(result[i++]).toEqual('..dto.test.subTest.read');
      expect(result[i++]).toEqual('..dto.same1');
      expect(result[i++]).toEqual('..dto.same1.test');
      expect(result[i++]).toEqual('..dto.same1.test.read');
      expect(result[i++]).toEqual('..dto.same2');
      expect(result[i++]).toEqual('..dto.same2.test');

      // this one has the ignore flag
      expect(result.includes('..dto.test')).not.toBeTruthy();

    });
});
