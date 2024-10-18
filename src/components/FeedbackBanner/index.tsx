import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import { GridContainer, Icon } from '@trussworks/react-uswds';
import classNames from 'classnames';

import './index.scss';

type FeedbackBannerProps = {
  /** Type of form edits were requested on - used for feedback text */
  type: 'Intake Request' | 'Draft Business Case' | 'Final Business Case';
  id: string;
  className?: string;
};

/**
 * Feedback banner to display on Intake Request, Draft Business Case,
 * and Final Business Case forms when edits have been requested
 */
const FeedbackBanner = ({ type, id, className }: FeedbackBannerProps) => {
  const { t } = useTranslation('intake');
  const { pathname } = useLocation();

  return (
    <div
      className={classNames(
        'system-intake__feedback-banner bg-error-lighter padding-y-2',
        className
      )}
    >
      <GridContainer
        // TODO EASI-3085: Remove horizontal padding class for v2 form layout
        className="padding-x-2"
      >
        <p className="margin-top-0 margin-bottom-2 display-flex line-height-body-5">
          <Icon.Warning className="text-error-dark margin-right-1" size={3} />
          {t('feedback', { type })}
        </p>
        <Link
          to={{
            pathname: `/governance-task-list/${id}/feedback`,
            state: { form: { pathname, type } }
          }}
          className="usa-button usa-button--outline"
        >
          {t('viewFeedback')}
        </Link>
      </GridContainer>
    </div>
  );
};

export default FeedbackBanner;
