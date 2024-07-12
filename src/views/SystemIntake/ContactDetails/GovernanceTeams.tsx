import React from 'react';
import { Controller } from 'react-hook-form';
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
    register,
    formState: { errors }
  } = useEasiFormContext<ContactDetailsForm>();

  const isPresent = watch('governanceTeams.isPresent');

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

          {cmsGovernanceTeams.map(({ key, label, acronym }) => {
            const team = watch(`governanceTeams.teams.${key}`);

            return (
              <div key={key}>
                <Controller
                  control={control}
                  name={`governanceTeams.teams.${key}.isPresent`}
                  render={({ field: { ref, ...field } }) => {
                    return (
                      <Checkbox
                        {...field}
                        inputRef={ref}
                        id={`governanceTeam-${key}`}
                        label={label}
                        disabled={!isPresent}
                        value="true"
                        onChange={() => field.onChange(true)}
                      />
                    );
                  }}
                />

                {team.isPresent && (
                  <FormGroup
                    error={
                      !!errors?.governanceTeams?.teams?.[key]?.collaborator
                    }
                    className="margin-top-1 margin-bottom-2 margin-left-4"
                  >
                    <Label htmlFor={`governanceTeam-${key}-collaborator`}>
                      {t(`${acronym} Collaborator Name`)}
                    </Label>

                    <ErrorMessage
                      errors={errors}
                      name={`governanceTeams.teams.${key}.collaborator`}
                      as={FieldErrorMsg}
                    />

                    <TextInput
                      {...register(`governanceTeams.teams.${key}.collaborator`)}
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
              onChange={() => field.onChange(false)}
            />
          )}
        />
      </Fieldset>
    </>
  );
};

export default GovernanceTeams;
