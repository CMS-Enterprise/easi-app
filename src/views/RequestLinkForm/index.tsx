/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
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
  Label,
  Radio,
  TextInput
} from '@trussworks/react-uswds';

import UswdsReactLink from 'components/LinkWrapper';
import MainContent from 'components/MainContent';
import Modal from 'components/Modal';
import PageHeading from 'components/PageHeading';
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

// schema.graphql#RequestRelationType
type RequestRelation = 'newSystem' | 'existingSystem' | 'existingService';

const RequestLinkForm = () => {
  const { systemId } = useParams<{
    systemId: string;
  }>();
  const history = useHistory();

  const { t } = useTranslation(['itGov', 'intake']);

  const {
    data: cedarSystemsData,
    loading,
    error: formError
  } = useQuery<GetCedarSystemIds>(GetCedarSystemIdsQuery);

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

  const { control, watch, handleSubmit } = useForm({
    defaultValues: {
      cedarSystemIDs: [],
      contractNumbers: '',
      contractName: ''
    }
  });

  const cedarSystemIdOptions = useMemo(() => {
    const data = {
      cedarSystems: [
        {
          id: '000-0000-1',
          name: 'Application Programming Interface Gateway'
        },
        {
          id: '000-0000-2',
          name: 'Blueprint'
        },
        {
          id: '000-0000-3',
          name: 'Value Based Care Management System'
        },
        {
          id: '000-0000-4',
          name: 'CMS Operations Information Network'
        }
      ]
    };
    return (data?.cedarSystems || []).map(system => ({
      label: system!.name!,
      value: system!.id!
    }));
    // }, [data]);
  }, []);

  const taskListUrl = `/governance-task-list/${systemId}`;

  const submit = handleSubmit(
    data => {
      // console.log('submit', data);

      const contractNumbers = data.contractNumbers
        .split(',')
        .map((v: string) => v.trim());

      let p: Promise<any> | null = null;

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
    },
    e => {
      // console.log('submit error', e);
    }
  );

  return (
    <MainContent className="grid-container margin-bottom-5">
      <BreadcrumbBar variant="wrap">
        <Breadcrumb>
          <BreadcrumbLink asCustom={Link} to="/">
            <span>{t('intake:navigation.itGovernance')}</span>
          </BreadcrumbLink>
        </Breadcrumb>
        <Breadcrumb current>{t('intake:navigation.startRequest')}</Breadcrumb>
      </BreadcrumbBar>
      <PageHeading>{t('link.header')}</PageHeading>
      <p>{t('link.description')}</p>
      {/* required fields text */}
      <Form className="maxw-full" onSubmit={e => e.preventDefault()}>
        <Grid row>
          <Grid tablet={{ col: 12 }} desktop={{ col: 6 }}>
            <Fieldset legend={t('link.form.field.systemOrService.label')}>
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
                          options={cedarSystemIdOptions}
                          onChange={values => {
                            // console.log('values', values);
                            field.onChange(values);
                          }}
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
            disabled={!relation}
            onClick={() => {
              // console.log('values', watch());
              submit();
            }}
          >
            {t(
              `link.form.${
                relation === 'newSystem' ? 'continueTaskList' : 'next'
              }`
            )}
          </Button>
          <UswdsReactLink
            variant="unstyled"
            to={taskListUrl}
            className="usa-button usa-button--unstyled"
          >
            {t('link.form.skip')}
          </UswdsReactLink>
        </ButtonGroup>

        {/* Skip confirm modal */}
        <Modal
          title={t('link.skipConfirm.heading')}
          isOpen={false}
          closeModal={() => {}}
        >
          <p>{t('link.skipConfirm.heading')}</p>
          <ul>
            <li>{t('link.skipConfirm.list.0')}</li>
            <li>{t('link.skipConfirm.list.1')}</li>
          </ul>
          <ButtonGroup>
            <Button type="button">{t('link.skipConfirm.submit')}</Button>
            <Button type="button" unstyled>
              {t('link.skipConfirm.cancel')}
            </Button>
          </ButtonGroup>
        </Modal>
      </Form>
    </MainContent>
  );
};

export default RequestLinkForm;
