import React, { useEffect, useState } from 'react';
import { FieldPath } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { ErrorMessage } from '@hookform/error-message';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Form } from '@trussworks/react-uswds';
import Pager from 'features/TechnicalAssistance/Requester/RequestForm/Pager';
import {
  GetSystemIntakeDocument,
  SystemIntakeContactFragment,
  SystemIntakeFormState,
  SystemIntakeFragmentFragment,
  SystemIntakeRequestType,
  UpdateSystemIntakeContactDetailsInput,
  useUpdateSystemIntakeContactDetailsMutation
} from 'gql/generated/graphql';

import Alert from 'components/Alert';
import { EasiFormProvider, useEasiForm } from 'components/EasiForm';
import { ErrorAlert, ErrorAlertMessage } from 'components/ErrorAlert';
import FeedbackBanner from 'components/FeedbackBanner';
import PageHeading from 'components/PageHeading';
import PageNumber from 'components/PageNumber';
import RequiredFieldsText from 'components/RequiredFieldsText';
import SystemIntakeContactsTable from 'components/SystemIntakeContactsTable';
import { GovernanceTeamsForm } from 'types/systemIntake';
import flattenFormErrors from 'utils/flattenFormErrors';
import SystemIntakeValidationSchema from 'validations/systemIntakeSchema';

import Section from '../_components/Section';

import ContactFormModal from './_components/ContactFormModal';
import GovernanceTeams from './GovernanceTeams';
import { formatGovernanceTeamsInput } from './utils';

import './index.scss';

type ContactDetailsProps = {
  systemIntake: SystemIntakeFragmentFragment;
};

/**
 * Contact details page of system intake form
 *
 * Contains the contacts table and governance team fields
 */
