// Custom hook for handling mouse clicks outside of mobile expanded side nav

import { useContext, useEffect } from 'react';
import { FilterValue, SortingRule, TableState } from 'react-table';
import { merge, omit } from 'lodash';

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

  // Navigates to previously view page || 0
  useEffect(() => {
    gotoPage(tableState.current.pageIndex!);
  }, [gotoPage, tableState]);

  // Sorts by previous view sort || desc:true, id: 'submittedAt'
  useEffect(() => {
    // console.log(tableState);
    setSortBy(tableState.current.sortBy!);
  }, [setSortBy, tableState]);

  // Filters by previous search term || ''
  useEffect(() => {
    if (data.length) {
      setGlobalFilter(tableState.current.globalFilter);
    }
  }, [data.length, setGlobalFilter, tableState]);

  // Set's context on unmount and sets previous active table || 'open'
  useEffect(() => {
    activeTableState.current = activeTable;

    return () => {
      // Sortby is deep and not merged by shallow merge
      tableState.current = merge(omit(tableState.current, 'sortBy'), state);
      tableState.current.sortBy = state.sortBy;
    };
  }, [
    tableState,
    state.pageIndex,
    activeTable,
    state.globalFilter,
    state.sortBy,
    state.pageSize,
    activeTableState,
    state
  ]);

  return { tableState, activeTableState };
};

export default useTableState;
