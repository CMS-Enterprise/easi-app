import React, { Fragment } from 'react';
import { Field, FieldArray, ErrorMessage } from 'formik';
import Label from 'components/shared/Label';
import TextField from 'components/shared/TextField';
import FieldGroup from 'components/shared/FieldGroup';
import FieldErrorMsg from 'components/shared/FieldErrorMsg';
import CheckboxField from 'components/shared/CheckboxField';
import cmsGovernanceTeams from 'constants/enums/cmsGovernanceTeams';
import { SystemIntakeForm } from 'types/systemIntake';

type GovernanceTeamOptionsProps = {
  values: SystemIntakeForm;
  setFieldValue: (field: string, value: any) => void;
};
const GovernanceTeamOptions = ({
  values,
  setFieldValue
}: GovernanceTeamOptionsProps) => {
  return (
    <FieldArray name="governanceTeams.teams">
      {arrayHelpers => (
        <>
          {cmsGovernanceTeams.map((team, index) => {
            const kebabValue = team.value.split(' ').join('-');
            return (
              <Fragment key={kebabValue}>
                <CheckboxField
                  checked={values.governanceTeams.teams
                    .map(t => t.name)
                    .includes(team.value)}
                  disabled={values.governanceTeams.isPresent === false}
                  id={`governanceTeam-${kebabValue}`}
                  label={team.name}
                  name={`governanceTeams.teams.${index}`}
                  onBlur={() => {}}
                  onChange={e => {
                    if (e.target.checked) {
                      arrayHelpers.push({
                        name: e.target.value,
                        collaborator: ''
                      });

                      // Check parent radio if it's not already checked
                      if (!values.governanceTeams.isPresent) {
                        setFieldValue('governanceTeams.isPresent', true);
                      }
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
                  if (team.value === t.name) {
                    const id = t.name.split(' ').join('-');
                    return (
                      <div
                        key={`${id}-Collaborator`}
                        className="width-card-lg margin-top-neg-2 margin-left-3 margin-bottom-2"
                      >
                        <FieldGroup
                          scrollElement={`governanceTeams.teams.${idx}.collaborator`}
                          error={false}
                        >
                          <Label htmlFor={`IntakeForm-${id}-Collaborator`}>
                            Collaborator Name
                          </Label>
                          <ErrorMessage
                            name={`governanceTeams.teams.${idx}.collaborator`}
                          >
                            {message => (
                              <FieldErrorMsg>{message}</FieldErrorMsg>
                            )}
                          </ErrorMessage>
                          <Field
                            as={TextField}
                            id={`IntakeForm-${id}-Collaborator`}
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
