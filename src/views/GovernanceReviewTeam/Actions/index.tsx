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

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setActionRoute(e.target.value);

  const onSubmit = () => history.push(`actions/${actionRoute}`);

  const NotAnITRequest = (
    <RadioField
      key="not-an-it-request"
      id="not-an-it-request"
      inline={false}
      label="Not an IT request"
      name="Not an IT request"
      value="not-an-it-request"
      onChange={onChange}
      checked={actionRoute === 'not-an-it-request'}
    />
  );

  const TestAction = (
    <RadioField
      key="test-route"
      id="test-route"
      inline={false}
      label="Test Action"
      name="Test Action"
      value="test-route"
      onChange={onChange}
      checked={actionRoute === 'test-route'}
    />
  );

  let availableActions: Array<any> = [];
  if (businessCaseExists) {
    availableActions = [TestAction];
  } else {
    availableActions = [NotAnITRequest, TestAction];
  }

  return (
    <>
      <h1>Actions on intake request</h1>
      <form onSubmit={onSubmit}>
        <RadioGroup>{availableActions}</RadioGroup>
        <Button type="submit" disabled={!actionRoute}>
          Continue
        </Button>
      </form>
    </>
  );
};

export default Actions;
