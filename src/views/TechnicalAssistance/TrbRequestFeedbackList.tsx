import React from 'react';
import { useTranslation } from 'react-i18next';
import { Grid } from '@trussworks/react-uswds';

import Divider from 'components/shared/Divider';
import { TrbRequestFeedback } from 'types/technicalAssistance';
import { formatDateLocal } from 'utils/date';

type TrbRequestFeedbackListProps = {
  feedback: TrbRequestFeedback[];
};

function TrbRequestFeedbackList({ feedback }: TrbRequestFeedbackListProps) {
  const { t } = useTranslation('technicalAssistance');

  return (
    <>
      {feedback.map((item, idx, arr) => (
        <React.Fragment key={item.id}>
          <Grid row gap className="margin-top-4 margin-bottom-6">
            <Grid tablet={{ col: 12 }} desktop={{ col: 6 }}>
              <dl className="easi-dl">
                <dt>{t('requestFeedback.date')}</dt>
                <dd data-testid="feedback-date">
                  {formatDateLocal(item.createdAt, 'MMMM d, yyyy')}
                </dd>
              </dl>
            </Grid>
            <Grid tablet={{ col: 12 }} desktop={{ col: 6 }}>
              <dl className="easi-dl">
                <dt>{t('requestFeedback.from')}</dt>
                <dd>{item.author.commonName}, TRB</dd>
              </dl>
            </Grid>
            <Grid col={12}>
              <div className="padding-3 bg-base-lightest line-height-body-5 text-pre-wrap">
                {item.feedbackMessage}
              </div>
            </Grid>
          </Grid>
          {idx < arr.length - 1 && <Divider />}
        </React.Fragment>
      ))}
    </>
  );
}

export default TrbRequestFeedbackList;
