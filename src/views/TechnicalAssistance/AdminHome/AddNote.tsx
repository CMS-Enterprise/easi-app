import React, { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Trans, useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import {
  Alert,
  Button,
  CharacterCount,
  Dropdown,
  ErrorMessage,
  Form,
  FormGroup,
  Grid,
  IconArrowBack,
  Label
} from '@trussworks/react-uswds';
import classNames from 'classnames';

import UswdsReactLink from 'components/LinkWrapper';
import PageHeading from 'components/PageHeading';
import { ErrorAlertMessage } from 'components/shared/ErrorAlert';
import useMessage from 'hooks/useMessage';
import CreateTrbAdminNote from 'queries/CreateTrbAdminNote';
import {
  CreateTrbAdminNote as CreateTrbAdminNoteType,
  CreateTrbAdminNoteVariables
} from 'queries/types/CreateTrbAdminNote';
import { TRBAdminNoteCategory } from 'types/graphql-global-types';

import Breadcrumbs from '../Breadcrumbs';

import { ModalViewType } from './components/NoteModal';

const AddNote = ({
  trbRequestId,
  setModalView,
  setModalMessage
}: {
  trbRequestId?: string;
  setModalView?: React.Dispatch<React.SetStateAction<ModalViewType>>;
  setModalMessage?: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const { t } = useTranslation('technicalAssistance');

  const { id, activePage } = useParams<{
    id: string;
    activePage: string;
  }>();

  const history = useHistory();

  const { message, showMessage, showMessageOnNextPage } = useMessage();

  const requestUrl = `/trb/${id}/${activePage}`;

  const [mutate] = useMutation<
    CreateTrbAdminNoteType,
    CreateTrbAdminNoteVariables
  >(CreateTrbAdminNote);

  const {
    control,
    handleSubmit,
    formState: { errors, isDirty, isSubmitting }
  } = useForm({
    defaultValues: {
      category: '' as TRBAdminNoteCategory,
      noteText: ''
    }
  });

  const hasErrors = Object.keys(errors).length > 0;

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
              text: t('adminHome.breadcrumb', { trbRequestId: id }),
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
                trbRequestId: trbRequestId || id,
                category: formData.category,
                noteText: formData.noteText
              }
            }
          })
            .then(result => {
              if (!setModalView) {
                showMessageOnNextPage(
                  <Alert type="success" slim className="margin-top-3">
                    {t('notes.status.success')}
                  </Alert>
                );
                history.push(requestUrl);
              } else if (setModalView && setModalMessage) {
                setModalView('viewNotes');
                setModalMessage(t('notes.status.success'));
              }
            })
            .catch(err => {
              showMessage(
                <Alert type="error" slim className="margin-top-3">
                  {t('notes.status.error')}
                </Alert>
              );
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
                i18nKey="technicalAssistance:actionRequestEdits.fieldsMarkedRequired"
                components={{ red: <span className="text-red" /> }}
              />
            </div>

            {message}

            {hasErrors && (
              <Alert
                heading={t('errors.checkFix')}
                type="error"
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
                  <Label
                    htmlFor="category"
                    className="text-normal"
                    error={!!error}
                  >
                    {t('notes.labels.category')}{' '}
                    <span className="text-red">*</span>
                  </Label>
                  {error && (
                    <ErrorMessage>{t('errors.fillBlank')}</ErrorMessage>
                  )}
                  <Dropdown
                    id="category"
                    data-testid="note-category"
                    {...field}
                    ref={null}
                  >
                    <option>- {t('basic.options.select')} -</option>
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

            {/* Note Text */}
            <Controller
              name="noteText"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <FormGroup>
                  <Label htmlFor="notes" className="text-normal">
                    {t('notes.labels.noteText')}
                  </Label>
                  <CharacterCount
                    {...field}
                    ref={null}
                    id="noteText"
                    maxLength={2000}
                    isTextArea
                    rows={2}
                    error={!!error}
                  />
                </FormGroup>
              )}
            />
          </Grid>
        </Grid>

        <div className="margin-top-3">
          <Button type="submit" disabled={!isDirty || isSubmitting}>
            {t('notes.save')}
          </Button>
        </div>
      </Form>

      <div className="margin-top-2">
        {setModalView ? (
          <Button
            type="button"
            className="usa-button--unstyled"
            onClick={() => {
              setModalView('viewNotes');
            }}
          >
            <IconArrowBack className="margin-right-05 margin-bottom-2px text-tbottom" />
            {t('actionRequestEdits.cancelAndReturn')}
          </Button>
        ) : (
          <UswdsReactLink to={requestUrl}>
            <IconArrowBack className="margin-right-05 margin-bottom-2px text-tbottom" />
            {t('actionRequestEdits.cancelAndReturn')}
          </UswdsReactLink>
        )}
      </div>
    </div>
  );
};

export default AddNote;
