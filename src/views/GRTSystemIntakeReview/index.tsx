import React, { useEffect } from 'react';
import { withAuth } from '@okta/okta-react';
import { useDispatch, useSelector } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { DateTime } from 'luxon';
import {
  DescriptionList,
  DescriptionTerm,
  DescriptionDefinition
} from 'components/shared/DescriptionGroup';
// import convertBoolToYesNo from 'utils/convertBoolToYesNo';
import { getSystemIntake } from '../../actions/systemIntakeActions';
import { AppState } from '../../reducers/rootReducer';
// import { GovernanceCollaborationTeam } from '../../types/systemIntake';

export type SystemIDRouterProps = {
  systemID: string;
};

type GRTSystemIntakeReviewProps = RouteComponentProps<SystemIDRouterProps> & {
  auth: any;
};

const GRTSystemIntakeReview = ({ match, auth }: GRTSystemIntakeReviewProps) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchSystemIntake = async (): Promise<void> => {
      dispatch(
        getSystemIntake(await auth.getAccessToken(), match.params.systemID)
      );
    };
    fetchSystemIntake();
  }, [auth, dispatch, match.params.systemID]);
  const systemIntake = useSelector(
    (state: AppState) => state.systemIntake.systemIntake
  );
  // const fundingDefinition = () => {
  //   const isFunded = convertBoolToYesNo(systemIntake.fundingSource.isFunded);
  //   if (systemIntake.fundingSource.isFunded) {
  //     return `${isFunded}, ${systemIntake.fundingSource.fundingNumber}`;
  //   }
  //   return isFunded;
  // };
  // const issoDefinition = () => {
  //   const hasIsso = convertBoolToYesNo(systemIntake.isso.isPresent);
  //   if (systemIntake.isso.isPresent) {
  //     return `${hasIsso}, ${systemIntake.isso.name}`;
  //   }
  //   return hasIsso;
  // };

  return (
    <div className="system-intake__review margin-bottom-7">
      <h1 className="font-heading-xl margin-top-4">CMS Sytem Request</h1>
      {!systemIntake && (
        <h2 className="font-heading-xl">
          System intake with ID: {match.params.systemID} was not found
        </h2>
      )}
      {systemIntake && (
        <div>
          <DescriptionList title="System Request">
            <div className="system-intake__review-row">
              <div>
                <DescriptionTerm term="Submission Date" />
                <DescriptionDefinition
                  definition={DateTime.local().toLocaleString(
                    DateTime.DATE_MED
                  )}
                />
              </div>
              <div>
                <DescriptionTerm term="Request for" />
                <DescriptionDefinition
                  definition={systemIntake.process_status}
                />
              </div>
            </div>
          </DescriptionList>
        </div>
      )}
      <hr className="system-intake__hr" />
      <h2 className="font-heading-xl">What to do after reviewing?</h2>
      <p>Email the requester and:</p>
      <ul className="usa-list">
        <li>Ask them to fill in the business case and submit it</li>
        <li>Tell them what to expect after they submit the business case</li>
        <li>And how to get in touch if they have any questions.</li>
      </ul>
    </div>
  );
};

export default withAuth(GRTSystemIntakeReview);
