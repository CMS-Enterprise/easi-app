import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { Button } from '@trussworks/react-uswds';
import { kebabCase } from 'lodash';

import CollapsableLink from 'components/shared/CollapsableLink';
import { RadioField, RadioGroup } from 'components/shared/RadioField';
import { BusinessCaseModel } from 'types/businessCase';
import { RequestType } from 'types/systemIntake';

type ChooseActionProps = {
  businessCase: BusinessCaseModel;
  systemIntakeType: RequestType;
};

const ChooseAction = ({
  businessCase,
  systemIntakeType
}: ChooseActionProps) => {
  const history = useHistory();
  const { t } = useTranslation('action');

  const businessCaseExists = !!businessCase.id;
  const [actionRoute, setActionRoute] = useState('');

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setActionRoute(e.target.value);

  const onSubmit = () => history.push(`actions/${actionRoute}`);

  const radioGroupName = 'Available Actions';
  const radioFieldClassName = 'margin-y-3';

  const notITRequestRoute = 'not-it-request';
  const NotITRequest = (
    <RadioField
      key={notITRequestRoute}
      id={notITRequestRoute}
      label={t('actions.notItRequest')}
      name={radioGroupName}
      value={notITRequestRoute}
      onChange={onChange}
      checked={actionRoute === notITRequestRoute}
      className={radioFieldClassName}
    />
  );

  const issueLifecycleIdRoute = 'issue-lcid';
  const IssueLifecycleId = (
    <RadioField
      key={issueLifecycleIdRoute}
      id={issueLifecycleIdRoute}
      label="Issue Lifecycle Id"
      name={radioGroupName}
      value={issueLifecycleIdRoute}
      onChange={onChange}
      checked={actionRoute === issueLifecycleIdRoute}
      className={radioFieldClassName}
    />
  );

  const needBizCaseRoute = 'need-biz-case';
  const NeedBizCase = (
    <RadioField
      key={needBizCaseRoute}
      id={needBizCaseRoute}
      label={t('actions.needBizCase')}
      name={radioGroupName}
      value={needBizCaseRoute}
      onChange={onChange}
      checked={actionRoute === needBizCaseRoute}
      className={radioFieldClassName}
    />
  );

  const readyForGrtRoute = 'ready-for-grt';
  const ReadyForGRT = (
    <RadioField
      key={readyForGrtRoute}
      id={readyForGrtRoute}
      label={t('actions.readyForGrt')}
      name={radioGroupName}
      value={readyForGrtRoute}
      onChange={onChange}
      checked={actionRoute === readyForGrtRoute}
      className={radioFieldClassName}
    />
  );

  const readyForGrbRoute = 'ready-for-grb';
  const ReadyForGRB = (
    <RadioField
      key={readyForGrbRoute}
      id={readyForGrbRoute}
      label={t('actions.readyForGrb')}
      name={radioGroupName}
      value={readyForGrbRoute}
      onChange={onChange}
      checked={actionRoute === readyForGrbRoute}
      className={radioFieldClassName}
    />
  );

  const provideFeedbackNeedBizCaseRoute = 'provide-feedback-need-biz-case';
  const ProvideFeedbackNeedBizCase = (
    <RadioField
      key={provideFeedbackNeedBizCaseRoute}
      id={provideFeedbackNeedBizCaseRoute}
      label={t('actions.provideFeedbackNeedBizCase')}
      name={radioGroupName}
      value={provideFeedbackNeedBizCaseRoute}
      onChange={onChange}
      checked={actionRoute === provideFeedbackNeedBizCaseRoute}
      className={radioFieldClassName}
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
      className={radioFieldClassName}
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
      className={radioFieldClassName}
    />
  );

  const bizCaseNeedsChangesRoute = 'biz-case-needs-changes';
  const BizCaseNeedsChanges = (
    <RadioField
      key={bizCaseNeedsChangesRoute}
      id={bizCaseNeedsChangesRoute}
      label={t('actions.bizCaseNeedsChanges')}
      name={radioGroupName}
      value={bizCaseNeedsChangesRoute}
      onChange={onChange}
      checked={actionRoute === bizCaseNeedsChangesRoute}
      className={radioFieldClassName}
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
      className={radioFieldClassName}
    />
  );

  const rejectIntakeRoute = 'not-approved';
  const RejectIntake = (
    <RadioField
      key={rejectIntakeRoute}
      id={rejectIntakeRoute}
      label={t('actions.rejectIntake')}
      name={radioGroupName}
      value={rejectIntakeRoute}
      onChange={onChange}
      checked={actionRoute === rejectIntakeRoute}
      className={radioFieldClassName}
    />
  );

  let availableActions: Array<any> = [];
  let availableHiddenActions: Array<any> = [];
  if (systemIntakeType === 'SHUTDOWN') {
    availableActions = [NotITRequest];
    availableHiddenActions = [];
  } else if (businessCaseExists) {
    availableActions = [BizCaseNeedsChanges];
    availableHiddenActions = [
      ReadyForGRT,
      ReadyForGRB,
      ProvideFeedbackKeepDraft,
      ProvideFeedbackNeedFinal,
      IssueLifecycleId,
      NoFurtherGovernance,
      RejectIntake
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
          {[availableActions]}
          {availableHiddenActions && (
            <CollapsableLink
              id={kebabCase(t('submitAction.otherOptions'))}
              label={t('submitAction.otherOptions')}
              styleLeftBar={false}
            >
              {[availableHiddenActions]}
            </CollapsableLink>
          )}
        </RadioGroup>
        <Button className="margin-top-5" type="submit" disabled={!actionRoute}>
          Continue
        </Button>
      </form>
    </>
  );
};

export default ChooseAction;
