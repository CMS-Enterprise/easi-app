import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Trans, useTranslation } from 'react-i18next';
import { Link, useHistory, useLocation, useParams } from 'react-router-dom';
import {
  Breadcrumb,
  BreadcrumbBar,
  BreadcrumbLink,
  Button,
  ButtonGroup,
  Fieldset,
  Form,
  Grid,
  Icon
} from '@trussworks/react-uswds';
import {
  RequestRelationType,
  SystemIntakeSystem,
  useSystemIntakeQuery
} from 'gql/generated/graphql';

import Alert from 'components/Alert';
import CheckboxField from 'components/CheckboxField';
import IconButton from 'components/IconButton';
import MainContent from 'components/MainContent';
import Modal from 'components/Modal';
import PageHeading from 'components/PageHeading';
import PageLoading from 'components/PageLoading';
import RequiredAsterisk from 'components/RequiredAsterisk';

import LinkedSystemTable from '../LinkedSystemsTable';

type EditLinkedSystemsFormType = {
  relationType: RequestRelationType | null;
  cedarSystemIDs: string[];
  contractNumbers: string;
  contractName: string;
};

const EditLinkedSystemsForm = ({ fromAdmin }: { fromAdmin?: boolean }) => {
  // Id refers to trb request or system intake
  const { id } = useParams<{
    id: string;
  }>();

  const history = useHistory();

  const { t } = useTranslation([
    'itGov',
    'intake',
    'technicalAssistance',
    'action',
    'error'
  ]);

  const { state } = useLocation<{ isNew?: boolean }>();

  //   const linkCedarSystemId = useLinkCedarSystemIdQueryParam();

  // Form edit mode is either new or edit
  const isNew = !!state?.isNew;

  // Url of next view after successful form submit
  // Also for a breadcrumb navigation link
  const redirectUrl = (() => {
    if (fromAdmin) {
      return `/it-governance/${id}/system-information`;
    }
    return `/governance-task-list/${id}`;
  })();

  const breadCrumb = (() => {
    if (fromAdmin) {
      return t('additionalRequestInfo.itGovBreadcrumb');
    }
    return t('additionalRequestInfo.taskListBreadCrumb');
  })();

  const [isSkipModalOpen, setSkipModalOpen] = useState<boolean>(false);
  const [isUnlinkModalOpen, setUnlinkModalOpen] = useState<boolean>(false);

  const {
    data,
    // error: undefined,
    loading: relationLoading
  } = useSystemIntakeQuery({
    variables: { id }
  });

  console.log(
    'Cedar Relationships:',
    data?.systemIntake?.cedarSystemRelationShips as SystemIntakeSystem[]
  );

  const { watch, handleSubmit } = useForm<EditLinkedSystemsFormType>({
    defaultValues: {
      relationType: null,
      cedarSystemIDs: [],
      contractNumbers: '',
      contractName: ''
    }
    // values: (values => {
    //   if (!values) return undefined;

    //   // Condition for prefilling existing systems on new requests
    //   //   if (values.relationType === null && linkCedarSystemId) {
    //   //     return {
    //   //       relationType: RequestRelationType.EXISTING_SYSTEM,
    //   //       cedarSystemIDs: [linkCedarSystemId],
    //   //       contractNumbers: '',
    //   //       contractName: ''
    //   //     };
    //   //   }

    //   //   return {
    //   //     relationType: values.relationType || null,
    //   //     cedarSystemIDs: values.systems.map(v => v.id),
    //   //     contractNumbers: formatContractNumbers(values.contractNumbers),
    //   //     contractName: values.contractName || ''
    //   //   };
    // })(
    //   requestType === 'trb'
    //     ? data && 'trbRequest' in data && data.trbRequest
    //     : data && 'systemIntake' in data && data.systemIntake
    // )
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
    console.log(formData);
  });

  const unlink = () => {
    console.log('unlink');
  };

  // Error feedback
  const hasErrors = false;
  // relationError ||
  // newIntakeSystemError ||
  // newTRBSystemError ||
  // existingTRBServiceError ||
  // existingIntakeServiceError ||
  // unlinkTRBRelationError ||
  // unlinkIntakeRelationError ||
  // existingTRBSystemError ||
  // existingIntakeSystemError ||
  // hasUserError;

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

      {relationLoading && <PageLoading />}
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
          {t(`'itGov':link.description`)}
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
                    {t(`itGov:link.form.field.systemOrService.label`)}
                  </h4>
                }
              >
                <p className="text-base margin-top-1 margin-bottom-3">
                  {t(`itGov:link.form.field.systemOrService.hint`)}
                </p>
                <ul className="text-base">
                  <li>
                    {t(
                      'link.form.field.systemOrService.reasonsToAddSystem.primarySupport'
                    )}
                  </li>
                  <li>
                    {t(
                      'link.form.field.systemOrService.reasonsToAddSystem.partialSupport'
                    )}
                  </li>
                  <li>
                    {t(
                      'link.form.field.systemOrService.reasonsToAddSystem.usesOrImpactedBySelectedSystem'
                    )}
                  </li>
                  <li>
                    {t(
                      'link.form.field.systemOrService.reasonsToAddSystem.impactsSelectedSystem'
                    )}
                  </li>
                  <li>
                    {t(
                      'link.form.field.systemOrService.reasonsToAddSystem.other'
                    )}
                  </li>
                </ul>
              </Fieldset>
              <Button type="button" outline>
                {t('link.form.addASystem')}
              </Button>
              <CheckboxField
                label={t('link.form.doesNotSupportOrUseAnySystems')}
                id={'innerProps.id'!}
                name="datavalue"
                checked={false}
                onChange={() => null}
                onBlur={() => null}
                value="false"
              />
            </Grid>
          </Grid>

          <LinkedSystemTable
            systems={
              data?.systemIntake
                ?.cedarSystemRelationShips as SystemIntakeSystem[]
            }
            defaultPageSize={20}
            isHomePage={false}
          />

          <ButtonGroup>
            <Button type="button" outline>
              {t('link.form.back')}
            </Button>
            <Button
              type="submit"
              disabled={!submitEnabled}
              onClick={() => submit()}
            >
              {t(`'itGov':link.form.continueTaskList`)}
            </Button>
          </ButtonGroup>

          <IconButton
            icon={<Icon.ArrowBack className="margin-right-05" aria-hidden />}
            type="button"
            unstyled
            onClick={() => {
              history.goBack();
            }}
          >
            {t('link.form.dontEditAndReturn')}
          </IconButton>

          <Modal
            isOpen={isSkipModalOpen}
            closeModal={() => setSkipModalOpen(false)}
          >
            <h2 className="usa-modal__heading margin-bottom-2">
              {t('link.skipConfirm.heading')}
            </h2>
            <p className="margin-y-0">{t('link.skipConfirm.text')}</p>
            <ul className="easi-list margin-top-0">
              <li>{t(`itGov:link.skipConfirm.list.0`)}</li>
              <li>{t('link.skipConfirm.list.1')}</li>
            </ul>
            <ButtonGroup className="margin-top-3">
              <Button type="button" onClick={() => history.push(redirectUrl)}>
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

          <Modal
            isOpen={isUnlinkModalOpen}
            closeModal={() => setUnlinkModalOpen(false)}
          >
            <h2 className="usa-modal__heading margin-bottom-2">
              {t('link.unlinkConfirm.heading')}
            </h2>
            <p className="margin-top-0">{t('link.unlinkConfirm.text.0')}</p>
            <p className="margin-bottom-0">{t('link.unlinkConfirm.text.1')}</p>
            <ul className="easi-list margin-top-0">
              <li>{t(`itGov:link.skipConfirm.list.0`)}</li>
              <li>{t('link.skipConfirm.list.1')}</li>
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
    </MainContent>
  );
};

export default EditLinkedSystemsForm;
