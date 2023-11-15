import React from 'react';
import { useTranslation } from 'react-i18next';

import HelpText from 'components/shared/HelpText';
import { GovernanceRequestFeedback } from 'queries/types/GovernanceRequestFeedback';
import { GovernanceRequestFeedbackType } from 'types/graphql-global-types';
import { formatDateLocal, parseAsUTC } from 'utils/date';

type GRTFeedbackViewProps = {
  grtFeedbacks: GovernanceRequestFeedback[];
};

const GRTFeedbackView = ({ grtFeedbacks }: GRTFeedbackViewProps) => {
  const { t } = useTranslation('businessCase');

  const feedbacksForGRB = grtFeedbacks.filter(
    grtFeedback => grtFeedback.type === GovernanceRequestFeedbackType.GRB
  );
  const feedbacksForBusinessOwner = grtFeedbacks.filter(
    grtFeedback => grtFeedback.type === GovernanceRequestFeedbackType.REQUESTER
  );

  const formatGRTFeedback = (feedback: GovernanceRequestFeedback) => {
    const formattedDate = formatDateLocal(feedback.createdAt, 'MMMM d, yyyy');
    return (
      <div className="margin-bottom-3" key={feedback.createdAt}>
        <h4
          className="margin-y-0"
          aria-label={t('grtFeedback.dateSRHelpText', { date: formattedDate })}
        >
          {formattedDate}
        </h4>
        <p className="margin-top-1 line-height-body-3">{feedback.feedback}</p>
      </div>
    );
  };

  return (
    <>
      <h2 className="margin-bottom-3 margin-top-0 font-heading-xl">
        {t('grtFeedback.header')}
      </h2>
      {feedbacksForGRB.length > 0 && (
        <div>
          <h3 className="margin-bottom-1">{t('grtFeedback.grbSubhead')}</h3>
          <HelpText className="margin-bottom-2">
            {t('grtFeedback.grbHelpText')}
          </HelpText>
          {feedbacksForGRB
            .sort(
              (a, b) =>
                parseAsUTC(a.createdAt).toMillis() -
                parseAsUTC(b.createdAt).toMillis()
            )
            .map(grtFeedback => formatGRTFeedback(grtFeedback))}
        </div>
      )}
      {feedbacksForBusinessOwner.length > 0 && (
        <div>
          <h3 className="margin-bottom-1">
            {t('grtFeedback.businessOwnerSubhead')}
          </h3>
          <HelpText className="margin-bottom-2">
            {t('grtFeedback.businessOwnerHelpText')}
          </HelpText>
          {feedbacksForBusinessOwner
            .sort(
              (a, b) =>
                parseAsUTC(a.createdAt).toMillis() -
                parseAsUTC(b.createdAt).toMillis()
            )
            .map(grtFeedback => formatGRTFeedback(grtFeedback))}
        </div>
      )}
    </>
  );
};

export default GRTFeedbackView;
