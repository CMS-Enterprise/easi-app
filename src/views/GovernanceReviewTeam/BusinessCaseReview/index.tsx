import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { DateTime } from 'luxon';

import AlternativeAnalysisReview from 'components/BusinessCaseReview/AlternativeAnalysisReview';
import GeneralRequestInfoReview from 'components/BusinessCaseReview/GeneralRequestInfoReview';
import RequestDescriptionReview from 'components/BusinessCaseReview/RequestDescriptionReview';
import UswdsReactLink from 'components/LinkWrapper';
import PageHeading from 'components/PageHeading';
import PDFExport from 'components/PDFExport';
import Alert from 'components/shared/Alert';
import { GovernanceRequestFeedback } from 'queries/types/GovernanceRequestFeedback';
import { BusinessCaseModel } from 'types/businessCase';
import { getFiscalYear } from 'utils/date';

import ITGovAdminContext from '../ITGovAdminContext';

type BusinessCaseReviewProps = {
  businessCase: BusinessCaseModel;
  grtFeedbacks?: GovernanceRequestFeedback[] | null;
};

const BusinessCaseReview = ({
  businessCase,
  grtFeedbacks
}: BusinessCaseReviewProps) => {
  const { t } = useTranslation('governanceReviewTeam');
  const filename = `Business case for ${businessCase.requestName}.pdf`;

  const isITGovAdmin = useContext(ITGovAdminContext);

  if (!businessCase.id) {
    return (
      <div data-testid="business-case-review-not-found">
        <PageHeading className="margin-top-0">
          {t('general:businessCase')}
        </PageHeading>
        <p>Business Case has not been submitted</p>
      </div>
    );
  }

  return (
    <div data-testid="business-case-review">
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
            currentSolutionSummary: businessCase.currentSolutionSummary,
            priorityAlignment: businessCase.priorityAlignment,
            successIndicators: businessCase.successIndicators
          }}
        />
        <h2 className="font-heading-xl margin-top-6 margin-bottom-2">
          Alternatives analysis
        </h2>
        <AlternativeAnalysisReview
          fiscalYear={
            businessCase.createdAt
              ? getFiscalYear(DateTime.fromISO(businessCase.createdAt))
              : new Date().getFullYear()
          }
          preferredSolution={businessCase.preferredSolution}
          alternativeA={businessCase.alternativeA}
          alternativeB={businessCase.alternativeB}
        />

        {
          // Alert to show Feedback has moved to new tab
          grtFeedbacks && grtFeedbacks.length > 0 && (
            <Alert type="info" className="margin-top-5 easi-no-print" slim>
              {t('feedback.feedbackMoved')}
            </Alert>
          )
        }
      </PDFExport>

      {isITGovAdmin && (
        <UswdsReactLink
          className="usa-button margin-top-5"
          variant="unstyled"
          to={`/it-governance/${businessCase.systemIntakeId}/actions`}
        >
          {t('action:takeAnAction')}
        </UswdsReactLink>
      )}
    </div>
  );
};

export default BusinessCaseReview;
