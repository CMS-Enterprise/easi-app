import React, { useMemo } from 'react';
import { Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useMutation } from '@apollo/client';
import { Form, FormGroup, TextInput } from '@trussworks/react-uswds';

import FeedbackBanner from 'components/FeedbackBanner';
import MandatoryFieldsAlert from 'components/MandatoryFieldsAlert';
import PageHeading from 'components/PageHeading';
import PageLoading from 'components/PageLoading';
import FieldErrorMsg from 'components/shared/FieldErrorMsg';
import Label from 'components/shared/Label';
import useEasiForm from 'hooks/useEasiForm';
import useSystemIntakeContacts from 'hooks/useSystemIntakeContacts';
import GetSystemIntakeQuery from 'queries/GetSystemIntakeQuery';
import { UpdateSystemIntakeContactDetails as UpdateSystemIntakeContactDetailsQuery } from 'queries/SystemIntakeQueries';
import { SystemIntake } from 'queries/types/SystemIntake';
import {
  UpdateSystemIntakeContactDetails,
  UpdateSystemIntakeContactDetailsVariables
} from 'queries/types/UpdateSystemIntakeContactDetails';
import { SystemIntakeFormState } from 'types/graphql-global-types';
import { ContactDetailsForm, SystemIntakeRoleKeys } from 'types/systemIntake';

type ContactDetailsProps = {
  systemIntake: SystemIntake;
};

const ContactDetails = ({ systemIntake }: ContactDetailsProps) => {
  const { t } = useTranslation('intake');

  const {
    contacts,
    createContact,
    updateContact
    // deleteContact
  } = useSystemIntakeContacts(systemIntake.id);
  const { requester, businessOwner, productManager, isso } = contacts.data;

  const defaultValues: ContactDetailsForm = useMemo(
    () => ({
      requester,
      businessOwner,
      productManager,
      isso: {
        isPresent: !!isso?.euaUserId,
        ...isso
      },
      governanceTeams: {
        isPresent: systemIntake.governanceTeams.isPresent,
        teams:
          systemIntake.governanceTeams.teams?.map(team => ({
            collaborator: team.collaborator,
            name: team.name,
            key: team.key
          })) || []
      }
    }),
    [
      requester,
      businessOwner,
      productManager,
      isso,
      systemIntake.governanceTeams
    ]
  );

  const { control, handleSubmit, setValue } = useEasiForm<ContactDetailsForm>({
    defaultValues
  });

  const [mutate] = useMutation<
    UpdateSystemIntakeContactDetails,
    UpdateSystemIntakeContactDetailsVariables
  >(UpdateSystemIntakeContactDetailsQuery, {
    refetchQueries: [
      {
        query: GetSystemIntakeQuery,
        variables: {
          id: systemIntake.id
        }
      }
    ]
  });

  const submit = handleSubmit(async values => {
    /**
     * Create or update contact in database
     * */
    const updateSystemIntakeContact = async (type: SystemIntakeRoleKeys) => {
      // Only run mutations when contact has been verified via CEDAR and component is set
      if (values[type].euaUserId && values[type].component) {
        // If contact has ID, update values
        if (values?.[type].id) {
          return updateContact({ ...values[type] });
        }
        // If contact does not have id, create new contact
        return createContact(values[type]).then(newContact => {
          // Set ID field value from new contact data
          setValue(`${type}.id`, newContact?.id);
        });
      }
      return null;
    };

    await Promise.all([
      updateSystemIntakeContact('requester'),
      updateSystemIntakeContact('businessOwner'),
      updateSystemIntakeContact('productManager'),
      updateSystemIntakeContact('isso')
    ]);
    return mutate({
      variables: {
        input: {
          id: systemIntake.id,
          requester: {
            name: values.requester.commonName,
            component: values.requester.component
          },
          businessOwner: {
            name: values.businessOwner.commonName,
            component: values.businessOwner.component
          },
          productManager: {
            name: values.productManager.commonName,
            component: values.productManager.component
          },
          isso: {
            isPresent: values.isso.isPresent,
            name: values.isso.commonName
          },
          governanceTeams: values.governanceTeams
        }
      }
    });
  });

  if (contacts.loading) return <PageLoading />;

  return (
    <>
      {/* TODO: errors summary */}

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

      <Form onSubmit={submit}>
        {/* Requester Name */}
        <Controller
          control={control}
          name="requester.commonName"
          render={({ field, fieldState: { error } }) => (
            <FormGroup error={!!error}>
              <Label htmlFor={field.name}>
                {t('contactDetails.requester')}
              </Label>
              {!!error && <FieldErrorMsg>{t('Error')}</FieldErrorMsg>}
              <TextInput
                {...field}
                ref={null}
                id={field.name}
                type="text"
                disabled
              />
            </FormGroup>
          )}
        />
      </Form>
    </>
  );
};

export default ContactDetails;
