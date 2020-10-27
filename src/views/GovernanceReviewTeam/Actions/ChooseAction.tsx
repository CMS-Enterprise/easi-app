import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { Button } from '@trussworks/react-uswds';

import { RadioField, RadioGroup } from 'components/shared/RadioField';
import { BusinessCaseModel } from 'types/businessCase';

type ChooseActionProps = {
  businessCase: BusinessCaseModel;
};

const ChooseAction = ({ businessCase }: ChooseActionProps) => {
  const history = useHistory();
  const { t } = useTranslation('action');

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
      label={t('actions.notItRequest')}
      name={radioGroupName}
      value="not-an-it-request"
      onChange={onChange}
      checked={actionRoute === 'not-an-it-request'}
    />
  );

  const NeedBizCase = (
    <RadioField
      key="need-biz-case"
      id="need-biz-case"
      label={t('actions.needBizCase')}
      name={radioGroupName}
      value="need-biz-case"
      onChange={onChange}
      checked={actionRoute === 'need-biz-case'}
    />
  );

  let availableActions: Array<any> = [];
  if (businessCaseExists) {
    availableActions = [];
  } else {
    availableActions = [NotAnITRequest, NeedBizCase];
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
