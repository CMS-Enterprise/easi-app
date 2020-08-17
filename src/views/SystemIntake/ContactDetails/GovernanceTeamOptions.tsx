import React, { Fragment } from 'react';
import { Field, FieldArray, FormikProps, getIn } from 'formik';

import CheckboxField from 'components/shared/CheckboxField';
import FieldErrorMsg from 'components/shared/FieldErrorMsg';
import FieldGroup from 'components/shared/FieldGroup';
import Label from 'components/shared/Label';
import TextField from 'components/shared/TextField';
import cmsGovernanceTeams from 'constants/enums/cmsGovernanceTeams';

import { ContactDetailsForm } from './index';

type GovernanceTeamOptionsProps = {
  formikProps: FormikProps<ContactDetailsForm>;
};

const GovernanceTeamOptions = ({ formikProps }: GovernanceTeamOptionsProps) => {
  const { values, errors } = formikProps;
  return (
    <FieldArray name="governanceTeams.teams">
      {arrayHelpers => (
        <>
          {cmsGovernanceTeams.map((team: any, index: number) => {
            return (
              <Fragment key={team.key}>
                <CheckboxField
                  checked={values.governanceTeams.teams
                    .map(t => t.name)
                    .includes(team.value)}
                  disabled={values.governanceTeams.isPresent !== true}
                  id={`governanceTeam-${team.key}`}
                  label={team.label}
                  name={`governanceTeams.teams.${index}`}
                  onBlur={() => {}}
                  onChange={e => {
                    if (e.target.checked) {
                      arrayHelpers.push({
                        name: e.target.value,
                        collaborator: ''
                      });
                    } else {
                      const removeIndex = values.governanceTeams.teams
                        .map(t => t.name)
                        .indexOf(e.target.value);

                      arrayHelpers.remove(removeIndex);
                    }
                  }}
                  value={team.value}
                />
                {values.governanceTeams.teams.map((t, idx) => {
                  const { key } = team;
                  if (team.value === t.name) {
                    return (
                      <div
                        key={`${key}-Collaborator`}
                        className="width-card-lg margin-top-neg-2 margin-left-4 margin-bottom-2"
                      >
                        <FieldGroup
                          scrollElement={`governanceTeams.teams.${idx}.collaborator`}
                          error={false}
                        >
                          <Label
                            htmlFor={`IntakeForm-${key}-Collaborator`}
                            ariaLabel={`Enter ${team.acronym} Collaborator Name`}
                          >
                            {`${team.acronym} Collaborator Name`}
                          </Label>
                          {errors.governanceTeams &&
                            errors.governanceTeams.teams &&
                            errors.governanceTeams.teams[idx] && (
                              <FieldErrorMsg>
                                {getIn(
                                  errors,
                                  `governanceTeams.teams.${idx}.collaborator`
                                )}
                              </FieldErrorMsg>
                            )}
                          <Field
                            as={TextField}
                            error={getIn(
                              errors,
                              `governanceTeams.teams.${idx}.collaborator`
                            )}
                            id={`IntakeForm-${key}-Collaborator`}
                            maxLength={50}
                            name={`governanceTeams.teams.${idx}.collaborator`}
                          />
                        </FieldGroup>
                      </div>
                    );
                  }
                  return null;
                })}
              </Fragment>
            );
          })}
        </>
      )}
    </FieldArray>
  );
};

export default GovernanceTeamOptions;
