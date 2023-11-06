import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import {
  Breadcrumb,
  BreadcrumbBar,
  BreadcrumbLink,
  Button,
  Grid,
  GridContainer,
  IconError
} from '@trussworks/react-uswds';

import Modal from 'components/Modal';
import PageHeading from 'components/PageHeading';
import { ErrorAlert, ErrorAlertMessage } from 'components/shared/ErrorAlert';
import { RadioField, RadioGroup } from 'components/shared/RadioField';
import { GetSystemIntake_systemIntake_requester as Requester } from 'queries/types/GetSystemIntake';
import { UpdateSystemIntakeAdminLead } from 'queries/types/UpdateSystemIntakeAdminLead';
import UpdateSystemIntakeAdminLeadQuery from 'queries/UpdateSystemIntakeAdminLeadQuery';
import { SystemIntakeState } from 'types/graphql-global-types';
import { RequestType } from 'types/systemIntake';
import { formatDateLocal } from 'utils/date';
import { getPersonNameAndComponentAcronym } from 'utils/getPersonNameAndComponent';
import {
  isIntakeClosed,
  translateRequestType,
  translateStatus
} from 'utils/systemIntake';

import StatusTag from './StatusTag';

import './index.scss';

type RequestSummaryProps = {
  id: string;
  requester: Requester;
  requestName: string;
  requestType: RequestType;
  status: string;
  adminLead: string | null;
  submittedAt: string | null;
  lcid: string | null;
  contractNumber: string | null;
};

