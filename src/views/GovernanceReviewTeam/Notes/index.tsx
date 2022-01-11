import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/client';
import { Button } from '@trussworks/react-uswds';
import { Field, Form, Formik, FormikHelpers, FormikProps } from 'formik';
import { DateTime } from 'luxon';

import {
  NoteByline,
  NoteContent,
  NoteListItem,
  NotesList
} from 'components/NotesList';
import PageHeading from 'components/PageHeading';
import Alert from 'components/shared/Alert';
import CollapsableLink from 'components/shared/CollapsableLink';
import { ErrorAlert, ErrorAlertMessage } from 'components/shared/ErrorAlert';
import FieldGroup from 'components/shared/FieldGroup';
import Label from 'components/shared/Label';
import TextAreaField from 'components/shared/TextAreaField';
import TruncatedText from 'components/shared/TruncatedText';
import { AnythingWrongSurvey } from 'components/Survey';
import CreateSystemIntakeNoteQuery from 'queries/CreateSystemIntakeNoteQuery';
import GetAdminNotesAndActionsQuery from 'queries/GetAdminNotesAndActionsQuery';
import {
  CreateSystemIntakeNote,
  CreateSystemIntakeNoteVariables
} from 'queries/types/CreateSystemIntakeNote';
import {
  GetAdminNotesAndActions,
  GetAdminNotesAndActionsVariables
} from 'queries/types/GetAdminNotesAndActions';
import { AppState } from 'reducers/rootReducer';
import { formatDate, formatDateAndIgnoreTimezone } from 'utils/date';

import './index.scss';

type NoteForm = {
  note: string;
};

