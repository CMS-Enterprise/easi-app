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

import Alert from 'components/Alert';
import UswdsReactLink from 'components/LinkWrapper';
import MainContent from 'components/MainContent';
import PageHeading from 'components/PageHeading';
import PageLoading from 'components/PageLoading';
import { formatDateUtc } from 'utils/date';

import './index.scss';

const LcidInfo = () => {
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
    <MainContent className="lcid-info grid-container margin-bottom-7">
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
          <Breadcrumb current>{t('navigation.lcidInfo')}</Breadcrumb>
        </BreadcrumbBar>
      </div>
      {loading && <PageLoading />}

      {systemIntake && (
        <div className="grid-row">
          <div className="tablet:grid-col-9">
            <PageHeading>{t('decision.aboutThisLcid')}</PageHeading>
            <div className="easi-lcid__info" data-testid="lcid-info">
              <dl>
                <dt>{t('decision.lcid')}</dt>
                <dd className="margin-left-0 font-body-xl text-bold">
                  {systemIntake.lcid}
                </dd>
                <dd className="margin-left-0">
                  <p>{t('decision.tempLcidExplanation')}</p>
                </dd>
                <dd className="margin-left-0 text-bold">
                  {systemIntake.lcidExpiresAt && (
                    <p>
                      {t('decision.lcidExpiration', {
                        date: formatDateUtc(
                          systemIntake.lcidExpiresAt,
                          'MMMM d, yyyy'
                        )
                      })}
                    </p>
                  )}
                </dd>
                <dd className="margin-left-0">
                  <h3>{t('decision.lcidScope')}</h3>
                  <p className="text-pre-wrap">{systemIntake.lcidScope}</p>
                </dd>
                <dd className="margin-left-0">
                  {systemIntake?.lcidCostBaseline && (
                    <>
                      <h3 className="margin-top-0">
                        {t('decision.costBaseline')}
                      </h3>
                      <p>{systemIntake.lcidCostBaseline}</p>
                    </>
                  )}
                </dd>
              </dl>
            </div>
            <h2>{t('decision.nextSteps')}</h2>
            <Alert type="warning">{t('decision.tempLcidNextSteps')}</Alert>
            {systemIntake.decisionNextSteps && (
              <p className="text-pre-wrap">{systemIntake.decisionNextSteps}</p>
            )}
            <div className="margin-top-4">
              <UswdsReactLink
                className="usa-button margin-bottom-2"
                variant="unstyled"
                to={`/governance-task-list/${systemIntake.id}`}
              >
                {t('navigation.returnToTaskList')}
              </UswdsReactLink>
            </div>
          </div>
          <div className="tablet:grid-col-1" />
          <div className="tablet:grid-col-2">
            <div className="sidebar margin-top-4">
              <h3 className="font-sans-sm">
                Need help? Contact the Governance team
              </h3>
              <p>
                <UswdsLink href="mailto:IT_Governance@cms.hhs.gov">
                  IT_Governance@cms.hhs.gov
                </UswdsLink>
              </p>
            </div>
          </div>
        </div>
      )}
    </MainContent>
  );
};

export default LcidInfo;
