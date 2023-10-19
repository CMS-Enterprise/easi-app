import React, { useContext, useEffect, useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Trans, useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import {
  Button,
  Dropdown,
  ErrorMessage,
  Form,
  FormGroup,
  Grid,
  IconArrowBack
} from '@trussworks/react-uswds';
import classNames from 'classnames';

import UswdsReactLink from 'components/LinkWrapper';
import PageHeading from 'components/PageHeading';
import Alert from 'components/shared/Alert';
import CheckboxField from 'components/shared/CheckboxField';
import { ErrorAlertMessage } from 'components/shared/ErrorAlert';
import FieldGroup from 'components/shared/FieldGroup';
import HelpText from 'components/shared/HelpText';
import Label from 'components/shared/Label';
import MultiSelect from 'components/shared/MultiSelect';
import RequiredAsterisk from 'components/shared/RequiredAsterisk';
import TextAreaField from 'components/shared/TextAreaField';
import Spinner from 'components/Spinner';
import useCacheQuery from 'hooks/useCacheQuery';
import useMessage from 'hooks/useMessage';
import CreateTrbAdminNote from 'queries/CreateTrbAdminNote';
import { TRBAdminNoteFragment } from 'queries/GetTrbAdminNotesQuery';
import GetTrbRequestDocumentsQuery from 'queries/GetTrbRequestDocumentsQuery';
import {
  CreateTrbAdminNote as CreateTrbAdminNoteType,
  CreateTrbAdminNoteVariables
} from 'queries/types/CreateTrbAdminNote';
import {
  GetTrbRequestDocuments,
  GetTrbRequestDocumentsVariables
} from 'queries/types/GetTrbRequestDocuments';
import { TRBAdminNoteCategory } from 'types/graphql-global-types';

import Breadcrumbs from '../Breadcrumbs';

import { ModalViewType } from './components/NoteModal';
import { TRBRequestContext } from './RequestContext';

type AddNoteCommonFields<T extends TRBAdminNoteCategory> = {
  category: T;
  noteText: string;
};

type AddNoteInitialRequestFormFields = {
  appliesToBasicRequestDetails: boolean;
  appliesToSubjectAreas: boolean;
  appliesToAttendees: boolean;
} & AddNoteCommonFields<TRBAdminNoteCategory.INITIAL_REQUEST_FORM>;

type AddNoteAdviceLetterFields = {
  section: 'appliesToMeetingSummary' | 'appliesToNextSteps' | string;
  recommendationIDs: string[];
} & AddNoteCommonFields<TRBAdminNoteCategory.ADVICE_LETTER>;

type AddNoteSupportingDocumentsFields = {
  documentIDs: string[];
} & AddNoteCommonFields<TRBAdminNoteCategory.SUPPORTING_DOCUMENTS>;

type AddNoteFields =
  | AddNoteInitialRequestFormFields
  | AddNoteAdviceLetterFields
  | AddNoteSupportingDocumentsFields
  | AddNoteCommonFields<TRBAdminNoteCategory.GENERAL_REQUEST>
  | AddNoteCommonFields<TRBAdminNoteCategory.CONSULT_SESSION>;

const AddNote = ({
  trbRequestId,
  setModalView, // prop used to conditionall render text/links/etc specifically for modal
  setModalMessage,
  defaultSelect
}: {
  trbRequestId?: string;
  setModalView?: React.Dispatch<React.SetStateAction<ModalViewType>>;
  setModalMessage?: React.Dispatch<React.SetStateAction<string>>;
  defaultSelect?: TRBAdminNoteCategory;
}) => {
  const { t } = useTranslation('technicalAssistance');

  /** Used to get request ID if `trbRequestId` is undefined */
  const { id } = useParams<{
    id: string;
  }>();

  const documentsQuery = useCacheQuery<
    GetTrbRequestDocuments,
    GetTrbRequestDocumentsVariables
  >(GetTrbRequestDocumentsQuery, {
    variables: { id: trbRequestId || id }
  });

  const documents = useMemo(() => documentsQuery.data?.trbRequest.documents, [
    documentsQuery.data
  ]);

  const history = useHistory();

  // TRB request information to render name in breadcrumbs
  const { data } = useContext(TRBRequestContext);

  const { Message, showMessage, showMessageOnNextPage } = useMessage();

  const requestUrl: string = `/trb/${id}/notes`;

  const [mutate] = useMutation<
    CreateTrbAdminNoteType,
    CreateTrbAdminNoteVariables
  >(CreateTrbAdminNote, {
    update(cache, { data: modifiedData }) {
      cache.modify({
        id: cache.identify({ __typename: 'TRBRequest', id }),
        fields: {
          adminNotes(existingNotes = []) {
            const newNote = cache.writeFragment({
              data: modifiedData?.createTRBAdminNote,
              fragment: TRBAdminNoteFragment
            });
            return [...existingNotes, newNote];
          }
        }
      });
    }
  });

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting }
  } = useForm<AddNoteFields>({
    defaultValues: {
      category: defaultSelect || ('' as TRBAdminNoteCategory),
      noteText: ''
    }
  });

  const category = watch('category');

  const hasErrors: boolean = Object.keys(errors).length > 0;

  useEffect(() => {
    if (hasErrors) {
      const err = document.querySelector('.trb-basic-fields-error');
      err?.scrollIntoView();
    }
  }, [errors, hasErrors]);

  return (
    <div
      className={classNames({
        'grid-container': !setModalView
      })}
    >
      {!setModalView && (
        <Breadcrumbs
          items={[
            { text: t('Home'), url: `/trb` },
            {
              text: t('adminHome.breadcrumb', {
                trbRequestId: data?.trbRequest.name || ''
              }),
              url: requestUrl
            },
            {
              text: t('notes.addNote')
            }
          ]}
        />
      )}

      <Form
        onSubmit={handleSubmit(formData => {
          mutate({
            variables: {
              input: {
                trbRequestId: trbRequestId || id, // Get id from prop(modal) or url param
                category: formData.category,
                noteText: formData.noteText
              }
            }
          })
            .then(result => {
              if (!setModalView) {
                showMessageOnNextPage(t('notes.status.success'), {
                  type: 'success',
                  className: 'margin-top-3'
                });
                history.push(requestUrl);
              } else if (setModalView && setModalMessage) {
                setModalView('viewNotes');
                setModalMessage(t('notes.status.success'));
              }
            })
            .catch(err => {
              showMessage(t('notes.status.error'), {
                type: 'error',
                className: 'margin-top-3'
              });
            });
        })}
        className={classNames('maxw-full', {
          'desktop:grid-col-6': !setModalView
        })}
      >
        <Grid row>
          <Grid col>
            <PageHeading
              className={classNames('margin-bottom-0', {
                'margin-top-0': setModalView
              })}
            >
              {t('notes.addNote')}
            </PageHeading>
            <div className="line-height-body-5 font-body-lg text-light">
              {t('notes.addNoteDescription')}
            </div>
            <div className="margin-top-1 margin-bottom-2 text-base">
              <Trans
                i18nKey="action:fieldsMarkedRequired"
                components={{ asterisk: <RequiredAsterisk /> }}
              />
            </div>

            {!setModalView && <Message />}

            {hasErrors && (
              <Alert
                heading={t('errors.checkFix')}
                type="error"
                slim={false}
                className="trb-basic-fields-error"
              >
                {Object.keys(errors).map(fieldName => {
                  const msg: string = t(`notes.labels.${fieldName}`);
                  return (
                    <ErrorAlertMessage
                      key={fieldName}
                      errorKey={fieldName}
                      message={msg}
                    />
                  );
                })}
              </Alert>
            )}
          </Grid>
        </Grid>

        <Grid row gap>
          <Grid desktop={{ col: 12 }}>
            {/* Category */}

            <Controller
              name="category"
              control={control}
              rules={{ required: true }}
              render={({ field, fieldState: { error } }) => (
                <FormGroup error={!!error}>
                  <Label htmlFor="category" className="text-normal" required>
                    {t('notes.labels.category')}
                  </Label>

                  <HelpText className="margin-top-1">
                    {t('notes.labels.categoryHelpText')}
                  </HelpText>

                  {error && (
                    <ErrorMessage>{t('errors.fillBlank')}</ErrorMessage>
                  )}

                  <Dropdown
                    id="category"
                    data-testid="note-category"
                    {...field}
                    ref={null}
                  >
                    <option key="default-select" disabled value="">
                      - {t('basic.options.select')} -
                    </option>

                    {[
                      TRBAdminNoteCategory.GENERAL_REQUEST,
                      TRBAdminNoteCategory.INITIAL_REQUEST_FORM,
                      TRBAdminNoteCategory.SUPPORTING_DOCUMENTS,
                      TRBAdminNoteCategory.CONSULT_SESSION,
                      TRBAdminNoteCategory.ADVICE_LETTER
                    ].map(key => (
                      <option key={key} value={key}>
                        {t(`notes.categories.${key}`)}
                      </option>
                    ))}
                  </Dropdown>
                </FormGroup>
              )}
            />

            {category === TRBAdminNoteCategory.INITIAL_REQUEST_FORM && (
              <FormGroup>
                <Label
                  htmlFor="initialRequestFormSection"
                  className="text-normal"
                >
                  {t('notes.labels.section')}
                </Label>

                <HelpText className="margin-top-1">
                  {t('notes.labels.sectionHelpText')}
                </HelpText>

                <FieldGroup
                  id="initialRequestFormSection"
                  className="margin-top-1"
                >
                  <Controller
                    control={control}
                    name="appliesToBasicRequestDetails"
                    render={({ field: { ref, ...field } }) => (
                      <CheckboxField
                        {...field}
                        id={field.name}
                        value={field.name}
                        label={t(`notes.labels.${field.name}`)}
                      />
                    )}
                  />

                  <Controller
                    control={control}
                    name="appliesToSubjectAreas"
                    render={({ field: { ref, ...field } }) => (
                      <CheckboxField
                        {...field}
                        id={field.name}
                        value={field.name}
                        label={t(`notes.labels.${field.name}`)}
                      />
                    )}
                  />

                  <Controller
                    control={control}
                    name="appliesToAttendees"
                    render={({ field: { ref, ...field } }) => (
                      <CheckboxField
                        {...field}
                        id={field.name}
                        value={field.name}
                        label={t(`notes.labels.${field.name}`)}
                      />
                    )}
                  />
                </FieldGroup>
              </FormGroup>
            )}

            {category === TRBAdminNoteCategory.SUPPORTING_DOCUMENTS && (
              // TODO: State for no available documents
              <Controller
                control={control}
                name="documentIDs"
                render={({ field: { ref, ...field } }) => (
                  <FormGroup>
                    <Label htmlFor={field.name} className="text-normal">
                      {t('notes.labels.whichDocument')}
                    </Label>

                    <HelpText className="margin-y-1">
                      {t('notes.labels.selectHelpText')}
                    </HelpText>

                    {documentsQuery.loading ? (
                      <Spinner />
                    ) : (
                      <MultiSelect
                        {...field}
                        id={field.name}
                        selectedLabel={t('notes.labels.selectedDocuments')}
                        options={(documents || []).map(doc => ({
                          label: doc.fileName,
                          value: doc.id
                        }))}
                      />
                    )}
                  </FormGroup>
                )}
              />
            )}

            {category === TRBAdminNoteCategory.ADVICE_LETTER && (
              <Controller
                control={control}
                name="section"
                render={({ field: { ref, ...field } }) => (
                  <FormGroup>
                    <Label htmlFor={field.name} className="text-normal">
                      {t('notes.labels.section')}
                    </Label>

                    <HelpText className="margin-y-1">
                      {t('notes.labels.selectHelpText')}
                    </HelpText>
                    <MultiSelect
                      {...field}
                      id={field.name}
                      selectedLabel={t('notes.labels.selectedSections')}
                      options={[
                        {
                          label: t('notes.labels.meetingSummary'),
                          value: 'appliesToMeetingSummary'
                        },
                        {
                          label: t('notes.labels.nextSteps'),
                          value: 'appliesToNextSteps'
                        },
                        // TODO: Populate recommendation options with actual values
                        {
                          label: t('notes.labels.recommendation', {
                            title: 'AWS migration'
                          }),
                          value: '3c0edb5c-f464-40f8-995e-e03ffb1b2bd7'
                        },
                        {
                          label: t('notes.labels.recommendation', {
                            title: 'DevOps tooling'
                          }),
                          value: '6ce35520-6358-4b53-b253-0ea8ab5fc966'
                        }
                      ]}
                    />
                  </FormGroup>
                )}
              />
            )}

            {/* Note Text */}
            <Controller
              name="noteText"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <FormGroup>
                  <Label htmlFor="noteText" className="text-normal" required>
                    {t('notes.labels.noteText')}
                  </Label>

                  <TextAreaField
                    {...field}
                    ref={null}
                    id={field.name}
                    error={!!error}
                  />
                </FormGroup>
              )}
            />
          </Grid>
        </Grid>

        <div className="margin-top-3">
          {setModalView && (
            <Button
              type="button"
              className="usa-button--outline"
              onClick={() => {
                setModalView('viewNotes');
              }}
            >
              {t('notes.cancel')}
            </Button>
          )}
          <Button
            type="submit"
            name={t('notes.saveNote')}
            disabled={isSubmitting || !watch('category') || !watch('noteText')}
          >
            {t('notes.saveNote')}
          </Button>
        </div>
      </Form>

      {!setModalView && (
        <div className="margin-top-2">
          <UswdsReactLink to={requestUrl}>
            <IconArrowBack className="margin-right-05 margin-bottom-2px text-tbottom" />
            {t('actionRequestEdits.cancelAndReturn')}
          </UswdsReactLink>
        </div>
      )}
    </div>
  );
};

export default AddNote;
