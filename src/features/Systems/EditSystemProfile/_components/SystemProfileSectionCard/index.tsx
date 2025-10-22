import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router-dom';
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Icon
} from '@trussworks/react-uswds';
import classNames from 'classnames';
import { SystemProfileSectionLockStatus } from 'gql/generated/graphql';
import { useFlags } from 'launchdarkly-react-client-sdk';

import PercentCompleteTag from 'components/PercentCompleteTag';
import SectionLock from 'components/SectionLock';
import { SystemProfileSection } from 'types/systemProfile';

import { getSystemProfileSectionMap } from '../../util';
import ExternalDataTag from '../ExternalDataTag';

import './index.scss';

type SystemProfileSectionCardProps = {
  section: SystemProfileSection;
  percentComplete?: number;
  hasPendingChanges?: boolean;
  isManagedExternally?: boolean;
  hasExternalData?: boolean;
  readOnly?: boolean;
};

/**
 * Displays information about a system profile section with view/edit button
 */
const SystemProfileSectionCard = ({
  section,
  percentComplete,
  hasPendingChanges,
  isManagedExternally,
  hasExternalData,
  readOnly
}: SystemProfileSectionCardProps) => {
  const { t } = useTranslation('systemProfile');

  const { systemId } = useParams<{
    systemId: string;
  }>();

  const flags = useFlags();
  const sectionMap = getSystemProfileSectionMap(flags);
  const { route } = sectionMap[section];

  // TODO EASI-4984: Update to use actual section lock context
  const lockableSectionLocks = [] as SystemProfileSectionLockStatus[];

  /** Returns lock status if section is locked */
  const sectionLock: SystemProfileSectionLockStatus | undefined =
    lockableSectionLocks?.find(lock => lock.section === section);

  return (
    <Card
      className="tablet:grid-col-6 desktop:grid-col-4"
      containerProps={{ className: 'shadow-2 border-width-1px' }}
      data-testid={`section-card-${section}`}
    >
      {isManagedExternally && (
        <h5 className="text-base-dark bg-base-lightest padding-x-3 margin-0 font-body-xs text-light display-flex flex-align-center">
          <Icon.InfoOutline className="margin-right-05" aria-hidden />
          {t(
            readOnly
              ? 'editSystemProfile.dataManagedExternally'
              : 'editSystemProfile.dataPartiallyManagedExternally'
          )}
        </h5>
      )}

      <CardHeader
        className={classNames(
          'padding-bottom-0',
          isManagedExternally && 'padding-top-105'
        )}
      >
        <h3>{t(`sectionCards.${section}.title`)}</h3>
      </CardHeader>

      <CardBody
        className={classNames(
          'padding-top-05',
          !hasPendingChanges && 'padding-bottom-2'
        )}
      >
        <p className="system-profile-section-card__description">
          {t(`sectionCards.${section}.description`)}
        </p>

        {percentComplete !== undefined && (
          <PercentCompleteTag percentComplete={percentComplete} />
        )}

        {hasExternalData !== undefined && (
          <ExternalDataTag hasExternalData={hasExternalData} />
        )}
      </CardBody>

      <CardFooter>
        {hasPendingChanges && (
          <p className="text-base-dark margin-top-1 margin-bottom-0 display-flex flex-align-center">
            <Icon.Schedule className="margin-right-05" aria-hidden />
            {t('editSystemProfile.sectionHasPendingChanges')}
          </p>
        )}

        {sectionLock ? (
          <SectionLock sectionLock={sectionLock} />
        ) : (
          <Link
            to={`/systems/${systemId}/${route}`}
            className={`usa-button ${
              hasPendingChanges ? 'usa-button--unstyled' : 'usa-button--outline'
            }`}
          >
            {hasPendingChanges || readOnly
              ? t('editSystemProfile.viewSection')
              : t('editSystemProfile.editSection')}
          </Link>
        )}
      </CardFooter>
    </Card>
  );
};

export default SystemProfileSectionCard;
