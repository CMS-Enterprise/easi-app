import React, { useState } from 'react';
// import { useForm } from 'react-hook-form';
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
  Icon,
  ModalHeading
} from '@trussworks/react-uswds';
import {
  SystemIntakeSystem,
  useDeleteSystemLinkMutation,
  useGetSystemIntakeSystemsQuery,
  useUnlinkSystemIntakeRelationMutation
} from 'gql/generated/graphql';

import Alert from 'components/Alert';
import CheckboxField from 'components/CheckboxField';
import IconButton from 'components/IconButton';
import MainContent from 'components/MainContent';
import Modal from 'components/Modal';
import PageHeading from 'components/PageHeading';
import PageLoading from 'components/PageLoading';
import RequiredAsterisk from 'components/RequiredAsterisk';

import LinkedSystemTable from './LinkedSystemsTable';

// type EditLinkedSystemsFormType = {
//   relationType: RequestRelationType | null;
//   cedarSystemIDs: string[];
//   contractNumbers: string;
//   contractName: string;
// };

const LinkedSystems = ({ fromAdmin }: { fromAdmin?: boolean }) => {
  // Id refers to system intake
  const { id } = useParams<{
    id: string;
  }>();

  console.log('system intake id:', id);

  const history = useHistory();

  const { t } = useTranslation([
    'linkedSystems',
    'itGov',
    'intake',
    'technicalAssistance',
    'action',
    'error'
  ]);

  const location = useLocation<{
    successfullyUpdated?: boolean;
    systemUpdated?: string;
    successfullyAdded?: boolean;
  }>();

  const showSuccessfullyUpdated = location.state?.successfullyUpdated;
  const showSuccessfullyAdded = location.state?.successfullyAdded;

  console.log('STATE:', location.state);

  const systemUpdatedName = location.state?.systemUpdated;

  // Url of next view after successful form submit
  // Also for a breadcrumb navigation link
  const redirectUrl = (() => {
    if (fromAdmin) {
      return `/it-governance/${id}/additional-information`;
    }
    return `/governance-task-list/${id}`;
  })();

  const addASystemUrl = `/linked-systems-form/${id}`;

  const [noSystemsUsed, setNoSystemsUsed] = useState<boolean>(false);
  const [systemToBeRemoved, setSystemToBeRemoved] = useState<string>();

  const [showSuccessfullyDeleted, setShowSuccessfullyDeleted] =
    useState<boolean>(false);

  const [showRemoveLinkedSystemError, setShowRemoveLinkedSystemError] =
    useState<boolean>(false);

  const {
    data,
    error: systemIntakeError,
    loading: relationLoading,
    refetch: refetchSystemIntakes
  } = useGetSystemIntakeSystemsQuery({
    variables: { systemIntakeId: id }
  });

  console.log('data', data, systemIntakeError);

  const [deleteSystemLink, { data: deleteSystemLinkResponse }] =
    useDeleteSystemLinkMutation();

  const [unlinkAllSystems, { data: unlinkSystemResponse }] =
    useUnlinkSystemIntakeRelationMutation();

  console.log(unlinkSystemResponse);

  const submitEnabled: boolean = (() => {
    // if there are relationships added or the checkbox is filled
    if (
      data &&
      data?.systemIntakeSystems &&
      data?.systemIntakeSystems?.length > 0
    ) {
      return true;
    }
    if (noSystemsUsed) {
      return true;
    }

    return false;
  })();

  const [removeLinkedSystemModalOpen, setRemoveLinkedSystemModalOpen] =
    useState(false);

  const [removeAllLinkedSystemsModalOpen, setRemoveAllLinkedSystemModalOpen] =
    useState(false);

  const handleRemoveModal = (systemLinkedSystemId: string) => {
    setSystemToBeRemoved(systemLinkedSystemId);
    setRemoveLinkedSystemModalOpen(true);
  };

  const handleNoSystemsUsedCheckbox = () => {
    if (!noSystemsUsed) {
      if (data && data?.systemIntakeSystems.length > 0) {
        setRemoveAllLinkedSystemModalOpen(true);
      }
      setNoSystemsUsed(true);
      return;
    }

    setNoSystemsUsed(false);
  };

  const handleRemoveLink = async () => {
    console.log('remove this systemid!', systemToBeRemoved);

    if (!systemToBeRemoved) {
      return;
    }

    try {
      const response = await deleteSystemLink({
        variables: { systemIntakeSystemID: systemToBeRemoved }
        // variables: { systemIntakeSystemID: 'asd' }
      });

      console.log('response.data', response.data);
      console.log('deleteSystemLinkResponse', deleteSystemLinkResponse);
      refetchSystemIntakes();
      setShowSuccessfullyDeleted(true);
      setRemoveLinkedSystemModalOpen(false);
    } catch (error) {
      console.error('Error: Unable to remove linked system.', error);
      console.error('error:', deleteSystemLinkResponse);
      setShowRemoveLinkedSystemError(true);
    }
  };

  const handleCloseRemoveLinkedSystemModal = () => {
    setShowRemoveLinkedSystemError(false);
    setRemoveLinkedSystemModalOpen(false);
  };

  const handleCloseRemoveAllLinkedSystemModal = () => {
    console.log('close this modal');
    // setShowRemoveLinkedSystemError(false); todo fix this
    setRemoveAllLinkedSystemModalOpen(false);
  };

  const handleRemoveAllSystemLinks = async () => {
    console.log('handle no systems used checkbox?!', data?.systemIntakeSystems);
    if (data && data?.systemIntakeSystems.length > 0) {
      try {
        const response = await unlinkAllSystems({
          variables: { intakeID: id }
        });
        console.log('unlink response', response);
        if (
          response &&
          response.data &&
          response.data.unlinkSystemIntakeRelation
        ) {
          refetchSystemIntakes();
          setNoSystemsUsed(true);
        }
        setRemoveAllLinkedSystemModalOpen(false);
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <MainContent className="grid-container margin-bottom-15">
      {relationLoading && <PageLoading />}
      <>
        <BreadcrumbBar variant="wrap">
          <Breadcrumb>
            <BreadcrumbLink asCustom={Link} to="/">
              <span>{t('intake:navigation.itGovernance')}</span>
            </BreadcrumbLink>
          </Breadcrumb>
        </BreadcrumbBar>

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
          {t('itGov:link.header')}
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
                      'itGov:link.form.field.systemOrService.reasonsToAddSystem.primarySupport'
                    )}
                  </li>
                  <li>
                    {t(
                      'itGov:link.form.field.systemOrService.reasonsToAddSystem.partialSupport'
                    )}
                  </li>
                  <li>
                    {t(
                      'itGov:link.form.field.systemOrService.reasonsToAddSystem.usesOrImpactedBySelectedSystem'
                    )}
                  </li>
                  <li>
                    {t(
                      'itGov:link.form.field.systemOrService.reasonsToAddSystem.impactsSelectedSystem'
                    )}
                  </li>
                  <li>
                    {t(
                      'itGov:link.form.field.systemOrService.reasonsToAddSystem.other'
                    )}
                  </li>
                </ul>
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
                id={'innerProps.id'!}
                name="datavalue"
                value="systemsUsed"
                checked={noSystemsUsed}
                onChange={e => handleNoSystemsUsedCheckbox()}
                onBlur={() => null}
              />
            </Grid>
          </Grid>

          <LinkedSystemTable
            systems={(data?.systemIntakeSystems as SystemIntakeSystem[]) || []}
            defaultPageSize={20}
            isHomePage={false}
            systemIntakeId={id}
            onRemoveLink={handleRemoveModal}
          />

          <ButtonGroup>
            <Button type="button" outline>
              {t('itGov:link.form.back')}
            </Button>
            <Button
              type="submit"
              disabled={!submitEnabled}
              onClick={() => history.push(redirectUrl)}
            >
              {t(`itGov:link.form.continueTaskList`)}
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
            {t('itGov:link.form.dontEditAndReturn')}
          </IconButton>
        </Form>
        <Modal
          isOpen={removeLinkedSystemModalOpen}
          closeModal={() => setRemoveLinkedSystemModalOpen(false)}
          className="font-body-sm height-auto"
          id="confirmDiscussionModal"
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
          <p
            className="margin-top-0 text-light font-body-md"
            data-testid="discussion-board-type"
          >
            {t('removeLinkedSystemModal.message')}
          </p>

          <ButtonGroup className="margin-top-3">
            <Button
              type="submit"
              className="bg-error margin-right-1"
              form="discussionForm"
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
          id="confirmDiscussionModal"
        >
          <ModalHeading className="margin-top-0 margin-bottom-105">
            {t('removeAllLinkedSystemModal.heading')}
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
          <p
            className="margin-top-0 text-light font-body-md"
            data-testid="discussion-board-type"
          >
            {t('removeAllLinkedSystemModal.message')}
          </p>

          <ButtonGroup className="margin-top-3">
            <Button
              type="submit"
              className="bg-error margin-right-1"
              form="discussionForm"
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
      </>
    </MainContent>
  );
};

export default LinkedSystems;
