import React from 'react';
import { Controller, useFieldArray, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Checkbox, FormGroup, Radio, TextInput } from '@trussworks/react-uswds';

import FieldErrorMsg from 'components/shared/FieldErrorMsg';
import HelpText from 'components/shared/HelpText';
import Label from 'components/shared/Label';
import cmsGovernanceTeams from 'constants/enums/cmsGovernanceTeams';
import { ContactDetailsForm } from 'types/systemIntake';

const GovernanceTeams = () => {
  const { t } = useTranslation('intake');

  const { control } = useFormContext<ContactDetailsForm>();

  const { fields: teams, remove, append } = useFieldArray<ContactDetailsForm>({
    control,
    name: 'governanceTeams.teams'
  });

  return (
    <Controller
      control={control}
      name="governanceTeams.isPresent"
      render={({ field: govTeamsField }) => (
        <FormGroup>
          <fieldset className="usa-fieldset">
            <legend className="usa-label margin-bottom-1">
              {t('contactDetails.collaboration.label')}
            </legend>
            <HelpText id="IntakeForm-Collaborators">
              {t('contactDetails.collaboration.helpText')}
            </HelpText>

            <Radio
              {...govTeamsField}
              ref={null}
              id={`${govTeamsField.name}True`}
              label={t('contactDetails.collaboration.oneOrMore')}
              value="true"
              checked={govTeamsField.value === true}
              onChange={() => govTeamsField.onChange(true)}
            />

            {govTeamsField.value === true && (
              <Controller
                control={control}
                name="governanceTeams.teams"
                render={({
                  field: { ref, ...field },
                  fieldState: { error }
                }) => (
                  <FormGroup
                    error={!!error}
                    className="margin-left-4 margin-bottom-3 margin-top-1"
                  >
                    {!!error && <FieldErrorMsg>{t('Error')}</FieldErrorMsg>}

                    {cmsGovernanceTeams.map((team, index) => {
                      const teamIndex = teams.findIndex(
                        value => value.name === team.value
                      );

                      const isChecked: boolean = teamIndex !== -1;

                      return (
                        <fieldset key={team.key} className="usa-fieldset">
                          <Checkbox
                            {...field}
                            id={`governanceTeam-${team.key}`}
                            key={`governanceTeam-${team.key}`}
                            label={team.label}
                            name={`governanceTeams.teams.${index}`}
                            value={team.value}
                            checked={isChecked}
                            onChange={() => {
                              if (isChecked) {
                                remove(teamIndex);
                              } else {
                                // Add team to governanceTeams.teams array with empty collaborator
                                append({
                                  name: team.value,
                                  key: team.key,
                                  collaborator: ''
                                });
                              }
                            }}
                          />

                          {isChecked && (
                            <Controller
                              control={control}
                              name={`governanceTeams.teams.${teamIndex}.collaborator`}
                              render={collaborator => (
                                <FormGroup
                                  error={!!collaborator.fieldState.error}
                                  className="margin-top-1 margin-left-4 margin-bottom-1"
                                >
                                  <Label htmlFor={collaborator.field.name}>
                                    {t(`${team.acronym} Collaborator Name`)}
                                  </Label>
                                  {!!collaborator.fieldState.error && (
                                    <FieldErrorMsg>{t('Error')}</FieldErrorMsg>
                                  )}
                                  <TextInput
                                    {...collaborator.field}
                                    ref={null}
                                    id={collaborator.field.name}
                                    type="text"
                                  />
                                </FormGroup>
                              )}
                            />
                          )}
                        </fieldset>
                      );
                    })}
                  </FormGroup>
                )}
              />
            )}

            <Radio
              {...govTeamsField}
              ref={null}
              id={`${govTeamsField.name}False`}
              label={t('contactDetails.collaboration.none')}
              value="false"
              checked={govTeamsField.value === false}
              onChange={() => {
                // Set governanceTeams.isPresent to false
                govTeamsField.onChange(false);
                // Reset governanceTeams.teams array
                remove();
              }}
            />
          </fieldset>
        </FormGroup>
      )}
    />
  );
};

export default GovernanceTeams;
