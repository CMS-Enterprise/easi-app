import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { Button } from '@trussworks/react-uswds';
import classnames from 'classnames';
import { GetSystemIntake_systemIntake as SystemIntake } from 'queries/types/GetSystemIntake';
import { UpdateSystemIntakeAdminLead } from 'queries/types/UpdateSystemIntakeAdminLead';
import UpdateSystemIntakeAdminLeadQuery from 'queries/UpdateSystemIntakeAdminLeadQuery';

import BreadcrumbNav from 'components/BreadcrumbNav';
import Modal from 'components/Modal';
import PageHeading from 'components/PageHeading';
import { ErrorAlert, ErrorAlertMessage } from 'components/shared/ErrorAlert';
import { RadioField, RadioGroup } from 'components/shared/RadioField';
import cmsDivisionsAndOffices from 'constants/enums/cmsDivisionsAndOffices';
import formatDate from 'utils/formatDate';
import {
  isIntakeClosed,
  isIntakeOpen,
  translateRequestType
} from 'utils/systemIntake';

const RequestSummary = ({ intake }: { intake: SystemIntake }) => {
  const { t } = useTranslation('governanceReviewTeam');
  const [isModalOpen, setModalOpen] = useState(false);
  const [newAdminLead, setAdminLead] = useState('');
  const [mutate, mutationResult] = useMutation<UpdateSystemIntakeAdminLead>(
    UpdateSystemIntakeAdminLeadQuery,
    {
      errorPolicy: 'all'
    }
  );

  const component = cmsDivisionsAndOffices.find(
    c => c.name === intake.requester.component
  );

  const requesterNameAndComponent = component
    ? `${intake.requester.name}, ${component.acronym}`
    : intake.requester.name;

  // Get admin lead assigned to intake
  const getAdminLead = () => {
    if (intake.adminLead) {
      return intake.adminLead;
    }
    return (
      <>
        <i className="fa fa-exclamation-circle text-secondary margin-right-05" />
        {t('governanceReviewTeam:adminLeads.notAssigned')}
      </>
    );
  };

  // Resets newAdminLead to what is in intake currently. This is used to
  // reset state of modal upon exit without saving
  const resetNewAdminLead = () => {
    setAdminLead(intake.adminLead || '');
  };

  // Send newly selected admin lead to database
  const saveAdminLead = () => {
    mutate({
      variables: {
        input: {
          id: intake?.id,
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
      <div className="grid-container padding-y-2">
        <BreadcrumbNav>
          <li>
            <Link className="text-white" to="/">
              Home
            </Link>
            <i className="fa fa-angle-right margin-x-05" aria-hidden />
          </li>
          <li>{intake.requestName}</li>
        </BreadcrumbNav>
        <dl className="easi-grt__request-info">
          <div>
            <dt>{t('intake:fields.projectName')}</dt>
            <dd>{intake.requestName}</dd>
          </div>
          <div className="easi-grt__request-info-col">
            <div className="easi-grt__description-group">
              <dt>{t('intake:fields.requester')}</dt>
              <dd>{requesterNameAndComponent}</dd>
            </div>
            <div className="easi-grt__description-group">
              <dt>{t('intake:fields.submissionDate')}</dt>
              <dd>
                {intake.submittedAt ? formatDate(intake.submittedAt) : 'N/A'}
              </dd>
            </div>
            <div className="easi-grt__description-group">
              <dt>{t('intake:fields.requestFor')}</dt>
              <dd>{translateRequestType(intake.requestType)}</dd>
            </div>
          </div>
        </dl>
      </div>

      <div
        className={classnames({
          'bg-base-lightest': isIntakeClosed(intake.status),
          'easi-grt__status--open': isIntakeOpen(intake.status)
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
                {isIntakeClosed(intake.status)
                  ? t('status.closed')
                  : t('status.open')}
              </dd>
              {intake.lcid && (
                <>
                  <dt>{t('intake:lifecycleId')}:&nbsp;</dt>
                  <dd data-testid="grt-lcid">{intake.lcid}</dd>
                </>
              )}
            </div>
            <div className="text-gray-90">
              <dt className="text-bold">{t('intake:fields.adminLead')}</dt>
              <dd className="margin-left-0 padding-1">{getAdminLead()}</dd>
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
                title={t('governanceReviewTeam:adminLeads:assignModal.title')}
                isOpen={isModalOpen}
                closeModal={() => {
                  setModalOpen(false);
                }}
              >
                <PageHeading headingLevel="h2" className="margin-top-0">
                  {t('governanceReviewTeam:adminLeads:assignModal.header', {
                    requestName: intake.requestName
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
