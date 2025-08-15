import React, { useEffect, useMemo, useState } from 'react';
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
  useGetSystemIntakeSystemsQuery,
  useUnlinkSystemIntakeRelationMutation
} from 'gql/generated/graphql';

import Alert from 'components/Alert';
import Breadcrumbs from 'components/Breadcrumbs';
import CheckboxField from 'components/CheckboxField';
import IconButton from 'components/IconButton';
import MainContent from 'components/MainContent';
import Modal from 'components/Modal';
import PageHeading from 'components/PageHeading';
import PageLoading from 'components/PageLoading';
import RequiredAsterisk from 'components/RequiredAsterisk';
import { IT_GOV_EMAIL } from 'constants/externalUrls';

import LinkedSystemTable from './LinkedSystemsTable';

const LinkedSystems = ({ fromAdmin }: { fromAdmin?: boolean }) => {
  // Id refers to system intake
  const { id } = useParams<{
    id: string;
  }>();

  const history = useHistory();

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

  const showSuccessfullyUpdated = state?.successfullyUpdated;
  const showSuccessfullyAdded = state?.successfullyAdded;
  const isFromTaskList = state?.from === 'task-list';
  const systemUpdatedName = state?.systemUpdated;

  // Url of next view after successful form submit
  // Also for a breadcrumb navigation link
  const redirectUrl = `/governance-task-list/${id}`;

  const addASystemUrl = `/linked-systems-form/${id}`;

  const {
    data,
    loading: relationLoading,
    refetch: refetchSystemIntakes
  } = useGetSystemIntakeSystemsQuery({
    variables: { systemIntakeId: id }
  });

  const [noSystemsUsed, setNoSystemsUsed] = useState<boolean>(false);

  const [systemToBeRemoved, setSystemToBeRemoved] = useState<string>();

  const [showSuccessfullyDeleted, setShowSuccessfullyDeleted] =
    useState<boolean>(false);

  const [showRemoveLinkedSystemError, setShowRemoveLinkedSystemError] =
    useState<boolean>(false);

  const [showRemoveAllLinkedSystemError, setShowRemoveAllLinkedSystemError] =
    useState<boolean>(false);

  const [deleteSystemLink] = useDeleteSystemLinkMutation();

  const [unlinkAllSystems] = useUnlinkSystemIntakeRelationMutation();

  const submitEnabled = useMemo(() => {
    return (data?.systemIntakeSystems?.length ?? 0) > 0 || noSystemsUsed;
  }, [data, noSystemsUsed]);

  const [removeLinkedSystemModalOpen, setRemoveLinkedSystemModalOpen] =
    useState(false);

  const [removeAllLinkedSystemsModalOpen, setRemoveAllLinkedSystemModalOpen] =
    useState(false);

  useEffect(() => {
    if (location && location.state && state?.isNew) {
      setNoSystemsUsed(false);
      return;
    }
    if (data && !relationLoading && state?.from === 'task-list') {
      setNoSystemsUsed(data.systemIntakeSystems.length === 0);
    }
  }, [data, location, relationLoading, state]);

  const handleRemoveModal = (systemLinkedSystemId: string) => {
    setSystemToBeRemoved(systemLinkedSystemId);
    setRemoveLinkedSystemModalOpen(true);
  };

  const handleNoSystemsUsedCheckbox = () => {
    if (!noSystemsUsed) {
      if (data && data?.systemIntakeSystems.length > 0) {
        setRemoveAllLinkedSystemModalOpen(true);
        return;
      }
      setNoSystemsUsed(true);
      return;
    }

    setNoSystemsUsed(false);
  };

  const handleRemoveLink = async () => {
    if (!systemToBeRemoved) {
      return;
    }

    try {
      const response = await deleteSystemLink({
        variables: { systemIntakeSystemID: systemToBeRemoved }
      });

      if (response && response.data) {
        refetchSystemIntakes();
        setShowSuccessfullyDeleted(true);
        setRemoveLinkedSystemModalOpen(false);
      }
    } catch (error) {
      setShowRemoveLinkedSystemError(true);
    }
  };

  const handleCloseRemoveLinkedSystemModal = () => {
    setShowRemoveLinkedSystemError(false);
    setRemoveLinkedSystemModalOpen(false);
  };

  const handleCloseRemoveAllLinkedSystemModal = () => {
    setShowRemoveAllLinkedSystemError(false);
    setRemoveAllLinkedSystemModalOpen(false);
  };

  const handleRemoveAllSystemLinks = async () => {
    if (data && data?.systemIntakeSystems.length > 0) {
      try {
        const response = await unlinkAllSystems({
          variables: { intakeID: id }
        });
        if (
          response &&
          response.data &&
          response.data.unlinkSystemIntakeRelation
        ) {
          refetchSystemIntakes();
          setNoSystemsUsed(true);
          setRemoveAllLinkedSystemModalOpen(false);
        }
      } catch (error) {
        setShowRemoveAllLinkedSystemError(true);
      }
    }
  };

  if (relationLoading) {
    return <PageLoading />;
  }

  return (
    <MainContent className="grid-container margin-bottom-15">
      <Breadcrumbs
        items={[
          { text: t('intake:navigation.itGovernance'), url: '/' },
          ...(isFromTaskList
            ? [
                {
                  text: t('itGov:additionalRequestInfo.taskListBreadCrumb'),
                  url: `/governance-task-list/${id}`
                },
                { text: t('intake:navigation.editLinkRelation') }
              ]
            : [
                {
                  text: t('intake:navigation.startRequest')
                }
              ])
        ]}
      />

      {showSuccessfullyUpdated && (
        <Alert
          id="link-form-error"
          type="success"
          slim
          className="margin-top-2"
        >
          <Trans
            i18nKey="linkedSystems:savedChangesToALink"
            values={{ updatedSystem: systemUpdatedName }}
            components={{
              span: <span className="text-bold" />
            }}
          />
        </Alert>
      )}

      {showSuccessfullyAdded && (
        <Alert
          id="link-form-error"
          type="success"
          slim
          className="margin-top-2"
        >
          <Trans
            i18nKey="linkedSystems:successfullyLinked"
            values={{ updatedSystem: systemUpdatedName }}
            components={{
              span: <span className="text-bold" />
            }}
          />
        </Alert>
      )}

      {showSuccessfullyDeleted && (
        <Alert
          id="link-form-error"
          type="success"
          slim
          className="margin-top-2"
        >
          <Trans i18nKey="linkedSystems:successfullyDeleted" />
        </Alert>
      )}

      <PageHeading className="margin-top-4 margin-bottom-0">
        {isFromTaskList ? t('itGov:link.editHeader') : t('itGov:link.header')}
      </PageHeading>
      <p className="font-body-lg line-height-body-5 text-light margin-y-0">
        {t(`itGov:link.description`)}
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
              onClick={() => history.push(addASystemUrl)}
            >
              {t('itGov:link.form.addASystem')}
            </Button>
            <CheckboxField
              label={t('itGov:link.form.doesNotSupportOrUseAnySystems')}
              id="systemsUsed"
              name="datavalue"
              value="systemsUsed"
              checked={noSystemsUsed}
              onChange={e => handleNoSystemsUsedCheckbox()}
              onBlur={() => null}
            />
            <LinkedSystemTable
              systems={
                (data?.systemIntakeSystems as SystemIntakeSystem[]) || []
              }
              defaultPageSize={20}
              isHomePage={false}
              systemIntakeId={id}
              onRemoveLink={handleRemoveModal}
            />
          </Grid>
        </Grid>

        <ButtonGroup>
          <Button
            type="button"
            outline
            onClick={() => {
              history.goBack();
            }}
          >
            {t('itGov:link.form.back')}
          </Button>
          <Button
            type="submit"
            disabled={!submitEnabled}
            onClick={() =>
              history.push(redirectUrl, {
                requestType: state?.requestType
              })
            }
          >
            {isFromTaskList
              ? t(`itGov:link.form.saveChanges`)
              : t(`itGov:link.form.continueTaskList`)}
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
          {isFromTaskList
            ? t('itGov:link.form.dontEditAndReturn')
            : t('itGov:link.cancelAndExit')}
        </IconButton>
      </Form>
      <Modal
        isOpen={removeLinkedSystemModalOpen}
        closeModal={() => setRemoveLinkedSystemModalOpen(false)}
        className="font-body-sm height-auto"
        id="removeLinkedSystemModal"
      >
        <ModalHeading className="margin-top-0 margin-bottom-105">
          {t('removeLinkedSystemModal.heading')}
        </ModalHeading>
        {showRemoveLinkedSystemError && (
          <Alert
            id="link-form-error"
            type="error"
            slim
            className="margin-top-2"
          >
            <Trans i18nKey="linkedSystems:unableToRemoveLinkedSystem" />
          </Alert>
        )}
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

      <Modal
        isOpen={removeAllLinkedSystemsModalOpen}
        closeModal={() => setRemoveAllLinkedSystemModalOpen(false)}
        className="font-body-sm height-auto"
        id="removeAllLinkedSystemsModal"
      >
        <ModalHeading className="margin-top-0 margin-bottom-105">
          {t('removeAllLinkedSystemModal.heading')}
        </ModalHeading>
        {showRemoveAllLinkedSystemError && (
          <Alert
            id="link-form-error"
            type="error"
            slim
            className="margin-top-2"
          >
            <Trans i18nKey="linkedSystems:unableToRemoveAllLinkedSystem" />
          </Alert>
        )}
        <p className="margin-top-0 text-light font-body-md">
          {t('removeAllLinkedSystemModal.message')}
        </p>

        <ButtonGroup className="margin-top-3">
          <Button
            type="submit"
            className="bg-error margin-right-1"
            onClick={() => handleRemoveAllSystemLinks()}
          >
            {t('removeAllLinkedSystemModal.remove')}
          </Button>
          <Button
            type="button"
            unstyled
            onClick={() => handleCloseRemoveAllLinkedSystemModal()}
          >
            {t('removeAllLinkedSystemModal.dontRemove')}
          </Button>
        </ButtonGroup>
      </Modal>
    </MainContent>
  );
};

export default LinkedSystems;
