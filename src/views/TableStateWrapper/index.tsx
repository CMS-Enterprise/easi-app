/*
Context wrapper for getting and setting table states
*/

import React, { createContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

type TableStateWrapperProps = {
  children: React.ReactNode;
};

export type TableTypes = 'open' | 'closed';

type TableStateType = {
  state: TableTypes;
  pageIndex: number;
};

type TableStateContextType = {
  tableQuery: string;
  tableState: TableStateType;
  setTableState: React.Dispatch<React.SetStateAction<TableStateType>>;
  setTableQuery: React.Dispatch<React.SetStateAction<string>>;
};

// Create the table state context - fetched from IT gov table
export const TableStateContext = createContext<TableStateContextType>({
  tableQuery: '',
  tableState: {
    state: 'open',
    pageIndex: 0
  },
  setTableState: () => null,
  setTableQuery: () => null
});

const initialTableState: TableStateType = {
  state: 'open',
  pageIndex: 0
};

const TableStateWrapper = ({ children }: TableStateWrapperProps) => {
  // Checks to see if the current route is a part of IT Gov or home
  const { pathname } = useLocation();

  const routeParams: string[] = pathname.split('/');

  const isGovTeamRoute: boolean =
    routeParams[1] === 'governance-review-team' || pathname === '/';

  const [tableState, setTableState] = useState<TableStateType>(
    initialTableState
  );

  const [tableQuery, setTableQuery] = useState<string>('');

  useEffect(() => {
    if (!isGovTeamRoute) {
      setTableState(initialTableState);
      setTableQuery('');
    }
  }, [isGovTeamRoute]);

  return (
    // The Provider gives access to the context to its children
    <TableStateContext.Provider
      value={{
        tableState,
        tableQuery,
        setTableQuery,
        setTableState
      }}
    >
      {children}
    </TableStateContext.Provider>
  );
};

export default TableStateWrapper;
