import React from 'react';
import { useGetSystemIntakeContactsQuery } from 'gql/generated/graphql';

import {
  DescriptionDefinition,
  DescriptionList,
  DescriptionTerm
} from 'components/DescriptionGroup';
import ReviewRow from 'components/ReviewRow';
import { GeneralRequestInfoForm } from 'types/businessCase';

type GeneralRequestInfoReviewProps = {
  systemIntakeId: string;
  values: GeneralRequestInfoForm;
};

const GeneralRequestInfoReview = ({
  systemIntakeId,
  values
}: GeneralRequestInfoReviewProps) => {
  const { data } = useGetSystemIntakeContactsQuery({
    variables: {
      id: systemIntakeId
    }
  });

  // Get business owner from contacts table because we no longer update this through the business case form
  const businessOwner = data?.systemIntakeContacts?.businessOwners[0];

  return (
    <DescriptionList title="General request information">
      <ReviewRow>
        <div>
          <DescriptionTerm term="Contact / request title" />
          <DescriptionDefinition definition={values.requestName} />
        </div>
        <div>
          <DescriptionTerm term="Contact / request acronym" />
          <DescriptionDefinition
            definition={values.projectAcronym ? values.projectAcronym : 'N/A'}
          />
        </div>
      </ReviewRow>
      <ReviewRow>
        <div>
          <DescriptionTerm term="CMS Business Owner" />
          <DescriptionDefinition
            definition={businessOwner?.userAccount.commonName}
          />
        </div>
      </ReviewRow>
      <ReviewRow>
        <div>
          <DescriptionTerm term="Requester" />
          <DescriptionDefinition definition={values.requester.name} />
        </div>
      </ReviewRow>
      <ReviewRow>
        <div>
          <DescriptionTerm term="Requester phone number" />
          <DescriptionDefinition definition={values.requester.phoneNumber} />
        </div>
      </ReviewRow>
    </DescriptionList>
  );
};

export default GeneralRequestInfoReview;
