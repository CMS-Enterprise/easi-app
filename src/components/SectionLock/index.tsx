import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { AppState } from 'stores/reducers/rootReducer';

import { AvatarCircle } from 'components/Avatar/Avatar';
import { LockSectionType } from 'types/systemProfile';

type SectionLockProps = {
  sectionLock?: LockSectionType | null;
};

/**
 * Component that displays the lock state of a section of system profile.
 *
 * Does not render if `sectionLock` prop is not provided.
 */
const SectionLock = ({ sectionLock }: SectionLockProps) => {
  const { t } = useTranslation('systemProfile');

  const { euaId } = useSelector((state: AppState) => state.auth);

  // If current section lock is not found, return null
  if (!sectionLock) {
    return null;
  }

  // Determine if the section is self-locked by the current user
  const selfLocked = sectionLock.lockedByUserAccount.username === euaId;

  return (
    <>
      {sectionLock.lockedByUserAccount && (
        <div className="display-inline-flex flex-align-center">
          <AvatarCircle
            user={sectionLock.lockedByUserAccount.commonName}
            className="margin-right-1"
          />

          <span className="text-base-dark">
            {selfLocked
              ? t('editSystemProfile.selfLocked')
              : t('editSystemProfile.locked')}
          </span>
        </div>
      )}
    </>
  );
};

export default SectionLock;
