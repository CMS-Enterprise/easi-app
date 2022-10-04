import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Route, Switch, useHistory, useRouteMatch } from 'react-router-dom';
import { Button } from '@trussworks/react-uswds';

import UswdsReactLink from 'components/LinkWrapper';

import AttendeesList from './AttendeesList';
import Pager from './Pager';
import { FormStepComponentProps } from '.';

function Attendees({ request, stepUrl }: FormStepComponentProps) {
  const { t } = useTranslation('technicalAssistance');
  const { path, url } = useRouteMatch();
  const history = useHistory();

  // Temp example vars to demo adding attendees
  const [numExample, setNumExample] = useState(0);

  return (
    <div className="trb-attendees">
      <Switch>
        <Route exact path={`${path}/list`}>
          <AttendeesList
            request={request}
            backToFormUrl={stepUrl.current}
            addExample={() => {
              setNumExample(numExample + 1);
            }}
          />
        </Route>

        <Route exact path={`${path}`}>
          <div className="margin-y-2">
            <div className="margin-y-2">Attendees: {numExample}</div>
            <UswdsReactLink
              variant="unstyled"
              className="usa-button"
              to={`${url}/list`}
            >
              {t('attendees.addAnAttendee')}
            </UswdsReactLink>
            <Button
              type="button"
              onClick={() => {
                setNumExample(numExample - 1);
              }}
            >
              {t('attendees.remove')}
            </Button>
          </div>

          <Pager
            back={{
              onClick: () => {
                history.push(stepUrl.back);
              }
            }}
            next={{
              type: 'submit',
              onClick: e => {
                history.push(stepUrl.next);
              },
              // Demo next button based on attendees
              ...(numExample === 0
                ? {
                    text: t('attendees.continueWithoutAdding'),
                    outline: true
                  }
                : {})
            }}
          />
        </Route>
      </Switch>
    </div>
  );
}

export default Attendees;
