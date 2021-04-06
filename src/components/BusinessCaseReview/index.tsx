import React from 'react';
import { GrtFeedbackFieldsFragment } from 'graph/queries/GetGRTFeedbackQuery.generated';
import { DateTime } from 'luxon';

import GRTFeedbackView from 'components/GRTFeedbackView';
import PDFExport from 'components/PDFExport';
import { BusinessCaseModel } from 'types/businessCase';
import { getFiscalYear } from 'utils/date';

import AlternativeAnalysisReview from './AlternativeAnalysisReview';
import GeneralRequestInfoReview from './GeneralRequestInfoReview';
import RequestDescriptionReview from './RequestDescriptionReview';

import './index.scss';

type BusinessCaseReviewProps = {
  values: BusinessCaseModel;
  grtFeedbacks?: GrtFeedbackFieldsFragment[] | null;
};

const BusinessCaseReview = ({
  values,
  grtFeedbacks
}: BusinessCaseReviewProps) => {
  const filename = `Business case for ${values.requestName}.pdf`;
  return (
    <>
      <PDFExport
        title="Business Case"
        filename={filename}
        label="Download Business Case as PDF"
      >
        <div className="grid-container">
          <h2 className="font-heading-xl">General request information</h2>
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

          <h2 className="font-heading-xl margin-top-6">Request description</h2>
          <RequestDescriptionReview
            values={{
              businessNeed: values.businessNeed,
              cmsBenefit: values.cmsBenefit,
              priorityAlignment: values.priorityAlignment,
              successIndicators: values.successIndicators
            }}
          />
        </div>

        <div className="grid-container">
          <h2 className="font-heading-xl margin-top-6 margin-bottom-2 easi-no-print">
            Alternatives analysis
          </h2>
        </div>
        <div className="padding-top-2 padding-bottom-8 alternative-analysis-wrapper">
          <div className="grid-container">
            <AlternativeAnalysisReview
              fiscalYear={getFiscalYear(DateTime.fromISO(values.createdAt))}
              asIsSolution={values.asIsSolution}
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
    </>
  );
};

export default BusinessCaseReview;
