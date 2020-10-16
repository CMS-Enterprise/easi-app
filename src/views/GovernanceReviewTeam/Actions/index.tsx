import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Button } from '@trussworks/react-uswds';

import { RadioField, RadioGroup } from 'components/shared/RadioField';
import { BusinessCaseModel } from 'types/businessCase';

type ActionsProps = {
  businessCase: BusinessCaseModel;
};

const Actions = ({ businessCase }: ActionsProps) => {
  const history = useHistory();

  const businessCaseExists = !!businessCase.id;
  const [actionRoute, setActionRoute] = useState('');

  let availableActions: Array<any> = [];
  if (businessCaseExists) {
    availableActions = [];
  } else {
    availableActions = [
      {
        actionName: 'Not an IT request',
        actionRoute: 'not-an-it-request'
      },
      {
        actionName: 'Test Thing',
        actionRoute: 'test-route'
      }
    ];
  }
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setActionRoute(e.target.value);

  const onSubmit = () => history.push(`actions/${actionRoute}`);

  return (
    <>
      <h1>Actions on intake request</h1>
      <form onSubmit={onSubmit}>
        <RadioGroup>
          {availableActions.map(action => (
            <RadioField
              key={action.actionRoute}
              id={action.actionRoute}
              inline={false}
              label={action.actionName}
              name={action.actionName}
              value={action.actionRoute}
              onChange={onChange}
              checked={actionRoute === action.actionRoute}
            />
          ))}
        </RadioGroup>
        <Button type="submit" disabled={!actionRoute}>
          Continue
        </Button>
      </form>
    </>
  );
};

export default Actions;
