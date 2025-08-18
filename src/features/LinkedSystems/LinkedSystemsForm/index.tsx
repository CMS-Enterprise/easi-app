import React, { useEffect, useMemo } from 'react';
import { Controller, FieldPath, FormProvider } from 'react-hook-form';
import { Trans, useTranslation } from 'react-i18next';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import { ErrorMessage } from '@hookform/error-message';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Button,
  Checkbox,
  Fieldset,
  Form,
  FormGroup,
  Grid,
  Icon,
  Label,
  Link,
  Select,
  TextInput
} from '@trussworks/react-uswds';
import {
  SystemRelationshipType,
  UpdateSystemLinkMutationFn,
  useAddSystemLinkMutation,
  useGetCedarSystemsQuery,
  useGetSystemIntakeSystemQuery,
  useGetSystemIntakeSystemsQuery,
  useUpdateSystemLinkMutation
} from 'gql/generated/graphql';

import Alert from 'components/Alert';
import CheckboxField from 'components/CheckboxField';
import { useEasiForm } from 'components/EasiForm';
import { ErrorAlert, ErrorAlertMessage } from 'components/ErrorAlert';
import IconButton from 'components/IconButton';
import MainContent from 'components/MainContent';
import PageHeading from 'components/PageHeading';
import PageLoading from 'components/PageLoading';
import RequiredAsterisk from 'components/RequiredAsterisk';
import RequiredFieldsText from 'components/RequiredFieldsText';
import useMessage from 'hooks/useMessage';
import flattenFormErrors from 'utils/flattenFormErrors';
import { linkedSystemsSchema } from 'validations/systemIntakeSchema';

type LinkedSystemsFormFields = {
  cedarSystemID: string;
  relationshipTypes: {
    primarySupport: boolean;
    partialSupport: boolean;
    usesOrImpactedBySelectedSystem: boolean;
    impactsSelectedSystem: boolean;
    other: boolean;
  };
  otherDescription?: string;
};

const buildCedarSystemRelationshipObjects = (
  payload: LinkedSystemsFormFields
) => {
  const selectedSystemRelationshipTypes: Array<SystemRelationshipType> = [];

  if (payload.relationshipTypes.primarySupport) {
    selectedSystemRelationshipTypes.push(
      SystemRelationshipType.PRIMARY_SUPPORT
    );
  }
  if (payload.relationshipTypes.partialSupport) {
    selectedSystemRelationshipTypes.push(
      SystemRelationshipType.PARTIAL_SUPPORT
    );
  }
  if (payload.relationshipTypes.usesOrImpactedBySelectedSystem) {
    selectedSystemRelationshipTypes.push(
      SystemRelationshipType.USES_OR_IMPACTED_BY_SELECTED_SYSTEM
    );
  }
  if (payload.relationshipTypes.impactsSelectedSystem) {
    selectedSystemRelationshipTypes.push(
      SystemRelationshipType.IMPACTS_SELECTED_SYSTEM
    );
  }
  if (payload.relationshipTypes.other) {
    selectedSystemRelationshipTypes.push(SystemRelationshipType.OTHER);
  }

  return selectedSystemRelationshipTypes;
};

const buildInputPayload = (
  payload: LinkedSystemsFormFields,
  systemIntakeID: string
) => ({
  systemID: payload.cedarSystemID,
  systemIntakeID,
  systemRelationshipType: buildCedarSystemRelationshipObjects(payload),
  otherSystemRelationshipDescription: payload.otherDescription
});

const updateLink = async (
  payload: LinkedSystemsFormFields,
  linkedSystemID: string,
  systemIntakeID: string,
  updateSystemLink: UpdateSystemLinkMutationFn
) => {
  const updateInput = {
    input: {
      id: linkedSystemID,
      ...buildInputPayload(payload, systemIntakeID)
    }
  };
  return updateSystemLink({ variables: updateInput });
};

const addLink = async (
  payload: LinkedSystemsFormFields,
  systemIntakeID: string,
  addSystemLink: ReturnType<typeof useAddSystemLinkMutation>[0]
) => {
  const addInput = {
    input: buildInputPayload(payload, systemIntakeID)
  };
  return addSystemLink({ variables: addInput });
};

