import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/client';
import { Button, ButtonGroup, ModalFooter } from '@trussworks/react-uswds';
import { Form, Formik, FormikHelpers, FormikProps } from 'formik';
import CreateSystemIntakeNoteQuery from 'gql/legacyGQL/CreateSystemIntakeNoteQuery';
import GetAdminNotesAndActionsQuery from 'gql/legacyGQL/GetAdminNotesAndActionsQuery';
import {
  CreateSystemIntakeNote,
  CreateSystemIntakeNoteVariables
} from 'gql/legacyGQL/types/CreateSystemIntakeNote';
import {
  GetAdminNotesAndActions,
  GetAdminNotesAndActionsVariables
} from 'gql/legacyGQL/types/GetAdminNotesAndActions';
import { UpdateSystemIntakeNote } from 'gql/legacyGQL/types/UpdateSystemIntakeNote';
import UpdateSystemIntakeNoteQuery from 'gql/legacyGQL/UpdateSystemIntakeNoteQuery';
import { DateTime } from 'luxon';
import { AppState } from 'stores/reducers/rootReducer';

import Alert from 'components/Alert';
import CollapsableLink from 'components/CollapsableLink';
import { ErrorAlert, ErrorAlertMessage } from 'components/ErrorAlert';
import FieldGroup from 'components/FieldGroup';
import Label from 'components/Label';
import Modal from 'components/Modal';
import {
  NoteByline,
  NoteContent,
  NoteListItem,
  NotesList
} from 'components/NotesList';
import PageHeading from 'components/PageHeading';
import {
  RichTextEditorFormikField,
  RichTextViewer
} from 'components/RichTextEditor';
import TruncatedText from 'components/TruncatedText';
import { SystemIntakeActionType } from 'types/graphql-global-types';
import { formatDateUtc } from 'utils/date';

import './index.scss';

type NoteForm = {
  note: string;
};

