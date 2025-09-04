import React, { useEffect } from 'react';
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
import FieldErrorMsg from 'components/FieldErrorMsg';
import HelpText from 'components/HelpText';
import Label from 'components/Label';
import cmsGovernanceTeams from 'constants/enums/cmsGovernanceTeams';
import { GovernanceTeamsForm } from 'types/systemIntake';

/**
 * Governance team fields for use in Contact details section of System Intake form
 */
const GovernanceTeams = () => {
  const { t } = useTranslation('intake');

  const {
    control,
    watch,
    register,
    clearErrors,
    setValue,
    formState: { errors }
  } = useEasiFormContext<GovernanceTeamsForm>();

  const isPresent = watch('isPresent');

  // Reset team fields when `isPresent` is false
  useEffect(() => {
    if (!isPresent) {
      clearErrors('teams');
      setValue('teams.securityPrivacy.isPresent', false);
      setValue('teams.technicalReviewBoard.isPresent', false);
      setValue('teams.clearanceOfficer508.isPresent', false);
    }
  }, [isPresent, setValue, clearErrors]);

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
          name="isPresent"
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
          error={!!errors?.teams?.message}
          className="margin-left-4 margin-bottom-3 margin-top-1"
        >
          <ErrorMessage errors={errors} name="teams" as={FieldErrorMsg} />

          {cmsGovernanceTeams.map(({ key, label, acronym }) => {
            const team = watch(`teams.${key}`);

            return (
              <div key={key}>
                <Controller
                  control={control}
                  name={`teams.${key}.isPresent`}
                  render={({ field: { ref, ...field } }) => {
                    return (
                      <Checkbox
                        {...field}
                        inputRef={ref}
                        id={`governanceTeam-${key}`}
                        label={label}
                        disabled={!isPresent}
                        value="true"
                        checked={field.value}
                        onChange={() => field.onChange(!field.value)}
                      />
                    );
                  }}
                />

                {team?.isPresent && (
                  <FormGroup
                    error={!!errors?.teams?.[key]?.collaborator}
                    className="margin-top-1 margin-bottom-2 margin-left-4"
                  >
                    <Label htmlFor={`governanceTeam-${key}-collaborator`}>
                      {t(`${acronym} Collaborator Name`)}
                    </Label>

                    <ErrorMessage
                      errors={errors}
                      name={`teams.${key}.collaborator`}
                      as={FieldErrorMsg}
                    />

                    <TextInput
                      {...register(`teams.${key}.collaborator`, {
                        shouldUnregister: true
                      })}
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
          name="isPresent"
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
