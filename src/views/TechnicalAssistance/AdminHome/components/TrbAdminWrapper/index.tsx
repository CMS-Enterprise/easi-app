import React, { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Grid, ModalRef } from '@trussworks/react-uswds';
import classNames from 'classnames';
import i18next from 'i18next';

import AdminAction, { AdminActionButton } from 'components/shared/AdminAction';
import CollapsableLink from 'components/shared/CollapsableLink';
import { TaskStatus } from 'components/shared/TaskStatusTag';
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
};

const TrbAdminAction = ({
  translationKey,
  actionButtons
}: TrbAdminActionProps) => {
  const text: ActionText = i18next.t(translationKey, { returnObjects: true });
  const { list } = text;
  return (
    <AdminAction
      title={text.title}
      description={text.description}
      buttons={actionButtons}
      className="margin-top-0"
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
  title: string;
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
  /** Props to display status tag */
  statusTagProps?: {
    status: TaskStatus;
    name: string;
    date: string;
  };
  renderBottom?: boolean;
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
  statusTagProps,
  renderBottom
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
          <h1 className="margin-top-0 margin-bottom-1">{t(title)}</h1>
          {description && (
            <p className="line-height-body-5 font-body-md margin-top-0 mnargin-bottom-1">
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

      {/* Admin Action box */}
      {actionButtons.length > 0 && adminActionProps && !disableStep && (
        <TrbAdminAction
          translationKey={`technicalAssistance:adminAction.statuses.${
            adminActionProps.state === TRBRequestState.CLOSED
              ? adminActionProps.state
              : adminActionProps.status
          }`}
          actionButtons={actionButtons}
        />
      )}

      {children}

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
