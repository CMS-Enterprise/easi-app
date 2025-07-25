import React from 'react';
import { useTranslation } from 'react-i18next';

import PDFExport from 'components/PDFExport';
import SectionWrapper from 'components/SectionWrapper';
import { BusinessCaseModel } from 'types/businessCase';
import { getFiscalYear, parseAsUTC } from 'utils/date';

import AlternativeAnalysisReview from './AlternativeAnalysisReview';
import GeneralRequestInfoReview from './GeneralRequestInfoReview';
import RequestDescriptionReview from './RequestDescriptionReview';

import './index.scss';

type BusinessCaseReviewProps = {
  values: BusinessCaseModel;
  helpArticle?: boolean;
};

const BusinessCaseReview = ({
  values,
  helpArticle = false
}: BusinessCaseReviewProps) => {
  const { t } = useTranslation('businessCase');

  const filename = `Business case for ${values.requestName}.pdf`;

  return (
    <div className="margin-top-neg-1">
      <PDFExport
        title="Business Case"
        filename={filename}
        label="Download Business Case as PDF"
        linkPosition={helpArticle ? 'top' : 'bottom'}
      >
        <SectionWrapper
          borderBottom={!!helpArticle}
          borderTop={!!helpArticle}
          className={
            helpArticle ? 'request-information-wrapper margin-top-4' : ''
          }
        >
          <hr className="margin-bottom-1 margin-top-4 opacity-30" aria-hidden />

          <h2>{t('generalRequest')}</h2>
          <GeneralRequestInfoReview
            values={{
              requestName: values.requestName,
              projectAcronym: values.projectAcronym,
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
          <hr className="margin-bottom-1 margin-top-4 opacity-30" aria-hidden />

          <h2>{t('requestDescription')}</h2>
          <RequestDescriptionReview
            values={{
              businessNeed: values.businessNeed,
              collaborationNeeded: values.collaborationNeeded,
              currentSolutionSummary: values.currentSolutionSummary,
              cmsBenefit: values.cmsBenefit,
              priorityAlignment: values.priorityAlignment,
              successIndicators: values.successIndicators,
              responseToGRTFeedback: values.responseToGRTFeedback
            }}
          />
        </SectionWrapper>

        <hr className="margin-bottom-1 margin-top-4 opacity-30" aria-hidden />

        <h2 className="easi-no-print">{t('alternatives')}</h2>
        <div className="alternative-analysis-wrapper">
          <AlternativeAnalysisReview
            fiscalYear={
              values.createdAt
                ? getFiscalYear(parseAsUTC(values.createdAt))
                : new Date().getFullYear()
            }
            preferredSolution={values.preferredSolution}
            alternativeA={values.alternativeA}
            alternativeB={values.alternativeB}
          />
        </div>
      </PDFExport>
    </div>
  );
};

export default BusinessCaseReview;
