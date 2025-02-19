import React, { useRef, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useReactToPrint } from 'react-to-print';
import { Grid, ModalRef } from '@trussworks/react-uswds';
import classNames from 'classnames';
import i18next from 'i18next';

import AdminAction, { AdminActionButton } from 'components/AdminAction';
import CollapsableLink from 'components/CollapsableLink';
import { PDFExportButton } from 'components/PDFExport';
import { TaskStatus } from 'components/TaskStatusTag';
import { TRBRequestState, TRBRequestStatus } from 'types/graphql-global-types';
import { TrbAdminPath, TrbRequestIdRef } from 'types/technicalAssistance';

import AdminTaskStatusTag from '../AdminTaskStatusTag';
import NoteBox, { noteCategoryPageMap } from '../NoteBox';
import NotesModal from '../NoteModal';

import useTrbAdminActionButtons from './useTrbAdminActionButtons';

export type ActionText = {
  title: string;
  description?: string;
  list?: {
    label: string;
    text?: string;
    unorderedItems?: string[];
    orderedItems?: string[];
    note?: string;
  };
};

type TrbAdminActionProps = {
  translationKey: string;
  actionButtons: AdminActionButton[];
  className?: string;
};

const TrbAdminAction = ({
  translationKey,
  actionButtons,
  className
}: TrbAdminActionProps) => {
  const text: ActionText = i18next.t(translationKey, { returnObjects: true });
  const { list } = text;
  return (
    <AdminAction
      title={text.title}
      description={text.description}
      buttons={actionButtons}
      className={classNames('easi-no-print', className, {
        'margin-top-0': !className?.includes('margin-top')
      })}
    >
      {list && (
        <CollapsableLink
          id="trbAdminActionContent"
          className="margin-y-2 text-bold display-flex flex-align-center"
          label={list.label}
        >
          {list.text && <p className="margin-y-0">{list.text}</p>}
          {list.unorderedItems && (
            <ul className="margin-y-05">
              {list.unorderedItems.map((item, index) => (
                <li key={item}>
                  <Trans
                    i18nKey={`${translationKey}.list.unorderedItems.${index}`}
                    components={{ b: <span className="text-bold" /> }}
                  />
                </li>
              ))}
            </ul>
          )}
          {list.orderedItems && (
            <ol className="margin-y-05">
              {list.orderedItems.map((item, index) => (
                <li key={item}>
                  <Trans
                    i18nKey={`${translationKey}.list.orderedItems.${index}`}
                    components={{ b: <span className="text-bold" /> }}
                  />
                </li>
              ))}
            </ol>
          )}
          {list.note && <p className="margin-y-0">{list.note}</p>}
        </CollapsableLink>
      )}
    </AdminAction>
  );
};

type TrbAdminWrapperProps = {
  activePage: TrbAdminPath;
  trbRequestId: string;
  children: React.ReactNode;

  /** Page title */
  title?: string;
  /** Page description */
  description?: string;
  /** Set to true if step actions should be hidden */
  disableStep?: boolean;
  /** Include noteCount to display Notes component */
  noteCount?: number;
  /** Props to display Admin Action componnet */
  adminActionProps?: {
    status: TRBRequestStatus;
    state: TRBRequestState;
    // TRB Lead modal refs
    assignLeadModalRef?: React.RefObject<ModalRef>;
    assignLeadModalTrbRequestIdRef?: React.MutableRefObject<TrbRequestIdRef>;
  };
  /** Whether or not to render admin actions box at bottom of page */
  renderBottom?: boolean;
  /** Props to display status tag */
  statusTagProps?: {
    status: TaskStatus;
    name: string;
    date: string;
  };
  /** Props for optional PDF export button */
  pdfExportProps?: {
    title: string;
    filename: string;
    label: string;
  };
};

export default function TrbAdminWrapper({
  activePage,
  trbRequestId,
  children,
  title,
  description,
  disableStep,
  adminActionProps,
  noteCount,
  renderBottom,
  statusTagProps,
  pdfExportProps
}: TrbAdminWrapperProps) {
  const { t } = useTranslation('technicalAssistance');

  const { status, state, assignLeadModalRef, assignLeadModalTrbRequestIdRef } =
    adminActionProps || {};

  const [notesOpen, openNotes] = useState<boolean>(false);

  const actionButtons = useTrbAdminActionButtons({
    activePage,
    trbRequestId,
    status,
    state,
    assignLeadModalRef,
    assignLeadModalTrbRequestIdRef,
    openNotes
  });

  const printRef = useRef<HTMLDivElement>(null);
  const handlePrint = useReactToPrint({
    documentTitle: pdfExportProps?.filename || '',
    content: () => printRef.current,
    // The lib default is to have no margin, which hides window.prints()'s built in pagination
    // Set auto margins back to show everything the browser renders
    pageStyle: `
      @page {
        margin: auto;
      }
    `
  });

  return (
    <Grid
      className={classNames(`trbAdmin__${activePage}`, {
        'margin-bottom-2': !!adminActionProps && !disableStep
      })}
      id={`trbAdmin__${activePage}`}
      data-testid={`trb-admin-home__${activePage}`}
    >
      {notesOpen && (
        <NotesModal
          isOpen={notesOpen}
          trbRequestId={trbRequestId}
          addNote
          openModal={openNotes}
          defaultSelect={noteCategoryPageMap[activePage]}
        />
      )}

      <Grid row gap="lg">
        <Grid tablet={{ col: 8 }}>
          {title && (
            <h1 className="margin-top-0 margin-bottom-1">{t(title)}</h1>
          )}
          {description && (
            <p className="line-height-body-4 text-light font-body-md margin-top-0">
              {t(description)}
            </p>
          )}
          {statusTagProps && (
            <AdminTaskStatusTag
              status={statusTagProps.status}
              name={statusTagProps.name}
              date={statusTagProps.date}
              className="margin-top-0 margin-bottom-205"
            />
          )}

          {!!pdfExportProps && (
            <PDFExportButton handlePrint={handlePrint}>
              {pdfExportProps.label}
            </PDFExportButton>
          )}
        </Grid>

        {noteCount !== undefined && (
          <Grid tablet={{ col: 4 }}>
            <NoteBox
              trbRequestId={trbRequestId}
              noteCount={noteCount}
              activePage={activePage}
            />
          </Grid>
        )}
      </Grid>

      {actionButtons.length > 0 && adminActionProps && !disableStep && (
        <TrbAdminAction
          translationKey={`technicalAssistance:adminAction.statuses.${
            adminActionProps.state === TRBRequestState.CLOSED
              ? adminActionProps.state
              : adminActionProps.status
          }`}
          actionButtons={actionButtons}
          className={pdfExportProps ? 'margin-top-3' : ''}
        />
      )}

      {pdfExportProps ? (
        <div ref={printRef}>
          {pdfExportProps?.title && (
            <h1 className="easi-only-print">{pdfExportProps.title}</h1>
          )}
          {children}
        </div>
      ) : (
        children
      )}

      {/* Admin Action box rendered additionally at bottom */}
      {renderBottom &&
        actionButtons.length > 0 &&
        adminActionProps &&
        !disableStep && (
          <TrbAdminAction
            translationKey={`technicalAssistance:adminAction.statuses.${
              adminActionProps.state === TRBRequestState.CLOSED
                ? adminActionProps.state
                : adminActionProps.status
            }`}
            actionButtons={actionButtons}
          />
        )}
    </Grid>
  );
}
