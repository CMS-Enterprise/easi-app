import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Controller, FieldPath, FormProvider } from 'react-hook-form';
import { Trans, useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';
import { ErrorMessage } from '@hookform/error-message';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Button,
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
  useAddSystemLinkMutation,
  useGetCedarSystemsQuery,
  useGetSystemIntakeSystemQuery,
  useUpdateSystemLinkMutation
} from 'gql/generated/graphql';

import Alert from 'components/Alert';
import CheckboxField from 'components/CheckboxField';
import { useEasiForm } from 'components/EasiForm';
import { ErrorAlert, ErrorAlertMessage } from 'components/ErrorAlert';
import IconButton from 'components/IconButton';
import MainContent from 'components/MainContent';
import PageHeading from 'components/PageHeading';
import RequiredAsterisk from 'components/RequiredAsterisk';
import Spinner from 'components/Spinner';
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

const hasErrors = false; // todo fix this

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
  updateSystemLink: any
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
  addSystemLink: any
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

  // const { register, setValue, watch } = useForm<LinkedSystemFormFields>();
  const form = useEasiForm<LinkedSystemsFormFields>({
    resolver: yupResolver(linkedSystemsSchema)
  });

  const {
    control,
    handleSubmit,
    watch,
    register,
    setFocus,
    setValue,
    formState: { isDirty, errors }
  } = form;

  const { t } = useTranslation([
    'linkedSystems',
    'itGov',
    'technicalAssistance',
    'error'
  ]);

  const [addSystemLink, { error: addSystemLinkError }] =
    useAddSystemLinkMutation();

  const [updateSystemLink, { error: updateSystemLinkError }] =
    useUpdateSystemLinkMutation();

  const [cedarSystemSelectedError, setCedarSystemSelectedError] =
    useState<boolean>(false);

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

  const {
    data: linkedSystem,
    error: linkedSystemQueryError,
    loading: linkedSystemLoading
  } = useGetSystemIntakeSystemQuery({
    variables: { systemIntakeSystemID: linkedSystemID || '' },
    skip: !linkedSystemID
  });

  console.log(
    'Linked system data: ',
    linkedSystem,
    linkedSystemQueryError,
    linkedSystemLoading
  );

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

  const submit = useCallback(async () => {
    if (!isDirty) return;

    const values = watch();
    const payload = { ...values };
    console.log('payload', payload, cedarSystemIdOptions);

    const systemName = cedarSystemIdOptions.find(
      option => option.value === payload.cedarSystemID
    )?.label;

    if (!payload.cedarSystemID) {
      setCedarSystemSelectedError(true);
      return;
    }
    setCedarSystemSelectedError(false);

    if (linkedSystemID) {
      const updateLinkResult = await updateLink(
        payload,
        linkedSystemID,
        systemIntakeID,
        updateSystemLink
      );

      if (updateLinkResult && updateLinkResult.data) {
        history.push(`/linked-systems/${systemIntakeID}`, {
          successfullyUpdated: true,
          systemUpdated: systemName
        });
      }

      return;
    }

    const addLinkResult = await addLink(payload, systemIntakeID, addSystemLink);

    if (
      addLinkResult &&
      addLinkResult.data &&
      addLinkResult.data.addSystemLink !== null
    ) {
      history.push(`/linked-systems/${systemIntakeID}`, {
        successfullyAdded: true,
        systemUpdated: systemName
      });
    }
  }, [
    history,
    systemIntakeID,
    linkedSystemID,
    isDirty,
    cedarSystemIdOptions,
    watch,
    updateSystemLink,
    addSystemLink
  ]);

  return (
    <MainContent className="grid-container margin-bottom-15">
      <>
        {(hasErrors || addSystemLinkError || updateSystemLinkError) && (
          <Alert
            id="link-form-error"
            type="error"
            slim
            className="margin-top-2"
          >
            <Trans
              i18nKey="linkedSystems:unableToUpdateSystemLinks"
              components={{
                link1: <Link href="EnterpriseArchitecture@cms.hhs.gov"> </Link>
              }}
            />
          </Alert>
        )}
        {cedarSystemSelectedError && (
          <Alert
            id="link-form-error"
            type="error"
            slim
            className="margin-top-2"
          >
            {t('error:pleaseSelectASystem')}
          </Alert>
        )}
        <PageHeading className="margin-top-4 margin-bottom-0">
          {t('header')}
        </PageHeading>
        <p className="font-body-lg line-height-body-5 text-light margin-y-0">
          {t('subHeader')}
        </p>
        <p className="margin-top-2 margin-bottom-5 text-base">
          <Trans
            i18nKey="action:fieldsMarkedRequired"
            components={{ asterisk: <RequiredAsterisk /> }}
          />
        </p>
        <p>
          <IconButton
            icon={<Icon.ArrowBack className="margin-right-05" aria-hidden />}
            type="button"
            unstyled
            onClick={() => {
              history.goBack();
            }}
          >
            {t('dontEditAndReturn')}
          </IconButton>
        </p>
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
              <Grid tablet={{ col: 12 }} desktop={{ col: 6 }}>
                <Fieldset>
                  {relationLoading && <Spinner size="small" />}
                  {!relationLoading && (
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
                            >
                              {t('cmsSystemsDropdown.title')}{' '}
                              <RequiredAsterisk />
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
                              {cedarSystemIdOptions.map(system => (
                                <option
                                  key={system.label}
                                  value={system.value}
                                  label={t(`${system.label}`)}
                                />
                              ))}
                            </Select>
                          </FormGroup>
                        )}
                      />
                      <Label
                        htmlFor="cedarSystemID"
                        hint={t('relationship.hint')}
                      >
                        {t('relationship.title')} <RequiredAsterisk />
                      </Label>
                    </>
                  )}

                  <Controller
                    control={control}
                    name="relationshipTypes.primarySupport"
                    render={({ field: { ref, ...field } }) => (
                      <CheckboxField
                        label={t('relationshipTypes.primarySupport')}
                        id="primarySupport"
                        name="primarySupport"
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
                        label={t('relationshipTypes.partialSupport')}
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
                          'relationshipTypes.usesOrImpactedBySelectedSystems'
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
                        label={t('relationshipTypes.impactsSelectedSystem')}
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
                        label={t('relationshipTypes.other')}
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
                      <Label htmlFor="otherDescription">
                        {t('relationshipTypes.pleaseExplain')}
                        <RequiredAsterisk />
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

            <Button type="submit">
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
              {t('dontEditAndReturn')}
            </IconButton>
          </Form>
        </FormProvider>
      </>
    </MainContent>
  );
};

export default LinkedSystemsForm;
