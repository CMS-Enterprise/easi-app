import React, { useEffect } from 'react';
import { Controller, useFieldArray } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { ErrorMessage } from '@hookform/error-message';
import {
  Checkbox,
  Fieldset,
  FormGroup,
  Radio,
  TextInput
} from '@trussworks/react-uswds';

import { useEasiFormContext } from 'components/EasiForm';
import FieldErrorMsg from 'components/shared/FieldErrorMsg';
import HelpText from 'components/shared/HelpText';
import Label from 'components/shared/Label';
import cmsGovernanceTeams from 'constants/enums/cmsGovernanceTeams';
import { ContactDetailsForm } from 'types/systemIntake';

/**
 * Governance team fields for use in Contact Details section of System Intake form
 */
const GovernanceTeams = () => {
  const { t } = useTranslation('intake');

  const {
    control,
    watch,
    trigger,
    register,
    formState: { errors, isSubmitted }
  } = useEasiFormContext<ContactDetailsForm>();

  const { fields: teams, remove, append } = useFieldArray<ContactDetailsForm>({
    control,
    name: 'governanceTeams.teams'
  });

  const isPresent = watch('governanceTeams.isPresent');

  // Revalidate teams fields after failed submission when updating values
  useEffect(() => {
    if (isSubmitted && teams.length > 0) {
      trigger('governanceTeams.teams');
    }
  }, [errors, trigger, isSubmitted, teams]);

  return (
    <>
      <Fieldset className="margin-top-3">
        <legend
          className="text-bold margin-bottom-1"
          aria-describedby="govTeamHelpText"
        >
          {t('contactDetails.collaboration.label')}
        </legend>

        <HelpText id="govTeamHelpText">
          {t('contactDetails.collaboration.helpText')}
        </HelpText>

        <Controller
          control={control}
          name="governanceTeams.isPresent"
          render={({ field: { ref, ...field } }) => (
            <Radio
              {...field}
              inputRef={ref}
              id="governanceTeamsIsPresentTrue"
              label={t('contactDetails.collaboration.oneOrMore')}
              value="true"
              checked={!!field.value}
              onChange={() => field.onChange(true)}
            />
          )}
        />

        <FormGroup
          error={!!errors?.governanceTeams?.teams?.message}
          className="margin-left-4 margin-bottom-3 margin-top-1"
        >
          <ErrorMessage
            errors={errors}
            name="governanceTeams.teams"
            as={FieldErrorMsg}
          />

          {cmsGovernanceTeams.map(({ key, value: name, label, acronym }) => {
            const teamIndex = teams.findIndex(team => team.key === key);

            const isChecked = teamIndex > -1;

            const collaboratorField = `governanceTeams.teams.${teamIndex}.collaborator` as const;

            const error =
              errors?.governanceTeams?.teams?.[teamIndex]?.collaborator;

            return (
              <div key={key}>
                <Controller
                  control={control}
                  name="governanceTeams.teams"
                  render={({ field: { ref, ...field } }) => {
                    return (
                      <Checkbox
                        {...field}
                        inputRef={ref}
                        id={`governanceTeam-${key}`}
                        label={label}
                        value={name}
                        checked={isChecked}
                        disabled={!isPresent}
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
                  <FormGroup
                    error={!!error}
                    className="margin-top-1 margin-bottom-2 margin-left-4"
                  >
                    <Label htmlFor={`governanceTeam-${key}-collaborator`}>
                      {t(`${acronym} Collaborator Name`)}
                    </Label>

                    <ErrorMessage name={collaboratorField} as={FieldErrorMsg} />

                    <TextInput
                      {...register(collaboratorField)}
                      ref={null}
                      id={`governanceTeam-${key}-collaborator`}
                      type="text"
                    />
                  </FormGroup>
                )}
              </div>
            );
          })}
        </FormGroup>

        <Controller
          control={control}
          name="governanceTeams.isPresent"
          render={({ field: { ref, ...field } }) => (
            <Radio
              {...field}
              inputRef={ref}
              id="governanceTeamsIsPresentFalse"
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
      </Fieldset>
    </>
  );
};

export default GovernanceTeams;
