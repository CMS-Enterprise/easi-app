import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';

import Pager from '../RequestForm/Pager';

const InternalReview = ({ trbRequestId }: { trbRequestId: string }) => {
  const { t } = useTranslation('technicalAssistance');
  const history = useHistory();

  return (
    <div id="trbAdviceInternalReview">
      {/* Internal Review */}
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
