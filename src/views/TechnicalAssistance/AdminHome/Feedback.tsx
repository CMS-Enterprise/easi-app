import React from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@apollo/client';
import { Grid } from '@trussworks/react-uswds';
import { sortBy } from 'lodash';

import PageLoading from 'components/PageLoading';
import Divider from 'components/shared/Divider';
import GetTrbRequestFeedbackQuery from 'queries/GetTrbRequestFeedbackQuery';
import {
  GetTrbRequestFeedback,
  GetTrbRequestFeedbackVariables
} from 'queries/types/GetTrbRequestFeedback';
import { TRBFeedbackAction } from 'types/graphql-global-types';
import { TrbAdminPageProps } from 'types/technicalAssistance';
import { formatDateLocal } from 'utils/date';
import { NotFoundPartial } from 'views/NotFound';

const Feedback = ({ trbRequestId }: TrbAdminPageProps) => {
  const { t } = useTranslation('technicalAssistance');

  const { data, loading, error } = useQuery<
    GetTrbRequestFeedback,
    GetTrbRequestFeedbackVariables
  >(GetTrbRequestFeedbackQuery, {
    variables: {
      id: trbRequestId
    }
  });

  return (
    <div
      className="trb-admin-home__feedback"
      data-testid="trb-admin-home__feedback"
      id={`trbAdminFeedback-${trbRequestId}`}
    >
      {loading && <PageLoading />}
      {error && <NotFoundPartial />}
      {data && (
        <>
          <h1 className="margin-y-0">{t('adminHome.subnav.feedback')}</h1>
          <p className="line-height-body-5 margin-top-0 margin-bottom-5">
            {t('requestFeedback.adminInfo')}
          </p>
          {sortBy(
            data.trbRequest.feedback.filter(
              e => e.action === TRBFeedbackAction.REQUEST_EDITS
            ),
            'createdAt'
          )
            .reverse()
            .map(item => {
              return (
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
                      <div className="padding-3 bg-base-lightest line-height-body-5">
                        {item.feedbackMessage}
                      </div>
                    </Grid>
                  </Grid>
                  <Divider />
                </React.Fragment>
              );
            })}
        </>
      )}
    </div>
  );
};

export default Feedback;
