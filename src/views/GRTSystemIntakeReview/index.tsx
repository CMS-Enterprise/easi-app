import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { SystemIntakeReview } from 'components/SystemIntakeReview';
import Header from 'components/Header';
import { AppState } from 'reducers/rootReducer';
import { fetchSystemIntake } from 'types/routines';

export type SystemIDRouterProps = {
  systemId: string;
};

export type GRTSystemIntakeReviewProps = RouteComponentProps<
  SystemIDRouterProps
>;

export const GRTSystemIntakeReview = ({
  match
}: GRTSystemIntakeReviewProps) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchSystemIntake(match.params.systemId));
  }, [dispatch, match.params.systemId]);
  const systemIntake = useSelector(
    (state: AppState) => state.systemIntake.systemIntake
  );
  return (
    <div>
      <Header />
      <div className="grid-container">
        <div className="system-intake__review margin-bottom-7">
          <h1 className="font-heading-xl margin-top-4">CMS System Request</h1>
          {!systemIntake && (
            <h2 className="font-heading-xl">
              System intake with ID: {match.params.systemId} was not found
            </h2>
          )}
          {systemIntake && <SystemIntakeReview systemIntake={systemIntake} />}
          <hr className="system-intake__hr" />
          <h2 className="font-heading-xl">What to do after reviewing?</h2>
          <p>Email the requester and:</p>
          <ul className="usa-list">
            <li>Ask them to fill in the bidness case and submit it</li>
            <li>
              Tell them what to expect after they submit the bidness case
            </li>
            <li>And how to get in touch if they have any questions.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default GRTSystemIntakeReview;
