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
import Decision, {
  LcidInfoContainer
} from 'features/ITGovernance/Admin/Decision';
import { DecisionProvider } from 'features/ITGovernance/Admin/Decision/DecisionContext';
import {
  SystemIntakeDecisionState,
  SystemIntakeFragmentFragment,
  useGetSystemIntakeQuery
} from 'gql/generated/graphql';

import IconButton from 'components/IconButton';
import UswdsReactLink from 'components/LinkWrapper';
import MainContent from 'components/MainContent';
import PageHeading from 'components/PageHeading';
import PageLoading from 'components/PageLoading';
import PDFExport, { PDFExportButton } from 'components/PDFExport';
import { IT_GOV_EMAIL } from 'constants/externalUrls';

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
        margin: auto;
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
              <LcidInfoContainer />
            </DecisionProvider>
          </div>

          <SummaryBox className="grid-col-6 margin-top-0 margin-bottom-5">
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

          {/* <UswdsReactLink
              className="usa-button margin-top-4"
              variant="unstyled"
              to={`/governance-task-list/${systemId}`}
            >
              {t('navigation.returnToTaskList')}
            </UswdsReactLink> */}
          {/* Sidebar */}
          {/* <div className="desktop:grid-col-3">
            <div className="sidebar margin-top-4">
              <h3 className="font-sans-sm">{t('decision.needHelp')}</h3>
              <p>
                <UswdsLink href={`mailto:${IT_GOV_EMAIL}`}>
                  {IT_GOV_EMAIL}
                </UswdsLink>
              </p>
            </div>
          </div> */}
        </>
      )}
    </MainContent>
  );
};

export default RequestDecision;
