import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation, useParams } from 'react-router-dom';

import { AvatarCircle } from 'components/Avatar/Avatar';
import MainContent from 'components/MainContent';
import PageHeading from 'components/PageHeading';
import { useSystemSectionLockContext } from 'contexts/SystemSectionLockContext';

import { getLockableSectionFromRoute } from '../../util';

type LockedSectionLocationState = {
  section?: string;
  error?: boolean;
};

/**
 * Component displayed when a user attempts to access a system profile section that is locked by another user.
 */
const LockedSystemProfileSection = () => {
  const { t } = useTranslation('systemProfile');
  const { systemId } = useParams<{ systemId: string }>();
  const location = useLocation<LockedSectionLocationState>();
  const { systemProfileSectionLocks } = useSystemSectionLockContext();

  const routeSegment = location.state?.section;
  const section = routeSegment
    ? getLockableSectionFromRoute(routeSegment)
    : null;

  // Find the lock for this section
  const sectionLock = section
    ? systemProfileSectionLocks.find(lock => lock.section === section)
    : null;

  const hasError = location.state?.error;

  return (
    <MainContent className="grid-container">
      <div className="margin-y-7">
        {hasError ? (
          <>
            <PageHeading className="margin-bottom-2" data-testid="page-error">
              {t('editSystemProfile.lockErrorHeading')}
            </PageHeading>
            <p>{t('editSystemProfile.lockErrorInfo')}</p>
          </>
        ) : (
          <>
            <PageHeading className="margin-bottom-2" data-testid="page-locked">
              {t('editSystemProfile.lockedHeading')}
            </PageHeading>
            <p>{t('editSystemProfile.lockedSubheading')}</p>

            {sectionLock && sectionLock.lockedByUserAccount && (
              <div className="display-flex flex-align-center margin-top-3">
                <AvatarCircle
                  user={sectionLock.lockedByUserAccount.commonName}
                  className="margin-right-2"
                />
                <div>
                  <p className="margin-0 text-bold">
                    {t('editSystemProfile.lockedBy', {
                      name: sectionLock.lockedByUserAccount.commonName
                    })}
                  </p>
                </div>
              </div>
            )}
          </>
        )}

        <Link
          to={`/systems/${systemId}/edit`}
          className="usa-button margin-top-6"
        >
          {t('editSystemProfile.returnToSystemProfile')}
        </Link>
      </div>
    </MainContent>
  );
};

export default LockedSystemProfileSection;
