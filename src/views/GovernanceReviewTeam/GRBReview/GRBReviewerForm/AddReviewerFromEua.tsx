import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useHistory, useLocation } from 'react-router-dom';
import { ErrorMessage } from '@hookform/error-message';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Dropdown, Form, FormGroup } from '@trussworks/react-uswds';
import {
  CreateSystemIntakeGRBReviewersMutationFn,
  GetSystemIntakeGRBReviewersDocument,
  SystemIntakeGRBReviewerFragment,
  useUpdateSystemIntakeGRBReviewerMutation
} from 'gql/gen/graphql';
import { toLower } from 'lodash';

import CedarContactSelect from 'components/CedarContactSelect';
import { useEasiForm } from 'components/EasiForm';
import Alert from 'components/shared/Alert';
import CollapsableLink from 'components/shared/CollapsableLink';
import FieldErrorMsg from 'components/shared/FieldErrorMsg';
import HelpText from 'components/shared/HelpText';
import Label from 'components/shared/Label';
import { grbReviewerRoles, grbReviewerVotingRoles } from 'constants/grbRoles';
import useMessage from 'hooks/useMessage';
import { GRBReviewerFields } from 'types/grbReview';
import { GRBReviewerSchema } from 'validations/grbReviewerSchema';
import Pager from 'views/TechnicalAssistance/RequestForm/Pager';

type AddReviewerFromEuaProps = {
  systemId: string;
  initialGRBReviewers: SystemIntakeGRBReviewerFragment[];
  createGRBReviewers: CreateSystemIntakeGRBReviewersMutationFn;
  setReviewerToRemove: (reviewer: SystemIntakeGRBReviewerFragment) => void;
  grbReviewStartedAt?: string | null;
};

const AddReviewerFromEua = ({
  systemId,
  initialGRBReviewers,
  createGRBReviewers,
  setReviewerToRemove,
  grbReviewStartedAt
}: AddReviewerFromEuaProps) => {
  const { t } = useTranslation('grbReview');
  const { showMessageOnNextPage } = useMessage();
  const history = useHistory();

  const {
    /** Active reviewer when editing */
    state: activeReviewer
  } = useLocation<SystemIntakeGRBReviewerFragment | undefined>();

  const [updateGRBReviewer] = useUpdateSystemIntakeGRBReviewerMutation({
    refetchQueries: [
      {
        query: GetSystemIntakeGRBReviewersDocument,
        variables: { id: systemId }
      }
    ]
  });

  const {
    register,
    watch,
    setValue,
    handleSubmit,
    formState: { errors, isSubmitted, isDirty }
  } = useEasiForm<GRBReviewerFields>({
    resolver: yupResolver(GRBReviewerSchema),
    context: { errorOnDuplicates: !activeReviewer, initialGRBReviewers },
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

  const grbReviewPath = `/it-governance/${systemId}/grb-review`;

  const submit = handleSubmit(({ userAccount, ...values }) => {
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

    return (
      mutate()
        .then(() => {
          showMessageOnNextPage(
            <Trans
              i18nKey="grbReview:form.success"
              values={{
                commonName: userAccount.commonName,
                votingRole: toLower(
                  t<string>(`votingRoles.${values.votingRole}`)
                )
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
        // TODO: error message
        .catch(() => null)
    );
  });

  return (
    <Form onSubmit={submit} className="maxw-none tablet:grid-col-6">
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

      {!activeReviewer && (
        <Alert type="info" slim className="margin-top-6">
          {t(
            grbReviewStartedAt
              ? 'form.infoAlertReviewStarted'
              : 'form.infoAlertReviewNotStarted'
          )}
        </Alert>
      )}

      <Pager
        next={{
          text: activeReviewer ? t('form.saveChanges') : t('form.addReviewer'),
          disabled:
            !isDirty ||
            !watch('userAccount') ||
            !watch('votingRole') ||
            !watch('grbRole')
        }}
        taskListUrl={grbReviewPath}
        saveExitText={t('form.returnToRequest', {
          context: activeReviewer ? 'edit' : 'add'
        })}
        border={false}
        className="margin-top-4"
        submitDisabled
      />
    </Form>
  );
};

export default AddReviewerFromEua;
