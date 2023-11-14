import React from 'react';
import { useTranslation } from 'react-i18next';
import { Grid } from '@trussworks/react-uswds';

import { GovernanceRequestFeedback } from 'queries/types/GovernanceRequestFeedback';
import { GovernanceRequestFeedbackTargetForm } from 'types/graphql-global-types';
import { formatDateLocal } from 'utils/date';

const FeedbackItem = ({
  targetForm,
  type,
  createdAt,
  author,
  feedback
}: GovernanceRequestFeedback) => {
  const { t } = useTranslation('taskList');

  return (
    <li className="border-top-1px border-base-light margin-bottom-4">
      <h3 className="margin-top-4">
        {targetForm !== GovernanceRequestFeedbackTargetForm.NO_TARGET_PROVIDED
          ? t('feedbackV2.feedbackTitleEditsRequested')
          : t('feedbackV2.feedbackTitle', { context: type })}
      </h3>

      <dl className="grid-row">
        <Grid col={6}>
          <dt className="text-bold margin-bottom-1">{t('feedbackV2.date')}</dt>
          <dd className="margin-x-0">
            {formatDateLocal(createdAt, 'MMMM d, yyyy')}
          </dd>
        </Grid>
        <Grid col={6}>
          <dt className="text-bold margin-bottom-1">{t('feedbackV2.from')}</dt>
          <dd className="margin-x-0">
            {t('feedbackV2.author', { name: author.commonName })}
          </dd>
        </Grid>
        <div className="bg-base-lightest width-full margin-top-3 padding-3">
          {targetForm !==
            GovernanceRequestFeedbackTargetForm.NO_TARGET_PROVIDED && (
            <dl className="margin-y-0" data-testid="target-form">
              <dt className="text-bold margin-top-0 margin-bottom-1">
                {t('feedbackV2.editsRequestedFor')}
              </dt>
              <dd className="margin-top-1 margin-bottom-4 margin-x-0">
                {t(`feedbackV2.targetForm.${targetForm}`)}
              </dd>
            </dl>
          )}
          <p className="margin-y-0">{feedback}</p>
        </div>
      </dl>
    </li>
  );
};

export default FeedbackItem;
