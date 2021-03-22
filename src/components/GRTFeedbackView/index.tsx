import React from 'react';
import { DateTime } from 'luxon';
// eslint-disable-next-line camelcase
import { GetGRTFeedback_grtFeedbacks } from 'queries/types/GetGRTFeedback';

import HelpText from 'components/shared/HelpText';

type GRTFeedbackViewProps = {
  // eslint-disable-next-line camelcase
  grtFeedbacks: GetGRTFeedback_grtFeedbacks[];
};

const GRTFeedbackView = ({ grtFeedbacks }: GRTFeedbackViewProps) => {
  return (
    <>
      <h2 className="margin-bottom-3 margin-top-0">Recommendations</h2>
      {grtFeedbacks.some(grtFeedback => grtFeedback.feedbackType === 'GRB') && (
        <div>
          <h3 className="margin-bottom-1">GRT recommendations to the GRB</h3>
          <HelpText className="margin-bottom-2">
            These are the Governance Review Team recommendations for the
            Governance Review Board.
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
            GRT recommendations to the Business Owner
          </h3>
          <HelpText className="margin-bottom-2">
            These are the Governance Review Team recommendations for the
            Business Owner.
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
