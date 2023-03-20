/*
Hook for storing and setting table values
Utilizes both local storage and context for persistence
Storage method depends on the need of type of persistence
Table setters are dependent on react-table exposed methods
*/

import { useContext, useEffect } from 'react';
import { FilterValue, SortingRule, TableState } from 'react-table';
import { assign } from 'lodash';

import { TableStateContext, TableTypes } from 'views/TableStateWrapper';

const useTableState = (
  state: Partial<TableState>,
  gotoPage: (updater: ((pageIndex: number) => number) | number) => void,
  setSortBy: (sortBy: Array<SortingRule<{}>>) => void,
  setGlobalFilter: (filterValue: FilterValue) => void,
  activeTable: TableTypes,
  data: any[]
) => {
  const { tableState, activeTableState } = useContext(TableStateContext);

  // Stores page size in local storage on every selection change
  useEffect(() => {
    localStorage.setItem(
      'request-table-page-size',
      JSON.stringify(state.pageSize)
    );
  }, [state.pageSize]);

  // Stores state/sets context on unmount only on page change
  useEffect(() => {
    return () => {
      tableState.current = assign({}, tableState.current, state);
    };
  }, [tableState, state]);

  // The following hooks sets table settings from stored context state

  // Navigates to previously view page || 0
  // Sorts by previous view sort || desc:true, id: 'submittedAt'
  useEffect(() => {
    gotoPage(tableState.current.pageIndex || 0);
    setSortBy(tableState.current.sortBy || [{ desc: true, id: 'submittedAt' }]);
  }, [gotoPage, setSortBy, tableState]);

  // Filters by previous search term || ''
  useEffect(() => {
    if (data.length) {
      setGlobalFilter(tableState.current.globalFilter || '');
    }
  }, [data.length, setGlobalFilter, tableState]);

  // Sets previous active table || 'open'
  useEffect(() => {
    activeTableState.current = activeTable;
  }, [activeTable, activeTableState]);

  return { tableState, activeTableState };
};

export default useTableState;
