/*
Context wrapper for persisting and setting react-table states
Ex: <RequestRepository />
*/

import React, {
  createContext,
  MutableRefObject,
  useEffect,
  useRef
} from 'react';
import { useLocation } from 'react-router-dom';
import { SortingRule } from 'react-table';

type TableStateWrapperProps = {
  children: React.ReactNode;
};

export type TableTypes = 'open' | 'closed';

export type TableSortType = {
  desc: boolean;
  id: string;
};

type TableStateContextType = {
  tableQuery: MutableRefObject<string>;
  tablePage: MutableRefObject<number>;
  tablePageSize: MutableRefObject<number>;
  tableState: MutableRefObject<TableTypes>;
  tableSort: MutableRefObject<SortingRule<TableSortType>[]>;
};

const initialTableState: TableStateContextType = {
  tableQuery: {
    current: ''
  },
  tablePage: {
    current: 0
  },
  tablePageSize: {
    current: 50
  },
  tableState: {
    current: 'open'
  },
  tableSort: {
    current: [
      {
        desc: true,
        id: 'submittedAt'
      }
    ]
  }
};

// Create the table state context - fetched from IT gov table
export const TableStateContext = createContext<TableStateContextType>(
  initialTableState
);

const TableStateWrapper = ({ children }: TableStateWrapperProps) => {
  // Checks to see if the current route is a part of IT Gov or home
  const { pathname } = useLocation();

  const routeParams: string[] = pathname.split('/');

  const isGovTeamRoute: boolean =
    routeParams[1] === 'governance-review-team' || pathname === '/';

  const tableQuery = useRef<string>(initialTableState.tableQuery.current);
  const tablePage = useRef<number>(initialTableState.tablePage.current);
  const tablePageSize = useRef<number>(initialTableState.tablePageSize.current);
  const tableState = useRef<TableTypes>(initialTableState.tableState.current);
  const tableSort = useRef<SortingRule<TableSortType>[]>(
    initialTableState.tableSort.current
  );

  // Reset the state to their inital state in the abscence of isGovTeamRoute
  useEffect(() => {
    if (!isGovTeamRoute) {
      tableQuery.current = initialTableState.tableQuery.current;
      tablePage.current = initialTableState.tablePage.current;
      tablePageSize.current = initialTableState.tablePageSize.current;
      tableState.current = initialTableState.tableState.current;
      tableSort.current = initialTableState.tableSort.current;
    }
  }, [isGovTeamRoute]);

  return (
    // The Provider gives access to the context to its children
    <TableStateContext.Provider
      value={{
        tableQuery,
        tablePage,
        tablePageSize,
        tableState,
        tableSort
      }}
    >
      {children}
    </TableStateContext.Provider>
  );
};

export default TableStateWrapper;
