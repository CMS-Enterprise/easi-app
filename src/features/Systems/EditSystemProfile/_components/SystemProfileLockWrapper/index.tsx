import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { Redirect, useHistory, useLocation, useParams } from 'react-router-dom';
import {
  SystemProfileLockableSection,
  useLockSystemProfileSectionMutation,
  useUnlockSystemProfileSectionMutation
} from 'gql/generated/graphql';
import { AppState } from 'stores/reducers/rootReducer';

import { useSystemSectionLockContext } from 'contexts/SystemSectionLockContext';
import { LockSectionType } from 'types/systemProfile';

import { getLockableSectionFromRoute } from '../../util';

type SystemProfileLockWrapperProps = {
  children: React.ReactNode;
};

export enum LockStatus {
  LOCKED = 'LOCKED',
  UNLOCKED = 'UNLOCKED',
  OCCUPYING = 'OCCUPYING',
  CANT_LOCK = 'CANT_LOCK'
}

/**
 * Determines the lock status of a section for the current user
 */
const findLockStatus = (
  locks: LockSectionType[],
  section: SystemProfileLockableSection,
  euaId?: string
): LockStatus => {
  const foundLock = locks.find(lock => lock.section === section);

  // If no lock found, section is unlocked
  if (!foundLock) {
    return LockStatus.UNLOCKED;
  }

  // If locked by another user, section is locked
  if (foundLock.lockedByUserAccount.username !== euaId) {
    return LockStatus.LOCKED;
  }

  // User currently has the lock
  return LockStatus.OCCUPYING;
};

/**
 * Extracts the route segment from the full pathname
 */
const extractRouteSegment = (pathname: string): string | null => {
  const parts = pathname.split('/');
  const editIndex = parts.indexOf('edit');

  // Should be: /systems/:systemId/edit/:section
  if (editIndex !== -1 && parts[editIndex + 1]) {
    return parts[editIndex + 1];
  }

  return null;
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
    section?: string;
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

  // Track previous pathname to detect navigation changes
  const prevPathnameRef = useRef<string>(pathname);

  const currentSection = getLockableSectionFromRoute(section);

  // Determine lock status
  let lockState: LockStatus = LockStatus.CANT_LOCK;

  if (
    currentSection &&
    systemProfileSectionLocks &&
    euaId &&
    !lockLoading &&
    !unlockLoading &&
    !locksLoading
  ) {
    lockState = findLockStatus(
      systemProfileSectionLocks,
      currentSection,
      euaId
    );
  }

  // Handle automatic locking/unlocking on navigation
  useEffect(() => {
    const prevPathname = prevPathnameRef.current;
    const prevRouteSegment = extractRouteSegment(prevPathname);
    const prevSection = getLockableSectionFromRoute(prevRouteSegment);

    // Only process if pathname actually changed
    if (prevPathname === pathname) {
      return;
    }

    // Update previous pathname ref
    prevPathnameRef.current = pathname;

    // Unlock previous section if navigating away from a lockable section
    if (prevSection) {
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
        }).catch(() => {
          // Error handling: navigation will be handled by error state if needed
        });
      }
    }

    // Lock current section if navigating to a lockable section
    if (
      currentSection &&
      lockState === LockStatus.UNLOCKED &&
      systemId &&
      !lockLoading &&
      !unlockLoading &&
      !locksLoading
    ) {
      lockSection({
        variables: {
          cedarSystemId: systemId,
          section: currentSection
        }
      }).catch(() => {
        history.replace(`/systems/${systemId}/edit/locked`, {
          section,
          error: true
        });
      });
    }
  }, [
    pathname,
    section,
    currentSection,
    systemProfileSectionLocks,
    euaId,
    systemId,
    lockState,
    lockSection,
    unlockSection,
    lockLoading,
    unlockLoading,
    locksLoading,
    history
  ]);

  // Redirect if section is locked by another user
  if (lockState === LockStatus.LOCKED && currentSection && systemId) {
    return (
      <Redirect
        to={{
          pathname: `/systems/${systemId}/edit/locked`,
          state: { section: currentSection, error: false }
        }}
      />
    );
  }

  return <>{children}</>;
};

export default SystemProfileLockWrapper;
