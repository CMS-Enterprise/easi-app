import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { Alert } from '@trussworks/react-uswds';

import PageLoading from 'components/PageLoading';
import Divider from 'components/shared/Divider';
import { GetTrbAdviceLetterQuery } from 'queries/TrbAdviceLetterQueries';
import {
  GetTrbAdviceLetter,
  GetTrbAdviceLetterVariables
} from 'queries/types/GetTrbAdviceLetter';
import { TRBAdviceLetterStatus } from 'types/graphql-global-types';
import { NotFoundPartial } from 'views/NotFound';

import ReviewAdviceLetter from '../AdminHome/components/ReviewAdviceLetter';
import Pager from '../RequestForm/Pager';

const InternalReview = ({ trbRequestId }: { trbRequestId: string }) => {
  const { t } = useTranslation('technicalAssistance');
  const history = useHistory();

  const { data, loading } = useQuery<
    GetTrbAdviceLetter,
    GetTrbAdviceLetterVariables
  >(GetTrbAdviceLetterQuery, {
    variables: {
      id: trbRequestId
    }
  });

  const trbRequest = data?.trbRequest;

  if (loading) return <PageLoading />;
  if (!trbRequest?.adviceLetter) return <NotFoundPartial />;

  const {
    adviceLetter,
    taskStatuses: { adviceLetterStatus }
  } = trbRequest;

  return (
    <div id="trbAdviceInternalReview">
      {/* Internal Review */}
      <ReviewAdviceLetter
        adviceLetter={adviceLetter}
        className="margin-top-5 margin-bottom-4"
        showEditLinks
      />

      <Divider />

      {
        /* Internal review needed alert */
        (adviceLetterStatus === TRBAdviceLetterStatus.IN_PROGRESS ||
          adviceLetterStatus === TRBAdviceLetterStatus.READY_FOR_REVIEW) && (
          <Alert
            type="warning"
            heading={t('adviceLetterForm.internalReviewNeeded.heading')}
            className="margin-top-4 margin-bottom-5"
          >
            {t('adviceLetterForm.internalReviewNeeded.text')}
          </Alert>
        )
      }

      {/* Form pager buttons */}
      <Pager
        back={{
          outline: true,
          onClick: () => history.push(`/trb/${trbRequestId}/advice/next-steps`)
        }}
        next={{
          text: 'Request internal review',
          // disabled: isSubmitting,
          onClick: () => {
            // TODO: Submit for internal review
            history.push(`/trb/${trbRequestId}/advice/review`);
          }
        }}
        taskListUrl={`/trb/${trbRequestId}/request`}
        saveExitText={t('adviceLetterForm.returnToRequest')}
        border={false}
      />
    </div>
  );
};

export default InternalReview;
