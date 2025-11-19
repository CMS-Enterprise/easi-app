/**
 * Subscription wrapper and context for fetching and updating system profile section lock states.
 * SubscriptionContext gets modified based on the addition or removal of a locked system profile section.
 * SubscriptionContext can be accessed from anywhere in the edit system profile form.
 */

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react';
import { useLocation, useParams } from 'react-router-dom';
import {
  LockChangeType,
  OnSystemProfileLockStatusChangedDocument,
  OnSystemProfileLockStatusChangedSubscription,
  useGetSystemProfileSectionLocksLazyQuery
} from 'gql/generated/graphql';

import { LockSectionType } from 'types/systemProfile';

type SystemSectionLockContextType = {
  systemProfileSectionLocks: LockSectionType[];
  loading: boolean;
};

type SystemSectionLockContextProviderProps = {
  children: React.ReactNode;
};

/**
 * Updates context on the addition of lock
 * @param locksToUpdate The current locks in the context
 * @param lockSection The lock to add
 */
export const addLockedSection = (
  locksToUpdate: LockSectionType[] = [],
  lockSection: LockSectionType
): LockSectionType[] => {
  const updatedLocks: LockSectionType[] = [...locksToUpdate];

  // Finds the lock index from the context array
  const foundSectionIndex: number = locksToUpdate.findIndex(
    (section: LockSectionType) => section.section === lockSection.section
  );

  // If the lock exists, replace the lock object
  if (foundSectionIndex !== -1) {
    updatedLocks[foundSectionIndex] = lockSection;
    // Otherwise add the lock object to the context array
  } else {
    updatedLocks.push(lockSection);
  }

  return updatedLocks;
};

/**
 * Updates context on the removal of lock
 * @param locksToUpdate The current locks in the context
 * @param lockSection The lock to remove
 */
export const removeLockedSection = (
  locksToUpdate: LockSectionType[] = [],
  lockSection: LockSectionType
): LockSectionType[] => {
  const updatedLocks: LockSectionType[] = [...locksToUpdate];

  // Finds and removes the locked object from the context array
  const foundIndex = updatedLocks.findIndex(
    (section: LockSectionType) => section.section === lockSection.section
  );

  if (foundIndex !== -1) {
    updatedLocks.splice(foundIndex, 1);
  }

  return updatedLocks;
};

/**
 * Create the subscription context - can be used anywhere in edit system profile
 */
export const SystemSectionLockContext =
  createContext<SystemSectionLockContextType>({
    systemProfileSectionLocks: [],
    loading: true
  });

/**
 * Hook to access the system section lock context
 */
export const useSystemSectionLockContext = (): SystemSectionLockContextType =>
  useContext(SystemSectionLockContext);

/**
 * Provider for the system section lock context
 */
const SystemSectionLockContextProvider = ({
  children
}: SystemSectionLockContextProviderProps) => {
  const { systemId } = useParams<{ systemId: string }>();
  const { pathname } = useLocation();

  const [lockStatuses, setLockStatuses] = useState<LockSectionType[]>([]);

  const [loading, setLoading] = useState<boolean>(true);

  // useLazyQuery hook to initialize query and create subscription
  const [getSystemProfileLocks, { data: queryData, subscribeToMore }] =
    useGetSystemProfileSectionLocksLazyQuery();

  /**
   * Holds reference to subscribeToMore for closing websocket connection
   *
   * Returns null when not subscribed
   */
  const subscribedRef = React.useRef<ReturnType<typeof subscribeToMore> | null>(
    null
  );

  /** Only subscribe when on edit system profile routes */
  const shouldFetchLocks: boolean = useMemo(
    () =>
      systemId !== undefined && pathname.includes(`/systems/${systemId}/edit`),
    [systemId, pathname]
  );

  // Update lock statuses when query data is available
  useEffect(() => {
    if (queryData?.systemProfileSectionLocks) {
      setLockStatuses(queryData.systemProfileSectionLocks);
      setLoading(false);
    }
  }, [queryData]);

  useEffect(() => {
    if (shouldFetchLocks) {
      // Fetch existing lock statuses on mount or when systemId changes
      getSystemProfileLocks({ variables: { cedarSystemId: systemId } });

      // Set up subscription if not already subscribed
      if (!subscribedRef.current) {
        subscribedRef.current = subscribeToMore({
          document: OnSystemProfileLockStatusChangedDocument,
          variables: {
            cedarSystemId: systemId
          },
          updateQuery: (
            prev,
            {
              subscriptionData: { data }
            }: {
              subscriptionData: {
                data: OnSystemProfileLockStatusChangedSubscription;
              };
            }
          ) => {
            if (!data) return prev;

            const lockChange = data.onSystemProfileSectionLockStatusChanged;

            // Update lock statuses based on change type
            const updatedLocks =
              lockChange.changeType === LockChangeType.REMOVED
                ? // If section lock is to be freed, remove the lock from the context
                  removeLockedSection(
                    prev.systemProfileSectionLocks,
                    lockChange.lockStatus
                  )
                : // If section lock is to be added/updated, add/update the lock in the context
                  addLockedSection(
                    prev.systemProfileSectionLocks,
                    lockChange.lockStatus
                  );

            // Update state to trigger re-renders in consumers
            setLockStatuses(updatedLocks);
            setLoading(false);

            // Return the formatted locks to be used as the next 'prev' parameter of updateQuery
            return {
              ...prev,
              systemProfileSectionLocks: updatedLocks,
              loading: false
            };
          }
        });
      }
    } else {
      // Unsubscribe from GraphQL Subscription when navigating away
      // Invoking the reference to subscribeToMore will close the websocket connection
      if (subscribedRef.current) {
        subscribedRef.current();
        subscribedRef.current = null;
      }
      // Reset state when not on edit system profile routes
      setLockStatuses([]);
      setLoading(true);
    }
  }, [systemId, shouldFetchLocks, getSystemProfileLocks, subscribeToMore]);

  // Cleanup subscription on unmount
  useEffect(() => {
    return () => {
      if (subscribedRef.current) {
        subscribedRef.current();
        subscribedRef.current = null;
      }
    };
  }, []);

  return (
    <SystemSectionLockContext.Provider
      value={{
        systemProfileSectionLocks: lockStatuses,
        loading
      }}
    >
      {children}
    </SystemSectionLockContext.Provider>
  );
};

export default SystemSectionLockContextProvider;
