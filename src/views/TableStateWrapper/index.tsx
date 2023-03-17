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
import { TableState } from 'react-table';

type TableStateWrapperProps = {
  children: React.ReactNode;
};

export type TableTypes = 'open' | 'closed';

export type TableSortType = {
  desc: boolean;
  id: string;
};

type TableStateContextType = {
  tableState: MutableRefObject<Partial<TableState>>;
  activeTableState: MutableRefObject<TableTypes>;
};

const initialTableState: TableStateContextType = {
  tableState: {
    current: {
      pageIndex: 0,
      globalFilter: '',
      sortBy: [{ desc: true, id: 'submittedAt' }],
      pageSize: 50
    }
  },
  activeTableState: {
    current: 'open'
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

  const tableState = useRef<Partial<TableState>>(
    initialTableState.tableState.current
  );
  const activeTableState = useRef<TableTypes>(
    initialTableState.activeTableState.current
  );

  // Reset the state to their inital state in the abscence of isGovTeamRoute
  useEffect(() => {
    if (!isGovTeamRoute) {
      tableState.current = initialTableState.tableState.current;
      activeTableState.current = initialTableState.activeTableState.current;
    }
  }, [isGovTeamRoute]);

  return (
    // The Provider gives access to the context to its children
    <TableStateContext.Provider
      value={{
        tableState,
        activeTableState
      }}
    >
      {children}
    </TableStateContext.Provider>
  );
};

export default TableStateWrapper;
