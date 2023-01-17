import React from 'react';

import GRTFeedbackView from 'components/GRTFeedbackView';
import PDFExport from 'components/PDFExport';
import SectionWrapper from 'components/shared/SectionWrapper';
import { GetSystemIntake_systemIntake_grtFeedbacks as GRTFeedback } from 'queries/types/GetSystemIntake';
import { BusinessCaseModel } from 'types/businessCase';
import { getFiscalYear, parseAsDate } from 'utils/date';

import AlternativeAnalysisReview from './AlternativeAnalysisReview';
import GeneralRequestInfoReview from './GeneralRequestInfoReview';
import RequestDescriptionReview from './RequestDescriptionReview';

import './index.scss';

type BusinessCaseReviewProps = {
  values: BusinessCaseModel;
  grtFeedbacks?: GRTFeedback[] | null;
  helpArticle?: boolean;
};

const BusinessCaseReview = ({
  values,
  grtFeedbacks,
  helpArticle = false
}: BusinessCaseReviewProps) => {
  const filename = `Business case for ${values.requestName}.pdf`;
  return (
    <div className="margin-top-neg-1">
      <PDFExport
        title="Business Case"
        filename={filename}
        label="Download Business Case as PDF"
        linkPosition={helpArticle ? 'top' : 'bottom'}
      >
        <div className={helpArticle ? '' : 'grid-container'}>
          <SectionWrapper
            borderBottom={!!helpArticle}
            borderTop={!!helpArticle}
            className={
              helpArticle ? 'request-information-wrapper margin-top-4' : ''
            }
          >
            <h2 className="font-heading-xl margin-top-4">
              General request information
            </h2>
            <GeneralRequestInfoReview
              values={{
                requestName: values.requestName,
                businessOwner: {
                  name: values.businessOwner.name
                },
                requester: {
                  name: values.requester.name,
                  phoneNumber: values.requester.phoneNumber
                }
              }}
            />
          </SectionWrapper>

          <SectionWrapper
            borderBottom={!!helpArticle}
            className={helpArticle ? 'padding-bottom-3' : ''}
          >
            <h2 className="font-heading-xl margin-top-4">
              Request description
            </h2>
            <RequestDescriptionReview
              values={{
                businessNeed: values.businessNeed,
                currentSolutionSummary: values.currentSolutionSummary,
                cmsBenefit: values.cmsBenefit,
                priorityAlignment: values.priorityAlignment,
                successIndicators: values.successIndicators
              }}
            />
          </SectionWrapper>
        </div>

        <div className={helpArticle ? '' : 'grid-container'}>
          <h2 className="font-heading-xl margin-top-4 easi-no-print">
            Alternatives analysis
          </h2>
        </div>
        <div className="alternative-analysis-wrapper">
          <div className={helpArticle ? '' : 'grid-container'}>
            <AlternativeAnalysisReview
              fiscalYear={
                values.createdAt
                  ? getFiscalYear(parseAsDate(values.createdAt))
                  : new Date().getFullYear()
              }
              preferredSolution={values.preferredSolution}
              alternativeA={values.alternativeA}
              alternativeB={values.alternativeB}
            />
          </div>
        </div>
        {grtFeedbacks && grtFeedbacks.length > 0 && (
          <div className="bg-gray-10 margin-top-3 padding-x-3 padding-top-3 padding-bottom-1">
            <div className="grid-container">
              <GRTFeedbackView grtFeedbacks={grtFeedbacks} />
            </div>
          </div>
        )}
      </PDFExport>
    </div>
  );
};

export default BusinessCaseReview;
