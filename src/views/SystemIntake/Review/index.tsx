import React from 'react';
import { FormikProps } from 'formik';
import { DateTime } from 'luxon';
import {
  DefinitionList,
  DefinitionTerm,
  DefinitionDescription
} from 'components/shared/DefinitionGroup';
import { SystemIntakeForm } from 'types/systemIntake';

type ReviewProps = {
  formikProps: FormikProps<SystemIntakeForm>;
};

const Review = ({ formikProps }: ReviewProps) => {
  const { values } = formikProps;
  return (
    <div className="margin-bottom-7">
      <h2 className="font-heading-xl">Check your answers before sending</h2>

      <DefinitionList title="System Request">
        <div className="grid-row flex-row">
          <div className="grid-col">
            <DefinitionTerm term="Submission Date" />
            <DefinitionDescription
              description={DateTime.local().toLocaleString(DateTime.DATE_MED)}
            />
          </div>
          <div className="grid-col">
            <DefinitionTerm term="Request for" />
            <DefinitionDescription description="A new idea or system" />
          </div>
        </div>
      </DefinitionList>

      {/* hr */}
      <h2 className="font-heading-xl">Contact Details</h2>

      <DefinitionList title="System Request">
        <div className="grid-row flex-row">
          <div className="grid-col">
            <DefinitionTerm term="Requestor" />
            <DefinitionDescription description="Ryan Coleman" />
          </div>
          <div className="grid-col">
            <DefinitionTerm term="Requestor Component" />
            <DefinitionDescription description="OIT" />
          </div>
        </div>
        <div className="grid-row flex-row">
          <div className="grid-col">
            <DefinitionTerm term="CMS Business/Product Owner's Name" />
            <DefinitionDescription description="Ryan Coleman" />
          </div>
          <div className="grid-col">
            <DefinitionTerm term="Business Owner Component" />
            <DefinitionDescription description="OIT" />
          </div>
        </div>
        <div className="grid-row flex-row">
          <div className="grid-col">
            <DefinitionTerm term="CMS Project/Product Manager or lead" />
            <DefinitionDescription description="Jeff Barnes" />
          </div>
          <div className="grid-col">
            <DefinitionTerm term="Product Manager Component" />
            <DefinitionDescription description="OIT" />
          </div>
        </div>
        <div className="grid-row flex-row">
          <div className="grid-col">
            <DefinitionTerm term="Currently collaborating with" />
            <DefinitionDescription description="TBD" />
            <DefinitionDescription description="TBD" />
            <DefinitionDescription description="TBD" />
            <DefinitionDescription description="TBD" />
          </div>
        </div>
      </DefinitionList>

      {/* hr */}
      <h2 className="font-heading-xl">Contact Details</h2>

      <DefinitionList title="Request Details">
        <div className="grid-row flex-row">
          <div className="grid-col">
            <DefinitionTerm term="Project Name" />
            <DefinitionDescription description="Easy Access to System Information" />
          </div>
          <div className="grid-col">
            <DefinitionTerm term="Does the project have funding" />
            <DefinitionDescription description="Yes, 112211" />
          </div>
        </div>
        <div className="grid-row flex-row">
          <div className="grid-col">
            <DefinitionTerm term="What is your business need?" />
            <DefinitionDescription description="Litttttttttttttttttttt" />
          </div>
        </div>
        <div className="grid-row flex-row">
          <div className="grid-col">
            <DefinitionTerm term="How are you thinking of solving it?" />
            <DefinitionDescription description="Litttttttttttttttttttt" />
          </div>
        </div>
        <div className="grid-row flex-row">
          <div className="grid-col">
            <DefinitionTerm term="Where are you in the process?" />
            <DefinitionDescription description="Just an idea" />
          </div>
          <div className="grid-col">
            <DefinitionTerm term="Do you currently have a contract in place?" />
            <DefinitionDescription description="No" />
          </div>
        </div>
        <div className="grid-row flex-row">
          <div className="grid-col">
            <DefinitionTerm term="Do you need EA support?" />
            <DefinitionDescription description="Yes" />
          </div>
        </div>
      </DefinitionList>

      {/* hr */}
      <h2 className="font-heading-xl">What happens next?</h2>
      <p>
        The Governance Review Team will review and get back to you with{' '}
        <strong>one of these</strong> outcomes:
      </p>
      <ul>
        <li>direct you to go through the Goverannce Review process</li>
        <li>or direct you to an existing project</li>
        <li>
          or issue you a lifecycle id and decide that there is no further
          governance needed
        </li>
      </ul>
      <p>They will get back to you in two business days.</p>
    </div>
  );
};

export default Review;
