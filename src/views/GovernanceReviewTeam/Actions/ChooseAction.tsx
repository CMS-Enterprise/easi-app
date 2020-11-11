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

  const NotITRequest = (
    <RadioField
      key="not-it-request"
      id="not-it-request"
      label={t('actions.notItRequest')}
      name={radioGroupName}
      value="not-it-request"
      onChange={onChange}
      checked={actionRoute === 'not-it-request'}
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

  const ReadyForGRB = (
    <RadioField
      key="ready-for-grb"
      id="ready-for-grb"
      label={t('actions.readyForGrb')}
      name={radioGroupName}
      value="ready-for-grb"
      onChange={onChange}
      checked={actionRoute === 'ready-for-grb'}
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

  const provideFeedbackKeepDraftRoute = 'provide-feedback-keep-draft';
  const ProvideFeedbackKeepDraft = (
    <RadioField
      key={provideFeedbackKeepDraftRoute}
      id={provideFeedbackKeepDraftRoute}
      label={t('actions.provideGrtFeedbackKeepDraft')}
      name={radioGroupName}
      value={provideFeedbackKeepDraftRoute}
      onChange={onChange}
      checked={actionRoute === provideFeedbackKeepDraftRoute}
    />
  );

  const provideFeedbackNeedFinalRoute = 'provide-feedback-need-final';
  const ProvideFeedbackNeedFinal = (
    <RadioField
      key={provideFeedbackNeedFinalRoute}
      id={provideFeedbackNeedFinalRoute}
      label={t('actions.provideGrtFeedbackNeedFinal')}
      name={radioGroupName}
      value={provideFeedbackNeedFinalRoute}
      onChange={onChange}
      checked={actionRoute === provideFeedbackNeedFinalRoute}
    />
  );

  const BizCaseNeedsChanges = (
    <RadioField
      key="biz-case-needs-changes"
      id="biz-case-needs-changes"
      label={t('actions.bizCaseNeedsChanges')}
      name={radioGroupName}
      value="biz-case-needs-changes"
      onChange={onChange}
      checked={actionRoute === 'biz-case-needs-changes'}
    />
  );

  const noFurtherGovernanceRoute = 'no-governance';
  const NoFurtherGovernance = (
    <RadioField
      key={noFurtherGovernanceRoute}
      id={noFurtherGovernanceRoute}
      label={t('actions.noGovernance')}
      name={radioGroupName}
      value={noFurtherGovernanceRoute}
      onChange={onChange}
      checked={actionRoute === noFurtherGovernanceRoute}
    />
  );

  let availableActions: Array<any> = [];
  let availableHiddenActions: Array<any> = [];
  if (businessCaseExists) {
    availableActions = [BizCaseNeedsChanges];
    availableHiddenActions = [
      ReadyForGRT,
      ReadyForGRB,
      ProvideFeedbackKeepDraft,
      ProvideFeedbackNeedFinal,
      IssueLifecycleId,
      NoFurtherGovernance
    ];
  } else {
    availableActions = [NotITRequest, NeedBizCase];
    availableHiddenActions = [
      ReadyForGRT,
      ProvideFeedbackNeedBizCase,
      ReadyForGRB,
      NoFurtherGovernance,
      IssueLifecycleId
    ];
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
