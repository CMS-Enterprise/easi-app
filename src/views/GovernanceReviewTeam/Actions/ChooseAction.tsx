import React, { createContext, useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { Button } from '@trussworks/react-uswds';
import { useFlags } from 'launchdarkly-react-client-sdk';
import { kebabCase } from 'lodash';

import PageHeading from 'components/PageHeading';
import CollapsableLink from 'components/shared/CollapsableLink';
import { RadioField, RadioGroup } from 'components/shared/RadioField';
import { AnythingWrongSurvey } from 'components/Survey';
import { BusinessCaseModel } from 'types/businessCase';
import { SystemIntakeStatus } from 'types/graphql-global-types';
import { RequestType } from 'types/systemIntake';

type ActionContextType = {
  name: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value: string;
};

const ActionContext = createContext<ActionContextType>({
  name: '',
  onChange: () => {},
  value: ''
});

type ActionRadioOptionProps = {
  route: string;
  label: string;
};

const ActionRadioOption = ({ label, route }: ActionRadioOptionProps) => {
  const radioFieldClassName = 'margin-y-3';

  const actionContext = useContext(ActionContext);
  if (!actionContext) {
    throw new Error(
      'This component cannot be used outside of the Action Radio Group Context'
    );
  }

  return (
    <RadioField
      id={route}
      label={label}
      name={actionContext.name}
      value={route}
      onChange={actionContext.onChange}
      checked={actionContext.value === route}
      className={radioFieldClassName}
    />
  );
};

type ChooseActionProps = {
  systemIntake: {
    status: SystemIntakeStatus;
    lcid: string | null;
    requestType: RequestType;
  };
  businessCase: BusinessCaseModel;
};

const ChooseAction = ({ systemIntake, businessCase }: ChooseActionProps) => {
  const history = useHistory();
  const { t } = useTranslation('action');
  const flags = useFlags();

  const businessCaseExists = !!businessCase.id;
  const [actionRoute, setActionRoute] = useState('');

  const onSubmit = () => history.push(`actions/${actionRoute}`);

  const notITRequestRoute = 'not-it-request';
  const NotITRequest = (
    <ActionRadioOption
      key={notITRequestRoute}
      label={t('actions.notItRequest')}
      route={notITRequestRoute}
    />
  );

  const issueLifecycleIdRoute = 'issue-lcid';
  const IssueLifecycleId = (
    <ActionRadioOption
      key={issueLifecycleIdRoute}
      label="Issue Lifecycle Id"
      route={issueLifecycleIdRoute}
    />
  );

  const needBizCaseRoute = 'need-biz-case';
  const NeedBizCase = (
    <ActionRadioOption
      key={needBizCaseRoute}
      label={t('actions.needBizCase')}
      route={needBizCaseRoute}
    />
  );

  const readyForGrtRoute = 'ready-for-grt';
  const ReadyForGRT = (
    <ActionRadioOption
      key={readyForGrtRoute}
      label={t('actions.readyForGrt')}
      route={readyForGrtRoute}
    />
  );

  const readyForGrbRoute = 'ready-for-grb';
  const ReadyForGRB = (
    <ActionRadioOption
      key={readyForGrbRoute}
      label={t('actions.readyForGrb')}
      route={readyForGrbRoute}
    />
  );

  const provideFeedbackNeedBizCaseRoute = 'provide-feedback-need-biz-case';
  const ProvideFeedbackNeedBizCase = (
    <ActionRadioOption
      key={provideFeedbackNeedBizCaseRoute}
      label={t('actions.provideFeedbackNeedBizCase')}
      route={provideFeedbackNeedBizCaseRoute}
    />
  );

  const provideFeedbackKeepDraftRoute = 'provide-feedback-keep-draft';
  const ProvideFeedbackKeepDraft = (
    <ActionRadioOption
      key={provideFeedbackKeepDraftRoute}
      label={t('actions.provideGrtFeedbackKeepDraft')}
      route={provideFeedbackKeepDraftRoute}
    />
  );

  const provideFeedbackNeedFinalRoute = 'provide-feedback-need-final';
  const ProvideFeedbackNeedFinal = (
    <ActionRadioOption
      key={provideFeedbackNeedFinalRoute}
      label={t('actions.provideGrtFeedbackNeedFinal')}
      route={provideFeedbackNeedFinalRoute}
    />
  );

  const bizCaseNeedsChangesRoute = 'biz-case-needs-changes';
  const BizCaseNeedsChanges = (
    <ActionRadioOption
      key={bizCaseNeedsChangesRoute}
      label={t('actions.bizCaseNeedsChanges')}
      route={bizCaseNeedsChangesRoute}
    />
  );

  const noFurtherGovernanceRoute = 'no-governance';
  const NoFurtherGovernance = (
    <ActionRadioOption
      key={noFurtherGovernanceRoute}
      label={t('actions.noGovernance')}
      route={noFurtherGovernanceRoute}
    />
  );

  const rejectIntakeRoute = 'not-approved';
  const RejectIntake = (
    <ActionRadioOption
      key={rejectIntakeRoute}
      label={t('actions.rejectIntake')}
      route={rejectIntakeRoute}
    />
  );

  const sendEmailRoute = 'send-email';
  const SendEmail = (
    <ActionRadioOption
      key={sendEmailRoute}
      label={t('actions.sendEmail')}
      route={sendEmailRoute}
    />
  );

  const guideReceivedCloseRoute = 'guide-received-close';
  const GuideReceivedClose = (
    <ActionRadioOption
      key={guideReceivedCloseRoute}
      label={t('actions.guideReceivedClose')}
      route={guideReceivedCloseRoute}
    />
  );

  const notRespondingCloseRoute = 'not-responding-close';
  const NotRespondingClose = (
    <ActionRadioOption
      key={notRespondingCloseRoute}
      label={t('actions.notRespondingClose')}
      route={notRespondingCloseRoute}
    />
  );

  const extendLifecycleIDRoute = 'extend-lcid';
  const ExtendLifecycleID = (
    <ActionRadioOption
      key={extendLifecycleIDRoute}
      label={t('actions.extendLifecycleID')}
      route={extendLifecycleIDRoute}
    />
  );

  let availableActions: Array<any> = [];
  let availableHiddenActions: Array<any> = [];

  if (systemIntake.requestType === 'SHUTDOWN') {
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

  if (flags.lcidExtension) {
    // Only display extend LCID action if status is LCID_ISSUED or there has been an lcid issued in the past
    if (
      systemIntake.status === SystemIntakeStatus.LCID_ISSUED ||
      systemIntake.lcid != null
    ) {
      availableActions.unshift(ExtendLifecycleID);
    }
  }

  return (
    <>
      <PageHeading data-testid="grt-actions-view">
        {t('submitAction.heading')}
      </PageHeading>
      <h2 className="margin-y-3">{t('submitAction.subheading')}</h2>
      <form onSubmit={onSubmit}>
        <ActionContext.Provider
          value={{
            name: 'Available Actions',
            onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
              setActionRoute(e.target.value);
            },
            value: actionRoute
          }}
        >
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
        </ActionContext.Provider>
        <Button className="margin-top-5" type="submit" disabled={!actionRoute}>
          Continue
        </Button>
      </form>
      <AnythingWrongSurvey />
    </>
  );
};

export default ChooseAction;
