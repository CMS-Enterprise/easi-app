/**
 * Subscription wrapper and context for fetching and updating system profile section lock states.
 * SubscriptionContext gets modified based on the addition or removal of a locked system profile section.
 * SubscriptionContext can be accessed from anywhere in the edit system profile form.
 */

import React, { createContext, useContext, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
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
const addLockedSection = (
  locksToUpdate: LockSectionType[] = [],
  lockSection: LockSectionType
): LockSectionType[] => {
  const existingIndex = locksToUpdate.findIndex(
    ({ section }) => section === lockSection.section
  );

  if (existingIndex !== -1) {
    // Replace existing lock
    return locksToUpdate.map((section, index) =>
      index === existingIndex ? lockSection : section
    );
  }

  // Add new lock
  return [...locksToUpdate, lockSection];
};

/**
 * Updates context on the removal of lock
 * @param locksToUpdate The current locks in the context
 * @param lockSection The lock to remove
 */
const removeLockedSection = (
  locksToUpdate: LockSectionType[] = [],
  lockSection: LockSectionType
): LockSectionType[] =>
  locksToUpdate.filter(({ section }) => section !== lockSection.section);

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

  // useLazyQuery hook to initialize query and create subscription
  const [getSystemProfileLocks, { data, loading, subscribeToMore }] =
    useGetSystemProfileSectionLocksLazyQuery();

  /**
   * Holds reference to subscribeToMore for closing websocket connection
   *
   * Returns null when not subscribed
   */
  const subscribedRef = React.useRef<ReturnType<typeof subscribeToMore> | null>(
    null
  );

  // Derive context value from query data
  const contextValue = useMemo<SystemSectionLockContextType>(() => {
    return {
      systemProfileSectionLocks: data?.systemProfileSectionLocks ?? [],
      loading
    };
  }, [data, loading]);

  useEffect(() => {
    // Only fetch and subscribe if systemId is available
    if (!systemId) {
      return;
    }

    // Unsubscribe from previous subscription if systemId changed
    if (subscribedRef.current) {
      subscribedRef.current();
      subscribedRef.current = null;
    }

    // Fetch existing lock statuses on mount or when systemId changes
    getSystemProfileLocks({ variables: { cedarSystemId: systemId } });

    // Set up subscription for the current systemId
    subscribedRef.current = subscribeToMore({
      document: OnSystemProfileLockStatusChangedDocument,
      variables: {
        cedarSystemId: systemId
      },
      updateQuery: (
        prev,
        {
          subscriptionData: { data: subscriptionData }
        }: {
          subscriptionData: {
            data: OnSystemProfileLockStatusChangedSubscription;
          };
        }
      ) => {
        if (!subscriptionData) return prev;

        const { changeType, lockStatus } =
          subscriptionData.onSystemProfileSectionLockStatusChanged;

        // Update lock statuses based on change type
        const updatedLocks =
          changeType === LockChangeType.REMOVED
            ? removeLockedSection(prev.systemProfileSectionLocks, lockStatus)
            : addLockedSection(prev.systemProfileSectionLocks, lockStatus);

        return {
          ...prev,
          systemProfileSectionLocks: updatedLocks
        };
      }
    });
  }, [systemId, getSystemProfileLocks, subscribeToMore]);

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
    <SystemSectionLockContext.Provider value={contextValue}>
      {children}
    </SystemSectionLockContext.Provider>
  );
};

export default SystemSectionLockContextProvider;
