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
import classnames from 'classnames';

import Modal from 'components/Modal';
import PageHeading from 'components/PageHeading';
import { ErrorAlert, ErrorAlertMessage } from 'components/shared/ErrorAlert';
import { RadioField, RadioGroup } from 'components/shared/RadioField';
import { GetSystemIntake_systemIntake_requester as Requester } from 'queries/types/GetSystemIntake';
import { UpdateSystemIntakeAdminLead } from 'queries/types/UpdateSystemIntakeAdminLead';
import UpdateSystemIntakeAdminLeadQuery from 'queries/UpdateSystemIntakeAdminLeadQuery';
import { RequestType } from 'types/systemIntake';
import { formatDateLocal } from 'utils/date';
import { getPersonNameAndComponentAcronym } from 'utils/getPersonNameAndComponent';
import {
  isIntakeClosed,
  isIntakeOpen,
  translateRequestType,
  translateStatus
} from 'utils/systemIntake';

type RequestSummaryProps = {
  id: string;
  requester: Requester;
  requestName: string;
  requestType: RequestType;
  status: string;
  adminLead: string | null;
  submittedAt: string | null;
  lcid: string | null;
};

const RequestSummary = ({
  id,
  requester,
  requestName,
  requestType,
  status,
  adminLead,
  submittedAt,
  lcid
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

  // Get admin lead assigned to intake
  const getAdminLead = () => {
    if (adminLead) {
      return adminLead;
    }
    return (
      <div className="display-flex flex-align-center">
        <IconError className="text-secondary margin-right-05" />
        {t('governanceReviewTeam:adminLeads.notAssigned')}
      </div>
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
    <section className="easi-grt__request-summary">
      {mutationResult.error && (
        <ErrorAlert heading="System error">
          <ErrorAlertMessage
            message={mutationResult.error.message}
            errorKey="system"
          />
        </ErrorAlert>
      )}
      <div className="grid-container padding-bottom-2">
        <BreadcrumbBar variant="wrap" className="bg-transparent text-white">
          <Breadcrumb>
            <BreadcrumbLink asCustom={Link} to="/">
              <span className="text-white">Home</span>
            </BreadcrumbLink>
          </Breadcrumb>
          <Breadcrumb current>{requestName}</Breadcrumb>
        </BreadcrumbBar>
        <dl className="easi-grt__request-info">
          <div>
            <dt>{t('intake:fields.projectName')}</dt>
            <dd>{requestName}</dd>
          </div>
          <div className="easi-grt__request-info-col">
            <div className="easi-grt__description-group">
              <dt>{t('intake:contactDetails.requester')}</dt>
              <dd>
                {getPersonNameAndComponentAcronym(
                  requester.name,
                  requester?.component
                )}
              </dd>
            </div>
            <div className="easi-grt__description-group">
              <dt>{t('intake:fields.submissionDate')}</dt>
              <dd>
                {submittedAt
                  ? formatDateLocal(submittedAt, 'MMMM d, yyyy')
                  : 'N/A'}
              </dd>
            </div>
            <div className="easi-grt__description-group">
              <dt>{t('intake:fields.requestFor')}</dt>
              <dd>{translateRequestType(requestType)}</dd>
            </div>
          </div>
        </dl>
      </div>

      <div
        className={classnames({
          'bg-base-lightest': isIntakeClosed(status),
          'easi-grt__status--open': isIntakeOpen(status)
        })}
      >
        <div className="grid-container overflow-auto">
          <dl className="easi-grt__status-group">
            <div className="easi-grt__status-info text-gray-90">
              <dt className="text-bold">{t('status.label')}</dt>
              &nbsp;
              <dd
                className="text-uppercase text-white bg-base-dark padding-05 font-body-3xs"
                data-testid="grt-status"
              >
                {isIntakeClosed(status) ? t('status.closed') : t('status.open')}
              </dd>
              <>
                <dt data-testid="grt-current-status">
                  {translateStatus(status, lcid)}
                </dt>
              </>
            </div>
            <div className="display-flex text-gray-90">
              <span className="text-bold">{t('intake:fields.adminLead')}</span>
              <span className="margin-x-1" data-testid="admin-lead">
                {getAdminLead()}
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
                {t('governanceReviewTeam:adminLeads.changeLead')}
              </Button>
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
          </dl>
        </div>
      </div>
    </section>
  );
};

export default RequestSummary;
