import React from 'react';
import { Controller, useFieldArray, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { ErrorMessage } from '@hookform/error-message';
import {
  Checkbox,
  Fieldset,
  FormGroup,
  Radio,
  TextInput
} from '@trussworks/react-uswds';

import FieldErrorMsg from 'components/shared/FieldErrorMsg';
import HelpText from 'components/shared/HelpText';
import Label from 'components/shared/Label';
import cmsGovernanceTeams from 'constants/enums/cmsGovernanceTeams';
import { ContactDetailsForm } from 'types/systemIntake';

const GovernanceTeams = () => {
  const { t } = useTranslation('intake');

  const {
    control,
    watch,
    formState: { errors }
  } = useFormContext<ContactDetailsForm>();

  const { fields: teams, remove, append } = useFieldArray<ContactDetailsForm>({
    control,
    name: 'governanceTeams.teams'
  });

  const isPresent = watch('governanceTeams.isPresent');

  return (
    <>
      <FormGroup>
        <Controller
          control={control}
          name="governanceTeams.isPresent"
          render={({ field: { ref, ...field } }) => (
            <>
              <Label htmlFor={field.name} className="margin-bottom-1">
                {t('contactDetails.collaboration.label')}
              </Label>

              <HelpText id="IntakeForm-Collaborators">
                {t('contactDetails.collaboration.helpText')}
              </HelpText>

              <Radio
                {...field}
                inputRef={ref}
                id={`${field.name}True`}
                label={t('contactDetails.collaboration.oneOrMore')}
                value="true"
                checked={!!field.value}
                onChange={() => field.onChange(true)}
              />
            </>
          )}
        />

        {isPresent && (
          <FormGroup
            error={!!errors?.governanceTeams?.teams?.message}
            className="margin-left-4 margin-bottom-3 margin-top-1"
          >
            <ErrorMessage name="governanceTeams.teams" as={FieldErrorMsg} />

            {cmsGovernanceTeams.map(({ key, value: name, label, acronym }) => {
              const teamIndex = teams.findIndex(team => team.key === key);

              const isChecked = teamIndex > -1;

              return (
                <Fieldset key={key}>
                  <Controller
                    control={control}
                    name="governanceTeams.teams"
                    shouldUnregister
                    render={({ field: { ref, ...field } }) => {
                      return (
                        <Checkbox
                          {...field}
                          inputRef={ref}
                          id={`${field.name}.${key}`}
                          label={label}
                          value={name}
                          defaultChecked={isChecked}
                          onChange={e => {
                            if (e.target.checked) {
                              append({
                                name,
                                key,
                                collaborator: ''
                              });
                            } else {
                              remove(teamIndex);
                            }
                          }}
                        />
                      );
                    }}
                  />

                  {isChecked && (
                    <Controller
                      control={control}
                      name={`governanceTeams.teams.${teamIndex}.collaborator`}
                      shouldUnregister
                      render={({
                        field: { ref, ...field },
                        fieldState: { error }
                      }) => (
                        <FormGroup
                          error={!!error}
                          className="margin-top-1 margin-left-4 margin-bottom-1"
                        >
                          <Label htmlFor={field.name}>
                            {t(`${acronym} Collaborator Name`)}
                          </Label>

                          <ErrorMessage name={field.name} as={FieldErrorMsg} />

                          <TextInput
                            {...field}
                            inputRef={ref}
                            id={field.name}
                            type="text"
                          />
                        </FormGroup>
                      )}
                    />
                  )}
                </Fieldset>
              );
            })}
          </FormGroup>
        )}

        <Controller
          control={control}
          name="governanceTeams.isPresent"
          render={({ field: { ref, ...field } }) => (
            <Radio
              {...field}
              inputRef={ref}
              id={`${field.name}False`}
              label={t('contactDetails.collaboration.none')}
              value="false"
              checked={!field.value}
              onChange={() => {
                // Set governanceTeams.isPresent to false
                field.onChange(false);
                // Reset governanceTeams.teams array
                remove();
              }}
            />
          )}
        />
      </FormGroup>
    </>
  );
};

export default GovernanceTeams;
