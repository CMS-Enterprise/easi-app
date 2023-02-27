import React from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';

import { AdviceLetterFormFields } from 'types/technicalAssistance';

import Pager from '../RequestForm/Pager';

const NextSteps = ({ trbRequestId }: { trbRequestId: string }) => {
  const { t } = useTranslation('technicalAssistance');
  const history = useHistory();

  const {
    formState: { isSubmitting }
  } = useFormContext<AdviceLetterFormFields>();

  return (
    <div>
      {/** Form pager buttons */}
      <Pager
        className="margin-top-4"
        back={{
          outline: true,
          onClick: () =>
            history.push(`/trb/${trbRequestId}/advice/recommendations`)
        }}
        next={{
          disabled: isSubmitting,
          onClick: () =>
            history.push(`/trb/${trbRequestId}/advice/internal-review`)
        }}
        taskListUrl={`/trb/${trbRequestId}/request`}
        saveExitText={t('adviceLetterForm.returnToRequest')}
        border={false}
      />
    </div>
  );
};

export default NextSteps;
