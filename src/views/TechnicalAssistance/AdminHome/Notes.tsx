import React from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, Button } from '@trussworks/react-uswds';

import UswdsReactLink from 'components/LinkWrapper';
import PageLoading from 'components/PageLoading';
import useApolloCacheQuery from 'hooks/useApolloCacheQuery';
import GetTRBAdminNotesQuery from 'queries/GetTrbAdminNotesQuery';
import {
  GetTrbAdminNotes,
  GetTrbAdminNotes_trbRequest_adminNotes as GetTrbAdminNotesType,
  GetTrbAdminNotesVariables
} from 'queries/types/GetTrbAdminNotes';
import { NotFoundPartial } from 'views/NotFound';

import Note from './components/Note';
import { ModalViewType } from './components/NoteModal';

const Notes = ({
  trbRequestId,
  setModalView,
  modalMessage
}: {
  trbRequestId: string;
  setModalView?: React.Dispatch<React.SetStateAction<ModalViewType>>;
  modalMessage?: string;
}) => {
  const { t } = useTranslation('technicalAssistance');

  const { data, error, loading } = useApolloCacheQuery<
    GetTrbAdminNotes,
    GetTrbAdminNotesVariables
  >(GetTRBAdminNotesQuery, {
    variables: {
      id: trbRequestId
    }
  });

  const notes: GetTrbAdminNotesType[] = data?.trbRequest?.adminNotes || [];

  if (error) {
    return <NotFoundPartial />;
  }

  return (
    <div
      className="trb-admin-home__notes line-height-body-5"
      data-testid="trb-admin-home__notes"
      id={`trbAdminNotes-${trbRequestId}`}
    >
      <h1 className="margin-top-0 margin-bottom-1 line-height-heading-2">
        {t('adminHome.subnav.notes')}
      </h1>

      <p>{t('notes.description')}</p>

      {modalMessage && (
        <Alert type="success" slim className="margin-top-0 margin-bottom-4">
          {modalMessage}
        </Alert>
      )}

      {setModalView ? (
        <Button
          type="button"
          className=" margin-bottom-6"
          onClick={() => {
            setModalView('addNote');
          }}
        >
          {t('notes.addNote')}
        </Button>
      ) : (
        <UswdsReactLink
          to={`/trb/${trbRequestId}/notes/add-note`}
          className="usa-button margin-bottom-6"
          variant="unstyled"
        >
          {t('notes.addNote')}
        </UswdsReactLink>
      )}

      {loading && <PageLoading />}

      {notes.length === 0 ? (
        <Alert type="info" slim className="margin-top-0">
          {t('notes.noNotes')}
        </Alert>
      ) : (
        notes.map(note => <Note note={note} key={note.id} />)
      )}
    </div>
  );
};

export default Notes;
