import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { Button } from '@trussworks/react-uswds';
import { kebabCase } from 'lodash';

import CollapsableLink from 'components/shared/CollapsableLink';
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

  
  const IssueLifecycleId = (
    <RadioField
      key="issue-lcid"
      id="issue-lcid"
      label="Issue Lifecycle Id"
      name={radioGroupName}
      value="issue-lcid"
      onChange={onChange}
      checked={actionRoute === 'issue-lcid'}
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

  const ReadyForGRT = (
    <RadioField
      key="ready-for-grt"
      id="ready-for-grt"
      label={t('actions.readyForGrt')}
      name={radioGroupName}
      value="ready-for-grt"
      onChange={onChange}
      checked={actionRoute === 'ready-for-grt'}
    />
  );

  const ProvideFeedbackNeedBizCase = (
    <RadioField
      key="provide-feedback-need-biz-case"
      id="provide-feedback-need-biz-case"
      label={t('actions.provideFeedbackNeedBizCase')}
      name={radioGroupName}
      value="provide-feedback-need-biz-case"
      onChange={onChange}
      checked={actionRoute === 'provide-feedback-need-biz-case'}
    />
  );

  let availableActions: Array<any> = [];
  let availableHiddenActions: Array<any> = [];
  if (businessCaseExists) {
    availableActions = [];
    availableHiddenActions = [];
  } else {
    availableActions = [NotAnITRequest, NeedBizCase, IssueLifecycleId];
    availableHiddenActions = [ReadyForGRT, ProvideFeedbackNeedBizCase];
  }

  return (
    <>
      <h1>{t('submitAction.heading')}</h1>
      <h2 className="margin-y-3">{t('submitAction.subheading')}</h2>
      <form onSubmit={onSubmit}>
        <RadioGroup>
          <div>
            {availableActions.map(actionRadio => (
              <div className="margin-y-3">{actionRadio}</div>
            ))}
          </div>
          <CollapsableLink
            id={kebabCase(t('submitAction.otherOptions'))}
            label={t('submitAction.otherOptions')}
            styleLeftBar={false}
          >
            {availableHiddenActions.map(actionRadio => (
              <div className="margin-bottom-3">{actionRadio}</div>
            ))}
          </CollapsableLink>
        </RadioGroup>
        <Button className="margin-top-5" type="submit" disabled={!actionRoute}>
          Continue
        </Button>
      </form>
    </>
  );
};

export default ChooseAction;
