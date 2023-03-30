import React from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@apollo/client';
import { Alert } from '@trussworks/react-uswds';
import { sortBy } from 'lodash';

import PageLoading from 'components/PageLoading';
import GetTrbRequestFeedbackQuery from 'queries/GetTrbRequestFeedbackQuery';
import {
  GetTrbRequestFeedback,
  GetTrbRequestFeedbackVariables
} from 'queries/types/GetTrbRequestFeedback';
import { TrbAdminPageProps } from 'types/technicalAssistance';
import { NotFoundPartial } from 'views/NotFound';

import TrbRequestFeedbackList from '../TrbRequestFeedbackList';

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
          {data.trbRequest.feedback.length > 0 ? (
            <TrbRequestFeedbackList
              feedback={sortBy(data.trbRequest.feedback, 'createdAt').reverse()}
            />
          ) : (
            <Alert slim type="info">
              {t('requestFeedback.noFeedbackAlert')}
            </Alert>
          )}
        </>
      )}
    </div>
  );
};

export default Feedback;
