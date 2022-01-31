import { HeaderGroup } from 'react-table';
import { DateTime } from 'luxon';

import {
  currentTableSortDescription,
  getColumnSortStatus,
  getHeaderSortIcon,
  sortColumnProps,
  sortColumnValues
} from './tableSort';

describe('tableSortUtil', () => {
  describe('getColumnSortStatus', () => {
    it('return text - ascending', () => {
      const column = {
        isSorted: true,
        isSortedDesc: false
      } as HeaderGroup;
      expect(getColumnSortStatus(column)).toEqual('ascending');
    });

    it('return text - descending', () => {
      const column = {
        isSorted: true,
        isSortedDesc: true
      } as HeaderGroup;
      expect(getColumnSortStatus(column)).toEqual('descending');
    });

    it('return text - none', () => {
      const column = {
        isSorted: false,
        isSortedDesc: true
      } as HeaderGroup;
      expect(getColumnSortStatus(column)).toEqual('none');
    });
  });

  describe('getHeaderSortIcon', () => {
    it('return default caret class', () => {
      const column = {
        isSorted: false,
        isSortedDesc: false
      } as HeaderGroup;
      expect(getHeaderSortIcon(column)).toContain('fa-sort caret');
    });

    it('return down caret class', () => {
      const column = {
        isSorted: true,
        isSortedDesc: true
      } as HeaderGroup;
      expect(getHeaderSortIcon(column)).toContain('fa-caret-down');
    });

    it('return up caret class', () => {
      const column = {
        isSorted: true,
        isSortedDesc: false
      } as HeaderGroup;
      expect(getHeaderSortIcon(column)).toContain('fa-caret-up');
    });
  });

  describe('currentTableSortDescription', () => {
    it('return header name of status ascending', () => {
      const headerGroup = {
        headers: [
          {
            Header: 'Name',
            isSorted: true,
            isSortedDesc: false
          }
        ]
      } as HeaderGroup;
      expect(currentTableSortDescription(headerGroup)).toEqual(
        'Requests table sorted by Name ascending'
      );
    });

    it('return header name of status descending', () => {
      const headerGroup = {
        headers: [
          {
            Header: 'Name',
            isSorted: true,
            isSortedDesc: true
          }
        ]
      } as HeaderGroup;
      expect(currentTableSortDescription(headerGroup)).toEqual(
        'Requests table sorted by Name descending'
      );
    });

    it('return default sort order string', () => {
      const headerGroup = {
        headers: [
          {
            Header: 'Name',
            isSorted: false,
            isSortedDesc: false
          }
        ]
      } as HeaderGroup;
      expect(currentTableSortDescription(headerGroup)).toEqual(
        'Requests table reset to default sort order'
      );
    });
  });

  describe('sortColumnValues', () => {
    it('sorts with a string and null value', () => {
      const input1: sortColumnProps = 'joe';
      const input2: sortColumnProps = null;
      expect(sortColumnValues(input1, input2)).toEqual(-1);
      expect(sortColumnValues(input2, input1)).toEqual(1);
    });

    it('sorts with two null values', () => {
      const input1: sortColumnProps = null;
      const input2: sortColumnProps = null;
      expect(sortColumnValues(input1, input2)).toEqual(1);
      expect(sortColumnValues(input2, input1)).toEqual(1);
    });

    it('sorts with a string and number', () => {
      const input1: sortColumnProps = 10;
      const input2: sortColumnProps = 'joe';
      expect(sortColumnValues(input1, input2)).toEqual(1);
      expect(sortColumnValues(input2, input1)).toEqual(-1);
    });

    it('sorts with a string and datetime', () => {
      const input1: sortColumnProps = DateTime.local();
      const input2: sortColumnProps = 'joe';
      expect(sortColumnValues(input1, input2)).toEqual(1);
      expect(sortColumnValues(input2, input1)).toEqual(-1);
    });

    it('sorts with a number and datetime', () => {
      const input1: sortColumnProps = DateTime.local();
      const input2: sortColumnProps = 10;
      expect(sortColumnValues(input1, input2)).toEqual(1);
      expect(sortColumnValues(input2, input1)).toEqual(-1);
    });

    it('sorts with two datetimes', () => {
      const input1: sortColumnProps = DateTime.local();
      const input2: sortColumnProps = DateTime.local(2017);
      expect(sortColumnValues(input1, input2)).toEqual(1);
      expect(sortColumnValues(input2, input1)).toEqual(-1);
    });

    it('sorts with two Strings', () => {
      const input1: sortColumnProps = 'barb';
      const input2: sortColumnProps = 'Joe';
      expect(sortColumnValues(input1, input2)).toEqual(-1);
      expect(sortColumnValues(input2, input1)).toEqual(1);
    });
  });
});
