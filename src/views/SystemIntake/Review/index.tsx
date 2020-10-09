import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Button } from '@trussworks/react-uswds';

import { SystemIntakeReview } from 'components/SystemIntakeReview';
import usePrevious from 'hooks/usePrevious';
import { AppState } from 'reducers/rootReducer';
import { postSystemIntakeAction } from 'types/routines';
import { SystemIntakeForm } from 'types/systemIntake';

type ReviewProps = {
  systemIntake: SystemIntakeForm;
};

const Review = ({ systemIntake }: ReviewProps) => {
  const history = useHistory();
  const dispatch = useDispatch();

  const isSubmitting = useSelector((state: AppState) => state.action.isPosting);
  const error = useSelector((state: AppState) => state.action.error);
  const prevIsSubmitting = usePrevious(isSubmitting);

  useEffect(() => {
    if (prevIsSubmitting && !isSubmitting && !error) {
      history.push('/');
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSubmitting]);

  return (
    <div className="system-intake__review">
      <h1 className="font-heading-xl margin-top-4">
        Check your answers before sending
      </h1>
      <SystemIntakeReview systemIntake={systemIntake} />
      <hr className="system-intake__hr" />
      <h2 className="font-heading-xl">What happens next?</h2>
      <p>
        The Governance Review Admin Team will review and get back to you with{' '}
        <strong>one of these</strong> outcomes:
      </p>
      <ul className="usa-list">
        <li>direct you to go through the Governance Review process</li>
        <li>or decide there is no further governance needed</li>
      </ul>
      <p>They will get back to you in two business days.</p>
      <Button
        type="button"
        outline
        onClick={() => {
          const newUrl = 'contract-details';
          history.push(newUrl);
          window.scrollTo(0, 0);
        }}
      >
        Back
      </Button>
      <Button
        type="submit"
        disabled={isSubmitting}
        onClick={() =>
          dispatch(
            postSystemIntakeAction({
              actionType: 'SUBMIT',
              intakeId: systemIntake.id
            })
          )
        }
      >
        Send my intake request
      </Button>
    </div>
  );
};

export default Review;
