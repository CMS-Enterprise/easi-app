import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useHistory, useLocation } from 'react-router-dom';
import { ErrorMessage } from '@hookform/error-message';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Form, FormGroup, Select } from '@trussworks/react-uswds';
import Pager from 'features/TechnicalAssistance/Requester/RequestForm/Pager';
import {
  GetSystemIntakeGRBReviewersDocument,
  SystemIntakeGRBReviewerFragment,
  useUpdateSystemIntakeGRBReviewerMutation
} from 'gql/generated/graphql';

import Alert from 'components/Alert';
import CedarContactSelect from 'components/CedarContactSelect';
import CollapsableLink from 'components/CollapsableLink';
import { useEasiForm } from 'components/EasiForm';
import FieldErrorMsg from 'components/FieldErrorMsg';
import HelpText from 'components/HelpText';
import Label from 'components/Label';
import { grbReviewerRoles, grbReviewerVotingRoles } from 'constants/grbRoles';
import useMessage from 'hooks/useMessage';
import { GRBReviewerFields, GRBReviewFormAction } from 'types/grbReview';
import { GRBReviewerSchema } from 'validations/grbReviewSchema';

type AddReviewerFromEuaProps = {
  systemId: string;
  initialGRBReviewers: SystemIntakeGRBReviewerFragment[];
  createGRBReviewers: (reviewers: GRBReviewerFields[]) => Promise<void>;
  setReviewerToRemove: (reviewer: SystemIntakeGRBReviewerFragment) => void;
  grbReviewStartedAt?: string | null;
};

/** Form to add or update GRB Reviewer */
const AddReviewerFromEua = ({
  systemId,
  initialGRBReviewers,
  createGRBReviewers,
  setReviewerToRemove,
  grbReviewStartedAt
}: AddReviewerFromEuaProps) => {
  const { t } = useTranslation('grbReview');
  const history = useHistory();
  const { showMessage, showMessageOnNextPage } = useMessage();

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
    handleSubmit,
    setValue,
    formState: { errors, isSubmitted, isDirty, isValid }
  } = useEasiForm<GRBReviewerFields>({
    resolver: yupResolver(GRBReviewerSchema),
    criteriaMode: 'all',
    context: { errorOnDuplicate: !activeReviewer, initialGRBReviewers },
    // Set default values if updating existing reviewer
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

  const action: GRBReviewFormAction = activeReviewer ? 'edit' : 'add';

  /** Update roles for existing reviewer */
  const updateRoles = ({ userAccount, ...reviewer }: GRBReviewerFields) =>
    updateGRBReviewer({
      variables: {
        input: {
          ...reviewer,
          reviewerID: activeReviewer?.id || ''
        }
      }
    })
      .then(() => {
        showMessageOnNextPage(
          <Trans
            i18nKey="grbReview:messages.success.edit"
            values={{ commonName: userAccount.commonName }}
          />,
          { type: 'success' }
        );

        history.push(grbReviewPath);
      })
      .catch(() => {
        showMessage(t(`messages.error.edit`), { type: 'error' });

        // Scroll to error
        const err = document.querySelector('.usa-alert');
        err?.scrollIntoView();
      });

  return (
    <Form
      onSubmit={handleSubmit(values =>
        activeReviewer ? updateRoles(values) : createGRBReviewers([values])
      )}
      className="maxw-none tablet:grid-col-6"
    >
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
          render={({ message }) =>
            // Only show field errors when revalidating after submission
            isSubmitted && <FieldErrorMsg>{message}</FieldErrorMsg>
          }
        />
        <CedarContactSelect
          {...{ ...register('userAccount'), ref: null }}
          onChange={contact =>
            setValue(
              'userAccount',
              {
                username: contact?.euaUserId || '',
                commonName: contact?.commonName || '',
                email: contact?.email || ''
              },
              // Validate field on every change
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

        {/* Duplicate GRB reviewer warning message */}
        <ErrorMessage
          errors={errors}
          name="userAccount"
          render={({ messages }) =>
            // Only show for duplicate reviewer error
            !!messages?.duplicate && (
              <Alert type="warning" slim>
                {t('form.duplicateReviewerAlert')}
              </Alert>
            )
          }
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
        <Select {...register('votingRole')} ref={null} id="votingRole">
          <option value="">{t('form:dropdownInitialSelect')}</option>
          {grbReviewerVotingRoles.map(key => (
            <option value={key} key={key}>
              {t(`votingRoles.${key}`)}
            </option>
          ))}
        </Select>
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
        <Select
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
        </Select>
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
          text: t('form.submit', { context: action }),
          disabled: !isDirty || !isValid
        }}
        taskListUrl={grbReviewPath}
        saveExitText={t('form.returnToRequest', {
          context: action
        })}
        border={false}
        className="margin-top-4"
        submitDisabled
      />
    </Form>
  );
};

export default AddReviewerFromEua;
