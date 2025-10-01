import React, { useRef } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Link, useHistory, useParams } from 'react-router-dom';
import { useReactToPrint } from 'react-to-print';
import {
  Breadcrumb,
  BreadcrumbBar,
  BreadcrumbLink,
  Icon,
  Link as UswdsLink,
  SummaryBox,
  SummaryBoxContent,
  SummaryBoxHeading
} from '@trussworks/react-uswds';
import { LcidInfoContainer } from 'features/ITGovernance/Admin/Decision';
import { DecisionProvider } from 'features/ITGovernance/Admin/Decision/DecisionContext';
import {
  SystemIntakeDecisionState,
  useGetSystemIntakeQuery
} from 'gql/generated/graphql';

import Alert from 'components/Alert';
import IconButton from 'components/IconButton';
import MainContent from 'components/MainContent';
import PageHeading from 'components/PageHeading';
import PageLoading from 'components/PageLoading';
import { PDFExportButton } from 'components/PDFExport';
import { RichTextViewer } from 'components/RichTextEditor';
import { ENTERPRISE_ARCH_EMAIL, IT_GOV_EMAIL } from 'constants/externalUrls';
import { formatDateLocal } from 'utils/date';

import './index.scss';

const RequestDecision = () => {
  const { systemId } = useParams<{ systemId: string }>();
  const { t } = useTranslation('taskList');
  const history = useHistory();

  const { loading, data } = useGetSystemIntakeQuery({
    variables: {
      id: systemId
    }
  });

  const systemIntake = data?.systemIntake;

  const printRef = useRef<HTMLDivElement>(null);
  const handlePrint = useReactToPrint({
    documentTitle: `${t('navigation.nextSteps')}.pdf`,
    content: () => printRef.current,
    pageStyle: `
      @page {
        margin: 1in;
      }
    `
  });

  return (
    <MainContent className="grid-container margin-bottom-7">
      <div className="grid-row">
        <BreadcrumbBar variant="wrap">
          <Breadcrumb>
            <BreadcrumbLink asCustom={Link} to="/">
              <span>{t('navigation.home')}</span>
            </BreadcrumbLink>
          </Breadcrumb>
          <Breadcrumb>
            <BreadcrumbLink
              asCustom={Link}
              to={`/governance-task-list/${systemId}`}
            >
              <span>{t('navigation.governanceTaskList')}</span>
            </BreadcrumbLink>
          </Breadcrumb>
          <Breadcrumb current>{t('navigation.nextSteps')}</Breadcrumb>
        </BreadcrumbBar>
      </div>

      {loading && <PageLoading />}

      {systemIntake && (
        <>
          <PageHeading className="margin-top-2 margin-bottom-1">
            {t('navigation.nextSteps')}
          </PageHeading>

          <div className="display-flex">
            <IconButton
              type="button"
              icon={<Icon.ArrowBack aria-hidden />}
              className="margin-y-0"
              onClick={() => {
                history.goBack();
              }}
              unstyled
            >
              {t('taskList:navigation.returnToGovernanceTaskList')}
            </IconButton>
            <span className="margin-x-2 text-base-light">|</span>
            <PDFExportButton handlePrint={handlePrint}>
              {t('decisionNextSteps.downloadPDF')}
            </PDFExportButton>
          </div>

          <div ref={printRef}>
            <DecisionProvider {...systemIntake}>
              <LcidInfoContainer isRequester />
            </DecisionProvider>

            {systemIntake.decisionState !==
              SystemIntakeDecisionState.NOT_GOVERNANCE && (
              <>
                <h2 className="margin-top-4 margin-bottom-2">
                  {t('decision.nextSteps')}
                </h2>
                <Alert slim type="info">
                  {t('decision.nextStepsAlert')}
                </Alert>
                <p className="easi-body-normal">
                  <RichTextViewer
                    value={
                      systemIntake.decisionNextSteps ||
                      t('notes.extendLcid.noNextSteps')
                    }
                  />
                </p>
                {systemIntake.decidedAt && (
                  <p className="text-base">
                    {t('decision.nextStepRecommendedOn', {
                      date: formatDateLocal(
                        systemIntake.decidedAt,
                        'MM/dd/yyyy'
                      )
                    })}
                  </p>
                )}

                <h3 className="margin-top-4 margin-bottom-2">
                  {t('decision.consultWithTheTRB.heading')}
                </h3>
                <p className="easi-body-normal">
                  {t('decision.consultWithTheTRB.content', {
                    context: systemIntake.trbFollowUpRecommendation
                  })}
                </p>

                <IconButton
                  type="button"
                  icon={<Icon.ArrowForward aria-hidden />}
                  iconPosition="after"
                  className="margin-y-0"
                  onClick={() => {
                    history.push('/trb/start');
                  }}
                  unstyled
                >
                  {t('technicalAssistance:breadcrumbs.startTrbRequest')}
                </IconButton>

                {systemIntake.decisionState ===
                  SystemIntakeDecisionState.LCID_ISSUED && (
                  <>
                    <h3 className="margin-top-4 margin-bottom-2">
                      {t('decision.updateSystemProfile.heading')}
                    </h3>
                    <p className="easi-body-normal margin-bottom-0">
                      {t('decision.updateSystemProfile.copy')}
                    </p>
                    <ul className="margin-top-0">
                      <li className="easi-body-normal">
                        {t('decision.updateSystemProfile.list1')}
                      </li>
                      <li className="easi-body-normal">
                        <Trans
                          i18nKey="taskList:decision.updateSystemProfile.list2"
                          values={{ email: ENTERPRISE_ARCH_EMAIL }}
                          components={{
                            emailLink: (
                              <UswdsLink
                                href={`mailto:${ENTERPRISE_ARCH_EMAIL}`}
                              >
                                {' '}
                              </UswdsLink>
                            )
                          }}
                        />
                      </li>
                    </ul>
                  </>
                )}
              </>
            )}
          </div>

          <SummaryBox className="grid-col-6 margin-top-10 margin-bottom-4">
            <SummaryBoxHeading headingLevel="h3" className="margin-bottom-2">
              {t('decision.haveQuestions')}
            </SummaryBoxHeading>
            <SummaryBoxContent>
              <Trans
                i18nKey="taskList:decision.contact"
                values={{ email: IT_GOV_EMAIL }}
                components={{
                  emailLink: (
                    <UswdsLink href={`mailto:${IT_GOV_EMAIL}`}> </UswdsLink>
                  )
                }}
              />
            </SummaryBoxContent>
          </SummaryBox>

          <div className="display-flex">
            <IconButton
              type="button"
              icon={<Icon.ArrowBack aria-hidden />}
              className="margin-y-0"
              onClick={() => {
                history.goBack();
              }}
              unstyled
            >
              {t('taskList:navigation.returnToGovernanceTaskList')}
            </IconButton>
            <span className="margin-x-2 text-base-light">|</span>
            <PDFExportButton handlePrint={handlePrint}>
              {t('decisionNextSteps.downloadPDF')}
            </PDFExportButton>
          </div>
        </>
      )}
    </MainContent>
  );
};

export default RequestDecision;
