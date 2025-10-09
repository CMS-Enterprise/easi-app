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

type SystemProfileSectionCardProps = {
  title: string;
  description: string;
  route: string;
  hasPendingChanges?: boolean;
  isManagedExternally?: boolean;
  readOnly?: boolean;
};

/**
 * Displays information about a system profile section with view/edit button
 */
const SystemProfileSectionCard = ({
  title,
  description,
  route,
  hasPendingChanges,
  isManagedExternally,
  readOnly
}: SystemProfileSectionCardProps) => {
  const { t } = useTranslation('systemProfile');

  const history = useHistory();

  return (
    <Card
      className="grid-col-4"
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
        <h3>{title}</h3>
      </CardHeader>

      <CardBody className="padding-top-05">
        <p>{description}</p>
      </CardBody>

      <CardFooter>
        {hasPendingChanges && (
          <p className="text-base-dark margin-top-1 margin-bottom-0 display-flex flex-align-center">
            <Icon.Schedule className="margin-right-05" aria-hidden />
            {t('editSystemProfile.sectionHasPendingChanges')}
          </p>
        )}
        <Button
          type="button"
          onClick={() => history.push(route)}
          className={
            hasPendingChanges ? 'usa-button--unstyled' : 'usa-button--outline'
          }
        >
          {hasPendingChanges || readOnly
            ? t('editSystemProfile.viewSection')
            : t('editSystemProfile.editSection')}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SystemProfileSectionCard;
