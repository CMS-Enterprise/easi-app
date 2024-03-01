import React, { useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Trans, useTranslation } from 'react-i18next';
import { Link, useHistory, useParams } from 'react-router-dom';
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

import MainContent from 'components/MainContent';
import Modal from 'components/Modal';
import PageHeading from 'components/PageHeading';
import IconButton from 'components/shared/IconButton';
import MultiSelect from 'components/shared/MultiSelect';
import RequiredAsterisk from 'components/shared/RequiredAsterisk';
import GetCedarSystemIdsQuery from 'queries/GetCedarSystemIdsQuery';
import {
  SetSystemIntakeRelationExistingServiceQuery,
  SetSystemIntakeRelationExistingSystemQuery,
  SetSystemIntakeRelationNewSystemQuery
} from 'queries/SystemIntakeRelationQueries';
import { GetCedarSystemIds } from 'queries/types/GetCedarSystemIds';
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

// Reflects schema.graphql#RequestRelationType
type RequestRelation = 'newSystem' | 'existingSystem' | 'existingService';

const RequestLinkForm = () => {
  const { systemId } = useParams<{
    systemId: string;
  }>();
  const history = useHistory();

  const { t } = useTranslation(['itGov', 'intake', 'action']);

  const { data: cedarSystemsData } = useQuery<GetCedarSystemIds>(
    GetCedarSystemIdsQuery
  );

  const cedarSystemIdOptions = useMemo(() => {
    if (!cedarSystemsData) return [];
    return cedarSystemsData.cedarSystems.map(system => ({
      label: system.name,
      value: system.id
    }));
  }, [cedarSystemsData]);

  const [setSystemIntakeRelationNewSystem] = useMutation<
    SetSystemIntakeRelationNewSystem,
    SetSystemIntakeRelationNewSystemVariables
  >(SetSystemIntakeRelationNewSystemQuery);

  const [setSystemIntakeRelationExistingSystem] = useMutation<
    SetSystemIntakeRelationExistingSystem,
    SetSystemIntakeRelationExistingSystemVariables
  >(SetSystemIntakeRelationExistingSystemQuery);

  const [setSystemIntakeRelationExistingService] = useMutation<
    SetSystemIntakeRelationExistingService,
    SetSystemIntakeRelationExistingServiceVariables
  >(SetSystemIntakeRelationExistingServiceQuery);

  const [relation, setRelation] = useState<RequestRelation | null>(null);

  const taskListUrl = `/governance-task-list/${systemId}`;

  const { control, watch, handleSubmit } = useForm<{
    cedarSystemIDs: string[];
    contractNumbers: string;
    contractName: string;
  }>({
    defaultValues: {
      cedarSystemIDs: [],
      contractNumbers: '',
      contractName: ''
    }
  });

  // Ref fields for some form behavior
  const fields = watch();

  // This form doesn't use validation
  // The submission button is disabled according to required fields
  const submitEnabled = (() => {
    if (relation === null) return false;

    if (relation === 'newSystem') return true;

    if (relation === 'existingSystem' && fields.cedarSystemIDs.length)
      return true;

    if (relation === 'existingService' && fields.contractName.trim() !== '')
      return true;

    // Default to disabled
    return false;
  })();

  const submit = handleSubmit(data => {
    // The new system relation form is entirely optional
    // If it's empty then just treat this submit handler as a link
    if (relation === 'newSystem' && data.contractNumbers.trim() === '') {
      history.push(taskListUrl);
      return;
    }

    // Otherwise do some field parsing and correlate `relation` to mutation

    // Parse contract numbers from csv text input to string[]
    // Make sure an empty string input is sent as an empty list
    const contractNumbers = data.contractNumbers
      .split(',')
      .map(v => v.trim())
      .filter(v => v !== '');

    let p: Promise<any> | undefined;

    if (relation === 'newSystem') {
      p = setSystemIntakeRelationNewSystem({
        variables: {
          input: {
            systemIntakeID: systemId,
            contractNumbers
          }
        }
      });
    } else if (relation === 'existingSystem') {
      p = setSystemIntakeRelationExistingSystem({
        variables: {
          input: {
            systemIntakeID: systemId,
            cedarSystemIDs: data.cedarSystemIDs,
            contractNumbers
          }
        }
      });
    } else if (relation === 'existingService') {
      p = setSystemIntakeRelationExistingService({
        variables: {
          input: {
            systemIntakeID: systemId,
            contractName: data.contractName,
            contractNumbers
          }
        }
      });
    }

    p?.then(() => {
      history.push(taskListUrl);
    });
  });

  const [isSkipModalOpen, setSkipModalOpen] = useState<boolean>(false);

  return (
    <MainContent className="grid-container margin-bottom-15">
      <BreadcrumbBar variant="wrap">
        <Breadcrumb>
          <BreadcrumbLink asCustom={Link} to="/">
            <span>{t('intake:navigation.itGovernance')}</span>
          </BreadcrumbLink>
        </Breadcrumb>
        <Breadcrumb current>{t('intake:navigation.startRequest')}</Breadcrumb>
      </BreadcrumbBar>
      <PageHeading className="margin-top-4 margin-bottom-0">
        {t('link.header')}
      </PageHeading>
      <p className="font-body-lg line-height-body-5 text-light margin-y-0">
        {t('link.description')}
      </p>
      <p className="margin-top-2 text-base">
        <Trans
          i18nKey="action:fieldsMarkedRequired"
          components={{ asterisk: <RequiredAsterisk /> }}
        />
      </p>

      <Form className="easi-form maxw-full" onSubmit={e => e.preventDefault()}>
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
                value="newSystem"
                label={t('link.form.field.systemOrService.options.0')}
                onClick={() => setRelation('newSystem')}
              />

              {relation === 'newSystem' && (
                <Controller
                  name="contractNumbers"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <FormGroup error={!!error}>
                      <Label
                        htmlFor="contractNumber"
                        hint={t('link.form.field.contractNumberNew.help')}
                        error={!!error}
                      >
                        {t('link.form.field.contractNumberNew.label')}
                      </Label>
                      <TextInput
                        {...field}
                        ref={null}
                        id="contractNumbers"
                        type="text"
                        validationStatus={error && 'error'}
                      />
                    </FormGroup>
                  )}
                />
              )}

              {/* Existing system */}
              <Radio
                id="relationType-existingSystem"
                name="relationType"
                value="existingSystem"
                label={t('link.form.field.systemOrService.options.1')}
                onClick={() => setRelation('existingSystem')}
              />

              {relation === 'existingSystem' && (
                <>
                  <Controller
                    name="cedarSystemIDs"
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                      <FormGroup error={!!error}>
                        <Label
                          htmlFor="cedarSystemIDs"
                          hint={t('link.form.field.cmsSystem.help')}
                          error={!!error}
                        >
                          {t('link.form.field.cmsSystem.label')}{' '}
                          <RequiredAsterisk />
                        </Label>
                        <MultiSelect
                          name={field.name}
                          selectedLabel={t(
                            'link.form.field.cmsSystem.selectedLabel'
                          )}
                          options={cedarSystemIdOptions}
                          onChange={values => field.onChange(values)}
                        />
                      </FormGroup>
                    )}
                  />

                  <Controller
                    name="contractNumbers"
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                      <FormGroup error={!!error}>
                        <Label
                          htmlFor="contractNumber"
                          hint={t(
                            'link.form.field.contractNumberExisting.help'
                          )}
                          error={!!error}
                        >
                          {t('link.form.field.contractNumberExisting.label')}
                        </Label>
                        <TextInput
                          {...field}
                          ref={null}
                          id="contractNumbers"
                          type="text"
                          validationStatus={error && 'error'}
                        />
                      </FormGroup>
                    )}
                  />
                </>
              )}

              {/* Existing service or contract */}
              <Radio
                id="relationType-existingService"
                name="relationType"
                value="existingService"
                label={t('link.form.field.systemOrService.options.2')}
                onClick={() => setRelation('existingService')}
              />
              {relation === 'existingService' && (
                <>
                  <Controller
                    name="contractName"
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                      <FormGroup error={!!error}>
                        <Label htmlFor="contractName" error={!!error}>
                          {t('link.form.field.serviceOrContractName.label')}{' '}
                          <RequiredAsterisk />
                        </Label>
                        <TextInput
                          {...field}
                          ref={null}
                          id="contractName"
                          type="text"
                          validationStatus={error && 'error'}
                        />
                      </FormGroup>
                    )}
                  />

                  <Controller
                    name="contractNumbers"
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                      <FormGroup error={!!error}>
                        <Label
                          htmlFor="contractNumber"
                          hint={t(
                            'link.form.field.contractNumberExisting.help'
                          )}
                          error={!!error}
                        >
                          {t('link.form.field.contractNumberExisting.label')}
                        </Label>
                        <TextInput
                          {...field}
                          ref={null}
                          id="contractNumbers"
                          type="text"
                          validationStatus={error && 'error'}
                        />
                      </FormGroup>
                    )}
                  />
                </>
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
              `link.form.${
                relation === 'newSystem' ? 'continueTaskList' : 'next'
              }`
            )}
          </Button>

          <Button
            type="submit"
            unstyled
            onClick={() => setSkipModalOpen(true)}
            className="margin-left-1"
          >
            {t('link.form.skip')}
          </Button>
        </ButtonGroup>

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

        <IconButton
          icon={<IconArrowBack className="margin-right-05" />}
          type="button"
          unstyled
          onClick={() => {
            history.goBack();
          }}
        >
          {t('link.cancelAndExit')}
        </IconButton>
      </Form>
    </MainContent>
  );
};

export default RequestLinkForm;
