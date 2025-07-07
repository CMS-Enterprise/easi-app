import React, { useCallback, useMemo, useState } from 'react';
import { Controller, FieldPath, FormProvider } from 'react-hook-form';
// import { useForm } from 'react-hook-form';
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
  TextInput
} from '@trussworks/react-uswds';
import {
  SystemRelationshipInput,
  SystemRelationshipType,
  useGetSystemIntakeRelationQuery,
  useSetSystemIntakeRelationExistingSystemMutation
} from 'gql/generated/graphql';

import Alert from 'components/Alert';
import CheckboxField from 'components/CheckboxField';
import { useEasiForm } from 'components/EasiForm';
import { ErrorAlert, ErrorAlertMessage } from 'components/ErrorAlert';
import IconButton from 'components/IconButton';
import MainContent from 'components/MainContent';
import MultiSelect from 'components/MultiSelect';
import PageHeading from 'components/PageHeading';
import RequiredAsterisk from 'components/RequiredAsterisk';
import Spinner from 'components/Spinner';
import flattenFormErrors from 'utils/flattenFormErrors';
import { linkedSystemsSchema } from 'validations/systemIntakeSchema';

type LinkedSystemsFormFields = {
  cedarSystemIDs: string[];
  primarySupport: boolean;
  partialSupport: boolean;
  usesOrImpactedBySelectedSystem: boolean;
  impactsSelectedSystem: boolean;
  other: boolean;
  otherDescription: string;
};

const hasErrors = false; // todo fix this

const buildCedarSystemRelationshipObjects = (
  payload: LinkedSystemsFormFields
) => {
  const selectedSystemRelationshipTypes: Array<SystemRelationshipType> = [];

  if (payload.primarySupport) {
    selectedSystemRelationshipTypes.push(
      SystemRelationshipType.PRIMARY_SUPPORT
    );
  }
  if (payload.partialSupport) {
    selectedSystemRelationshipTypes.push(
      SystemRelationshipType.PARTIAL_SUPPORT
    );
  }
  if (payload.usesOrImpactedBySelectedSystem) {
    selectedSystemRelationshipTypes.push(
      SystemRelationshipType.USES_OR_IMPACTED_BY_SELECTED_SYSTEM
    );
  }
  if (payload.impactsSelectedSystem) {
    selectedSystemRelationshipTypes.push(
      SystemRelationshipType.IMPACTS_SELECTED_SYSTEM
    );
  }
  if (payload.other) {
    selectedSystemRelationshipTypes.push(SystemRelationshipType.OTHER);
  }

  const systemRelationships: Array<SystemRelationshipInput> =
    payload.cedarSystemIDs.map((systemId: string) => {
      return {
        cedarSystemId: systemId,
        systemRelationshipType: selectedSystemRelationshipTypes,
        otherSystemRelationshipDescription: payload.otherDescription
      };
    });

  return systemRelationships;
};

const LinkedSystemsForm = () => {
  const { id } = useParams<{
    id: string;
  }>();

  const history = useHistory();

  //   const { getValues } = useForm();

  const { t } = useTranslation(['linkedSystems', 'error']);

  const [setExistingIntakeSystem, { error: existingIntakeSystemError }] =
    useSetSystemIntakeRelationExistingSystemMutation();

  const [cedarSystemSelectedError, setCedarSystemSelectedError] =
    useState<boolean>(false);

  const {
    data: systemIntakeAndCedarSystems,
    error: relationError,
    loading: relationLoading
  } = useGetSystemIntakeRelationQuery({
    variables: { id }
  });

  const cedarSystemIdOptions = useMemo(() => {
    const cedarSystemsData = systemIntakeAndCedarSystems?.cedarSystems;
    return !cedarSystemsData
      ? []
      : cedarSystemsData.map(system => ({
          label: `${system.name} (${system.acronym})`,
          value: system.id
        }));
  }, [systemIntakeAndCedarSystems?.cedarSystems]);

  const form = useEasiForm<LinkedSystemsFormFields>({
    resolver: yupResolver(linkedSystemsSchema)
  });

  const {
    control,
    handleSubmit,
    watch,
    register,
    setFocus,
    formState: { isDirty, errors }
  } = form;

  const fieldErrors = flattenFormErrors<LinkedSystemsFormFields>(errors);

  const updateSystemIntake = useCallback(async () => {
    const values = watch();
    const payload = { ...values };

    console.log('payload', payload);

    if (!payload.cedarSystemIDs || payload.cedarSystemIDs.length === 0) {
      setCedarSystemSelectedError(true);
      return () => {};
    }
    setCedarSystemSelectedError(false);

    const request = {
      variables: {
        input: {
          systemIntakeID: id,
          cedarSystemRelationShips:
            buildCedarSystemRelationshipObjects(payload),
          contractNumbers: [] // TODO: Will this overwrite existing contract numbers?
        }
      }
    };

    console.log(request);

    return setExistingIntakeSystem(request);
  }, [watch, id]);

  /** Update contacts and system intake form */
  const submit = async (callback: () => void = () => {}) => {
    // console.log('cedar system ids: ', getValues('cedarSystemIDs'));
    // if (getValues('cedarSystemIDs')) {
    //   setCedarSystemSelectedError(true);
    //   return;
    // }
    // setCedarSystemSelectedError(false);
    if (!isDirty) return;

    // Update intake
    const result = await updateSystemIntake(); // TODO Get this working

    console.log('result', result);

    callback();
  };

  return (
    <MainContent className="grid-container margin-bottom-15">
      <>
        {(hasErrors || existingIntakeSystemError) && (
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
            onSubmit={handleSubmit(() =>
              submit(() => history.push(`/linked-systems/${id}`))
            )}
          >
            <Grid row>
              <Grid tablet={{ col: 12 }} desktop={{ col: 6 }}>
                <Fieldset>
                  {relationLoading && <Spinner size="small" />}
                  {!relationLoading && (
                    <>
                      <Controller
                        name="cedarSystemIDs"
                        control={control}
                        render={({ field }) => (
                          <FormGroup>
                            <Label
                              htmlFor="cedarSystemIDs"
                              hint={t('cmsSystemsDropdown.hint')}
                            >
                              {t('cmsSystemsDropdown.title')}{' '}
                              <RequiredAsterisk />
                            </Label>
                            <MultiSelect
                              name={field.name}
                              selectedLabel={t(
                                'link.form.field.cmsSystem.selectedLabel'
                              )}
                              initialValues={field.value}
                              options={cedarSystemIdOptions}
                              onChange={values => field.onChange(values)}
                            />
                          </FormGroup>
                        )}
                      />
                      <Label
                        htmlFor="cedarSystemIDs"
                        hint={t('relationship.hint')}
                      >
                        {t('relationship.title')} <RequiredAsterisk />
                      </Label>
                    </>
                  )}

                  <Controller
                    control={control}
                    name="primarySupport"
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
                    name="partialSupport"
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
                    name="usesOrImpactedBySelectedSystem"
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
                    name="impactsSelectedSystem"
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
                    name="other"
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

                  {watch('other') && (
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

            <Button type="submit">{t('addSystem')}</Button>

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
