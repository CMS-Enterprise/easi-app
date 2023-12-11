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
import { useFlags } from 'launchdarkly-react-client-sdk';

import MainContent from 'components/MainContent';
import PageHeading from 'components/PageHeading';
import PageLoading from 'components/PageLoading';
import GetSystemIntakeQuery from 'queries/GetSystemIntakeQuery';
import {
  GetSystemIntake,
  GetSystemIntakeVariables
} from 'queries/types/GetSystemIntake';
import { SystemIntakeStatusRequester } from 'types/graphql-global-types';

import Approved from './Approved';
import Rejected from './Rejected';

import './index.scss';

const RequestDecision = () => {
  const { systemId } = useParams<{ systemId: string }>();
  const { t } = useTranslation('taskList');
  const flags = useFlags();

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

      {data?.systemIntake && (
        <div className="grid-row">
          <div className="tablet:grid-col-9">
            <PageHeading>Decision and next steps</PageHeading>
            {flags.itGovV2Fields ? (
              <>
                {systemIntake?.statusRequester ===
                  SystemIntakeStatusRequester.LCID_ISSUED && (
                  <Approved intake={systemIntake} />
                )}
                {systemIntake?.statusRequester ===
                  SystemIntakeStatusRequester.NOT_APPROVED && (
                  <Rejected intake={systemIntake} />
                )}
              </>
            ) : (
              <>
                {systemIntake?.status === 'LCID_ISSUED' && (
                  <Approved intake={systemIntake} />
                )}
                {systemIntake?.status === 'NOT_APPROVED' && (
                  <Rejected intake={systemIntake} />
                )}
              </>
            )}
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

export default RequestDecision;
