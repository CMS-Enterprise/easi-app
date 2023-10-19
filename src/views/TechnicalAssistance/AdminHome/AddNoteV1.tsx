import React, { useContext, useEffect } from 'react';
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
  IconArrowBack,
  Label
} from '@trussworks/react-uswds';
import classNames from 'classnames';

import UswdsReactLink from 'components/LinkWrapper';
import PageHeading from 'components/PageHeading';
import Alert from 'components/shared/Alert';
import { ErrorAlertMessage } from 'components/shared/ErrorAlert';
import RequiredAsterisk from 'components/shared/RequiredAsterisk';
import TextAreaField from 'components/shared/TextAreaField';
import useMessage from 'hooks/useMessage';
import CreateTrbAdminNote from 'queries/CreateTrbAdminNote';
import { TRBAdminNoteFragment } from 'queries/GetTrbAdminNotesQuery';
import {
  CreateTrbAdminNote as CreateTrbAdminNoteType,
  CreateTrbAdminNoteVariables
} from 'queries/types/CreateTrbAdminNote';
import {
  CreateTRBAdminNoteInput,
  TRBAdminNoteCategory
} from 'types/graphql-global-types';

import Breadcrumbs from '../Breadcrumbs';

import { ModalViewType } from './components/NoteModal';
import { TRBRequestContext } from './RequestContext';

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

  const { id } = useParams<{
    id: string;
  }>();

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

  const defaultValues: Omit<CreateTRBAdminNoteInput, 'trbRequestId'> = {
    category: defaultSelect || ('' as TRBAdminNoteCategory),
    noteText: ''
  };

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting }
  } = useForm({
    defaultValues
  });

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

            {/* Note Text */}
            <Controller
              name="noteText"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <FormGroup>
                  <Label htmlFor="noteText" className="text-normal">
                    {t('notes.labels.noteText')}
                    <span className="text-red">*</span>
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
