import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import { ErrorMessage } from '@hookform/error-message';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Button,
  Dropdown,
  Form,
  FormGroup,
  Grid,
  IconArrowBack
} from '@trussworks/react-uswds';
import {
  GetSystemIntakeGRBReviewersDocument,
  SystemIntakeGRBReviewerFragment,
  SystemIntakeGRBReviewerRole,
  SystemIntakeGRBReviewerVotingRole,
  useCreateSystemIntakeGRBReviewersMutation,
  useUpdateSystemIntakeGRBReviewerMutation
} from 'gql/gen/graphql';
import { toLower } from 'lodash';

import CedarContactSelect from 'components/CedarContactSelect';
import { EasiFormProvider, useEasiForm } from 'components/EasiForm';
import Alert from 'components/shared/Alert';
import CollapsableLink from 'components/shared/CollapsableLink';
import FieldErrorMsg from 'components/shared/FieldErrorMsg';
import HelpText from 'components/shared/HelpText';
import IconLink from 'components/shared/IconLink';
import Label from 'components/shared/Label';
import RequiredAsterisk from 'components/shared/RequiredAsterisk';
import { TabPanel, Tabs } from 'components/Tabs';
import { grbReviewerRoles, grbReviewerVotingRoles } from 'constants/grbRoles';
import useMessage from 'hooks/useMessage';
import CreateGRBReviewerSchema from 'validations/grbReviewerSchema';
import Pager from 'views/TechnicalAssistance/RequestForm/Pager';

import BulkAddGRBReviewersForm from './BulkAddGRBReviewersForm';

type GRBReviewerFormFields = {
  userAccount: {
    username: string;
    commonName: string;
    email: string;
  };
  votingRole: SystemIntakeGRBReviewerVotingRole;
  grbRole: SystemIntakeGRBReviewerRole;
};

type GRBReviewerFormProps = {
  grbReviewers: SystemIntakeGRBReviewerFragment[];
  setReviewerToRemove: (reviewer: SystemIntakeGRBReviewerFragment) => void;
  grbReviewStartedAt?: string | null;
};

/**
 * Form to add or edit a GRB reviewer
 */
