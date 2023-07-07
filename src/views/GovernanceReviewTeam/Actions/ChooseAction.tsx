import React, { createContext, useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { Button, Radio } from '@trussworks/react-uswds';

import PageHeading from 'components/PageHeading';
import CollapsableLink from 'components/shared/CollapsableLink';
import { RadioGroup } from 'components/shared/RadioField';
import { GetSystemIntake_systemIntake as SystemIntake } from 'queries/types/GetSystemIntake';

import './chooseAction.scss';

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
  description: string;
  accordionText: string;
};

const ActionRadioOption = ({
  label,
  description,
  accordionText,
  route
}: ActionRadioOptionProps) => {
  const { t } = useTranslation('action');

  const actionContext = useContext(ActionContext);
  const { name, onChange, value } = actionContext;

  return (
    <Radio
      className="grt-action-radio__option"
      id={route}
      label={t('chooseAction.selectAction')}
      name={name}
      value={route}
      onChange={onChange}
      checked={value === route}
      title={label}
      labelDescription={
        <>
          <h3 className="margin-top-2 margin-bottom-0">{label}</h3>
          <p className="margin-0 text-base font-body-sm line-height-body-5">
            {description}
          </p>
          <CollapsableLink
            className="margin-top-2"
            id="grt-action-radio__accordion"
            label={t('chooseAction.accordionLabel')}
          >
            <p className="line-height-body-4 font-body-md margin-0">
              {accordionText}
            </p>
          </CollapsableLink>
        </>
      }
      tile
    />
  );
};

type ChooseActionProps = {
  systemIntake: SystemIntake;
};

const ChooseAction = ({ systemIntake }: ChooseActionProps) => {
  const history = useHistory();
  const { t } = useTranslation('action');

  const { state, decisionState } = systemIntake;

  const [actionRoute, setActionRoute] = useState('');

  return (
    <>
      <PageHeading
        data-testid="grt-actions-view"
        className="margin-top-0 margin-bottom-5"
      >
        {t('chooseAction.heading')}
      </PageHeading>

      <form
        onSubmit={e => {
          e.preventDefault();
          history.push(`actions/${actionRoute}`);
        }}
        className="margin-bottom-4"
      >
        <ActionContext.Provider
          value={{
            name: 'Available Actions',
            onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
              setActionRoute(e.target.value);
            },
            value: actionRoute
          }}
        >
          <RadioGroup className="grt-actions-radio-group">
            <ActionRadioOption
              label={t('chooseAction.requestEdits.title')}
              description={t('chooseAction.requestEdits.description')}
              accordionText={t('chooseAction.requestEdits.accordion')}
              route="request-edits"
            />
            <ActionRadioOption
              label={t('chooseAction.progressToNewStep.title')}
              description={t('chooseAction.progressToNewStep.description')}
              accordionText={t('chooseAction.progressToNewStep.accordion')}
              route="next-step"
            />
            <ActionRadioOption
              label={t(`chooseAction.decision${state}.title`, {
                context: decisionState
              })}
              description={t(`chooseAction.decision${state}.description`, {
                context: decisionState
              })}
              accordionText={t(`chooseAction.decision${state}.accordion`, {
                context: decisionState
              })}
              route="decision"
            />
          </RadioGroup>
        </ActionContext.Provider>

        <Button className="margin-top-3" type="submit" disabled={!actionRoute}>
          {t('submitAction.continue')}
        </Button>
      </form>
    </>
  );
};

export default ChooseAction;
