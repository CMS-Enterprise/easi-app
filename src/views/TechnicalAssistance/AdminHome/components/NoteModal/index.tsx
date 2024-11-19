import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ReactModal from 'react-modal';
import { Button, Grid, GridContainer, Icon } from '@trussworks/react-uswds';
import { TRBAdminNoteCategory } from 'gql/gen/graphql';
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
  defaultSelect?: TRBAdminNoteCategory;
};

const NotesModal = ({
  isOpen,
  trbRequestId,
  addNote,
  openModal,
  defaultSelect
}: NotesModalWrapperProps) => {
  const { t } = useTranslation('technicalAssistance');

  // State used to render <AddNote /> or <Notes />
  const [viewType, setViewType] = useState<ModalViewType>('addNote');

  const [modalMessage, setModalMessage] = useState<string>('');

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
      overlayClassName="easi-notes__overlay"
      className="easi-notes__content"
      onAfterOpen={handleOpenModal}
      onAfterClose={noScroll.off}
      onRequestClose={() => openModal(false)}
      shouldCloseOnOverlayClick
      contentLabel={t('ariaLabel')}
      appElement={document.getElementById('root')! as HTMLElement}
    >
      <div data-testid="discussion-modal">
        <div className="easi-notes__x-button-container display-flex text-base flex-align-center padding-y-0 padding-x-1">
          <Button
            type="button"
            data-testid="close-discussions"
            className="bg-transparent margin-right-0"
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
              <Icon.Close size={4} className="text-base" />
            ) : (
              <Icon.ArrowBack size={4} className="text-base" />
            )}
          </Button>
          <h4 className="margin-0">
            {viewType === 'viewNotes' ? t('notes.notes') : t('notes.allNotes')}
          </h4>
        </div>
        <GridContainer className="padding-y-6">
          <Grid desktop={{ col: 12 }}>
            {viewType === 'viewNotes' ? (
              <Notes
                trbRequestId={trbRequestId}
                setModalView={setViewType}
                modalMessage={modalMessage}
              />
            ) : (
              <AddNote
                trbRequestId={trbRequestId}
                setModalView={setViewType}
                setModalMessage={setModalMessage}
                defaultSelect={defaultSelect}
              />
            )}
          </Grid>
        </GridContainer>
      </div>
    </ReactModal>
  );
};

export default NotesModal;
