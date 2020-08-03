import React, { useEffect } from 'react';
import { SystemIntakeForm } from 'types/systemIntake';
import { SystemIntakeReview } from 'components/SystemIntakeReview';
import { Button } from '@trussworks/react-uswds';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from 'reducers/rootReducer';
import { submitSystemIntake } from 'types/routines';
import usePrevious from 'hooks/usePrevious';

type ReviewProps = {
  systemIntake: SystemIntakeForm;
};

const Review = ({ systemIntake }: ReviewProps) => {
  const history = useHistory();
  const dispatch = useDispatch();

  const isSubmitting = useSelector(
    (state: AppState) => state.systemIntake.isSubmitting
  );
  const error = useSelector((state: AppState) => state.systemIntake.error);
  const prevIsSubmitting = usePrevious(isSubmitting);

  useEffect(() => {
    if (prevIsSubmitting && !isSubmitting && !error) {
      history.push('/');
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSubmitting]);

  return (
    <div className="system-intake__review margin-bottom-7">
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
          const newUrl = 'request-details';
          history.push(newUrl);
          window.scrollTo(0, 0);
        }}
      >
        Back
      </Button>
      <Button
        type="submit"
        disabled={isSubmitting}
        onClick={() => dispatch(submitSystemIntake(systemIntake))}
      >
        Send my intake request
      </Button>
    </div>
  );
};

export default Review;
