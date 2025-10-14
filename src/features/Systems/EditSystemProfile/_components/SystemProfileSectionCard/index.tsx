import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Icon
} from '@trussworks/react-uswds';
import classNames from 'classnames';
import { SystemProfileSectionLockStatus } from 'gql/generated/graphql';

import PercentCompleteTag from 'components/PercentCompleteTag';
import SectionLock from 'components/SectionLock';
import {
  systemProfileLockableSectionMap,
  SystemProfileSection
} from 'constants/systemProfile';

type SystemProfileSectionCardProps = {
  section: SystemProfileSection;
  percentComplete?: number;
  hasPendingChanges?: boolean;
  isManagedExternally?: boolean;
  externalDataExists?: boolean;
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
  externalDataExists,
  readOnly
}: SystemProfileSectionCardProps) => {
  const { t } = useTranslation('systemProfile');

  const history = useHistory();

  // TODO EASI-4984: Update to use actual section lock context
  const lockableSectionLocks = [] as SystemProfileSectionLockStatus[];

  /** Returns lock status if section is locked */
  const sectionLock: SystemProfileSectionLockStatus | undefined =
    lockableSectionLocks?.find(lock => lock.section === section);

  // TODO EASI-4984: Update to actual route (ex: systems/id/edit/key)
  const sectionRoute = systemProfileLockableSectionMap[section];

  return (
    <Card
      className="tablet:grid-col-6 desktop:grid-col-4"
      containerProps={{ className: 'shadow-2 border-width-1px' }}
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
        <p>{t(`sectionCards.${section}.description`)}</p>

        {percentComplete && (
          <PercentCompleteTag percentComplete={percentComplete} />
        )}

        {externalDataExists && (
          <span className="display-inline-flex flex-align-center line-height-body-3 padding-y-05 padding-left-1 padding-right-105 bg-base-lighter text-base-darker text-bold">
            <Icon.CheckCircle className="margin-right-1" aria-hidden />
            {t('editSystemProfile.externalDataExists')}
          </span>
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
          <Button
            type="button"
            onClick={() => history.push(sectionRoute)}
            className={
              hasPendingChanges ? 'usa-button--unstyled' : 'usa-button--outline'
            }
          >
            {hasPendingChanges || readOnly
              ? t('editSystemProfile.viewSection')
              : t('editSystemProfile.editSection')}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default SystemProfileSectionCard;
