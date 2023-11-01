import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import {
  Breadcrumb,
  BreadcrumbBar,
  BreadcrumbLink,
  Button,
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
        <span className="display-flex flex-align-center margin-right-1">
          {!adminLead && (
            <IconError className="text-secondary margin-right-05" />
          )}
          {adminLead || t('governanceReviewTeam:adminLeads.notAssigned')}
        </span>
        <Button
          type="button"
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
    <>
      <section className="easi-grt__request-summary bg-primary-darker">
        {/* Update admin lead error */}
        {mutationResult.error && (
          <ErrorAlert heading="System error">
            <ErrorAlertMessage
              message={mutationResult.error.message}
              errorKey="system"
            />
          </ErrorAlert>
        )}

        {/* Request summary */}
        <div className="grid-container padding-bottom-2 text-white">
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

          <h2 className="margin-y-0">{requestName}</h2>

          <dl className="easi-grt__request-info grid-row grid-gap margin-top-0">
            <div className="tablet:grid-col-8">
              <dt className="font-body-xs">{t('requestType')}</dt>
              <dd>{translateRequestType(requestType)}</dd>

              <dt className="font-body-xs">
                {t('intake:review.contractNumber')}
              </dt>
              <dd>{contractNumber}</dd>
            </div>

            <div className="tablet:grid-col-4">
              <dt className="font-body-xs">
                {t('intake:contactDetails.requester')}
              </dt>
              <dd>
                {getPersonNameAndComponentAcronym(
                  requester?.name || '',
                  requester?.component
                )}
              </dd>

              <dt className="font-body-xs">
                {t('intake:fields.submissionDate')}
              </dt>
              <dd>
                {submittedAt
                  ? formatDateLocal(submittedAt, 'MMMM d, yyyy')
                  : 'N/A'}
              </dd>
            </div>
          </dl>
        </div>

        {/* Status & admin lead info */}
        <div className="bg-base-lightest">
          <div className="grid-container padding-y-105">
            <dl className="easi-grt__status-group grid-row grid-gap margin-y-0">
              <div className="easi-grt__status-info display-flex flex-align-center desktop:grid-col-8">
                <dt className="margin-right-1">
                  <h4 className="margin-y-0">{t('status.label')}</h4>
                </dt>
                <dd className="margin-right-1" data-testid="grt-status">
                  <StatusTag state={state} />
                </dd>
                <dd data-testid="grt-current-status">
                  {
                    /* TODO EASI-3440: Update to use v2 statuses */
                    translateStatus(status, lcid)
                  }
                  <Link
                    to={`/governance-review-team/${id}/actions`}
                    className="margin-0 tablet:margin-left-1"
                  >
                    {t('action:takeAnAction')}
                  </Link>
                </dd>
              </div>

              <div className="display-flex flex-align-center desktop:grid-col-4">
                <dt className="margin-right-1">
                  <h4 className="margin-y-0">{t('intake:fields.adminLead')}</h4>
                </dt>
                <dd
                  className="margin-x-0 display-flex"
                  data-testid="admin-lead"
                >
                  <AdminLead />
                </dd>
              </div>
            </dl>
          </div>
        </div>
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
    </>
  );
};

export default RequestSummary;
