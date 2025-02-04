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

export type ReactTableStateType = Pick<
  TableState,
  'pageIndex' | 'globalFilter' | 'sortBy' | 'pageSize'
>;

export type ActiveStateType = 'open' | 'closed';

// React-Table state properties / EASI table properties
interface ITGovTableState {
  state: ReactTableStateType;
  activeTableState: ActiveStateType;
}

// Making extensible here for future table implementations
export interface TableStates extends MutableRefObject<ITGovTableState> {}

const initialTableStates: Record<string, TableStates> = {
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
  },
  trbExistingRequests: {
    current: {
      state: {
        pageIndex: 0,
        globalFilter: '',
        sortBy: [{ desc: true, id: 'consultMeetingTime' }],
        pageSize: 10
      },
      activeTableState: 'open'
    }
  }
};

export const TableStateContext =
  createContext<Record<string, TableStates>>(initialTableStates);

const TableStateWrapper = ({ children }: TableStateWrapperProps) => {
  // Checks to see if the current route is a part of IT Gov or home
  const { pathname } = useLocation();

  const routeParams: string[] = pathname.split('/');

  const isGovTeamRoute: boolean =
    routeParams[1] === 'it-governance' || pathname === '/';

  const itGovAdmin = useRef<ITGovTableState>({
    ...initialTableStates.itGovAdmin.current
  });
  const trbExistingRequests = useRef<ITGovTableState>({
    ...initialTableStates.trbExistingRequests.current
  });

  // Reset the state to their inital state in the abscence of isGovTeamRoute
  useEffect(() => {
    if (!isGovTeamRoute) {
      itGovAdmin.current = { ...initialTableStates.itGovAdmin.current };
    }
  }, [isGovTeamRoute]);

  return (
    // The Provider gives access to the context to its children
    <TableStateContext.Provider value={{ itGovAdmin, trbExistingRequests }}>
      {children}
    </TableStateContext.Provider>
  );
};

export default TableStateWrapper;
