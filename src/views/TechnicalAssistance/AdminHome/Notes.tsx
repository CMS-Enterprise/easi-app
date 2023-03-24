import React from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@apollo/client';
import { Alert, Button } from '@trussworks/react-uswds';

import UswdsReactLink from 'components/LinkWrapper';
import PageLoading from 'components/PageLoading';
import GetTRBAdminNotesQuery from 'queries/GetTrbAdminNotesQuery';
import {
  GetTrbAdminNotes,
  GetTrbAdminNotes_trbRequest_adminNotes as GetTrbAdminNotesType,
  GetTrbAdminNotesVariables
} from 'queries/types/GetTrbAdminNotes';
import { TrbAdminPageProps } from 'types/technicalAssistance';
import { NotFoundPartial } from 'views/NotFound';

import Note from './components/Note';
import { ModalViewType } from './components/NoteModal';

const Notes = ({
  trbRequestId,
  setModalView,
  modalMessage
}: TrbAdminPageProps & {
  setModalView?: React.Dispatch<React.SetStateAction<ModalViewType>>;
  modalMessage?: string;
}) => {
  const { t } = useTranslation('technicalAssistance');

  const { data, error, loading } = useQuery<
    GetTrbAdminNotes,
    GetTrbAdminNotesVariables
  >(GetTRBAdminNotesQuery, {
    variables: { id: trbRequestId }
  });

  const notes: GetTrbAdminNotesType[] | undefined =
    data?.trbRequest?.adminNotes;

  if (error) {
    return <NotFoundPartial />;
  }

  return (
    <div
      className="trb-admin-home__notes line-height-body-5"
      data-testid="trb-admin-home__notes"
      id={`trbAdminNotes-${trbRequestId}`}
    >
      {modalMessage && (
        <Alert type="success" slim className="margin-top-neg-1 margin-bottom-4">
          {modalMessage}
        </Alert>
      )}

      <h1 className="margin-top-0 margin-bottom-1 line-height-heading-2">
        {t('adminHome.subnav.notes')}
      </h1>

      <p>{t('notes.description')}</p>

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

      {!notes ? (
        <Alert type="info" slim>
          {t('notes.noNotes')}
        </Alert>
      ) : (
        notes.map(note => <Note note={note} key={note.id} />)
      )}
    </div>
  );
};

export default Notes;
