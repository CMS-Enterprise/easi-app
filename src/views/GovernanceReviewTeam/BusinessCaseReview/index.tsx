import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Link as UswdsLink } from '@trussworks/react-uswds';

import AlternativeAnalysisReview from 'components/BusinessCaseReview/AlternativeAnalysisReview';
import GeneralRequestInfoReview from 'components/BusinessCaseReview/GeneralRequestInfoReview';
import RequestDescriptionReview from 'components/BusinessCaseReview/RequestDescriptionReview';
import PageHeading from 'components/PageHeading';
import PDFExport from 'components/PDFExport';
import { AnythingWrongSurvey } from 'components/Survey';
import { BusinessCaseModel } from 'types/businessCase';

type BusinessCaseReviewProps = {
  businessCase: BusinessCaseModel;
};
const BusinessCaseReview = ({ businessCase }: BusinessCaseReviewProps) => {
  const { t } = useTranslation('governanceReviewTeam');
  const filename = `Business case for ${businessCase.requestName}.pdf`;

  if (!businessCase.id) {
    return (
      <div>
        <PageHeading className="margin-top-0">
          {t('general:businessCase')}
        </PageHeading>
        <p>Business Case has not been submitted</p>
      </div>
    );
  }

  return (
    <div>
      <PDFExport
        title="System Intake"
        filename={filename}
        label="Download Business Case as PDF"
      >
        <PageHeading className="margin-top-0">
          {t('general:businessCase')}
        </PageHeading>
        <h2 className="font-heading-xl">General request information</h2>
        <GeneralRequestInfoReview
          values={{
            requestName: businessCase.requestName,
            businessOwner: {
              name: businessCase.businessOwner.name
            },
            requester: {
              name: businessCase.requester.name,
              phoneNumber: businessCase.requester.phoneNumber
            }
          }}
        />

        <h2 className="font-heading-xl margin-top-6">Request description</h2>
        <RequestDescriptionReview
          values={{
            businessNeed: businessCase.businessNeed,
            cmsBenefit: businessCase.cmsBenefit,
            priorityAlignment: businessCase.priorityAlignment,
            successIndicators: businessCase.successIndicators
          }}
        />
        <h2 className="font-heading-xl margin-top-6 margin-bottom-2">
          Alternatives analysis
        </h2>
        <AlternativeAnalysisReview
          asIsSolution={businessCase.asIsSolution}
          preferredSolution={businessCase.preferredSolution}
          alternativeA={businessCase.alternativeA}
          alternativeB={businessCase.alternativeB}
        />
      </PDFExport>
      <UswdsLink
        className="usa-button margin-top-5"
        variant="unstyled"
        to={`/governance-review-team/${businessCase.systemIntakeId}/actions`}
        asCustom={Link}
      >
        Take an action
      </UswdsLink>
      <AnythingWrongSurvey />
    </div>
  );
};

export default BusinessCaseReview;