const Notes = () => {
  const { systemId } = useParams<{ systemId: string }>();
  const authState = useSelector((state: AppState) => state.auth);
  const [mutate, mutationResult] = useMutation<
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

  const { error, data } = useQuery<
    GetAdminNotesAndActions,
    GetAdminNotesAndActionsVariables
  >(GetAdminNotesAndActionsQuery, {
    variables: {
      id: systemId
    }
  });
  const { t } = useTranslation('governanceReviewTeam');

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
    mutate({ variables: { input } }).then(response => {
      if (!response.errors) {
        resetForm();
      }
    });
  };

  const initialValues = {
    note: ''
  };

  // New
  const notesByTimestamp =
    data?.systemIntake?.notes.map(note => {
      const { id, createdAt, content, author } = note;
      return {
        createdAt,
        element: (
          <NoteListItem key={id} isLinked data-testid="user-note">
            <NoteContent>{content}</NoteContent>
            <NoteByline>{`by ${author.name} | ${formatDate(
              createdAt
            )} at ${DateTime.fromISO(createdAt).toLocaleString(
              DateTime.TIME_SIMPLE
            )}`}</NoteByline>
          </NoteListItem>
        )
      };
    }) || [];

  const actionsByTimestamp =
    data?.systemIntake?.actions.map(action => {
      const {
        id,
        createdAt,
        type,
        actor,
        feedback,
        lcidExpirationChange
      } = action;
      return {
        createdAt,
        element: (
          <NoteListItem key={id} isLinked data-testid="action-note">
            <NoteContent>{t(`notes.actionName.${type}`)}</NoteContent>
            <NoteByline>{`by: ${actor.name} | ${formatDate(
              createdAt
            )} at ${DateTime.fromISO(createdAt).toLocaleString(
              DateTime.TIME_SIMPLE
            )}`}</NoteByline>
            {lcidExpirationChange && (
              <dl>
                <dt>Lifecycle ID</dt>
                <dd>{data.systemIntake?.lcid}</dd>
                <dt>{t('notes.extendLcid.newExpirationDate')}</dt>
                <dd>
                  {formatDateAndIgnoreTimezone(lcidExpirationChange.newDate)}
                </dd>
                <dt>{t('notes.extendLcid.oldExpirationDate')}</dt>
                <dd>
                  {formatDateAndIgnoreTimezone(
                    lcidExpirationChange.previousDate
                  )}
                </dd>

                {/* Used TruncatedText for old/new scope, next steps, and cost baseline since they can be 3000 characters */}
                <dt>{t('notes.extendLcid.newScope')}</dt>
                <dd>
                  <TruncatedText
                    id="new-lcid-scope"
                    label="less"
                    closeLabel="more"
                    text={lcidExpirationChange.newScope}
                    charLimit={freeFormTextCharLimit}
                    className="margin-top-2"
                  />
                </dd>
                <dt>{t('notes.extendLcid.oldScope')}</dt>
                <dd>
                  <TruncatedText
                    id="previous-lcid-scope"
                    label="less"
                    closeLabel="more"
                    text={lcidExpirationChange.previousScope}
                    charLimit={freeFormTextCharLimit}
                    className="margin-top-2"
                  />
                </dd>
                <dt>{t('notes.extendLcid.newNextSteps')}</dt>
                <dd>
                  <TruncatedText
                    id="new-lcid-next-steps"
                    label="less"
                    closeLabel="more"
                    text={lcidExpirationChange.newNextSteps}
                    charLimit={freeFormTextCharLimit}
                    className="margin-top-2"
                  />
                </dd>
                <dt>{t('notes.extendLcid.oldNextSteps')}</dt>
                <dd>
                  <TruncatedText
                    id="previous-lcid-next-steps"
                    label="less"
                    closeLabel="more"
                    text={lcidExpirationChange.previousNextSteps}
                    charLimit={freeFormTextCharLimit}
                    className="margin-top-2"
                  />
                </dd>
                <dt>{t('notes.extendLcid.newCostBaseline')}</dt>
                {lcidExpirationChange.newCostBaseline ? (
                  <dd>
                    <TruncatedText
                      id="new-lcid-cost-baseline"
                      label="less"
                      closeLabel="more"
                      text={lcidExpirationChange.newCostBaseline}
                      charLimit={freeFormTextCharLimit}
                      className="margin-top-2"
                    />
                  </dd>
                ) : (
                  <dd>{t('notes.extendLcid.noCostBaseline')}</dd>
                )}
                <dt>{t('notes.extendLcid.oldCostBaseline')}</dt>
                {lcidExpirationChange.previousCostBaseline ? (
                  <dd>
                    <TruncatedText
                      id="previous-lcid-cost-baseline"
                      label="less"
                      closeLabel="more"
                      text={lcidExpirationChange.previousCostBaseline}
                      charLimit={freeFormTextCharLimit}
                      className="margin-top-2"
                    />
                  </dd>
                ) : (
                  <dd>{t('notes.extendLcid.noCostBaseline')}</dd>
                )}
              </dl>
            )}
            {feedback && (
              <div className="margin-top-2">
                <CollapsableLink
                  id={`ActionEmailText-${id}`}
                  label={t('notes.showEmail')}
                  closeLabel={t('notes.hideEmail')}
                  styleLeftBar={false}
                >
                  {feedback}
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
  // New

  return (
    <>
      <PageHeading data-testid="grt-notes-view">
        {t('notes.heading')}
      </PageHeading>
      <Formik initialValues={initialValues} onSubmit={onSubmit}>
        {(formikProps: FormikProps<NoteForm>) => {
          const { values, handleSubmit } = formikProps;
          return (
            <div className="tablet:grid-col-9 margin-bottom-7">
              {mutationResult && mutationResult.error && (
                <ErrorAlert heading="Error">
                  <ErrorAlertMessage
                    message={mutationResult.error.message}
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
                  <Label htmlFor="GovernanceReviewTeam-Note">
                    {t('notes.addNote')}
                  </Label>
                  <Field
                    as={TextAreaField}
                    id="GovernanceReviewTeam-Note"
                    maxLength={2000}
                    name="note"
                    className="easi-grt__note-field"
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
              <AnythingWrongSurvey />
            </div>
          );
        }}
      </Formik>
    </>
  );
};

export default Notes;
