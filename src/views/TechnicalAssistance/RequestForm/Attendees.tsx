import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@trussworks/react-uswds';

import Pager from './Pager';
import { FormStepComponentProps } from '.';

function Attendees({ request, step }: FormStepComponentProps) {
  const { t } = useTranslation('technicalAssistance');
  return (
    <>
      <Button type="button">{t('attendees.addAnAttendee')}</Button>
      <Pager
        back={{ url: `/trb/requests/${request.id}/${step - 1}` }}
        next={{
          url: `/trb/requests/${request.id}/${step + 1}`,
          text: t('attendees.continueWithoutAdding'),
          style: 'outline'
        }}
      />
    </>
  );
}

export default Attendees;