const LinkedSystemsForm = () => {
  const { systemIntakeID, linkedSystemID } = useParams<{
    systemIntakeID: string;
    linkedSystemID?: string;
  }>();

  const history = useHistory();
  const location = useLocation<{ from?: string }>();
  const isFromTaskList = location.state?.from === 'task-list';
  const isFromAdmin = location.state?.from === 'admin';

  const { showMessageOnNextPage, showMessage, Message } = useMessage();

  const form = useEasiForm<LinkedSystemsFormFields>({
    resolver: yupResolver(linkedSystemsSchema),
    mode: 'onChange'
  });

  const {
    control,
    handleSubmit,
    watch,
    register,
    setFocus,
    setValue,
    formState: { isDirty, errors, isValid }
  } = form;

  const { t } = useTranslation([
    'linkedSystems',
    'itGov',
    'technicalAssistance',
    'error'
  ]);

  const [addSystemLink] = useAddSystemLinkMutation();

  const [updateSystemLink] = useUpdateSystemLinkMutation();

  const {
    data: systemIntakeAndCedarSystems,
    error: relationError,
    loading: relationLoading
  } = useGetCedarSystemsQuery();

  const cedarSystemIdOptions = useMemo(() => {
    const cedarSystemsData = systemIntakeAndCedarSystems?.cedarSystems;
    return !cedarSystemsData
      ? []
      : cedarSystemsData.map(system => ({
          label: `${system.name} (${system.acronym})`,
          value: system.id
        }));
  }, [systemIntakeAndCedarSystems?.cedarSystems]);

  const { data: linkedSystem } = useGetSystemIntakeSystemQuery({
    variables: { systemIntakeSystemID: linkedSystemID || '' },
    skip: !linkedSystemID
  });

  const { data: systemsData } = useGetSystemIntakeSystemsQuery({
    variables: { systemIntakeId: systemIntakeID },
    skip: !systemIntakeID
  });

  const filteredCedarSystemIdOptions = useMemo<
    { label: string; value: string }[]
  >(() => {
    const idsToRemove = new Set(
      (systemsData?.systemIntakeSystems ?? [])
        .map(item => item.systemID)
        .filter((id): id is string => Boolean(id))
    );

    return cedarSystemIdOptions.filter(item => !idsToRemove.has(item.value));
  }, [systemsData?.systemIntakeSystems, cedarSystemIdOptions]);

  useEffect(() => {
    if (linkedSystem?.systemIntakeSystem) {
      const data = linkedSystem.systemIntakeSystem;
      setValue('cedarSystemID', data.systemID || '');
      setValue(
        'otherDescription',
        data.systemRelationshipType.includes(SystemRelationshipType.OTHER)
          ? (data.otherSystemRelationshipDescription ?? '')
          : undefined
      );
      setValue('relationshipTypes', {
        primarySupport: data.systemRelationshipType.includes(
          SystemRelationshipType.PRIMARY_SUPPORT
        ),
        partialSupport: data.systemRelationshipType.includes(
          SystemRelationshipType.PARTIAL_SUPPORT
        ),
        usesOrImpactedBySelectedSystem: data.systemRelationshipType.includes(
          SystemRelationshipType.USES_OR_IMPACTED_BY_SELECTED_SYSTEM
        ),
        impactsSelectedSystem: data.systemRelationshipType.includes(
          SystemRelationshipType.IMPACTS_SELECTED_SYSTEM
        ),
        other: data.systemRelationshipType.includes(
          SystemRelationshipType.OTHER
        )
      });
    }
  }, [linkedSystem, setValue]);

  const fieldErrors = flattenFormErrors<LinkedSystemsFormFields>(errors);

  const submit = handleSubmit((payload: LinkedSystemsFormFields) => {
    if (!isDirty) return;

    // For the success banner copy after redirect
    const systemName = cedarSystemIdOptions.find(
      option => option.value === payload.cedarSystemID
    )?.label;

    const mutation = linkedSystemID
      ? updateLink(payload, linkedSystemID, systemIntakeID, updateSystemLink)
      : addLink(payload, systemIntakeID, addSystemLink);

    mutation
      .then(() => {
        showMessageOnNextPage(
          <Trans
            i18nKey={
              linkedSystemID
                ? 'linkedSystems:savedChangesToALink'
                : 'linkedSystems:successfullyLinked'
            }
            values={{ updatedSystem: systemName }}
            components={{
              span: <span className="text-bold" />
            }}
          />,
          {
            type: 'success'
          }
        );
        const nextState: {
          from?: string;
          successfullyAdded?: boolean;
          successfullyUpdated?: boolean;
          systemUpdated?: string;
        } = {};

        if (isFromTaskList) nextState.from = 'task-list';
        if (isFromAdmin) nextState.from = 'admin';

        // If we were editing an existing link, mark "updated"; otherwise "added"
        if (linkedSystemID) {
          nextState.successfullyUpdated = true;
        } else {
          nextState.successfullyAdded = true;
        }

        if (systemName) nextState.systemUpdated = systemName;

        history.push(`/linked-systems/${systemIntakeID}`, nextState);
      })
      .catch(() => {
        showMessage(t('linkedSystems:errorLinking'), {
          type: 'error',
          className: 'margin-top-2'
        });
      });
  });

  const systemOptions = linkedSystemID
    ? cedarSystemIdOptions
    : filteredCedarSystemIdOptions;

  if (relationLoading) {
    <PageLoading />;
  }

  return (
    <MainContent className="grid-container margin-bottom-15">
      <>
        <Message />
        <PageHeading className="margin-top-4 margin-bottom-0">
          {linkedSystemID ? t('editFormHeader') : t('addFormHeader')}
        </PageHeading>
        <p className="font-body-lg line-height-body-5 text-light margin-y-0">
          {linkedSystemID ? t('editFormSubheader') : t('addFormSubheader')}
        </p>

        <RequiredFieldsText className="margin-top-2 margin-bottom-5" />

        <IconButton
          icon={<Icon.ArrowBack className="margin-right-05" aria-hidden />}
          type="button"
          unstyled
          onClick={() => {
            history.goBack();
          }}
        >
          {linkedSystemID ? t('dontEditAndReturn') : t('dontAddAndReturn')}
        </IconButton>

        {Object.keys(errors).length > 0 && (
          <ErrorAlert
            testId="contact-details-errors"
            classNames="margin-top-3"
            heading={t('form:inputError.checkFix')}
            autoFocus={false}
          >
            {Object.keys(fieldErrors).map(key => {
              return (
                <ErrorMessage
                  errors={errors}
                  name={key}
                  key={key}
                  render={({ message }) => (
                    <ErrorAlertMessage
                      message={message}
                      onClick={() =>
                        setFocus(key as FieldPath<LinkedSystemsFormFields>)
                      }
                    />
                  )}
                />
              );
            })}
          </ErrorAlert>
        )}
        <ErrorMessage errors={errors} name="root" as={<Alert type="error" />} />
        {relationError && (
          <Alert type="warning" className="margin-top-5">
            <Trans
              i18nKey="linkedSystems:unableToRetrieveCedarSystems"
              components={{
                link1: <Link href="EnterpriseArchitecture@cms.hhs.gov"> </Link>
              }}
            />
          </Alert>
        )}
        <FormProvider<LinkedSystemsFormFields> {...form}>
          <Form
            className="easi-form maxw-full"
            onSubmit={handleSubmit(() => submit())}
          >
            <Grid row>
              <Grid tablet={{ col: 12 }} desktop={{ col: 9 }}>
                <Fieldset disabled={relationLoading}>
                  <>
                    <Controller
                      name="cedarSystemID"
                      control={control}
                      defaultValue=""
                      render={({ field }) => (
                        <FormGroup>
                          <Label
                            htmlFor="cedarSystemID"
                            hint={t('cmsSystemsDropdown.hint')}
                            className="text-normal"
                          >
                            {t('cmsSystemsDropdown.title')} <RequiredAsterisk />
                          </Label>
                          <Select
                            id="cedarSystemID"
                            data-testid="cedarSystemID"
                            {...field}
                            ref={null}
                            value={field.value || ''}
                            disabled={!!linkedSystemID}
                          >
                            <option
                              label={`- ${t('technicalAssistance:basic.options.select')} -`}
                              disabled
                            />
                            {systemOptions.map(system => (
                              <option
                                key={system.value}
                                value={system.value}
                                label={system.label}
                              />
                            ))}
                          </Select>
                        </FormGroup>
                      )}
                    />
                    <Label
                      htmlFor="cedarSystemID"
                      hint={t('relationship.hint')}
                      className="text-normal"
                    >
                      {t('relationship.title')} <RequiredAsterisk />
                    </Label>
                  </>

                  <Controller
                    control={control}
                    name="relationshipTypes.primarySupport"
                    render={({ field: { ref, ...field } }) => (
                      <Checkbox
                        id="primarySupport"
                        name="primarySupport"
                        label={t('relationshipTypes.PRIMARY_SUPPORT')}
                        labelDescription={t(
                          'relationshipTypes.primarySupportHint'
                        )}
                        value={SystemRelationshipType.PRIMARY_SUPPORT}
                        checked={field.value ?? false}
                        onChange={e => field.onChange(e.target.checked)}
                        onBlur={() => null}
                      />
                    )}
                  />

                  <Controller
                    control={control}
                    name="relationshipTypes.partialSupport"
                    render={({ field: { ref, ...field } }) => (
                      <CheckboxField
                        label={t('relationshipTypes.PARTIAL_SUPPORT')}
                        id="partialSupport"
                        name="partialSupport"
                        value={SystemRelationshipType.PARTIAL_SUPPORT}
                        checked={field.value ?? false}
                        onChange={e => field.onChange(e.target.checked)}
                        onBlur={() => null}
                      />
                    )}
                  />

                  <Controller
                    control={control}
                    name="relationshipTypes.usesOrImpactedBySelectedSystem"
                    render={({ field: { ref, ...field } }) => (
                      <CheckboxField
                        label={t(
                          'relationshipTypes.USES_OR_IMPACTED_BY_SELECTED_SYSTEM'
                        )}
                        id="usesOrImpactedBySelectedSystem"
                        name="usesOrImpactedBySelectedSystem"
                        value={
                          SystemRelationshipType.USES_OR_IMPACTED_BY_SELECTED_SYSTEM
                        }
                        checked={field.value ?? false}
                        onChange={e => field.onChange(e.target.checked)}
                        onBlur={() => null}
                      />
                    )}
                  />

                  <Controller
                    control={control}
                    name="relationshipTypes.impactsSelectedSystem"
                    render={({ field: { ref, ...field } }) => (
                      <CheckboxField
                        label={t('relationshipTypes.IMPACTS_SELECTED_SYSTEM')}
                        id="impactsSelectedSystem"
                        name="impactsSelectedSystem"
                        value={SystemRelationshipType.IMPACTS_SELECTED_SYSTEM}
                        checked={field.value ?? false}
                        onChange={e => field.onChange(e.target.checked)}
                        onBlur={() => null}
                      />
                    )}
                  />
                  <Controller
                    name="relationshipTypes.other"
                    control={control}
                    defaultValue={false}
                    render={({ field }) => (
                      <CheckboxField
                        label={t('relationshipTypes.OTHER')}
                        id="other"
                        name="other"
                        value={SystemRelationshipType.OTHER}
                        checked={field.value}
                        onChange={e => field.onChange(e.target.checked)}
                        onBlur={field.onBlur}
                      />
                    )}
                  />

                  {watch('relationshipTypes.other') && (
                    <FormGroup
                      className="margin-top-1 margin-left-4"
                      error={!!errors.otherDescription}
                    >
                      <Label htmlFor="otherDescription" className="text-normal">
                        {t('relationshipTypes.pleaseExplain')}
                      </Label>
                      <ErrorMessage
                        errors={errors}
                        name="otherDescription"
                        message={t('technicalAssistance:errors.fillBlank')}
                      />
                      <TextInput
                        {...register('otherDescription', {
                          shouldUnregister: true
                        })}
                        id="otherDescription"
                        type="text"
                      />
                    </FormGroup>
                  )}
                </Fieldset>
              </Grid>
            </Grid>

            <Button type="submit" disabled={!isValid || !isDirty}>
              {linkedSystemID ? (
                <Trans i18nKey="itGov:link.form.saveChanges" />
              ) : (
                t('addSystem')
              )}
            </Button>

            <IconButton
              icon={<Icon.ArrowBack className="margin-right-05" aria-hidden />}
              type="button"
              unstyled
              onClick={() => {
                history.goBack();
              }}
            >
              {linkedSystemID ? t('dontEditAndReturn') : t('dontAddAndReturn')}
            </IconButton>
          </Form>
        </FormProvider>
      </>
    </MainContent>
  );
};

export default LinkedSystemsForm;
