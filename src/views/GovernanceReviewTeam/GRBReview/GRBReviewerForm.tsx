import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import { useMutation } from '@apollo/client';
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
import { toLower } from 'lodash';

import CedarContactSelect from 'components/CedarContactSelect';
import { useEasiForm } from 'components/EasiForm';
import Alert from 'components/shared/Alert';
import CollapsableLink from 'components/shared/CollapsableLink';
import FieldErrorMsg from 'components/shared/FieldErrorMsg';
import HelpText from 'components/shared/HelpText';
import IconLink from 'components/shared/IconLink';
import Label from 'components/shared/Label';
import RequiredAsterisk from 'components/shared/RequiredAsterisk';
import { grbReviewerRoles, grbReviewerVotingRoles } from 'constants/grbRoles';
import useMessage from 'hooks/useMessage';
import {
  CreateSystemIntakeGRBReviewerQuery,
  UpdateSystemIntakeGRBReviewerQuery
} from 'queries/SystemIntakeGRBReviewerQueries';
import {
  CreateSystemIntakeGRBReviewer,
  CreateSystemIntakeGRBReviewerVariables
} from 'queries/types/CreateSystemIntakeGRBReviewer';
import { SystemIntakeGRBReviewer } from 'queries/types/SystemIntakeGRBReviewer';
import {
  UpdateSystemIntakeGRBReviewer,
  UpdateSystemIntakeGRBReviewerVariables
} from 'queries/types/UpdateSystemIntakeGRBReviewer';
import {
  SystemIntakeGRBReviewerRole,
  SystemIntakeGRBReviewerVotingRole
} from 'types/graphql-global-types';
import CreateGRBReviewerSchema from 'validations/grbReviewerSchema';
import Pager from 'views/TechnicalAssistance/RequestForm/Pager';

import { ReviewerKey } from '../subNavItems';

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
  setReviewerToRemove: (reviewer: SystemIntakeGRBReviewer) => void;
};

const GRBReviewerForm = ({ setReviewerToRemove }: GRBReviewerFormProps) => {
  const { t } = useTranslation('grbReview');

  const { showMessageOnNextPage } = useMessage();

  const history = useHistory();

  const { state: activeReviewer } = useLocation<
    SystemIntakeGRBReviewer | undefined
  >();

  const { reviewerType, systemId, action } = useParams<{
    reviewerType: ReviewerKey;
    systemId: string;
    action: 'add' | 'edit';
  }>();

  const [createGRBReviewer] = useMutation<
    CreateSystemIntakeGRBReviewer,
    CreateSystemIntakeGRBReviewerVariables
  >(CreateSystemIntakeGRBReviewerQuery, {
    refetchQueries: ['GetSystemIntakeGRBReviewers']
  });

  const [updateGRBReviewer] = useMutation<
    UpdateSystemIntakeGRBReviewer,
    UpdateSystemIntakeGRBReviewerVariables
  >(UpdateSystemIntakeGRBReviewerQuery, {
    refetchQueries: ['GetSystemIntakeGRBReviewers']
  });

  const {
    handleSubmit,
    register,
    watch,
    setValue,
    setError,
    formState: { errors, isValid, isDirty }
  } = useEasiForm<GRBReviewerFormFields>({
    resolver: yupResolver(CreateGRBReviewerSchema),
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

  const grbReviewPath = `/${reviewerType}/${systemId}/grb-review`;

  const submit = handleSubmit(({ userAccount, ...values }) => {
    if (!isDirty) return history.push(grbReviewPath);

    const mutate = () =>
      activeReviewer
        ? updateGRBReviewer({
            variables: { input: { ...values, reviewerID: activeReviewer.id } }
          })
        : createGRBReviewer({
            variables: {
              input: {
                ...values,
                systemIntakeID: systemId,
                euaUserId: userAccount.username
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
    <Grid className="tablet:grid-col-8 padding-y-4">
      <ErrorMessage errors={errors} name="root" as={<Alert type="error" />} />

      <h1 className="margin-bottom-1">{t('form.title')}</h1>
      <p className="font-body-md line-height-body-4 text-light margin-top-05 margin-bottom-105">
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

      <Form
        onSubmit={submit}
        className="maxw-none tablet:grid-col-9 margin-bottom-8"
      >
        <FormGroup>
          <Label htmlFor="userAccount" required>
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
                { shouldValidate: true }
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
          <Dropdown {...register('votingRole')} ref={null} id="votingRole">
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
          <ErrorMessage errors={errors} name="grbRole" as={<FieldErrorMsg />} />
          <Dropdown
            {...register('grbRole')}
            ref={null}
            id="grbRoleRole"
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

        {action === 'add' && (
          <Alert type="info" slim className="margin-top-8">
            {t('form.infoAlert')}
          </Alert>
        )}

        <Pager
          next={{
            text: t('form.submit', { context: action }),
            disabled: !isValid && !errors?.root
          }}
          taskListUrl={grbReviewPath}
          saveExitText={t('form.returnToRequest', { context: action })}
          border={false}
          className="margin-top-4"
          submitDisabled
        />
      </Form>
    </Grid>
  );
};

export default GRBReviewerForm;
