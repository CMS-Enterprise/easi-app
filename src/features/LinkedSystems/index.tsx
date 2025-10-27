import React, { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import {
  Button,
  ButtonGroup,
  Fieldset,
  Form,
  Grid,
  Icon,
  Link,
  ModalHeading
} from '@trussworks/react-uswds';
import {
  SystemIntakeSystem,
  useDeleteSystemLinkMutation,
  useGetSystemIntakeQuery,
  useGetSystemIntakeSystemsQuery,
  useUnlinkSystemIntakeRelationMutation
} from 'gql/generated/graphql';
import { useErrorMessage } from 'wrappers/ErrorContext';

import Breadcrumbs from 'components/Breadcrumbs';
import CheckboxField from 'components/CheckboxField';
import IconButton from 'components/IconButton';
import MainContent from 'components/MainContent';
import Modal from 'components/Modal';
import PageHeading from 'components/PageHeading';
import PageLoading from 'components/PageLoading';
import RequiredAsterisk from 'components/RequiredAsterisk';
import toastSuccess from 'components/ToastSuccess';
import { IT_GOV_EMAIL } from 'constants/externalUrls';
import useMessage from 'hooks/useMessage';

import LinkedSystemsTable from './LinkedSystemsTable';

const LinkedSystems = () => {
  // Id refers to system intake
  const { id } = useParams<{ id: string }>();

  const history = useHistory();
  const { Message } = useMessage();

  const { t } = useTranslation([
    'linkedSystems',
    'itGov',
    'intake',
    'technicalAssistance',
    'action',
    'error'
  ]);

  type LinkedSystemsLocationState = {
    successfullyUpdated?: boolean;
    systemUpdated?: string;
    successfullyAdded?: boolean;
    requestType?: string;
    isNew?: string;
    from?: string;
  };

  const location = useLocation();
  const state = location.state as LinkedSystemsLocationState | undefined;

  const isFromTaskList = state?.from === 'task-list';
  const isFromAdmin = state?.from === 'admin';

  // Urls
  const redirectUrl = `/governance-task-list/${id}`;
  const adminUrl = `/it-governance/${id}/system-information`;
  const addASystemUrl = `/linked-systems-form/${id}`;

  // Queries
  const {
    data,
    loading: relationLoading,
    refetch: refetchSystemIntakes
  } = useGetSystemIntakeSystemsQuery({
    variables: { systemIntakeId: id }
  });

  const { data: systemData, refetch: refetchIntake } = useGetSystemIntakeQuery({
    variables: { id }
  });

  // Derived source of truth
  const noSystemsUsed = !!systemData?.systemIntake?.doesNotSupportSystems;

  // Local UI state
  const [systemToBeRemoved, setSystemToBeRemoved] = useState<string>();
  const [removeLinkedSystemModalOpen, setRemoveLinkedSystemModalOpen] =
    useState(false);
  const [removeAllLinkedSystemsModalOpen, setRemoveAllLinkedSystemsModalOpen] =
    useState(false);

  // Mutations
  const [deleteSystemLink] = useDeleteSystemLinkMutation();
  const [unlinkAllSystems] = useUnlinkSystemIntakeRelationMutation();

  const { setErrorMeta } = useErrorMessage();

  const handleRemoveModal = (systemLinkedSystemId: string) => {
    setSystemToBeRemoved(systemLinkedSystemId);
    setRemoveLinkedSystemModalOpen(true);
  };

  // Toggle checkbox: persist via unlink mutation (also sets the flag)
  const handleNoSystemsUsedCheckbox = async () => {
    const hasSystems = (data?.systemIntakeSystems?.length ?? 0) > 0;

    // Turning on while systems exist -> prompt first
    if (!noSystemsUsed && hasSystems) {
      setRemoveAllLinkedSystemsModalOpen(true);
      return;
    }

    setErrorMeta({
      overrideMessage: (
        <Trans i18nKey="linkedSystems:unableToRemoveAllLinkedSystems" />
      )
    });

    // Otherwise directly flip the flag
    await unlinkAllSystems({
      variables: { intakeID: id, doesNotSupportSystems: !noSystemsUsed }
    });
    await Promise.all([refetchIntake(), refetchSystemIntakes()]);
  };

  const handleRemoveLink = async () => {
    if (!systemToBeRemoved) return;

    setErrorMeta({
      overrideMessage: (
        <Trans i18nKey="linkedSystems:unableToRemoveLinkedSystem" />
      )
    });

    const response = await deleteSystemLink({
      variables: { systemIntakeSystemID: systemToBeRemoved }
    });

    if (response?.data) {
      await refetchSystemIntakes();
      toastSuccess(t('linkedSystems:successfullyDeleted'));
      setRemoveLinkedSystemModalOpen(false);
    }
  };

  const handleCloseRemoveLinkedSystemModal = () => {
    setRemoveLinkedSystemModalOpen(false);
  };

  const handleCloseRemoveAllLinkedSystemModal = () => {
    setRemoveAllLinkedSystemsModalOpen(false);
  };

  // Confirm remove-all: unlink all and set flag true in one mutation
  const handleRemoveAllSystemLinks = async () => {
    setErrorMeta({
      overrideMessage: (
        <Trans i18nKey="linkedSystems:unableToRemoveAllLinkedSystems" />
      )
    });

    await unlinkAllSystems({
      variables: { intakeID: id, doesNotSupportSystems: true }
    });

    await Promise.all([refetchSystemIntakes(), refetchIntake()]);
    toastSuccess(t('linkedSystems:successfullyRemovedAllLinkedSystems'));
    setRemoveAllLinkedSystemsModalOpen(false);
  };

  if (relationLoading) {
    return <PageLoading />;
  }

  type BreadcrumbType = {
    text: string;
    url?: string; // optional now
  };

  const breadcrumbs: BreadcrumbType[] = [
    { text: t('intake:navigation.itGovernance'), url: '/' }
  ];

  if (isFromTaskList) {
    breadcrumbs.push({
      text: t('itGov:additionalRequestInfo.taskListBreadCrumb'),
      url: `/governance-task-list/${id}`
    });
  }

  if (isFromAdmin) {
    breadcrumbs.push({
      text: t('itGov:additionalRequestInfo.itGovBreadcrumb'),
      url: `/it-governance/${id}/system-information`
    });
  }

  if (isFromTaskList || isFromAdmin) {
    breadcrumbs.push({ text: t('intake:navigation.editLinkRelation') });
  } else {
    breadcrumbs.push({ text: t('intake:navigation.startRequest') });
  }

  return (
    <MainContent className="grid-container margin-bottom-15">
      <Breadcrumbs items={breadcrumbs} />

      <Message />

      <PageHeading className="margin-top-4 margin-bottom-0">
        {isFromTaskList || isFromAdmin
          ? t('itGov:link.editHeader')
          : t('itGov:link.header')}
      </PageHeading>
      <p className="font-body-lg line-height-body-5 text-light margin-y-0">
        {isFromAdmin
          ? t(`itGov:link.adminDescription`)
          : t(`itGov:link.description`)}
      </p>
      <p className="margin-top-2 margin-bottom-5 text-base">
        <Trans
          i18nKey="action:fieldsMarkedRequired"
          components={{ asterisk: <RequiredAsterisk /> }}
        />
      </p>

      <Form className="easi-form maxw-full" onSubmit={e => e.preventDefault()}>
        <Grid row>
          <Grid tablet={{ col: 12 }} desktop={{ col: 9 }}>
            <Fieldset
              legend={
                <h4 className="margin-top-0 margin-bottom-05 line-height-heading-2">
                  {t(`itGov:link.form.field.systemOrService.label`)}
                </h4>
              }
            >
              <p className="text-base margin-y-0">
                {t(`itGov:link.form.field.systemOrService.hint`)}
              </p>
              <ul className="text-base margin-top-05 margin-bottom-3 padding-left-3">
                {(
                  t(
                    'itGov:link.form.field.systemOrService.reasonsToAddSystem',
                    {
                      returnObjects: true
                    }
                  ) as string[]
                ).map(item => {
                  return <li key={item}>{item}</li>;
                })}
              </ul>
              <p className="text-base margin-y-0">
                <Trans
                  i18nKey="itGov:link.form.field.systemOrService.needHelp"
                  values={{ email: IT_GOV_EMAIL }}
                  components={{
                    emailLink: <Link href={`mailto:${IT_GOV_EMAIL}`}> </Link>
                  }}
                />
              </p>
            </Fieldset>

            <Button
              type="button"
              outline
              onClick={() => {
                let navigationData;
                if (isFromTaskList) {
                  navigationData = { from: 'task-list' };
                } else if (isFromAdmin) {
                  navigationData = { from: 'admin' };
                }

                history.push(addASystemUrl, navigationData);
              }}
              disabled={noSystemsUsed}
            >
              {t('itGov:link.form.addASystem')}
            </Button>

            <CheckboxField
              label={t('itGov:link.form.doesNotSupportOrUseAnySystems')}
              id="systemsUsed"
              name="datavalue"
              value="systemsUsed"
              checked={noSystemsUsed}
              onChange={handleNoSystemsUsedCheckbox}
              onBlur={() => null}
            />

            <LinkedSystemsTable
              systems={
                (data?.systemIntakeSystems as SystemIntakeSystem[]) || []
              }
              defaultPageSize={20}
              isHomePage={false}
              systemIntakeId={id}
              onRemoveLink={handleRemoveModal}
              isFromTaskList={isFromTaskList}
              noSystemsUsed={noSystemsUsed}
              isFromAdmin={isFromAdmin}
            />
          </Grid>
        </Grid>

        {(isFromAdmin || isFromTaskList) && (
          <ButtonGroup>
            <Button
              type="submit"
              disabled={
                (data?.systemIntakeSystems?.length === 0) !==
                Boolean(noSystemsUsed)
              }
              onClick={() => {
                if (isFromAdmin) {
                  history.push(adminUrl);
                } else {
                  history.push(redirectUrl, {
                    requestType: state?.requestType
                  });
                }
              }}
            >
              {isFromTaskList
                ? t('taskList:navigation.returnToTaskList')
                : t('linkedSystems:returnToRequestDetails')}
            </Button>
          </ButtonGroup>
        )}

        {!isFromAdmin && !isFromTaskList && (
          <>
            <ButtonGroup>
              <Button type="button" outline onClick={() => history.goBack()}>
                {t('itGov:link.form.back')}
              </Button>
              <Button
                type="submit"
                disabled={
                  (data?.systemIntakeSystems?.length === 0) !==
                  Boolean(noSystemsUsed)
                }
                onClick={() => {
                  if (isFromAdmin) {
                    history.push(adminUrl);
                  } else {
                    history.push(redirectUrl, {
                      requestType: state?.requestType
                    });
                  }
                }}
              >
                {t('itGov:link.form.continueTaskList')}
              </Button>
            </ButtonGroup>

            <IconButton
              icon={<Icon.ArrowBack className="margin-right-05" aria-hidden />}
              type="button"
              unstyled
              onClick={() => history.goBack()}
            >
              {isFromTaskList &&
                !isFromAdmin &&
                t('itGov:link.form.dontEditAndReturn')}

              {!isFromTaskList &&
                isFromAdmin &&
                t('dontEditAndReturnRequestDetails')}

              {!isFromTaskList && !isFromAdmin && t('itGov:link.cancelAndExit')}
            </IconButton>
          </>
        )}
      </Form>

      {/* Remove single link */}
      <Modal
        isOpen={removeLinkedSystemModalOpen}
        closeModal={() => setRemoveLinkedSystemModalOpen(false)}
        className="font-body-sm height-auto"
        id="removeLinkedSystemModal"
      >
        <ModalHeading className="margin-top-0 margin-bottom-105">
          {t('removeLinkedSystemModal.heading')}
        </ModalHeading>
        <p className="margin-top-0 text-light font-body-md">
          {t('removeLinkedSystemModal.message')}
        </p>

        <ButtonGroup className="margin-top-3">
          <Button
            type="submit"
            className="bg-error margin-right-1"
            onClick={() => handleRemoveLink()}
          >
            {t('removeLinkedSystemModal.remove')}
          </Button>
          <Button
            type="button"
            unstyled
            onClick={() => handleCloseRemoveLinkedSystemModal()}
          >
            {t('removeLinkedSystemModal.dontRemove')}
          </Button>
        </ButtonGroup>
      </Modal>

      {/* Remove all + set flag true */}
      <Modal
        isOpen={removeAllLinkedSystemsModalOpen}
        closeModal={() => setRemoveAllLinkedSystemsModalOpen(false)}
        className="font-body-sm height-auto"
        id="removeAllLinkedSystemsModal"
      >
        <ModalHeading className="margin-top-0 margin-bottom-105">
          {t('removeAllLinkedSystemsModal.heading')}
        </ModalHeading>
        <p className="margin-top-0 text-light font-body-md">
          {t('removeAllLinkedSystemsModal.message')}
        </p>

        <ButtonGroup className="margin-top-3">
          <Button
            type="submit"
            className="bg-error margin-right-1"
            onClick={() => handleRemoveAllSystemLinks()}
          >
            {t('removeAllLinkedSystemsModal.remove')}
          </Button>
          <Button
            type="button"
            unstyled
            onClick={() => handleCloseRemoveAllLinkedSystemModal()}
          >
            {t('removeAllLinkedSystemsModal.dontRemove')}
          </Button>
        </ButtonGroup>
      </Modal>
    </MainContent>
  );
};

export default LinkedSystems;
