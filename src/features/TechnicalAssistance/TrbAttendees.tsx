import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useParams } from 'react-router-dom';
import { Grid, GridContainer } from '@trussworks/react-uswds';

import Alert from 'components/Alert';

import Breadcrumbs from '../../components/Breadcrumbs';

import Attendees from './RequestForm/Attendees';
import { TrbFormAlert } from './RequestForm';

const TrbAttendees = () => {
  const { t } = useTranslation('technicalAssistance');

  const { pathname } = useLocation();

  const isForm = pathname.includes('/list');

  const { id: requestID } = useParams<{
    id: string;
  }>();

  const [formAlert, setFormAlert] = useState<TrbFormAlert>(false);

  return (
    <GridContainer>
      <Grid desktop={{ col: 12 }}>
        {!isForm && (
          <Breadcrumbs
            items={[
              { text: t('heading'), url: '/trb' },
              {
                text: t('taskList.heading'),
                url: `/trb/task-list/${requestID}`
              },
              {
                text: t('attendees.heading')
              }
            ]}
          />
        )}

        {/* Displays document success/fail messages when removing a document on this view */}
        {formAlert && (
          <Alert
            type={formAlert.type}
            heading={formAlert.heading}
            slim
            className="margin-top-2 margin-bottom-0"
          >
            {formAlert.message}
          </Alert>
        )}

        <Attendees
          fromTaskList
          setFormAlert={setFormAlert}
          taskListUrl={`/trb/task-list/${requestID}`}
        />
      </Grid>
    </GridContainer>
  );
};

export default TrbAttendees;
