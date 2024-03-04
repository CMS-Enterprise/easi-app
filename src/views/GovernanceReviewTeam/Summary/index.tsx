import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import {
  Breadcrumb,
  BreadcrumbBar,
  BreadcrumbLink,
  Button,
  ButtonGroup,
  Grid,
  GridContainer,
  IconError,
  ModalFooter,
  ModalHeading
} from '@trussworks/react-uswds';

import Modal from 'components/Modal';
import { ErrorAlert, ErrorAlertMessage } from 'components/shared/ErrorAlert';
import { RadioField, RadioGroup } from 'components/shared/RadioField';
import StateTag from 'components/StateTag';
import { GetSystemIntake_systemIntake_requester as Requester } from 'queries/types/GetSystemIntake';
import { UpdateSystemIntakeAdminLead } from 'queries/types/UpdateSystemIntakeAdminLead';
import UpdateSystemIntakeAdminLeadQuery from 'queries/UpdateSystemIntakeAdminLeadQuery';
import {
  SystemIntakeState,
  SystemIntakeStatusAdmin
} from 'types/graphql-global-types';
import { RequestType } from 'types/systemIntake';
import { formatDateLocal } from 'utils/date';
import { getPersonNameAndComponentAcronym } from 'utils/getPersonNameAndComponent';
import { translateRequestType } from 'utils/systemIntake';

import './index.scss';

type RequestSummaryProps = {
  id: string;
  requester: Requester;
  requestName: string;
  requestType: RequestType;
  statusAdmin: SystemIntakeStatusAdmin;
  adminLead: string | null;
  submittedAt: string | null;
  lcid: string | null;
  contractNumbers: string[];
  state: SystemIntakeState;
};

const RequestSummary = ({
  id,
  requester,
  requestName,
  requestType,
  statusAdmin,
  adminLead,
  submittedAt,
  lcid,
  contractNumbers = [],
  state
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

  /** Admin lead text and modal trigger button */
  const AdminLead = () => {
    const buttonText = t(
      `governanceReviewTeam:adminLeads.${
        adminLead ? 'changeLead' : 'assignLead'
      }`
    );

    return (
      <>
        <span
          className="display-flex flex-align-center"
          data-testid="admin-lead"
        >
          {!adminLead && <IconError className="text-error margin-right-05" />}
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
            <Breadcrumb current>{t('governanceRequestDetails')}</Breadcrumb>
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
                {/* TODO: (Sam) review */}
                {contractNumbers.join(', ') ||
                  t('intake:review.noContractNumber')}
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
                <StateTag state={state} />
              </div>
              {
                // Don't display additional status if closed with no decision
                statusAdmin !== SystemIntakeStatusAdmin.CLOSED && (
                  <p
                    className="text-base-dark"
                    data-testid="grt-current-status"
                  >
                    {t(`systemIntakeStatusAdmin.${statusAdmin}`, { lcid })}
                  </p>
                )
              }
              <Link
                to={`/governance-review-team/${id}/actions`}
                className="usa-link"
              >
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
        <ModalHeading>
          {t('governanceReviewTeam:adminLeads:assignModal.header', {
            requestName
          })}
        </ModalHeading>
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
            />
          ))}
        </RadioGroup>
        <ModalFooter>
          <ButtonGroup>
            <Button
              type="button"
              className="margin-right-1"
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
          </ButtonGroup>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default RequestSummary;
