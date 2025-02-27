import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import {
  Breadcrumb,
  BreadcrumbBar,
  BreadcrumbLink,
  Link as UswdsLink
} from '@trussworks/react-uswds';
import GetSystemIntakeQuery from 'gql/legacyGQL/GetSystemIntakeQuery';
import {
  GetSystemIntake,
  GetSystemIntakeVariables
} from 'gql/legacyGQL/types/GetSystemIntake';
import { SystemIntake } from 'gql/legacyGQL/types/SystemIntake';

import UswdsReactLink from 'components/LinkWrapper';
import MainContent from 'components/MainContent';
import PageHeading from 'components/PageHeading';
import PageLoading from 'components/PageLoading';
import { IT_GOV_EMAIL } from 'constants/externalUrls';
import { SystemIntakeDecisionState } from 'types/graphql-global-types';

import Approved from './Approved';
import NotGovernance from './NotGovernance';
import Rejected from './Rejected';

import './index.scss';

type DecisionComponentProps = {
  systemIntake: SystemIntake;
};

/** Renders decision content based on `decisionState` field */
const DecisionComponent = ({ systemIntake }: DecisionComponentProps) => {
  const { decisionState } = systemIntake;
  const { t } = useTranslation('governanceReviewTeam');

  switch (decisionState) {
    case SystemIntakeDecisionState.LCID_ISSUED:
      return <Approved intake={systemIntake} />;

    case SystemIntakeDecisionState.NOT_APPROVED:
      return <Rejected intake={systemIntake} />;

    case SystemIntakeDecisionState.NOT_GOVERNANCE:
      return <NotGovernance intake={systemIntake} />;

    default:
      return <p>{t('decision.noDecision')}</p>;
  }
};

const RequestDecision = () => {
  const { systemId } = useParams<{ systemId: string }>();
  const { t } = useTranslation('taskList');

  const { loading, data } = useQuery<GetSystemIntake, GetSystemIntakeVariables>(
    GetSystemIntakeQuery,
    {
      variables: {
        id: systemId
      }
    }
  );

  const systemIntake = data?.systemIntake;

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
        <div className="grid-row grid-gap-6 margin-top-2">
          <div className="desktop:grid-col-9 margin-bottom-2">
            <PageHeading className="margin-top-2">
              {t('navigation.nextSteps')}
            </PageHeading>

            <DecisionComponent systemIntake={systemIntake} />

            <UswdsReactLink
              className="usa-button margin-top-4"
              variant="unstyled"
              to={`/governance-task-list/${systemId}`}
            >
              {t('navigation.returnToTaskList')}
            </UswdsReactLink>
          </div>

          {/* Sidebar */}
          <div className="desktop:grid-col-3">
            <div className="sidebar margin-top-4">
              <h3 className="font-sans-sm">{t('decision.needHelp')}</h3>
              <p>
                <UswdsLink href={`mailto:${IT_GOV_EMAIL}`}>
                  {IT_GOV_EMAIL}
                </UswdsLink>
              </p>
            </div>
          </div>
        </div>
      )}
    </MainContent>
  );
};

export default RequestDecision;
