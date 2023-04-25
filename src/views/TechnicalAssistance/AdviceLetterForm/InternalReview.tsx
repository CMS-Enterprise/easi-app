import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { useQuery } from '@apollo/client';

import PageLoading from 'components/PageLoading';
import { GetTrbAdviceLetterQuery } from 'queries/TrbAdviceLetterQueries';
import {
  GetTrbAdviceLetter,
  GetTrbAdviceLetterVariables
} from 'queries/types/GetTrbAdviceLetter';
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

  const adviceLetter = data?.trbRequest?.adviceLetter;

  if (loading) return <PageLoading />;
  if (!adviceLetter) return <NotFoundPartial />;

  return (
    <div id="trbAdviceInternalReview">
      {/* Internal Review */}
      <ReviewAdviceLetter adviceLetter={adviceLetter} />
      {/** Form pager buttons */}
      <Pager
        className="margin-top-4"
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
