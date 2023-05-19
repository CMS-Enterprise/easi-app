import React from 'react';
import { useTranslation } from 'react-i18next';
import { sortBy } from 'lodash';

import PageLoading from 'components/PageLoading';
import Alert from 'components/shared/Alert';
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

  // Filter out any feedback that is an empty string
  const validFeedback = data?.trbRequest.feedback.filter(
    feedback => !!feedback.feedbackMessage
  );

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

      {validFeedback && validFeedback.length === 0 && (
        <Alert slim type="info">
          {t('requestFeedback.noFeedbackAlert')}
        </Alert>
      )}

      {validFeedback && validFeedback.length > 0 && (
        <TrbRequestFeedbackList
          feedback={sortBy(validFeedback, 'createdAt').reverse()}
        />
      )}
    </TrbAdminWrapper>
  );
};

export default Feedback;
