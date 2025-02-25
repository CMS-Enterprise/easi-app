import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@trussworks/react-uswds';
import classNames from 'classnames';
import { NotFoundPartial } from 'features/Miscellaneous/NotFound';
import {
  GetTRBRequestSummaryQuery,
  TRBAdminNoteFragment,
  useGetTRBAdminNotesQuery
} from 'gql/generated/graphql';

import Alert from 'components/Alert';
import UswdsReactLink from 'components/LinkWrapper';
import PageLoading from 'components/PageLoading';
import { TRBRequestState, TRBRequestStatus } from 'types/graphql-global-types';

import Note from '../_components/Note';
import { ModalViewType } from '../_components/NoteModal';
import TrbAdminWrapper from '../_components/TrbAdminWrapper';

interface NotesProps {
  trbRequestId: string;
  trbRequest?: GetTRBRequestSummaryQuery['trbRequest'];
  setModalView?: React.Dispatch<React.SetStateAction<ModalViewType>>;
  modalMessage?: string;
}

const Notes = ({
  trbRequestId,
  trbRequest,
  setModalView, // prop used to conditionall render text/links/etc specifically for modal
  modalMessage
}: NotesProps) => {
  const { t } = useTranslation('technicalAssistance');

  const [noteCount, setNoteCount] = useState<number>(5);

  const { data, error, loading } = useGetTRBAdminNotesQuery({
    variables: {
      id: trbRequestId
    }
  });

  const notes: TRBAdminNoteFragment[] = data?.trbRequest?.adminNotes || [];

  if (error) {
    return <NotFoundPartial />;
  }

  const adminActionDisabled: boolean =
    trbRequest?.state !== TRBRequestState.CLOSED &&
    trbRequest?.status !== TRBRequestStatus.GUIDANCE_LETTER_SENT;

  return (
    <TrbAdminWrapper
      activePage="notes"
      trbRequestId={trbRequestId}
      disableStep={adminActionDisabled}
      adminActionProps={{
        status: trbRequest?.status || TRBRequestStatus.NEW,
        state: trbRequest?.state || TRBRequestState.OPEN
      }}
      // Only pass title and description if NOT modal view
      {...(!setModalView
        ? { title: t('adminHome.notes'), description: t('notes.description') }
        : {})}
    >
      {setModalView ? (
        <>
          <h1 className="margin-y-05">{t('adminHome.notes')}</h1>
          <p className="line-height-body-4 font-body-md text-light margin-top-05">
            {t('notes.description')}
          </p>
          <Button
            type="button"
            className="margin-bottom-4"
            onClick={() => {
              setModalView('addNote');
            }}
          >
            {t('notes.addNote')}
          </Button>
        </>
      ) : (
        <UswdsReactLink
          to={`/trb/${trbRequestId}/notes/add-note`}
          className={classNames('usa-button margin-bottom-4', {
            'margin-top-4': !adminActionDisabled
          })}
          variant="unstyled"
        >
          {t('notes.addNote')}
        </UswdsReactLink>
      )}

      {modalMessage && (
        <Alert type="success" className="margin-top-0 margin-bottom-4">
          {modalMessage}
        </Alert>
      )}

      {loading && <PageLoading />}

      {notes.length === 0 ? (
        <Alert type="info" slim className="margin-top-0">
          {t('notes.noNotes')}
        </Alert>
      ) : (
        <div className="margin-top-1">
          {/* Show most recent notes first */}
          {[...notes] // TODO: BE will implement filter to ensure correct ordering
            .sort((a, b) => {
              return a.createdAt < b.createdAt ? 1 : -1;
            })
            .filter((note, index) => index < noteCount)
            .map((note, index, array) => {
              const isLastNote = index === array.length - 1;
              return (
                <Note
                  note={note}
                  border={!isLastNote}
                  key={note.id}
                  {...(isLastNote ? { className: 'margin-bottom-0' } : {})}
                />
              );
            })}

          {notes.length > 5 && !(noteCount > notes.length) && (
            <Button
              type="button"
              className="usa-button usa-button--unstyled margin-top-3"
              onClick={() => {
                setNoteCount(noteCount + 5);
              }}
            >
              {t('notes.viewMore')}
            </Button>
          )}
        </div>
      )}
    </TrbAdminWrapper>
  );
};

export default Notes;
