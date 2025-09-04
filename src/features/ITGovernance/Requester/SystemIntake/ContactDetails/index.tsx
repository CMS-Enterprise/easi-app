import React from 'react';
import { FieldPath } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { ErrorMessage } from '@hookform/error-message';
import { yupResolver } from '@hookform/resolvers/yup';
import { Form } from '@trussworks/react-uswds';
import Pager from 'features/TechnicalAssistance/Requester/RequestForm/Pager';
import {
  GetSystemIntakeDocument,
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
import MandatoryFieldsAlert from 'components/MandatoryFieldsAlert';
import PageHeading from 'components/PageHeading';
import PageNumber from 'components/PageNumber';
import SystemIntakeContactsTable from 'components/SystemIntakeContactsTable';
import { GovernanceTeamsForm } from 'types/systemIntake';
import flattenFormErrors from 'utils/flattenFormErrors';
import SystemIntakeValidationSchema from 'validations/systemIntakeSchema';

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

  return (
    <>
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

      <p className="line-height-body-5">
        {t('contactDetails.intakeProcessDescription')}
      </p>

      <MandatoryFieldsAlert className="tablet:grid-col-6" />

      <PageHeading className="margin-bottom-3">
        {t('contactDetails.heading')}
      </PageHeading>

      {systemIntake.requestFormState ===
        SystemIntakeFormState.EDITS_REQUESTED && (
        <FeedbackBanner id={systemIntake.id} type="Intake Request" />
      )}

      <Form
        onSubmit={handleSubmit(() =>
          submit(() => history.push('request-details'), true)
        )}
        className="maxw-none tablet:grid-col-6 margin-bottom-7"
      >
        <SystemIntakeContactsTable systemIntakeId={systemIntake.id} />

        <EasiFormProvider<GovernanceTeamsForm> {...form}>
          <GovernanceTeams />
        </EasiFormProvider>

        <Pager
          next={{
            type: 'submit'
          }}
          border={false}
          taskListUrl={saveExitLink}
          submit={() => submit(() => history.push(saveExitLink))}
          className="margin-top-4"
        />
      </Form>

      {/* <AutoSave values={watch()} onSave={submit} debounceDelay={3000} /> */}

      <PageNumber currentPage={1} totalPages={5} />
    </>
  );
};

export default ContactDetails;
