import React, { useEffect, useState } from 'react';
import { withAuth } from '@okta/okta-react';
import { useDispatch } from 'react-redux'; // , useSelector } from 'react-redux';
// import { DateTime } from 'luxon';
// import {
//   DescriptionList,
//   DescriptionTerm,
//   DescriptionDefinition
// } from 'components/shared/DescriptionGroup';
// import convertBoolToYesNo from 'utils/convertBoolToYesNo';
import { getSystemIntake } from '../../actions/systemIntakeActions';
// import { AppState } from '../../reducers/rootReducer';
// import { GovernanceCollaborationTeam } from '../../types/systemIntake';

type GRTSystemIntakeReviewProps = {
  auth: any;
};

const GRTSystemIntakeReview = ({ auth }: GRTSystemIntakeReviewProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchSystemIntake = async (): Promise<void> => {
      setIsLoading(true);
      dispatch(
        getSystemIntake(
          await auth.getAccessToken(),
          '50dab0f6-f532-43b2-965b-ff0b41cd3a1f'
        )
      );
      setIsLoading(false);
    };
    fetchSystemIntake();
  });

  // const systemIntake = useSelector(
  //   (state: AppState) => state.systemIntake.systemIntake
  // );
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
      {isLoading ? (
        <div>Loading ...</div>
      ) : (
        <div>
          <h1 className="font-heading-xl margin-top-4">CMS Sytem Request</h1>
          <hr className="system-intake__hr" />
          <h2 className="font-heading-xl">What to do after reviewing?</h2>
          <p>Email the requester and:</p>
          <ul className="usa-list">
            <li>Ask them to fill in the business case and submit it</li>
            <li>
              Tell them what to expect after they submit the business case
            </li>
            <li>And how to get in touch if they have any questions.</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default withAuth(GRTSystemIntakeReview);