const GRBReviewerForm = ({
  grbReviewers,
  setReviewerToRemove,
  grbReviewStartedAt
}: GRBReviewerFormProps) => {
  const { t } = useTranslation('grbReview');

  const { showMessageOnNextPage } = useMessage();

  const history = useHistory();

  const {
    /** Active reviewer when editing */
    state: activeReviewer
  } = useLocation<SystemIntakeGRBReviewerFragment | undefined>();

  const { systemId, action } = useParams<{
    systemId: string;
    action: 'add' | 'edit';
  }>();

  const [createGRBReviewers] = useCreateSystemIntakeGRBReviewersMutation({
    refetchQueries: [
      {
        query: GetSystemIntakeGRBReviewersDocument,
        variables: { id: systemId }
      }
    ]
  });

  const [updateGRBReviewer] = useUpdateSystemIntakeGRBReviewerMutation({
    refetchQueries: [
      {
        query: GetSystemIntakeGRBReviewersDocument,
        variables: { id: systemId }
      }
    ]
  });

  const form = useEasiForm<GRBReviewerFormFields>({
    resolver: yupResolver(CreateGRBReviewerSchema(grbReviewers)),
    context: { action },
    defaultValues: {
      votingRole: activeReviewer?.votingRole,
      grbRole: activeReviewer?.grbRole,
      userAccount: {
        commonName: activeReviewer?.userAccount?.commonName,
        username: activeReviewer?.userAccount?.username,
        email: activeReviewer?.userAccount?.email
      }
    }
  });

  const {
    handleSubmit,
    register,
    watch,
    setValue,
    setError,
    formState: { errors, isDirty, isSubmitted }
  } = form;

  const grbReviewPath = `/it-governance/${systemId}/grb-review`;

  const submit = handleSubmit(({ userAccount, ...values }) => {
    if (!isDirty) return history.push(grbReviewPath);

    const mutate = () =>
      activeReviewer
        ? updateGRBReviewer({
            variables: { input: { ...values, reviewerID: activeReviewer.id } }
          })
        : createGRBReviewers({
            variables: {
              input: {
                systemIntakeID: systemId,
                reviewers: [
                  {
                    ...values,
                    euaUserId: userAccount.username
                  }
                ]
              }
            }
          });

    return mutate()
      .then(() => {
        showMessageOnNextPage(
          <Trans
            i18nKey="grbReview:form.success"
            values={{
              commonName: userAccount.commonName,
              votingRole: toLower(t<string>(`votingRoles.${values.votingRole}`))
            }}
            tOptions={{
              context: values.votingRole
            }}
          >
            Success message
          </Trans>,
          { type: 'success' }
        );

        history.push(grbReviewPath);
      })
      .catch(() =>
        setError('root', {
          message: t('form.error')
        })
      );
  });

  return (
    <>
      <ErrorMessage
        errors={errors}
        name="root"
        as={<Alert type="error" className="margin-top-2" />}
      />

      <Grid className="padding-y-4 margin-bottom-205">
        <h1 className="margin-bottom-1">{t('form.title')}</h1>
        <p className="font-body-md line-height-body-4 text-light margin-top-05 margin-bottom-105 tablet:grid-col-8">
          {t('form.description')}
        </p>

        <p className="margin-top-1 text-base">
          <Trans
            i18nKey="action:fieldsMarkedRequired"
            components={{ asterisk: <RequiredAsterisk /> }}
          />
        </p>

        <IconLink
          icon={<IconArrowBack />}
          to={grbReviewPath}
          className="margin-top-3 margin-bottom-5"
        >
          {t('form.returnToRequest', { context: action })}
        </IconLink>

        <Form onSubmit={submit} className="maxw-none">
          <Tabs defaultActiveTab={t('form.addViaEUA')}>
            <TabPanel id="addReviewerFromEua" tabName={t('form.addViaEUA')}>
              <div className="tablet:grid-col-6 margin-bottom-4">
                <FormGroup>
                  <Label htmlFor="react-select-userAccount-input" required>
                    {t('form.grbMemberName')}
                  </Label>
                  <HelpText id="userAccountHelpText" className="margin-top-05">
                    {t('form.grbMemberNameHelpText')}
                  </HelpText>
                  <ErrorMessage
                    errors={errors}
                    name="userAccount"
                    as={<FieldErrorMsg />}
                  />
                  <CedarContactSelect
                    {...{ ...register('userAccount'), ref: null }}
                    onChange={contact =>
                      contact?.euaUserId &&
                      setValue(
                        'userAccount',
                        {
                          username: contact.euaUserId,
                          commonName: contact.commonName,
                          email: contact.email || ''
                        },
                        { shouldValidate: isSubmitted }
                      )
                    }
                    value={{
                      euaUserId: watch('userAccount.username'),
                      commonName: watch('userAccount.commonName'),
                      email: watch('userAccount.email')
                    }}
                    id="userAccount"
                    ariaDescribedBy="userAccountHelpText"
                    disabled={!!activeReviewer}
                  />
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="votingRole" required>
                    {t('form.votingRole')}
                  </Label>
                  <ErrorMessage
                    errors={errors}
                    name="votingRole"
                    as={<FieldErrorMsg />}
                  />
                  <Dropdown
                    {...register('votingRole')}
                    ref={null}
                    id="votingRole"
                  >
                    <option value="">{t('form:dropdownInitialSelect')}</option>
                    {grbReviewerVotingRoles.map(key => (
                      <option value={key} key={key}>
                        {t(`votingRoles.${key}`)}
                      </option>
                    ))}
                  </Dropdown>
                </FormGroup>
                <CollapsableLink
                  id="votingRolesInfoList"
                  label={t('form.votingRolesInfo.label')}
                  className="margin-top-2"
                >
                  <dl className="margin-y-neg-1 padding-left-2">
                    {t<string[]>('form.votingRolesInfo.items', {
                      returnObjects: true
                    }).map(item => (
                      <div key={item} className="display-list-item margin-y-1">
                        <Trans
                          defaults={item}
                          components={{
                            dt: <dt className="text-bold display-inline" />,
                            dd: <dd className="margin-0 display-inline" />
                          }}
                        />
                      </div>
                    ))}
                  </dl>
                </CollapsableLink>
                <FormGroup>
                  <Label htmlFor="grbRole" required>
                    {t('form.grbRole')}
                  </Label>
                  <HelpText id="grbRoleHelpText" className="margin-top-05">
                    {t('form.grbRoleHelpText')}
                  </HelpText>
                  <ErrorMessage
                    errors={errors}
                    name="grbRole"
                    as={<FieldErrorMsg />}
                  />
                  <Dropdown
                    {...register('grbRole')}
                    ref={null}
                    id="grbRole"
                    aria-describedby="grbRoleHelpText"
                  >
                    <option value="">{t('form:dropdownInitialSelect')}</option>
                    {grbReviewerRoles.map(key => (
                      <option value={key} key={key}>
                        {t(`reviewerRoles.${key}`)}
                      </option>
                    ))}
                  </Dropdown>
                </FormGroup>
                {activeReviewer && (
                  <Button
                    type="button"
                    onClick={() => setReviewerToRemove(activeReviewer)}
                    className="text-error margin-bottom-4"
                    unstyled
                  >
                    {t('form.removeGrbReviewer')}
                  </Button>
                )}
              </div>
            </TabPanel>
            <TabPanel
              id="addReviewersFromRequest"
              tabName={t('form.addFromRequest')}
            >
              <EasiFormProvider<GRBReviewerFormFields> {...form}>
                <BulkAddGRBReviewersForm systemId={systemId} />
              </EasiFormProvider>
            </TabPanel>
          </Tabs>

          {action === 'add' && (
            <Alert type="info" slim className="margin-top-5 tablet:grid-col-6">
              {t(
                grbReviewStartedAt
                  ? 'form.infoAlertReviewStarted'
                  : 'form.infoAlertReviewNotStarted'
              )}
            </Alert>
          )}

          <Pager
            next={{
              text: t('form.submit', { context: action }),
              disabled:
                !watch('userAccount') ||
                !watch('votingRole') ||
                !watch('grbRole')
            }}
            taskListUrl={grbReviewPath}
            saveExitText={t('form.returnToRequest', { context: action })}
            border={false}
            className="margin-top-4"
            submitDisabled
          />
        </Form>
      </Grid>
    </>
  );
};

export default GRBReviewerForm;
