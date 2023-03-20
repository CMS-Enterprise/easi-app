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

type ITGovTableState = {
  state: Pick<TableState, 'pageIndex' | 'globalFilter' | 'sortBy' | 'pageSize'>;
  activeTableState: TableTypes;
};

type ITGovRefType = MutableRefObject<ITGovTableState>;

// Making extensible here for future table implementations
export type TableStatesTypes = ITGovRefType;

const initialTableState: Record<string, TableStatesTypes> = {
  itGovAdmin: {
    current: {
      state: {
        pageIndex: 0,
        globalFilter: '',
        sortBy: [{ desc: true, id: 'submittedAt' }],
        pageSize: 50
      },
      activeTableState: 'open'
    }
  }
};

// Create the table state context - fetched from IT gov table
export const TableStateContext = createContext<
  Record<string, TableStatesTypes>
>(initialTableState);

const TableStateWrapper = ({ children }: TableStateWrapperProps) => {
  // Checks to see if the current route is a part of IT Gov or home
  const { pathname } = useLocation();

  const routeParams: string[] = pathname.split('/');

  const isGovTeamRoute: boolean =
    routeParams[1] === 'governance-review-team' || pathname === '/';

  const itGovAdmin = useRef<ITGovTableState>(
    initialTableState.itGovAdmin.current
  );

  // Reset the state to their inital state in the abscence of isGovTeamRoute
  useEffect(() => {
    if (!isGovTeamRoute) {
      itGovAdmin.current = initialTableState.itGovAdmin.current;
    }
  }, [isGovTeamRoute]);

  return (
    // The Provider gives access to the context to its children
    <TableStateContext.Provider value={{ itGovAdmin }}>
      {children}
    </TableStateContext.Provider>
  );
};

export default TableStateWrapper;