const RequestSummary = ({
  id,
  requester,
  requestName,
  requestType,
  status,
  adminLead,
  submittedAt,
  lcid,
  contractNumber
}: RequestSummaryProps) => {
  const { t } = useTranslation('governanceReviewTeam');
  const [isModalOpen, setModalOpen] = useState(false);
  const [newAdminLead, setAdminLead] = useState('');
  const [mutate, mutationResult] = useMutation<UpdateSystemIntakeAdminLead>(
    UpdateSystemIntakeAdminLeadQuery,
    {
      errorPolicy: 'all'
    }
  );

  // TODO EASI-3440: update to use v2 `state` field
  const state: SystemIntakeState = isIntakeClosed(status)
    ? SystemIntakeState.CLOSED
    : SystemIntakeState.OPEN;

  /** Admin lead text and modal trigger button */
  const AdminLead = () => {
    const buttonText = t(
      `governanceReviewTeam:adminLeads.${
        adminLead ? 'changeLead' : 'assignLead'
      }`
    );

    return (
      <>
        <span className="display-flex flex-align-center">
          {!adminLead && (
            <IconError className="text-secondary margin-right-05" />
          )}
          {adminLead || t('governanceReviewTeam:adminLeads.notAssigned')}
        </span>
        <Button
          type="button"
          className="width-auto"
          unstyled
          onClick={() => {
            // Reset newAdminLead to value in intake
            resetNewAdminLead();
            setModalOpen(true);
          }}
        >
          {buttonText}
        </Button>
      </>
    );
  };

  // Resets newAdminLead to what is in intake currently. This is used to
  // reset state of modal upon exit without saving
  const resetNewAdminLead = () => {
    setAdminLead(adminLead || '');
  };

  // Send newly selected admin lead to database
  const saveAdminLead = () => {
    mutate({
      variables: {
        input: {
          id,
          adminLead: newAdminLead
        }
      }
    });
  };

  // List of current GRT admin team members
  const grtMembers: string[] = t('governanceReviewTeam:adminLeads.members', {
    returnObjects: true
  });

  return (
    <div className="easi-admin-summary">
      <section className="easi-admin-summary__request-details bg-primary-darker">
        {/* Update admin lead error */}
        {mutationResult.error && (
          <ErrorAlert heading="System error">
            <ErrorAlertMessage
              message={mutationResult.error.message}
              errorKey="system"
            />
          </ErrorAlert>
        )}

        <GridContainer className="text-white padding-bottom-1">
          {/* Breadcrumbs */}
          <BreadcrumbBar variant="wrap" className="bg-transparent text-white">
            <Breadcrumb>
              <BreadcrumbLink
                asCustom={Link}
                to="/"
                className="text-white text-underline"
              >
                {t('header:home')}
              </BreadcrumbLink>
            </Breadcrumb>
            <Breadcrumb current>{requestName}</Breadcrumb>
          </BreadcrumbBar>

          {/* Request summary */}
          <h2 className="margin-top-05 margin-bottom-2">{requestName}</h2>

          <Grid row gap>
            <Grid tablet={{ col: 8 }}>
              <h5 className="text-normal margin-y-0">{t('requestType')}</h5>
              <h4 className="margin-top-05 margin-bottom-2">
                {translateRequestType(requestType)}
              </h4>

              <h5 className="text-normal margin-y-0">
                {t('intake:review.contractNumber')}
              </h5>
              <h4 className="margin-top-05 margin-bottom-2">
                {contractNumber || t('intake:review.noContractNumber')}
              </h4>
            </Grid>

            <Grid tablet={{ col: 4 }}>
              <h5 className="text-normal margin-y-0">
                {t('intake:contactDetails.requester')}
              </h5>
              <h4 className="margin-top-05 margin-bottom-2">
                {getPersonNameAndComponentAcronym(
                  requester?.name || '',
                  requester?.component
                )}
              </h4>

              <h5 className="text-normal margin-y-0">
                {t('intake:fields.submissionDate')}
              </h5>
              <h4 className="margin-top-05 margin-bottom-2">
                {submittedAt
                  ? formatDateLocal(submittedAt, 'MMMM d, yyyy')
                  : 'N/A'}
              </h4>
            </Grid>
          </Grid>
        </GridContainer>
      </section>

      {/* Status & admin lead info */}
      <section className="easi-admin-summary__status bg-base-lightest">
        <GridContainer className="padding-y-1">
          <Grid row gap>
            {/* Status */}
            <Grid desktop={{ col: 8 }}>
              <div>
                <h4 className="margin-right-1">{t('status.label')}</h4>
                <StatusTag state={state} />
              </div>
              {
                /* TODO EASI-3440: Update to use v2 statuses */
                translateStatus(status, lcid)
              }
              <Link to={`/governance-review-team/${id}/actions`}>
                {t('action:takeAnAction')}
              </Link>
            </Grid>

            {/* Admin lead */}
            <Grid desktop={{ col: 4 }}>
              <h4 className="text-no-wrap width-full tablet:width-auto">
                {t('intake:fields.adminLead')}
              </h4>
              <AdminLead />
            </Grid>
          </Grid>
        </GridContainer>
      </section>

      {/* Change admin lead modal */}
      <Modal
        isOpen={isModalOpen}
        closeModal={() => {
          setModalOpen(false);
        }}
      >
        <PageHeading headingLevel="h2" className="margin-top-0">
          {t('governanceReviewTeam:adminLeads:assignModal.header', {
            requestName
          })}
        </PageHeading>
        <RadioGroup>
          {grtMembers.map(name => (
            <RadioField
              id={`admin-lead-${name}`}
              key={`admin-lead-${name}`}
              checked={name === newAdminLead}
              label={name}
              name="admin-lead"
              value={name}
              onChange={e => setAdminLead(e.target.value)}
              className="margin-y-3"
            />
          ))}
        </RadioGroup>
        <Button
          type="button"
          className="margin-right-4"
          onClick={() => {
            // Set admin lead as newAdminLead in the intake
            saveAdminLead();
            setModalOpen(false);
          }}
        >
          {t('governanceReviewTeam:adminLeads:assignModal.save')}
        </Button>
        <Button
          type="button"
          unstyled
          onClick={() => {
            setModalOpen(false);
          }}
        >
          {t('governanceReviewTeam:adminLeads:assignModal.noChanges')}
        </Button>
      </Modal>
    </div>
  );
};

export default RequestSummary;
