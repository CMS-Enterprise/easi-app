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
import convertBoolToYesNo from 'utils/convertBoolToYesNo';
import Header from 'components/Header';
import { getSystemIntake } from '../../actions/systemIntakeActions';
import { AppState } from '../../reducers/rootReducer';

export type SystemIDRouterProps = {
  systemID: string;
};

export type GRTSystemIntakeReviewProps = RouteComponentProps<
  SystemIDRouterProps
> & {
  auth: any;
};

export const GRTSystemIntakeReview = ({
  match,
  auth
}: GRTSystemIntakeReviewProps) => {
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
  const fundingDefinition = () => {
    const isFunded = convertBoolToYesNo(!!systemIntake.funding_source);
    if (systemIntake.funding_source) {
      return `${isFunded}, ${systemIntake.funding_source}`;
    }
    return isFunded;
  };
  const issoDefinition = () => {
    const hasIsso = convertBoolToYesNo(!!systemIntake.isso);
    if (systemIntake.isso) {
      return `${hasIsso}, ${systemIntake.isso}`;
    }
    return hasIsso;
  };

  return (
    <div className="system-intake__review margin-bottom-7">
      <Header />
      <div className="grid-container">
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

            <hr className="system-intake__hr" />
            <h2 className="font-heading-xl">Contact Details</h2>

            <DescriptionList title="Contact Details">
              <div className="system-intake__review-row">
                <div>
                  <DescriptionTerm term="Requester" />
                  <DescriptionDefinition definition={systemIntake.requester} />
                </div>
                <div>
                  <DescriptionTerm term="Requester Component" />
                  <DescriptionDefinition definition={systemIntake.component} />
                </div>
              </div>
              <div className="system-intake__review-row">
                <div>
                  <DescriptionTerm term="CMS Business/Product Owner's Name" />
                  <DescriptionDefinition
                    definition={systemIntake.business_owner}
                  />
                </div>
                <div>
                  <DescriptionTerm term="Business Owner Component" />
                  <DescriptionDefinition
                    definition={systemIntake.business_owner_component}
                  />
                </div>
              </div>
              <div className="system-intake__review-row">
                <div>
                  <DescriptionTerm term="CMS Project/Product Manager or lead" />
                  <DescriptionDefinition
                    definition={systemIntake.product_manager}
                  />
                </div>
                <div>
                  <DescriptionTerm term="Product Manager Component" />
                  <DescriptionDefinition
                    definition={systemIntake.product_manager_component}
                  />
                </div>
              </div>
              <div className="system-intake__review-row">
                <div>
                  <DescriptionTerm term="Does your project have an Information System Security Officer (ISSO)?" />
                  <DescriptionDefinition definition={issoDefinition()} />
                </div>
                <div>
                  <DescriptionTerm term="Currently collaborating with" />
                  {systemIntake.governanceTeams ? (
                    systemIntake.governanceTeams.teams.map(
                      (team: {
                        name: {
                          split: (
                            arg0: string
                          ) => { join: (arg0: string) => void };
                        };
                        collaborator: any;
                      }) => (
                        <DescriptionDefinition
                          key={`GovernanceTeam-${team.name
                            .split(' ')
                            .join('-')}`}
                          definition={`${team.name}, ${team.collaborator}`}
                        />
                      )
                    )
                  ) : (
                    <DescriptionDefinition definition="N/A" />
                  )}
                </div>
              </div>
            </DescriptionList>

            <hr className="system-intake__hr" />
            <h2 className="font-heading-xl">Request Details</h2>

            <DescriptionList title="Request Details">
              <div className="system-intake__review-row">
                <div>
                  <DescriptionTerm term="Project Name" />
                  <DescriptionDefinition
                    definition={systemIntake.project_name}
                  />
                </div>
                <div>
                  <DescriptionTerm term="Does the project have funding" />
                  <DescriptionDefinition definition={fundingDefinition()} />
                </div>
              </div>
              <div className="margin-bottom-205 line-height-body-3">
                <div>
                  <DescriptionTerm term="What is your business need?" />
                  <DescriptionDefinition
                    definition={systemIntake.business_need}
                  />
                </div>
              </div>
              <div className="margin-bottom-205 line-height-body-3">
                <div>
                  <DescriptionTerm term="How are you thinking of solving it?" />
                  <DescriptionDefinition definition={systemIntake.solution} />
                </div>
              </div>
              <div className="system-intake__review-row">
                <div>
                  <DescriptionTerm term="Where are you in the process?" />
                  <DescriptionDefinition
                    definition={systemIntake.process_status}
                  />
                </div>
                <div>
                  <DescriptionTerm term="Do you currently have a contract in place?" />
                  <DescriptionDefinition
                    definition={systemIntake.existing_contract}
                  />
                </div>
              </div>
              <div className="system-intake__review-row">
                <div>
                  <DescriptionTerm term="Do you need Enterprise Architecture (EA) support?" />
                  <DescriptionDefinition
                    definition={convertBoolToYesNo(
                      !!systemIntake.needs_ea_support
                    )}
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
    </div>
  );
};

export default withAuth(GRTSystemIntakeReview);
