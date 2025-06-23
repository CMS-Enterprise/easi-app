import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import {
  Breadcrumb,
  BreadcrumbBar,
  BreadcrumbLink,
  Button,
  ButtonGroup,
  Grid,
  GridContainer,
  Icon,
  ModalFooter,
  ModalHeading
} from '@trussworks/react-uswds';
import {
  RequestRelationType,
  SystemIntakeFragmentFragment,
  SystemIntakeState,
  SystemIntakeStatusAdmin,
  useUpdateSystemIntakeAdminLeadMutation
} from 'gql/generated/graphql';

import AdminRequestHeaderSummary from 'components/AdminRequestHeaderSummary';
import { ErrorAlert, ErrorAlertMessage } from 'components/ErrorAlert';
import Modal from 'components/Modal';
import { RadioField, RadioGroup } from 'components/RadioField';
import StateTag from 'components/StateTag';
import { RequestType } from 'types/systemIntake';
import { getPersonNameAndComponentAcronym } from 'utils/getPersonNameAndComponent';
import { translateRequestType } from 'utils/systemIntake';

import ITGovAdminContext from '../ITGovAdminContext';

import './index.scss';

export type RequestSummaryProps = {
  id: string;
  requester: SystemIntakeFragmentFragment['requester'];
  requestName: string;
  requestType: RequestType;
  statusAdmin: SystemIntakeStatusAdmin;
  adminLead?: string | null;
  submittedAt?: string | null;
  lcid?: string | null;
  contractNumbers: string[];
  state: SystemIntakeState;
  contractName?: string | null;
  relationType?: RequestRelationType | null;
  systems: SystemIntakeFragmentFragment['systems'];
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
  state,
  contractName,
  relationType,
  systems
}: RequestSummaryProps) => {
  const { t } = useTranslation('governanceReviewTeam');
  const [isModalOpen, setModalOpen] = useState(false);
  const [newAdminLead, setAdminLead] = useState('');
  const [mutate, mutationResult] = useUpdateSystemIntakeAdminLeadMutation({
    errorPolicy: 'all'
  });

  const isITGovAdmin = useContext(ITGovAdminContext);

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
          {!adminLead && (
            <Icon.Error className="text-error margin-right-05" aria-hidden />
          )}
          {adminLead || t('governanceReviewTeam:adminLeads.notAssigned')}
        </span>
        {isITGovAdmin && (
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
        )}
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
            <Breadcrumb current>{t('itGovernanceRequestDetails')}</Breadcrumb>
          </BreadcrumbBar>

          <AdminRequestHeaderSummary
            requestName={requestName}
            submittedAt={submittedAt || ''}
            requestType={translateRequestType(requestType)}
            relationType={relationType}
            contractName={contractName}
            systems={systems}
            requester={getPersonNameAndComponentAcronym(
              requester?.name || '',
              requester?.component
            )}
            contractNumbers={contractNumbers}
          />
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
              {isITGovAdmin && (
                <Link to={`/it-governance/${id}/actions`} className="usa-link">
                  {t('action:takeAnAction')}
                </Link>
              )}
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
