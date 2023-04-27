import React from 'react';
import { useTranslation } from 'react-i18next';
import { Alert } from '@trussworks/react-uswds';
import { sortBy } from 'lodash';

import PageLoading from 'components/PageLoading';
import useCacheQuery from 'hooks/useCacheQuery';
import GetTrbRequestFeedbackQuery from 'queries/GetTrbRequestFeedbackQuery';
import {
  GetTrbRequestFeedback,
  GetTrbRequestFeedbackVariables
} from 'queries/types/GetTrbRequestFeedback';
import { TRBRequestState, TRBRequestStatus } from 'types/graphql-global-types';
import { TrbAdminPageProps } from 'types/technicalAssistance';
import { NotFoundPartial } from 'views/NotFound';

import TrbRequestFeedbackList from '../TrbRequestFeedbackList';

import TrbAdminWrapper from './components/TrbAdminWrapper';

const Feedback = ({
  trbRequest,
  assignLeadModalRef,
  assignLeadModalTrbRequestIdRef
}: TrbAdminPageProps) => {
  const { t } = useTranslation('technicalAssistance');

  const { data, loading, error } = useCacheQuery<
    GetTrbRequestFeedback,
    GetTrbRequestFeedbackVariables
  >(GetTrbRequestFeedbackQuery, {
    variables: {
      id: trbRequest.id
    }
  });

  return (
    <TrbAdminWrapper
      activePage="feedback"
      trbRequestId={trbRequest.id}
      title={t('adminHome.feedback')}
      description={t('requestFeedback.adminInfo')}
      disableStep={
        trbRequest.state !== TRBRequestState.CLOSED &&
        trbRequest.status !== TRBRequestStatus.ADVICE_LETTER_SENT
      }
      adminActionProps={{
        status: trbRequest.status,
        state: trbRequest.state,
        assignLeadModalTrbRequestIdRef,
        assignLeadModalRef
      }}
    >
      {loading && <PageLoading />}
      {error && <NotFoundPartial />}
      {data && data.trbRequest.feedback.length > 0 ? (
        <TrbRequestFeedbackList
          feedback={sortBy(data.trbRequest.feedback, 'createdAt').reverse()}
        />
      ) : (
        <Alert slim type="info">
          {t('requestFeedback.noFeedbackAlert')}
        </Alert>
      )}
    </TrbAdminWrapper>
  );
};

export default Feedback;
