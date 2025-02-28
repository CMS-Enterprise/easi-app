import React from 'react';
import { useTranslation } from 'react-i18next';
import { NotFoundPartial } from 'features/Miscellaneous/NotFound';
import {
  TRBRequestState,
  TRBRequestStatus,
  useGetTRBRequestFeedbackQuery
} from 'gql/generated/graphql';
import { sortBy } from 'lodash';

import Alert from 'components/Alert';
import PageLoading from 'components/PageLoading';
import { TrbAdminPageProps } from 'types/technicalAssistance';

import TrbRequestFeedbackList from '../../Requester/Feedback';
import TrbAdminWrapper from '../_components/TrbAdminWrapper';

const Feedback = ({
  trbRequest,
  assignLeadModalRef,
  assignLeadModalTrbRequestIdRef
}: TrbAdminPageProps) => {
  const { t } = useTranslation('technicalAssistance');

  const { data, loading, error } = useGetTRBRequestFeedbackQuery({
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
        trbRequest.status !== TRBRequestStatus.GUIDANCE_LETTER_SENT
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
