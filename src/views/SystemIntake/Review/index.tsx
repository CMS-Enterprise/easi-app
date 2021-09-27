import React from 'react';
import { useHistory } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { Button } from '@trussworks/react-uswds';

import PageHeading from 'components/PageHeading';
import { SystemIntakeReview } from 'components/SystemIntakeReview';
import { SubmitIntake as SubmitIntakeQuery } from 'queries/SystemIntakeQueries';
import { GetSystemIntake_systemIntake as SystemIntake } from 'queries/types/GetSystemIntake';
import {
  SubmitIntake,
  SubmitIntakeVariables
} from 'queries/types/SubmitIntake';

type ReviewProps = {
  systemIntake: SystemIntake;
};

const Review = ({ systemIntake }: ReviewProps) => {
  const history = useHistory();

  const [mutate, mutationResult] = useMutation<
    SubmitIntake,
    SubmitIntakeVariables
  >(SubmitIntakeQuery);

  return (
    <div className="system-intake__review">
      <PageHeading>Check your answers before sending</PageHeading>
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
        }}
      >
        Back
      </Button>
      <Button
        type="submit"
        disabled={mutationResult.loading}
        onClick={() =>
          mutate({
            variables: {
              input: { id: systemIntake.id }
            }
          }).then(response => {
            if (!response.errors) {
              history.push(`/system/${systemIntake.id}/confirmation`);
            }
          })
        }
      >
        Send my intake request
      </Button>
    </div>
  );
};

export default Review;
