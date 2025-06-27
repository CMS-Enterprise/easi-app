import React, { useEffect, useState } from 'react';
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
  Icon
} from '@trussworks/react-uswds';
import {
  // RequestRelationType,
  SystemIntakeSystem,
  useSystemIntakeQuery
} from 'gql/generated/graphql';

import Alert from 'components/Alert';
import CheckboxField from 'components/CheckboxField';
import IconButton from 'components/IconButton';
import MainContent from 'components/MainContent';
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

  // Form edit mode is either new or edit
  const isNew = !!state?.isNew;

  // Url of next view after successful form submit
  // Also for a breadcrumb navigation link
  const redirectUrl = (() => {
    if (fromAdmin) {
      return `/it-governance/${id}/additional-information`;
    }
    return `/governance-task-list/${id}`;
  })();

  const addASystemUrl = `/linked-systems-form/${id}`;

  const breadCrumb = (() => {
    if (fromAdmin) {
      return t('additionalRequestInfo.itGovBreadcrumb');
    }
    return t('additionalRequestInfo.taskListBreadCrumb');
  })();

  const [noSystemsUsed, setNoSystemsUsed] = useState<boolean>(false);

  const {
    data,
    // error: undefined,
    loading: relationLoading
  } = useSystemIntakeQuery({
    variables: { id }
  });

  const submitEnabled: boolean = (() => {
    // if there are relationships added or the checkbox is filled
    if (
      data &&
      data?.systemIntake?.cedarSystemRelationShips &&
      data?.systemIntake?.cedarSystemRelationShips?.length > 0
    ) {
      return true;
    }
    if (noSystemsUsed) {
      return true;
    }

    return false;
  })();

  const hasErrors = false;

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
          {t(`link.description`)}
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
              <Button
                type="button"
                outline
                onClick={() => history.push(addASystemUrl)}
              >
                {t('link.form.addASystem')}
              </Button>
              <CheckboxField
                label={t('link.form.doesNotSupportOrUseAnySystems')}
                id={'innerProps.id'!}
                name="datavalue"
                value="systemsUsed"
                checked={noSystemsUsed}
                onChange={e => setNoSystemsUsed(e.target.checked)}
                onBlur={() => null}
              />
            </Grid>
          </Grid>

          <LinkedSystemTable
            systems={
              (data?.systemIntake
                ?.cedarSystemRelationShips as SystemIntakeSystem[]) || []
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
            {t('link.form.dontEditAndReturn')}
          </IconButton>
        </Form>
      </>
    </MainContent>
  );
};

export default LinkedSystems;
