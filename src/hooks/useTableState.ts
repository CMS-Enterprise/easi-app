/*
Hook for storing and setting table values
Utilizes both local storage and context for persistence
Storage method depends on the need of type of persistence
Table setters are dependent on react-table exposed methods
*/

import { useContext, useEffect, useRef } from 'react';
import { FilterValue, SortingRule } from 'react-table';
import { assign, isEqual } from 'lodash';
import {
  ActiveStateType,
  ReactTableStateType,
  TableStateContext,
  TableStates
} from 'wrappers/TableStateWrapper';

const useTableState = (
  tableName: string,
  state: ReactTableStateType,
  gotoPage: (updater: ((pageIndex: number) => number) | number) => void,
  setSortBy: (sortBy: Array<SortingRule<{}>>) => void,
  setGlobalFilter: (filterValue: FilterValue) => void,
  activeTable: ActiveStateType,
  data: any[]
) => {
  const tableStates: Record<string, TableStates> =
    useContext(TableStateContext);
  const tableState = tableStates[tableName];

  const didInitRef = useRef(false);

  // Stores page size in local storage on every selection change
  useEffect(() => {
    localStorage.setItem(
      'request-table-page-size',
      JSON.stringify(state.pageSize)
    );
  }, [state.pageSize]);

  // Stores state/sets context on unmount only on page change
  useEffect(() => {
    const tableStateRef = tableState.current;
    return () => {
      tableStateRef.state = assign({}, tableStateRef.state, state);
    };
  }, [tableState, state]);

  // Initialize table state only once
  useEffect(() => {
    if (didInitRef.current) return;
    didInitRef.current = true;

    const storedPageIndex = tableState.current.state.pageIndex;
    const storedSortBy = tableState.current.state.sortBy;
    const storedFilter = tableState.current.state.globalFilter;

    if (state.pageIndex !== storedPageIndex) {
      gotoPage(storedPageIndex);
    }

    if (!isEqual(state.sortBy, storedSortBy)) {
      setSortBy(storedSortBy);
    }

    if (data.length && !isEqual(state.globalFilter, storedFilter)) {
      setGlobalFilter(storedFilter);
    }
  }, [
    gotoPage,
    setSortBy,
    setGlobalFilter,
    tableState,
    state.pageIndex,
    state.sortBy,
    state.globalFilter,
    data.length
  ]);

  // Sets previous active table || 'open'
  useEffect(() => {
    tableState.current.activeTableState = activeTable;
  }, [activeTable, tableState]);
};

export default useTableState;
