import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { Button } from '@trussworks/react-uswds';
import { kebabCase } from 'lodash';

import CollapsableLink from 'components/shared/CollapsableLink';
import { RadioField, RadioGroup } from 'components/shared/RadioField';
import { AnythingWrongSurvey } from 'components/Survey';
import { BusinessCaseModel } from 'types/businessCase';
import { RequestType } from 'types/systemIntake';

const radioGroupName = 'Available Actions';
const radioFieldClassName = 'margin-y-3';

type ActionRadioOptionProps = {
  route: string;
  label: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  checked: boolean;
};

const ActionRadioOption = ({
  label,
  route,
  onChange,
  checked
}: ActionRadioOptionProps) => (
  <RadioField
    id={route}
    label={label}
    name={radioGroupName}
    value={route}
    onChange={onChange}
    checked={checked}
    className={radioFieldClassName}
  />
);

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

  const notITRequestRoute = 'not-it-request';
  const NotITRequest = (
    <ActionRadioOption
      key={notITRequestRoute}
      onChange={onChange}
      label={t('actions.notItRequest')}
      route={notITRequestRoute}
      checked={actionRoute === notITRequestRoute}
    />
  );

  const issueLifecycleIdRoute = 'issue-lcid';
  const IssueLifecycleId = (
    <ActionRadioOption
      key={issueLifecycleIdRoute}
      onChange={onChange}
      label="Issue Lifecycle Id"
      route={issueLifecycleIdRoute}
      checked={actionRoute === issueLifecycleIdRoute}
    />
  );

  const needBizCaseRoute = 'need-biz-case';
  const NeedBizCase = (
    <ActionRadioOption
      key={needBizCaseRoute}
      onChange={onChange}
      label={t('actions.needBizCase')}
      route={needBizCaseRoute}
      checked={actionRoute === needBizCaseRoute}
    />
  );

  const readyForGrtRoute = 'ready-for-grt';
  const ReadyForGRT = (
    <ActionRadioOption
      key={readyForGrtRoute}
      onChange={onChange}
      label={t('actions.readyForGrt')}
      route={readyForGrtRoute}
      checked={actionRoute === readyForGrtRoute}
    />
  );

  const readyForGrbRoute = 'ready-for-grb';
  const ReadyForGRB = (
    <ActionRadioOption
      key={readyForGrbRoute}
      onChange={onChange}
      label={t('actions.readyForGrb')}
      route={readyForGrbRoute}
      checked={actionRoute === readyForGrbRoute}
    />
  );

  const provideFeedbackNeedBizCaseRoute = 'provide-feedback-need-biz-case';
  const ProvideFeedbackNeedBizCase = (
    <ActionRadioOption
      key={provideFeedbackNeedBizCaseRoute}
      onChange={onChange}
      label={t('actions.provideFeedbackNeedBizCase')}
      route={provideFeedbackNeedBizCaseRoute}
      checked={actionRoute === provideFeedbackNeedBizCaseRoute}
    />
  );

  const provideFeedbackKeepDraftRoute = 'provide-feedback-keep-draft';
  const ProvideFeedbackKeepDraft = (
    <ActionRadioOption
      key={provideFeedbackKeepDraftRoute}
      onChange={onChange}
      label={t('actions.provideGrtFeedbackKeepDraft')}
      route={provideFeedbackKeepDraftRoute}
      checked={actionRoute === provideFeedbackKeepDraftRoute}
    />
  );

  const provideFeedbackNeedFinalRoute = 'provide-feedback-need-final';
  const ProvideFeedbackNeedFinal = (
    <ActionRadioOption
      key={provideFeedbackNeedFinalRoute}
      onChange={onChange}
      label={t('actions.provideGrtFeedbackNeedFinal')}
      route={provideFeedbackNeedFinalRoute}
      checked={actionRoute === provideFeedbackNeedFinalRoute}
    />
  );

  const bizCaseNeedsChangesRoute = 'biz-case-needs-changes';
  const BizCaseNeedsChanges = (
    <ActionRadioOption
      key={bizCaseNeedsChangesRoute}
      onChange={onChange}
      label={t('actions.bizCaseNeedsChanges')}
      route={bizCaseNeedsChangesRoute}
      checked={actionRoute === bizCaseNeedsChangesRoute}
    />
  );

  const noFurtherGovernanceRoute = 'no-governance';
  const NoFurtherGovernance = (
    <ActionRadioOption
      key={noFurtherGovernanceRoute}
      onChange={onChange}
      label={t('actions.noGovernance')}
      route={noFurtherGovernanceRoute}
      checked={actionRoute === noFurtherGovernanceRoute}
    />
  );

  const rejectIntakeRoute = 'not-approved';
  const RejectIntake = (
    <ActionRadioOption
      key={rejectIntakeRoute}
      onChange={onChange}
      label={t('actions.rejectIntake')}
      route={rejectIntakeRoute}
      checked={actionRoute === rejectIntakeRoute}
    />
  );

  const sendEmailRoute = 'send-email';
  const SendEmail = (
    <ActionRadioOption
      key={sendEmailRoute}
      onChange={onChange}
      label={t('actions.sendEmail')}
      route={sendEmailRoute}
      checked={actionRoute === sendEmailRoute}
    />
  );

  const guideReceivedCloseRoute = 'guide-received-close';
  const GuideReceivedClose = (
    <ActionRadioOption
      key={guideReceivedCloseRoute}
      onChange={onChange}
      label={t('actions.guideReceivedClose')}
      route={guideReceivedCloseRoute}
      checked={actionRoute === guideReceivedCloseRoute}
    />
  );

  const notRespondingCloseRoute = 'not-responding-close';
  const NotRespondingClose = (
    <ActionRadioOption
      key={notRespondingCloseRoute}
      onChange={onChange}
      label={t('actions.notRespondingClose')}
      route={notRespondingCloseRoute}
      checked={actionRoute === notRespondingCloseRoute}
    />
  );

  let availableActions: Array<any> = [];
  let availableHiddenActions: Array<any> = [];
  if (systemIntakeType === 'SHUTDOWN') {
    availableActions = [
      SendEmail,
      GuideReceivedClose,
      NotRespondingClose,
      NotITRequest
    ];
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
      <AnythingWrongSurvey />
    </>
  );
};

export default ChooseAction;