const ContactDetails = ({ systemIntake }: ContactDetailsProps) => {
  const { t } = useTranslation('intake');
  const history = useHistory();

  const [contactToEdit, setContactToEdit] =
    useState<SystemIntakeContactFragment | null>(null);

  const [isContactsModalOpen, setIsContactsModalOpen] = useState(false);

  const [updateGovernanceTeams] = useUpdateSystemIntakeContactDetailsMutation({
    refetchQueries: [
      {
        query: GetSystemIntakeDocument,
        variables: {
          id: systemIntake.id
        }
      }
    ]
  });

  const saveExitLink =
    systemIntake.requestType === SystemIntakeRequestType.SHUTDOWN
      ? '/'
      : `/governance-task-list/${systemIntake.id}`;

  const form = useEasiForm<GovernanceTeamsForm>({
    resolver: yupResolver(SystemIntakeValidationSchema.governanceTeams),
    defaultValues: {
      isPresent: false,
      teams: {
        securityPrivacy: {
          isPresent: false,
          collaborator: ''
        },
        technicalReviewBoard: {
          isPresent: false,
          collaborator: ''
        },
        clearanceOfficer508: {
          isPresent: false,
          collaborator: ''
        }
      }
    }
  });

  const {
    handleSubmit,
    setFocus,
    watch,
    setError,
    formState: { isDirty, errors }
  } = form;

  const governanceTeams = watch('teams');
  const isPresent = watch('isPresent');

  /**
   * Update governance teams and execute callback if provided
   *
   * Optional prop to skip validation and hide any server errors
   */
  const submit = async (
    callback: () => void = () => {},
    /** Pass `true` if fields are being validated before submission (i.e., when wrapped in `handleSubmit`) */
    shouldValidate: boolean = false
  ) => {
    if (!isDirty) return callback();

    // TODO: EASI-4938 - remove type assertion when mutation input is updated to remove contacts
    const input: UpdateSystemIntakeContactDetailsInput = {
      id: systemIntake.id,
      governanceTeams: {
        isPresent,
        teams: formatGovernanceTeamsInput(governanceTeams)
      }
    } as UpdateSystemIntakeContactDetailsInput;

    const result = await updateGovernanceTeams({
      variables: {
        input
      }
    });

    if (!result?.errors) return callback();

    // Only set server error if validating form before submission
    if (shouldValidate) {
      return setError('root', {
        message: t('error:encounteredIssueTryAgain')
      });
    }

    // If skipping errors, return callback
    return callback();
  };

  /** Flattened field errors, excluding any root errors */
  const fieldErrors = flattenFormErrors<GovernanceTeamsForm>(errors);

  /** Close contacts modal and reset contact to edit */
  const handleCloseContactsModal = () => {
    if (contactToEdit) {
      setContactToEdit(null);
    }
    setIsContactsModalOpen(false);
  };

  useEffect(() => {
    setIsContactsModalOpen(!!contactToEdit);
  }, [contactToEdit]);

  return (
    <>
      <ContactFormModal
        type="contact"
        systemIntakeId={systemIntake.id}
        isOpen={isContactsModalOpen}
        closeModal={handleCloseContactsModal}
        initialValues={
          contactToEdit
            ? {
                id: contactToEdit.id,
                userInfo: {
                  euaUserId: contactToEdit.userAccount.username,
                  commonName: contactToEdit.userAccount.commonName,
                  email: contactToEdit.userAccount.email
                },
                component: contactToEdit.component,
                roles: contactToEdit.roles,
                isRequester: contactToEdit.isRequester
              }
            : undefined
        }
      />

      {Object.keys(errors).length > 0 && (
        <ErrorAlert
          testId="contact-details-errors"
          classNames="margin-top-3"
          heading={t('form:inputError.checkFix')}
          autoFocus={false}
        >
          {Object.keys(fieldErrors).map(key => {
            return (
              <ErrorMessage
                errors={errors}
                name={key}
                key={key}
                render={({ message }) => (
                  <ErrorAlertMessage
                    message={message}
                    onClick={() =>
                      setFocus(key as FieldPath<GovernanceTeamsForm>)
                    }
                  />
                )}
              />
            );
          })}
        </ErrorAlert>
      )}

      <ErrorMessage errors={errors} name="root" as={<Alert type="error" />} />

      <PageHeading className="margin-top-4 margin-bottom-1">
        {t('contactDetails.heading')}
      </PageHeading>

      <p className="font-body-lg line-height-body-5 margin-top-0 margin-bottom-2 text-light">
        {t('contactDetails.intakeProcessDescription')}
      </p>

      <RequiredFieldsText className="margin-top-0 margin-bottom-5" />

      {systemIntake.requestFormState ===
        SystemIntakeFormState.EDITS_REQUESTED && (
        <FeedbackBanner id={systemIntake.id} type="Intake Request" />
      )}

      <Form
        onSubmit={handleSubmit(() =>
          submit(() => history.push('request-details'), true)
        )}
        className="maxw-none tablet:grid-col-9 margin-bottom-7"
      >
        <Section heading={t('contactDetails.teamMembersPointsOfContact')}>
          <p className="margin-bottom-1">
            {t('contactDetails.addTeamMembers')}
          </p>

          <Button
            type="button"
            onClick={() => setIsContactsModalOpen(true)}
            outline
            className="margin-top-0"
          >
            {t('contactDetails.addAnotherContact')}
          </Button>

          <Alert type="warning" className="margin-top-3" slim>
            {t('contactDetails.contactsTableWarning')}
          </Alert>

          <SystemIntakeContactsTable
            systemIntakeId={systemIntake.id}
            className="margin-top-3 padding-top-05 margin-bottom-6"
            handleEditContact={setContactToEdit}
          />
        </Section>

        {/* Governance Teams */}
        <Section heading={t('requestDetails.subsectionHeadings.collaboration')}>
          <EasiFormProvider<GovernanceTeamsForm> {...form}>
            <GovernanceTeams />
          </EasiFormProvider>
        </Section>

        <Pager
          next={{
            type: 'submit'
          }}
          border
          taskListUrl={saveExitLink}
          submit={() => submit(() => history.push(saveExitLink))}
          className="margin-top-5"
        />
      </Form>

      {/* <AutoSave values={watch()} onSave={submit} debounceDelay={3000} /> */}

      <PageNumber currentPage={1} totalPages={5} className="margin-bottom-15" />
    </>
  );
};

export default ContactDetails;