const Notes = () => {
  const { systemId } = useParams<{ systemId: string }>();
  const authState = useSelector((state: AppState) => state.auth);
  const [createNoteMutation, createMutationResult] = useMutation<
    CreateSystemIntakeNote,
    CreateSystemIntakeNoteVariables
  >(CreateSystemIntakeNoteQuery, {
    refetchQueries: [
      {
        query: GetAdminNotesAndActionsQuery,
        variables: {
          id: systemId
        }
      }
    ]
  });

  const {
    error,
    data,
    refetch: refetchAdminNotesAndActions
  } = useQuery<GetAdminNotesAndActions, GetAdminNotesAndActionsVariables>(
    GetAdminNotesAndActionsQuery,
    {
      variables: {
        id: systemId
      }
    }
  );

  const [archiveNoteMutate, archiveMutationResult] =
    useMutation<UpdateSystemIntakeNote>(UpdateSystemIntakeNoteQuery, {
      errorPolicy: 'all'
    });

  // Archive System Intake Admin Note
  const archiveSystemIntakeNote = (noteID: string, noteContent: string) => {
    archiveNoteMutate({
      variables: {
        input: {
          id: noteID,
          isArchived: true,
          content: noteContent
        }
      }
    }).then(response => {
      refetchAdminNotesAndActions(); // this is probably not necessary since modal close is a state hook
    });
  };

  const [updateNoteMutate, updateMutationResult] =
    useMutation<UpdateSystemIntakeNote>(UpdateSystemIntakeNoteQuery, {
      errorPolicy: 'all'
    });

  // Update content of System Intake Admin Note
  const updateSystemIntakeNote = (noteID: string, noteContent: string) => {
    updateNoteMutate({
      variables: {
        input: {
          id: noteID,
          isArchived: false,
          content: noteContent
        }
      }
    }).then(response => {
      refetchAdminNotesAndActions(); // this is probably not necessary since modal close is a state hook
    });
  };

  const { t } = useTranslation('governanceReviewTeam');

  const [noteModal, setupNoteModal] = useState({
    isOpen: false,
    id: '',
    content: '',
    type: '' // TODO - make this an enum?
  });

  // Character limit for length of free text (LCID Scope, Next Steps, and Cost Baseline),
  // any text longer then this limit will be displayed with a button to allow users
  // to expand/unexpand the text
  const freeFormTextCharLimit = 250;

  const onSubmit = (
    values: NoteForm,
    { resetForm }: FormikHelpers<NoteForm>
  ) => {
    const input = {
      intakeId: systemId,
      authorName: authState.name,
      content: values.note
    };
    createNoteMutation({ variables: { input } }).then(response => {
      if (!response.errors) {
        resetForm();
      }
      refetchAdminNotesAndActions();
    });
  };

  const initialValues = {
    note: ''
  };

  // New
  const notesByTimestamp =
    data?.systemIntake?.notes.map(note => {
      const { id, createdAt, content, editor, modifiedAt, modifiedBy, author } =
        note;
      return {
        createdAt,
        element: (
          <NoteListItem key={id} isLinked data-testid="user-note">
            <NoteContent plainTextWrap={false}>
              <RichTextViewer className="margin-bottom-1" value={content} />
            </NoteContent>
            <NoteByline>{`by ${author.name} | ${DateTime.fromISO(
              createdAt
            ).toFormat('MMMM d, yyyy')} at ${DateTime.fromISO(
              createdAt
            ).toLocaleString(DateTime.TIME_SIMPLE)}`}</NoteByline>
            {modifiedAt != null && modifiedBy != null && (
              <div>
                <NoteByline>{`last edited by ${
                  editor?.commonName
                } | ${DateTime.fromISO(modifiedAt).toFormat(
                  'MMMM d, yyyy'
                )} at ${DateTime.fromISO(modifiedAt).toLocaleString(
                  DateTime.TIME_SIMPLE
                )}`}</NoteByline>
              </div>
            )}
            <div className="display-block margin-top-1">
              {/* Edit Note */}
              <NoteByline className="margin-right-1">
                <Button
                  type="button"
                  id="GovernanceReviewTeam-EditNoteButton"
                  unstyled
                  onClick={() => {
                    setupNoteModal({
                      ...noteModal,
                      ...{
                        isOpen: true,
                        id,
                        content,
                        type: 'edit'
                      }
                    });
                  }}
                >
                  {t('notes.edit')}
                </Button>
              </NoteByline>
              {noteModal.type === 'edit' && noteModal.id === id && (
                <Modal
                  isOpen={noteModal.isOpen}
                  closeModal={() => {
                    setupNoteModal({
                      ...noteModal,
                      ...{
                        isOpen: false
                      }
                    });
                  }}
                >
                  <PageHeading headingLevel="h2" className="margin-y-0">
                    {t('notes.editModal.header')}
                  </PageHeading>
                  <p className="margin-top-0">
                    {t('notes.editModal.description')}
                  </p>
                  <Label
                    id="GovernanceReviewTeam-EditNote-label"
                    htmlFor="GovernanceReviewTeam-EditNote"
                  >
                    {t('notes.editModal.contentLabel')}
                  </Label>
                  <RichTextEditorFormikField
                    id="GovernanceReviewTeam-EditNote"
                    name="editNote"
                    height="300px"
                    required
                    editableProps={{
                      id: 'GovernanceReviewTeam-EditNote',
                      'data-testid': 'GovernanceReviewTeam-EditNote',
                      'aria-labelledby': 'GovernanceReviewTeam-EditNote-label'
                    }}
                    onChange={(value: any) => {
                      setupNoteModal({
                        ...noteModal,
                        ...{
                          content: value
                        }
                      });
                    }}
                    value={noteModal.content}
                    onBlur={() => {}}
                  />
                  <ModalFooter>
                    <ButtonGroup>
                      <Button
                        type="button"
                        id="GovernanceReviewTeam-SaveEditsButton"
                        className="margin-right-1"
                        onClick={() => {
                          updateSystemIntakeNote(
                            noteModal.id,
                            noteModal.content
                          );
                          setupNoteModal({
                            ...noteModal,
                            ...{
                              isOpen: false
                            }
                          });
                        }}
                      >
                        {t('notes.editModal.saveEdits')}
                      </Button>
                      <Button
                        type="button"
                        unstyled
                        onClick={() => {
                          setupNoteModal({
                            ...noteModal,
                            ...{
                              isOpen: false
                            }
                          });
                        }}
                      >
                        {t('notes.editModal.cancel')}
                      </Button>
                    </ButtonGroup>
                  </ModalFooter>
                </Modal>
              )}

              {/* Remove Note */}
              <NoteByline className="margin-left-1">
                <Button
                  type="button"
                  id="GovernanceReviewTeam-RemoveNoteButton"
                  unstyled
                  onClick={() => {
                    setupNoteModal({
                      ...noteModal,
                      ...{
                        isOpen: true,
                        id,
                        content,
                        type: 'remove'
                      }
                    });
                  }}
                >
                  {t('notes.remove')}
                </Button>
              </NoteByline>
              {noteModal.type === 'remove' && noteModal.id === id && (
                <Modal
                  isOpen={noteModal.isOpen}
                  closeModal={() => {
                    setupNoteModal({
                      ...noteModal,
                      ...{
                        isOpen: false
                      }
                    });
                  }}
                >
                  <PageHeading headingLevel="h2" className="margin-top-0">
                    {t('notes.removeModal.header')}
                  </PageHeading>
                  <p>{t('notes.removeModal.description')}</p>
                  <Button
                    type="button"
                    id="GovernanceReviewTeam-SaveArchiveButton"
                    className="margin-right-4"
                    onClick={() => {
                      archiveSystemIntakeNote(noteModal.id, noteModal.content);
                      setupNoteModal({
                        ...noteModal,
                        ...{
                          isOpen: false
                        }
                      });
                    }}
                  >
                    {t('notes.removeModal.removeNote')}
                  </Button>
                  <Button
                    type="button"
                    unstyled
                    onClick={() => {
                      setupNoteModal({
                        ...noteModal,
                        ...{
                          isOpen: false
                        }
                      });
                    }}
                  >
                    {t('notes.removeModal.cancel')}
                  </Button>
                </Modal>
              )}
            </div>
          </NoteListItem>
        )
      };
    }) || [];

  const actionsByTimestamp =
    data?.systemIntake?.actions.map(action => {
      const { id, createdAt, type, actor, feedback, lcidExpirationChange } =
        action;

      return {
        createdAt,
        element: (
          <NoteListItem key={id} isLinked data-testid="action-note">
            <NoteContent>{t(`notes.actionName.${type}`)}</NoteContent>
            <NoteByline>{`by: ${actor.name} | ${DateTime.fromISO(
              createdAt
            ).toFormat('MMMM d, yyyy')} at ${DateTime.fromISO(
              createdAt
            ).toLocaleString(DateTime.TIME_SIMPLE)}`}</NoteByline>

            {
              // Update LCID fields summary
              lcidExpirationChange &&
                type === SystemIntakeActionType.UPDATE_LCID && (
                  <dl>
                    <dt>Life Cycle ID</dt>
                    <dd>{data.systemIntake?.lcid}</dd>
                    <dt>{t('notes.extendLcid.newExpirationDate')}</dt>
                    <dd>
                      {formatDateUtc(
                        lcidExpirationChange.newDate,
                        'MMMM d, yyyy'
                      )}
                    </dd>
                    <dt>{t('notes.extendLcid.oldExpirationDate')}</dt>
                    <dd>
                      {formatDateUtc(
                        lcidExpirationChange.previousDate,
                        'MMMM d, yyyy'
                      )}
                    </dd>

                    {/* Used TruncatedText for old/new scope, next steps, and cost baseline since they can be 3000 characters */}
                    <dt>{t('notes.extendLcid.newScope')}</dt>
                    <dd>
                      <TruncatedText
                        id="new-lcid-scope"
                        label="less"
                        closeLabel="more"
                        text={
                          lcidExpirationChange.newScope ||
                          t('notes.extendLcid.noScope')
                        }
                        charLimit={freeFormTextCharLimit}
                        isRich
                      />
                    </dd>

                    <dt>{t('notes.extendLcid.oldScope')}</dt>
                    <dd>
                      <TruncatedText
                        id="previous-lcid-scope"
                        label="less"
                        closeLabel="more"
                        text={
                          lcidExpirationChange.previousScope ||
                          t('notes.extendLcid.noScope')
                        }
                        charLimit={freeFormTextCharLimit}
                        isRich
                      />
                    </dd>

                    <dt>{t('notes.extendLcid.newNextSteps')}</dt>
                    <dd>
                      <TruncatedText
                        id="new-lcid-next-steps"
                        label="less"
                        closeLabel="more"
                        text={
                          lcidExpirationChange.newNextSteps ||
                          t('notes.extendLcid.noNextSteps')
                        }
                        charLimit={freeFormTextCharLimit}
                        isRich
                      />
                    </dd>

                    <dt>{t('notes.extendLcid.oldNextSteps')}</dt>
                    <dd>
                      <TruncatedText
                        id="previous-lcid-next-steps"
                        label="less"
                        closeLabel="more"
                        text={
                          lcidExpirationChange.previousNextSteps ||
                          t('notes.extendLcid.noNextSteps')
                        }
                        charLimit={freeFormTextCharLimit}
                        isRich
                      />
                    </dd>

                    <dt>{t('notes.extendLcid.newCostBaseline')}</dt>
                    <dd>
                      <TruncatedText
                        id="new-lcid-cost-baseline"
                        label="less"
                        closeLabel="more"
                        text={
                          lcidExpirationChange.newCostBaseline ||
                          t('notes.extendLcid.noCostBaseline')
                        }
                        charLimit={freeFormTextCharLimit}
                        isRich
                      />
                    </dd>

                    <dt>{t('notes.extendLcid.oldCostBaseline')}</dt>
                    <dd>
                      <TruncatedText
                        id="previous-lcid-cost-baseline"
                        label="less"
                        closeLabel="more"
                        text={
                          lcidExpirationChange.previousCostBaseline ||
                          t('notes.extendLcid.noCostBaseline')
                        }
                        charLimit={freeFormTextCharLimit}
                        isRich
                      />
                    </dd>
                  </dl>
                )
            }
            {feedback && (
              <div className="margin-top-2">
                <CollapsableLink
                  id={`ActionEmailText-${id}`}
                  label={t('notes.showEmail')}
                  closeLabel={t('notes.hideEmail')}
                  styleLeftBar={false}
                >
                  <RichTextViewer value={feedback} />
                </CollapsableLink>
              </div>
            )}
          </NoteListItem>
        )
      };
    }) || [];

  const interleavedList = [...notesByTimestamp, ...actionsByTimestamp]
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
    .map(a => a.element);

  return (
    <>
      <PageHeading data-testid="grt-notes-view" className="margin-top-0">
        {t('notes.heading')}
      </PageHeading>
      {archiveMutationResult.error && (
        <Alert type="error" slim className="padding-1">
          <div>{t('notes.removeModal.error')}</div>
        </Alert>
      )}
      {updateMutationResult.error && (
        <Alert type="error" className="padding-1">
          <div>{t('notes.editModal.error')}</div>
        </Alert>
      )}
      <Formik initialValues={initialValues} onSubmit={onSubmit}>
        {(formikProps: FormikProps<NoteForm>) => {
          const { values, handleSubmit } = formikProps;
          return (
            <div className="tablet:grid-col-9 margin-bottom-7">
              {createMutationResult && createMutationResult.error && (
                <ErrorAlert heading="Error">
                  <ErrorAlertMessage
                    message={createMutationResult.error.message}
                    errorKey="note"
                  />
                </ErrorAlert>
              )}
              <Form
                onSubmit={e => {
                  handleSubmit(e);
                  window.scrollTo(0, 0);
                }}
              >
                <FieldGroup>
                  <Label
                    id="GovernanceReviewTeam-Note-label"
                    htmlFor="GovernanceReviewTeam-Note"
                  >
                    {t('notes.addNote')}
                  </Label>
                  <RichTextEditorFormikField
                    id="GovernanceReviewTeam-Note"
                    name="note"
                    height="405px"
                    required
                    editableProps={{
                      id: 'GovernanceReviewTeam-Note',
                      'data-testid': 'GovernanceReviewTeam-Note',
                      'aria-labelledby': 'GovernanceReviewTeam-Note-label'
                    }}
                  />
                </FieldGroup>
                <Button
                  className="margin-top-2"
                  type="submit"
                  disabled={!values.note}
                >
                  {t('notes.addNoteCta')}
                </Button>
              </Form>
              {error && (
                <Alert type="error">The notes could not be loaded.</Alert>
              )}
              {!error && data && (
                <NotesList className="margin-top-7 margin-left-1">
                  {interleavedList}
                </NotesList>
              )}
            </div>
          );
        }}
      </Formik>
    </>
  );
};

export default Notes;
