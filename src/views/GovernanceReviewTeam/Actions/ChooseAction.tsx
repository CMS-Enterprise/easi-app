import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Button } from '@trussworks/react-uswds';

import { RadioField, RadioGroup } from 'components/shared/RadioField';
import { BusinessCaseModel } from 'types/businessCase';

type ChooseActionProps = {
  businessCase: BusinessCaseModel;
};

const ChooseAction = ({ businessCase }: ChooseActionProps) => {
  const history = useHistory();

  const businessCaseExists = !!businessCase.id;
  const [actionRoute, setActionRoute] = useState('');

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setActionRoute(e.target.value);

  const onSubmit = () => history.push(`actions/${actionRoute}`);

  const radioGroupName = 'Available Actions';

  const NotAnITRequest = (
    <RadioField
      key="not-an-it-request"
      id="not-an-it-request"
      inline={false}
      label="Not an IT request"
      name={radioGroupName}
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
      name={radioGroupName}
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

export default ChooseAction;
