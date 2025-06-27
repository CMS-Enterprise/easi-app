import React, { useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
// import { useForm } from 'react-hook-form';
import { Trans, useTranslation } from 'react-i18next';
import { Link, useHistory, useParams } from 'react-router-dom';
import {
  Breadcrumb,
  BreadcrumbBar,
  BreadcrumbLink,
  Button,
  Fieldset,
  Form,
  FormGroup,
  Grid,
  Icon,
  Label
} from '@trussworks/react-uswds';
import {
  SystemRelationshipType,
  //   useGetCedarSystemsQuery,
  useGetSystemIntakeRelationQuery
} from 'gql/generated/graphql';

import Alert from 'components/Alert';
import CheckboxField from 'components/CheckboxField';
import IconButton from 'components/IconButton';
import MainContent from 'components/MainContent';
import MultiSelect from 'components/MultiSelect';
import PageHeading from 'components/PageHeading';
import RequiredAsterisk from 'components/RequiredAsterisk';

type LinkedSystemsFormFields = {
  cedarSystemIDs: string[];
};

const hasErrors = false; // todo fix this

const isNew = false; // TODO fix this

const LinkedSystemsForm = () => {
  const { id } = useParams<{
    id: string;
  }>();

  console.log(id);

  const history = useHistory();

  const { t } = useTranslation('linkedSystems');

  //   const { state } = useLocation<{ isNew?: boolean }>();

  const [primarySupport, setPrimarySupport] = useState<boolean>(false);
  const [partialSupport, setPartialSupport] = useState<boolean>(false);
  const [usesOrImpactedBySelectedSystem, setUsesOrImpactedBySelectedSystem] =
    useState<boolean>(false);
  const [impactsSelectedSystem, setImpactsSelectedSystem] =
    useState<boolean>(false);
  const [otherSystemRelationship, setOtherSystemRelationship] =
    useState<boolean>(false);

  const { control } = useForm<LinkedSystemsFormFields>({
    defaultValues: {
      cedarSystemIDs: []
    }
  });

  //   const {
  //     loading: loadingSystems,
  //     error: cedarSystemsError,
  //     data
  //   } = useGetCedarSystemsQuery();

  const {
    data,
    error: relationError,
    loading: relationLoading
  } = useGetSystemIntakeRelationQuery({
    variables: { id }
  });
  console.log(relationError, relationLoading);
  const cedarSystemIdOptions = useMemo(() => {
    const cedarSystemsData = data?.cedarSystems;
    return !cedarSystemsData
      ? []
      : cedarSystemsData.map(system => ({
          label: `${system.name} (${system.acronym})`,
          value: system.id
        }));
  }, [data?.cedarSystems]);

  const breadCrumb = (() => {
    return t('additionalRequestInfo.taskListBreadCrumb');
  })();

  return (
    <MainContent className="grid-container margin-bottom-15">
      {hasErrors && (
        <Alert id="link-form-error" type="error" slim className="margin-top-2">
          {t('error:encounteredIssueTryAgain')}
        </Alert>
      )}

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
                <BreadcrumbLink asCustom={Link} to="/">
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
          {t('header')}
        </PageHeading>
        <p className="font-body-lg line-height-body-5 text-light margin-y-0">
          {t('subHeader')}
        </p>
        <p className="margin-top-2 margin-bottom-5 text-base">
          <Trans
            i18nKey="action:fieldsMarkedRequired"
            components={{ asterisk: <RequiredAsterisk /> }}
          />
        </p>
        <p>
          <IconButton
            icon={<Icon.ArrowBack className="margin-right-05" aria-hidden />}
            type="button"
            unstyled
            onClick={() => {
              history.goBack();
            }}
          >
            {t('dontEditAndReturn')}
          </IconButton>
        </p>

        <Form
          className="easi-form maxw-full"
          onSubmit={e => e.preventDefault()}
        >
          <Grid row>
            <Grid tablet={{ col: 12 }} desktop={{ col: 6 }}>
              <Fieldset>
                <Controller
                  name="cedarSystemIDs"
                  control={control}
                  render={({ field }) => (
                    <FormGroup>
                      <Label
                        htmlFor="cedarSystemIDs"
                        hint={t('cmsSystemsDropdown.hint')}
                      >
                        {t('cmsSystemsDropdown.title')} <RequiredAsterisk />
                      </Label>
                      <MultiSelect
                        name={field.name}
                        selectedLabel={t(
                          'link.form.field.cmsSystem.selectedLabel'
                        )}
                        initialValues={field.value}
                        options={cedarSystemIdOptions}
                        onChange={values => field.onChange(values)}
                      />
                    </FormGroup>
                  )}
                />
                <Label htmlFor="cedarSystemIDs" hint={t('relationship.hint')}>
                  {t('relationship.title')} <RequiredAsterisk />
                </Label>

                {/* relationshipTypes: {
    primarySupport: '',
    partialSupport: '',
    usesOrImpactedBySelectedSystems: '',
    impactsSelectedSystem: '',
    other: ''
  } */}

                <CheckboxField
                  label={t('relationshipTypes.primarySupport')}
                  id="idOne"
                  name="datavalue"
                  value={SystemRelationshipType.PRIMARY_SUPPORT}
                  checked={primarySupport}
                  onChange={e => setPrimarySupport(e.target.checked)}
                  onBlur={() => null}
                />
                <CheckboxField
                  label={t('relationshipTypes.partialSupport')}
                  id="idTwo"
                  name="datavalue"
                  value={SystemRelationshipType.PARTIAL_SUPPORT}
                  checked={partialSupport}
                  onChange={e => setPartialSupport(e.target.checked)}
                  onBlur={() => null}
                />
                <CheckboxField
                  label={t('relationshipTypes.usesOrImpactedBySelectedSystems')}
                  id="idThree"
                  name="datavalue"
                  value={
                    SystemRelationshipType.USES_OR_IMPACTED_BY_SELECTED_SYSTEM
                  }
                  checked={usesOrImpactedBySelectedSystem}
                  onChange={e =>
                    setUsesOrImpactedBySelectedSystem(e.target.checked)
                  }
                  onBlur={() => null}
                />
                <CheckboxField
                  label={t('relationshipTypes.impactsSelectedSystem')}
                  id="idFour"
                  name="datavalue"
                  value={SystemRelationshipType.IMPACTS_SELECTED_SYSTEM}
                  checked={impactsSelectedSystem}
                  onChange={e => setImpactsSelectedSystem(e.target.checked)}
                  onBlur={() => null}
                />
                <CheckboxField
                  label={t('relationshipTypes.other')}
                  id="idFive"
                  name="datavalue"
                  value={SystemRelationshipType.OTHER}
                  checked={otherSystemRelationship}
                  onChange={e => setOtherSystemRelationship(e.target.checked)}
                  onBlur={() => null}
                />
              </Fieldset>
            </Grid>
          </Grid>

          <Button type="button">{t('addSystem')}</Button>

          <IconButton
            icon={<Icon.ArrowBack className="margin-right-05" aria-hidden />}
            type="button"
            unstyled
            onClick={() => {
              history.goBack();
            }}
          >
            {t('dontEditAndReturn')}
          </IconButton>
        </Form>
      </>
    </MainContent>
  );
};

export default LinkedSystemsForm;
