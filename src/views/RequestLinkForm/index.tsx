import React, { useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Trans, useTranslation } from 'react-i18next';
import { Link, useHistory, useLocation, useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/client';
import {
  Breadcrumb,
  BreadcrumbBar,
  BreadcrumbLink,
  Button,
  ButtonGroup,
  Fieldset,
  Form,
  FormGroup,
  Grid,
  IconArrowBack,
  Label,
  Radio,
  TextInput
} from '@trussworks/react-uswds';
import classNames from 'classnames';

import MainContent from 'components/MainContent';
import Modal from 'components/Modal';
import PageHeading from 'components/PageHeading';
import PageLoading from 'components/PageLoading';
import Alert from 'components/shared/Alert';
import IconButton from 'components/shared/IconButton';
import MultiSelect from 'components/shared/MultiSelect';
import RequiredAsterisk from 'components/shared/RequiredAsterisk';
import {
  GetSystemIntakeRelationQuery,
  SetSystemIntakeRelationExistingServiceQuery,
  SetSystemIntakeRelationExistingSystemQuery,
  SetSystemIntakeRelationNewSystemQuery,
  UnlinkSystemIntakeRelationQuery
} from 'queries/SystemIntakeRelationQueries';
import {
  GetSystemIntakeRelation,
  GetSystemIntakeRelationVariables
} from 'queries/types/GetSystemIntakeRelation';
import {
  SetSystemIntakeRelationExistingService,
  SetSystemIntakeRelationExistingServiceVariables
} from 'queries/types/SetSystemIntakeRelationExistingService';
import {
  SetSystemIntakeRelationExistingSystem,
  SetSystemIntakeRelationExistingSystemVariables
} from 'queries/types/SetSystemIntakeRelationExistingSystem';
import {
  SetSystemIntakeRelationNewSystem,
  SetSystemIntakeRelationNewSystemVariables
} from 'queries/types/SetSystemIntakeRelationNewSystem';
import {
  UnlinkSystemIntakeRelation,
  UnlinkSystemIntakeRelationVariables
} from 'queries/types/UnlinkSystemIntakeRelation';
import { RequestRelationType } from 'types/graphql-global-types';

const RequestLinkForm = () => {
  const { systemId } = useParams<{
    systemId: string;
  }>();
  const history = useHistory();

  const { t } = useTranslation(['itGov', 'intake', 'action', 'error']);

  // Form mode is either new or edit
  const { state } = useLocation<{ isNew?: boolean }>();
  const isNew = !!state?.isNew;

  // Fetch query param to check if coming from ITGov/TRB admin home for redirect and text changes
  const params = new URLSearchParams(useLocation().search);
  const editType = params.get('edit-type');

  const taskListUrl = `/governance-task-list/${systemId}`;
  let breadCrumb = t('additionalRequestInfo.taskListBreadCrumb');

  let redirectUrl = taskListUrl;
  if (editType === 'it-gov-admin') {
    redirectUrl = `/governance-review-team/${systemId}/additional-information`;
    breadCrumb = t('additionalRequestInfo.itGovBreadcrumb');
  } else if (editType === 'trb-admin') {
    redirectUrl = `/trb/${systemId}/additional-information`;
    breadCrumb = t('additionalRequestInfo.trbBreadcrumb');
  }

  const [hasUserError, setUserError] = useState<boolean>(false);

  const [isSkipModalOpen, setSkipModalOpen] = useState<boolean>(false);
  const [isUnlinkModalOpen, setUnlinkModalOpen] = useState<boolean>(false);

  const { data, error, loading } = useQuery<
    GetSystemIntakeRelation,
    GetSystemIntakeRelationVariables
  >(GetSystemIntakeRelationQuery, { variables: { id: systemId } });

  const cedarSystemIdOptions = useMemo(() => {
    const cedarSystemsData = data?.cedarSystems;
    return !cedarSystemsData
      ? []
      : cedarSystemsData.map(system => ({
          label: system.name,
          value: system.id
        }));
  }, [data?.cedarSystems]);

  const [
    setSystemIntakeRelationNewSystem,
    { error: newSystemError }
  ] = useMutation<
    SetSystemIntakeRelationNewSystem,
    SetSystemIntakeRelationNewSystemVariables
  >(SetSystemIntakeRelationNewSystemQuery);

  const [
    setSystemIntakeRelationExistingSystem,
    { error: existingSystemError }
  ] = useMutation<
    SetSystemIntakeRelationExistingSystem,
    SetSystemIntakeRelationExistingSystemVariables
  >(SetSystemIntakeRelationExistingSystemQuery);

  const [
    setSystemIntakeRelationExistingService,
    { error: existingServiceError }
  ] = useMutation<
    SetSystemIntakeRelationExistingService,
    SetSystemIntakeRelationExistingServiceVariables
  >(SetSystemIntakeRelationExistingServiceQuery);

  const [unlinkSystemIntakeRelation, { error: unlinkError }] = useMutation<
    UnlinkSystemIntakeRelation,
    UnlinkSystemIntakeRelationVariables
  >(UnlinkSystemIntakeRelationQuery);

  const { control, watch, setValue, handleSubmit } = useForm<{
    relationType: RequestRelationType | null;
    cedarSystemIDs: string[];
    contractNumbers: string;
    contractName: string;
  }>({
    defaultValues: {
      relationType: null,
      cedarSystemIDs: [],
      contractNumbers: '',
      contractName: ''
    },
    values: (values => {
      if (!values) return undefined;
      return {
        relationType: values.relationType,
        cedarSystemIDs: values.systems.map(v => v.id),
        contractNumbers: values.contractNumbers
          .map(v => v.contractNumber)
          .join(', '),
        contractName: values.contractName || ''
      };
    })(data?.systemIntake)
  });

  // Ref fields for some form behavior
  const fields = watch();
  const relation = fields.relationType;

  // This form doesn't use field validation feedback
  // Instead the submission button is disabled according to field requirements
  const submitEnabled: boolean = (() => {
    if (relation === null) return false;

    if (relation === RequestRelationType.NEW_SYSTEM) return true;

    if (
      relation === RequestRelationType.EXISTING_SYSTEM &&
      fields.cedarSystemIDs.length
    )
      return true;

    if (
      relation === RequestRelationType.EXISTING_SERVICE &&
      fields.contractName.trim() !== ''
    )
      return true;

    // Default to disabled
    return false;
  })();

  const submit = handleSubmit(formData => {
    // Do some field parsing and correlate relation type to mutation

    // Parse contract numbers from csv text input to string[]
    // Make sure an empty string input is sent as an empty list
    const contractNumbers = formData.contractNumbers
      .split(',')
      .map(v => v.trim())
      .filter(v => v !== '');

    let p;

    if (relation === RequestRelationType.NEW_SYSTEM) {
      p = setSystemIntakeRelationNewSystem({
        variables: {
          input: {
            systemIntakeID: systemId,
            contractNumbers
          }
        }
      });
    } else if (relation === RequestRelationType.EXISTING_SYSTEM) {
      p = setSystemIntakeRelationExistingSystem({
        variables: {
          input: {
            systemIntakeID: systemId,
            cedarSystemIDs: formData.cedarSystemIDs,
            contractNumbers
          }
        }
      });
    } else if (relation === RequestRelationType.EXISTING_SERVICE) {
      p = setSystemIntakeRelationExistingService({
        variables: {
          input: {
            systemIntakeID: systemId,
            contractName: formData.contractName,
            contractNumbers
          }
        }
      });
    }

    p?.then(
      res => {
        if (res?.data) history.push(redirectUrl);
      },
      () => {}
    ).catch(() => {
      setUserError(true);
    });
  });

  const unlink = () => {
    unlinkSystemIntakeRelation({ variables: { intakeID: systemId } })
      .then(
        res => {
          if (res?.data) history.push(redirectUrl);
        },
        () => {}
      )
      .catch(() => {
        setUserError(true);
      });
  };

  // Error feedback
  const hasErrors =
    error ||
    existingServiceError ||
    existingSystemError ||
    newSystemError ||
    unlinkError ||
    hasUserError;

  useEffect(() => {
    if (hasErrors) {
      const err = document.getElementById('link-form-error');
      err?.scrollIntoView();
    }
  }, [hasErrors]);

  return (
    <MainContent className="grid-container margin-bottom-15">
      {hasErrors && (
        <Alert id="link-form-error" type="error" slim className="margin-top-2">
          {t('error:encounteredIssueTryAgain')}
        </Alert>
      )}
      {loading && <PageLoading />}
      {!loading && data && (
        <>
          <BreadcrumbBar variant="wrap">
            <Breadcrumb>
              <BreadcrumbLink asCustom={Link} to="/">
                <span>{t('intake:navigation.itGovernance')}</span>
              </BreadcrumbLink>
            </Breadcrumb>
            {isNew ? (
              <Breadcrumb current>
                {t('intake:navigation.startRequest')}
              </Breadcrumb>
            ) : (
              <>
                <Breadcrumb>
                  <BreadcrumbLink asCustom={Link} to={redirectUrl}>
                    <span>{breadCrumb}</span>
                  </BreadcrumbLink>
                </Breadcrumb>
                <Breadcrumb current>
                  {t('intake:navigation.editLinkRelation')}
                </Breadcrumb>
              </>
            )}
          </BreadcrumbBar>
          <PageHeading className="margin-top-4 margin-bottom-0">
            {t('link.header')}
          </PageHeading>
          <p className="font-body-lg line-height-body-5 text-light margin-y-0">
            {t('link.description')}
          </p>
          <p className="margin-top-2 margin-bottom-5 text-base">
            <Trans
              i18nKey="action:fieldsMarkedRequired"
              components={{ asterisk: <RequiredAsterisk /> }}
            />
          </p>

          <Form
            className="easi-form maxw-full"
            onSubmit={e => e.preventDefault()}
          >
            <Grid row>
              <Grid tablet={{ col: 12 }} desktop={{ col: 6 }}>
                <Fieldset
                  legend={
                    <h4 className="margin-top-0 margin-bottom-1 line-height-heading-2">
                      {t('link.form.field.systemOrService.label')}
                    </h4>
                  }
                >
                  {/* New system or service */}
                  <Radio
                    id="relationType-newSystem"
                    name="relationType"
                    value={RequestRelationType.NEW_SYSTEM}
                    label={t('link.form.field.systemOrService.options.0')}
                    onChange={() =>
                      setValue('relationType', RequestRelationType.NEW_SYSTEM)
                    }
                    checked={relation === RequestRelationType.NEW_SYSTEM}
                  />

                  {relation === RequestRelationType.NEW_SYSTEM && (
                    <Controller
                      name="contractNumbers"
                      control={control}
                      render={({ field }) => (
                        <FormGroup className="margin-left-4">
                          <Label
                            htmlFor="contractNumber"
                            hint={t('link.form.field.contractNumberNew.help')}
                          >
                            {t('link.form.field.contractNumberNew.label')}
                          </Label>
                          <TextInput
                            {...field}
                            ref={null}
                            id="contractNumbers"
                            type="text"
                          />
                        </FormGroup>
                      )}
                    />
                  )}

                  {/* Existing system */}
                  <Radio
                    id="relationType-existingSystem"
                    name="relationType"
                    value={RequestRelationType.EXISTING_SYSTEM}
                    label={t('link.form.field.systemOrService.options.1')}
                    onChange={() =>
                      setValue(
                        'relationType',
                        RequestRelationType.EXISTING_SYSTEM
                      )
                    }
                    checked={relation === RequestRelationType.EXISTING_SYSTEM}
                  />

                  {relation === RequestRelationType.EXISTING_SYSTEM && (
                    <div className="margin-left-4">
                      <Controller
                        name="cedarSystemIDs"
                        control={control}
                        render={({ field }) => (
                          <FormGroup>
                            <Label
                              htmlFor="cedarSystemIDs"
                              hint={t('link.form.field.cmsSystem.help')}
                            >
                              {t('link.form.field.cmsSystem.label')}{' '}
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

                      <Controller
                        name="contractNumbers"
                        control={control}
                        render={({ field }) => (
                          <FormGroup>
                            <Label
                              htmlFor="contractNumber"
                              hint={t(
                                'link.form.field.contractNumberExisting.help'
                              )}
                            >
                              {t(
                                'link.form.field.contractNumberExisting.label'
                              )}
                            </Label>
                            <TextInput
                              {...field}
                              ref={null}
                              id="contractNumbers"
                              type="text"
                            />
                          </FormGroup>
                        )}
                      />
                    </div>
                  )}

                  {/* Existing service or contract */}
                  <Radio
                    id="relationType-existingService"
                    name="relationType"
                    value={RequestRelationType.EXISTING_SERVICE}
                    label={t('link.form.field.systemOrService.options.2')}
                    onChange={() =>
                      setValue(
                        'relationType',
                        RequestRelationType.EXISTING_SERVICE
                      )
                    }
                    checked={relation === RequestRelationType.EXISTING_SERVICE}
                  />

                  {relation === RequestRelationType.EXISTING_SERVICE && (
                    <div className="margin-left-4">
                      <Controller
                        name="contractName"
                        control={control}
                        render={({ field }) => (
                          <FormGroup>
                            <Label htmlFor="contractName">
                              {t('link.form.field.serviceOrContractName.label')}{' '}
                              <RequiredAsterisk />
                            </Label>
                            <TextInput
                              {...field}
                              ref={null}
                              id="contractName"
                              type="text"
                            />
                          </FormGroup>
                        )}
                      />

                      <Controller
                        name="contractNumbers"
                        control={control}
                        render={({ field }) => (
                          <FormGroup>
                            <Label
                              htmlFor="contractNumber"
                              hint={t(
                                'link.form.field.contractNumberExisting.help'
                              )}
                            >
                              {t(
                                'link.form.field.contractNumberExisting.label'
                              )}
                            </Label>
                            <TextInput
                              {...field}
                              ref={null}
                              id="contractNumbers"
                              type="text"
                            />
                          </FormGroup>
                        )}
                      />
                    </div>
                  )}
                </Fieldset>
              </Grid>
            </Grid>

            <ButtonGroup>
              <Button
                type="submit"
                disabled={!submitEnabled}
                onClick={() => submit()}
              >
                {t(
                  `link.form.${(() => {
                    if (isNew) {
                      return relation === RequestRelationType.NEW_SYSTEM
                        ? 'continueTaskList'
                        : 'next';
                    }
                    return 'saveChanges';
                  })()}`
                )}
              </Button>

              {(isNew ||
                (!isNew && data.systemIntake?.relationType !== null)) && (
                <Button
                  type="submit"
                  unstyled
                  onClick={() => {
                    if (isNew) setSkipModalOpen(true);
                    else setUnlinkModalOpen(true);
                  }}
                  className={classNames('margin-left-1', {
                    'text-error': !isNew
                  })}
                >
                  {t(`link.form.${isNew ? 'skip' : 'unlink'}`)}
                </Button>
              )}
            </ButtonGroup>

            <IconButton
              icon={<IconArrowBack className="margin-right-05" />}
              type="button"
              unstyled
              onClick={() => {
                history.goBack();
              }}
            >
              {t('link.form.back')}
            </IconButton>

            {/* Skip confirm modal */}
            <Modal
              isOpen={isSkipModalOpen}
              closeModal={() => setSkipModalOpen(false)}
            >
              <h2 className="usa-modal__heading margin-bottom-2">
                {t('link.skipConfirm.heading')}
              </h2>
              <p className="margin-y-0">{t('link.skipConfirm.text')}</p>
              <ul className="easi-list margin-top-0">
                <li>{t('link.skipConfirm.list.0')}</li>
                <li>{t('link.skipConfirm.list.1')}</li>
              </ul>
              <ButtonGroup className="margin-top-3">
                <Button type="button" onClick={() => history.push(taskListUrl)}>
                  {t('link.skipConfirm.submit')}
                </Button>
                <Button
                  type="button"
                  unstyled
                  className="margin-left-1"
                  onClick={() => setSkipModalOpen(false)}
                >
                  {t('link.skipConfirm.cancel')}
                </Button>
              </ButtonGroup>
            </Modal>

            {/* Unlink confirm */}
            <Modal
              isOpen={isUnlinkModalOpen}
              closeModal={() => setUnlinkModalOpen(false)}
            >
              <h2 className="usa-modal__heading margin-bottom-2">
                {t('link.unlinkConfirm.heading')}
              </h2>
              <p className="margin-top-0">{t('link.unlinkConfirm.text.0')}</p>
              <p className="margin-bottom-0">
                {t('link.unlinkConfirm.text.1')}
              </p>
              <ul className="easi-list margin-top-0">
                <li>{t('link.unlinkConfirm.list.0')}</li>
                <li>{t('link.unlinkConfirm.list.1')}</li>
              </ul>
              <ButtonGroup className="margin-top-3">
                <Button secondary type="button" onClick={() => unlink()}>
                  {t('link.unlinkConfirm.submit')}
                </Button>
                <Button
                  type="button"
                  unstyled
                  className="margin-left-1"
                  onClick={() => setUnlinkModalOpen(false)}
                >
                  {t('link.unlinkConfirm.cancel')}
                </Button>
              </ButtonGroup>
            </Modal>
          </Form>
        </>
      )}
    </MainContent>
  );
};

export default RequestLinkForm;
