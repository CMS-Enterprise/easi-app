import React, { useEffect } from 'react';
import { withAuth } from '@okta/okta-react';
import { useDispatch, useSelector } from 'react-redux';
import { FormikProps } from 'formik';
import { DateTime } from 'luxon';
import {
  DescriptionList,
  DescriptionTerm,
  DescriptionDefinition
} from 'components/shared/DescriptionGroup';
import { SystemIntakeForm } from 'types/systemIntake';
import convertBoolToYesNo from 'utils/convertBoolToYesNo';
import { getAllSystemShorts } from '../../actions/searchActions';

type GRTSystemIntakeReviewProps = {
  auth: any;
  formikProps: FormikProps<SystemIntakeForm>;
};

const GRTSystemIntakeReview = ({
  auth,
  formikProps
}: GRTSystemIntakeReviewProps) => {
  const { values } = formikProps;
  const fundingDefinition = () => {
    const isFunded = convertBoolToYesNo(values.fundingSource.isFunded);
    if (values.fundingSource.isFunded) {
      return `${isFunded}, ${values.fundingSource.fundingNumber}`;
    }
    return isFunded;
  };
  const issoDefinition = () => {
    const hasIsso = convertBoolToYesNo(values.isso.isPresent);
    if (values.isso.isPresent) {
      return `${hasIsso}, ${values.isso.name}`;
    }
    return hasIsso;
  };
  const dispatch = useDispatch();


  useEffect(() => {
    const fetchSystemShorts = async (): Promise<void> => {
      dispatch(getAllSystemShorts(await auth.getAccessToken()));
    };
    fetchSystemShorts();
  }, [auth, dispatch]);

  return (
    <div className="system-intake__review margin-bottom-7">
      <h1 className="font-heading-xl margin-top-4">
        Check your answers before sending
      </h1>

      <DescriptionList title="System Request">
        <div className="system-intake__review-row">
          <div>
            <DescriptionTerm term="Submission Date" />
            <DescriptionDefinition
              definition={DateTime.local().toLocaleString(DateTime.DATE_MED)}
            />
          </div>
          <div>
            <DescriptionTerm term="Request for" />
            <DescriptionDefinition definition={values.currentStage} />
          </div>
        </div>
      </DescriptionList>

      <hr className="system-intake__hr" />
      <h2 className="font-heading-xl">Contact Details</h2>

      <DescriptionList title="Contact Details">
        <div className="system-intake__review-row">
          <div>
            <DescriptionTerm term="Requester" />
            <DescriptionDefinition definition={values.requester.name} />
          </div>
          <div>
            <DescriptionTerm term="Requester Component" />
            <DescriptionDefinition definition={values.requester.component} />
          </div>
        </div>
        <div className="system-intake__review-row">
          <div>
            <DescriptionTerm term="CMS Business/Product Owner's Name" />
            <DescriptionDefinition definition={values.businessOwner.name} />
          </div>
          <div>
            <DescriptionTerm term="Business Owner Component" />
            <DescriptionDefinition
              definition={values.businessOwner.component}
            />
          </div>
        </div>
        <div className="system-intake__review-row">
          <div>
            <DescriptionTerm term="CMS Project/Product Manager or lead" />
            <DescriptionDefinition definition={values.productManager.name} />
          </div>
          <div>
            <DescriptionTerm term="Product Manager Component" />
            <DescriptionDefinition
              definition={values.productManager.component}
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
            {values.governanceTeams.isPresent ? (
              values.governanceTeams.teams.map(team => (
                <DescriptionDefinition
                  key={`GovernanceTeam-${team.name.split(' ').join('-')}`}
                  definition={`${team.name}, ${team.collaborator}`}
                />
              ))
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
            <DescriptionDefinition definition={values.projectName} />
          </div>
          <div>
            <DescriptionTerm term="Does the project have funding" />
            <DescriptionDefinition definition={fundingDefinition()} />
          </div>
        </div>
        <div className="margin-bottom-205 line-height-body-3">
          <div>
            <DescriptionTerm term="What is your business need?" />
            <DescriptionDefinition definition={values.businessNeed} />
          </div>
        </div>
        <div className="margin-bottom-205 line-height-body-3">
          <div>
            <DescriptionTerm term="How are you thinking of solving it?" />
            <DescriptionDefinition definition={values.businessSolution} />
          </div>
        </div>
        <div className="system-intake__review-row">
          <div>
            <DescriptionTerm term="Where are you in the process?" />
            <DescriptionDefinition definition={values.currentStage} />
          </div>
          <div>
            <DescriptionTerm term="Do you currently have a contract in place?" />
            <DescriptionDefinition definition={values.hasContract} />
          </div>
        </div>
        <div className="system-intake__review-row">
          <div>
            <DescriptionTerm term="Do you need Enterprise Architecture (EA) support?" />
            <DescriptionDefinition
              definition={convertBoolToYesNo(values.needsEaSupport)}
            />
          </div>
        </div>
      </DescriptionList>

      <hr className="system-intake__hr" />
      <h2 className="font-heading-xl">What happens next?</h2>
      <p>
        The Governance Review Team will review and get back to you with{' '}
        <strong>one of these</strong> outcomes:
      </p>
      <ul className="usa-list">
        <li>direct you to go through the Governance Review process</li>
        <li>or decide there is no further governance needed</li>
      </ul>
      <p>They will get back to you in two business days.</p>
    </div>
  );
};

export default GRTSystemIntakeReview;
