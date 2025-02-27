import React from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import classNames from 'classnames';

import UswdsReactLink from 'components/LinkWrapper';
import { SubpageKey } from 'types/systemProfile';
import { formatDateLocal } from 'utils/date';

type EditPageCalloutProps = {
  modifiedAt?: string | null;
  className?: string;
};

/**
 * Edit page callout for system profile admin sidebar
 *
 * Uses subinfo url param to get page name, and links to `/systems/:systemId/:subinfo/edit`
 */
const EditPageCallout = ({ modifiedAt, className }: EditPageCalloutProps) => {
  const { t } = useTranslation('systemProfile');

  const { subinfo, systemId } = useParams<{
    systemId: string;
    subinfo: SubpageKey;
  }>();

  // TODO: logic to display "Just now" text
  const lastUpdatedText = modifiedAt
    ? formatDateLocal(modifiedAt, 'MM/dd/yyyy')
    : 'Never';

  return (
    <div className={classNames('bg-warning-lighter padding-2', className)}>
      <h4 className="margin-y-0">{t('singleSystem.editPage.heading')}</h4>

      {
        // TODO: Remove conditional rendering when system modifiedAt field is implemented
        modifiedAt && (
          <p className="margin-top-1 margin-bottom-05 text-base-dark">
            {t('singleSystem.editPage.lastUpdated', {
              lastUpdatedText,
              interpolation: { escapeValue: false }
            })}
          </p>
        )
      }

      <UswdsReactLink
        to={`/systems/${systemId}/${subinfo}/edit`}
        className="usa-button usa-button--outline margin-top-2"
      >
        {t('singleSystem.editPage.buttonLabel', { page: subinfo })}
      </UswdsReactLink>
    </div>
  );
};

export default EditPageCallout;
