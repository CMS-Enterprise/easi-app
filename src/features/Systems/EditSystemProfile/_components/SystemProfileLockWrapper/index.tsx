import React, { useEffect, useMemo, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import {
  useLockSystemProfileSectionMutation,
  useUnlockSystemProfileSectionMutation
} from 'gql/generated/graphql';
import { AppState } from 'stores/reducers/rootReducer';

import { useSystemSectionLockContext } from 'contexts/SystemSectionLockContext';
import { SystemProfileSection } from 'types/systemProfile';

import { systemProfileSectionIsLockable } from '../../util';

type SystemProfileLockWrapperProps = {
  children: React.ReactNode;
};

/**
 * Wrapper component for system profile section routes that handles automatic locking/unlocking.
 *
 * Checks lock status, automatically locks sections on navigation, and unlocks when navigating away.
 */
const SystemProfileLockWrapper = ({
  children
}: SystemProfileLockWrapperProps) => {
  const { systemId, section } = useParams<{
    systemId: string;
    section?: SystemProfileSection;
  }>();
  const { pathname } = useLocation();
  const history = useHistory();

  const { euaId } = useSelector((state: AppState) => state.auth);

  const { systemProfileSectionLocks, loading: locksLoading } =
    useSystemSectionLockContext();

  const [lockSection, { loading: lockLoading }] =
    useLockSystemProfileSectionMutation();

  const [unlockSection, { loading: unlockLoading }] =
    useUnlockSystemProfileSectionMutation();

  const loading = useMemo(() => {
    return lockLoading || unlockLoading || locksLoading;
  }, [lockLoading, unlockLoading, locksLoading]);

  // Track previous pathname to detect navigation changes
  const prevSectionRef = useRef<SystemProfileSection | undefined>(section);

  const currentSectionIsLockable = systemProfileSectionIsLockable(section);

  const lockedRedirectPath = systemId
    ? `/systems/${systemId}/edit/locked`
    : undefined;

  /** Returns true if the current section is locked by another user */
  const isLockedByAnotherUser = useMemo(() => {
    if (!currentSectionIsLockable || loading) {
      return false;
    }

    const sectionLock = systemProfileSectionLocks.find(
      lock => lock.section === section
    );

    return sectionLock?.lockedByUserAccount.username !== euaId;
  }, [
    section,
    currentSectionIsLockable,
    systemProfileSectionLocks,
    euaId,
    loading
  ]);

  // Handle automatic locking/unlocking on navigation
  useEffect(() => {
    const prevSection = prevSectionRef.current;
    const prevSectionIsLockable = systemProfileSectionIsLockable(prevSection);

    // Only process if pathname actually changed
    if (loading || prevSection === section) {
      return;
    }

    // Update previous pathname ref
    prevSectionRef.current = section;

    // Unlock previous section if navigating away from a lockable section
    if (prevSectionIsLockable) {
      const prevLock = systemProfileSectionLocks.find(
        lock =>
          lock.section === prevSection &&
          lock.lockedByUserAccount.username === euaId
      );

      if (prevLock && systemId) {
        unlockSection({
          variables: {
            cedarSystemId: systemId,
            section: prevSection
          }
        }).catch(error => {
          // Non-blocking: log and move on
          // eslint-disable-next-line no-console
          console.error('Error: Failed to unlock system profile section', {
            error,
            section: prevSection
          });
        });
      }
    }

    // Lock current section if navigating to a lockable section
    if (
      currentSectionIsLockable &&
      !isLockedByAnotherUser &&
      lockedRedirectPath
    ) {
      lockSection({
        variables: {
          cedarSystemId: systemId!,
          section
        }
      }).catch(() => {
        history.replace(lockedRedirectPath, {
          section,
          error: true
        });
      });
    }
  }, [
    section,
    currentSectionIsLockable,
    systemProfileSectionLocks,
    euaId,
    systemId,
    isLockedByAnotherUser,
    lockSection,
    unlockSection,
    history,
    loading,
    lockedRedirectPath
  ]);

  // Redirect if section is locked by another user
  useEffect(() => {
    if (
      isLockedByAnotherUser &&
      lockedRedirectPath &&
      pathname !== lockedRedirectPath
    ) {
      history.replace(lockedRedirectPath, {
        section,
        error: false
      });
    }
  }, [isLockedByAnotherUser, section, lockedRedirectPath, pathname, history]);

  return <>{children}</>;
};

export default SystemProfileLockWrapper;
