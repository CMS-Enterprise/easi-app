/*
Hook for storing and setting table values
Utilizes both local storage and context for persistence
Storage method depends on the need of type of persistence
Table setters are dependent on react-table exposed methods
*/

import { useContext, useEffect } from 'react';
import { FilterValue, SortingRule } from 'react-table';
import { assign } from 'lodash';
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

  // The following hooks sets table settings from stored context state

  // Navigates to previously view page || 0
  // Sorts by previous view sort || desc:true, id: 'submittedAt'
  useEffect(() => {
    gotoPage(tableState.current.state.pageIndex);
    setSortBy(tableState.current.state.sortBy);
  }, [gotoPage, setSortBy, tableState]);

  // Filters by previous search term || ''
  useEffect(() => {
    // Needs to wait for data to be present - react-table resets globalFilter if initialized before data
    if (data.length) {
      setGlobalFilter(tableState.current.state.globalFilter);
    }
  }, [data.length, setGlobalFilter, tableState]);

  // Sets previous active table || 'open'
  useEffect(() => {
    tableState.current.activeTableState = activeTable;
  }, [activeTable, tableState]);
};

export default useTableState;
