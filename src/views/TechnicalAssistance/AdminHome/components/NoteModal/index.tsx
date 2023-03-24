import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ReactModal from 'react-modal';
import {
  Grid,
  GridContainer,
  IconArrowBack,
  IconClose
} from '@trussworks/react-uswds';
import noScroll from 'no-scroll';

import AddNote from '../../AddNote';
import Notes from '../../Notes';

import './index.scss';

export type ModalViewType = 'addNote' | 'viewNotes';

type NotesModalWrapperProps = {
  isOpen: boolean;
  trbRequestId: string;
  addNote?: boolean;
  openModal: React.Dispatch<React.SetStateAction<boolean>>;
};

const NotesModal = ({
  isOpen,
  trbRequestId,
  addNote,
  openModal
}: NotesModalWrapperProps) => {
  const { t } = useTranslation('technicalAssistance');

  const [viewType, setViewType] = useState<ModalViewType>('addNote');

  const handleOpenModal = () => {
    noScroll.on();
  };

  // Set initial view type
  useEffect(() => {
    if (addNote) {
      setViewType('addNote');
    } else {
      setViewType('viewNotes');
    }
  }, [addNote]);

  return (
    <ReactModal
      isOpen={isOpen}
      overlayClassName="easi-notes__overlay overflow-y-scroll"
      className="easi-notes__content"
      onAfterOpen={handleOpenModal}
      onAfterClose={noScroll.off}
      onRequestClose={() => openModal(false)}
      shouldCloseOnOverlayClick
      contentLabel={t('ariaLabel')}
      appElement={document.getElementById('root')! as HTMLElement}
    >
      <div data-testid="discussion-modal">
        <div className="easi-notes__x-button-container display-flex text-base flex-align-center">
          <button
            type="button"
            data-testid="close-discussions"
            className="easi-notes__x-button margin-right-2"
            aria-label="Close Modal"
            onClick={() => {
              if (viewType === 'addNote') {
                setViewType('viewNotes');
              } else {
                openModal(false);
              }
            }}
          >
            {viewType === 'viewNotes' ? (
              <IconClose size={4} className="text-base" />
            ) : (
              <IconArrowBack size={4} className="text-base" />
            )}
          </button>
          <h4 className="margin-0">
            {viewType === 'viewNotes' ? t('notes.notes') : t('notes.allNotes')}
          </h4>
        </div>
        <GridContainer className="padding-y-8">
          <Grid desktop={{ col: 12 }}>
            {viewType === 'viewNotes' ? (
              <Notes trbRequestId={trbRequestId} setModalView={setViewType} />
            ) : (
              <AddNote setModalView={setViewType} />
            )}
          </Grid>
        </GridContainer>
      </div>
    </ReactModal>
  );
};

export default NotesModal;
