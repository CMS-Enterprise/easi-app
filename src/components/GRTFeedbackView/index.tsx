import React from 'react';
import { useTranslation } from 'react-i18next';
import { DateTime } from 'luxon';
import { GetGRTFeedback_grtFeedbacks as GRTFeedback } from 'queries/types/GetGRTFeedback';

import HelpText from 'components/shared/HelpText';

type GRTFeedbackViewProps = {
  grtFeedbacks: GRTFeedback[];
};

const GRTFeedbackView = ({ grtFeedbacks }: GRTFeedbackViewProps) => {
  const { t } = useTranslation('businessCase');

  return (
    <>
      <h2 className="margin-bottom-3 margin-top-0">
        {t('grtFeedback.header')}
      </h2>
      {grtFeedbacks.some(grtFeedback => grtFeedback.feedbackType === 'GRB') && (
        <div>
          <h3 className="margin-bottom-1">{t('grtFeedback.grbSubhead')}</h3>
          <HelpText className="margin-bottom-2">
            {t('grtFeedback.grbHelpText')}
          </HelpText>
          {grtFeedbacks
            .filter(grtFeedback => grtFeedback.feedbackType === 'GRB')
            .sort(
              (a, b) =>
                DateTime.fromISO(a.createdAt).toMillis() -
                DateTime.fromISO(b.createdAt).toMillis()
            )
            .map(grtFeedback => {
              return (
                <div>
                  <div className="text-bold">
                    {DateTime.fromISO(grtFeedback.createdAt).toLocaleString(
                      DateTime.DATE_MED
                    )}
                  </div>
                  <p className="margin-bottom-3 margin-top-1 line-height-body-3">
                    {grtFeedback.feedback}
                  </p>
                </div>
              );
            })}
        </div>
      )}
      {grtFeedbacks.some(
        grtFeedback => grtFeedback.feedbackType === 'BUSINESS_OWNER'
      ) && (
        <div>
          <h3 className="margin-bottom-1">
            {t('grtFeedback.businessOwnerSubhead')}
          </h3>
          <HelpText className="margin-bottom-2">
            {t('grtFeedback.businessOwnerHelpText')}
          </HelpText>
          {grtFeedbacks
            .filter(
              grtFeedback => grtFeedback.feedbackType === 'BUSINESS_OWNER'
            )
            .sort(
              (a, b) =>
                DateTime.fromISO(a.createdAt).toMillis() -
                DateTime.fromISO(b.createdAt).toMillis()
            )
            .map(grtFeedback => {
              return (
                <div>
                  <div className="text-bold">
                    {DateTime.fromISO(grtFeedback.createdAt).toLocaleString(
                      DateTime.DATE_MED
                    )}
                  </div>
                  <p className="margin-bottom-3 margin-top-1 line-height-body-3">
                    {grtFeedback.feedback}
                  </p>
                </div>
              );
            })}
        </div>
      )}
    </>
  );
};

export default GRTFeedbackView;
