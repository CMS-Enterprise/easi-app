import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ButtonGroup } from '@trussworks/react-uswds';

type RequestNotesProps = {
  trbRequestId: string;
};

const RequestNotes = ({ trbRequestId }: RequestNotesProps) => {
  const { t } = useTranslation('technicalAssistance');
  const notesCount = 0;
  return (
    <div
      className="trb-admin-home__request-notes bg-base-lightest padding-x-2 padding-y-1"
      data-testid="trb-admin-home__request-notes"
    >
      <p className="margin-y-0 line-height-body-5">
        <span className="text-bold">{notesCount}</span> {t('requestNotes.text')}
      </p>
      <ButtonGroup>
        <Link to={`/trb/${trbRequestId}/notes`} className="margin-right-05">
          {t('requestNotes.viewNotes')}
        </Link>
        <Link to={`/trb/${trbRequestId}/notes`}>
          {t('requestNotes.addNote')}
        </Link>
      </ButtonGroup>
    </div>
  );
};

export default RequestNotes;
