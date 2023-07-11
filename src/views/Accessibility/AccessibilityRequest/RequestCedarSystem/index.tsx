import React, { useMemo, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import {
  ApolloError,
  MutationResult,
  useMutation,
  useQuery
} from '@apollo/client';
import { Button, ComboBox, IconArrowBack, Link } from '@trussworks/react-uswds';
import classNames from 'classnames';
import { Form as FormikForm, Formik, FormikProps } from 'formik';

import PageHeading from 'components/PageHeading';
import Alert from 'components/shared/Alert';
import CollapsibleLink from 'components/shared/CollapsableLink';
import { ErrorAlert, ErrorAlertMessage } from 'components/shared/ErrorAlert';
import FieldGroup from 'components/shared/FieldGroup';
import HelpText from 'components/shared/HelpText';
import Label from 'components/shared/Label';
import Spinner from 'components/Spinner';
import { initialAccessibilityRequestFormDataCedar } from 'data/accessibility';
import useMessage from 'hooks/useMessage';
import CreateAccessibilityRequestQuery from 'queries/CreateAccessibilityRequestQuery';
import CreateCedarSystemBookmarkQuery from 'queries/CreateCedarSystemBookmarkQuery';
import DeleteCedarSystemBookmarkQuery from 'queries/DeleteCedarSystemBookmarkQuery';
import GetCedarSystemBookmarksQuery from 'queries/GetCedarSystemBookmarksQuery';
import GetCedarSystemIdsQuery from 'queries/GetCedarSystemIdsQuery';
import { GetCedarSystemBookmarks } from 'queries/types/GetCedarSystemBookmarks';
import { GetCedarSystemIds } from 'queries/types/GetCedarSystemIds';
import UpdateAccessibilityRequestQuery from 'queries/UpdateAccessibilityRequestQuery';
import { AccessibilityRequestFormCedar } from 'types/accessibility';
import accessibilitySchema from 'validations/accessibilitySchema';
import SidebarTestingLinks from 'views/Accessibility/SidebarTestingLinks';

import SystemInformationCard from './SystemInformationCard';

import './index.scss';

type RequestWrapperProps = {
  existingRequest: boolean;
  cedarData?: GetCedarSystemIds;
  cedarLoading: boolean;
  cedarError?: ApolloError;
  setCedarSystemId: (id?: string) => void;
};

type FormWrapperProps = {
  cedarSystemSelectLabelText: string;
  cedarSystemSubmitLabelText: string;
  handleSubmitForm: (values: AccessibilityRequestFormCedar) => void;
  mutationResult: MutationResult<any>;
} & RequestWrapperProps;

const CreateRequestWrapper = (props: RequestWrapperProps) => {
  const [createRequest, createRequestResult] = useMutation(
    CreateAccessibilityRequestQuery
  );
  const { showMessageOnNextPage } = useMessage();
  const history = useHistory();
  const { t } = useTranslation('accessibility');

  const handleSubmitForm = (values: AccessibilityRequestFormCedar) => {
    createRequest({
      variables: {
        input: {
          name: '', // todo omit field?
          cedarSystemId: values.cedarId
        }
      }
    }).then(response => {
      if (!response.errors) {
        const uuid =
          response.data.createAccessibilityRequest.accessibilityRequest.id;
        showMessageOnNextPage(
          <span className="margin-bottom-2">
            {t('newRequestForm.confirmation')}
          </span>
        );
        history.push(`/508/requests/${uuid}/documents`);
      }
    });
  };

  return (
    <RequestFormWrapper
      {...props}
      cedarSystemSelectLabelText="newRequestForm.cedar.fields.project.label"
      cedarSystemSubmitLabelText="newRequestForm.submitBtn"
      handleSubmitForm={handleSubmitForm}
      mutationResult={createRequestResult}
    />
  );
};

type UpdateRequestWrapperProps = {
  accessibilityRequestId: string;
};

const UpdateRequestWrapper = (
  props: RequestWrapperProps & UpdateRequestWrapperProps
) => {
  const { accessibilityRequestId } = props;
  const [updateRequest, updateRequestResult] = useMutation(
    UpdateAccessibilityRequestQuery
  );
  const { showMessageOnNextPage } = useMessage();
  const history = useHistory();

  const handleSubmitForm = (values: AccessibilityRequestFormCedar) => {
    updateRequest({
      variables: {
        input: {
          id: accessibilityRequestId,
          cedarSystemId: values.cedarId
        }
      }
    }).then(response => {
      const {
        id: uuid,
        name
      } = response.data.updateAccessibilityRequestCedarSystem.accessibilityRequest;
      // todo return values

      showMessageOnNextPage(
        <>
          <span className="margin-bottom-2">
            {`${values.cedarId} has been tied to ${name}.`}
          </span>
        </>
      );
      history.push(`/508/requests/${uuid}/documents`);
    });
  };

  return (
    <RequestFormWrapper
      {...props}
      cedarSystemSelectLabelText="requestDetails.selectSystemRequest"
      cedarSystemSubmitLabelText="requestDetails.saveSystem"
      handleSubmitForm={handleSubmitForm}
      mutationResult={updateRequestResult}
    />
  );
};

const RequestFormWrapper = ({
  existingRequest,
  cedarData,
  cedarLoading,
  cedarError,
  mutationResult,
  setCedarSystemId,
  cedarSystemSelectLabelText,
  cedarSystemSubmitLabelText,
  handleSubmitForm
}: FormWrapperProps) => {
  const { t } = useTranslation('accessibility');

  const cedarSystemsOptions = useMemo(() => {
    return (cedarData?.cedarSystems || []).map(system => {
      return {
        label: system!.name!,
        value: system!.id!
      };
    });
  }, [cedarData]);

  return (
    <Formik
      initialValues={initialAccessibilityRequestFormDataCedar}
      onSubmit={handleSubmitForm}
      validationSchema={accessibilitySchema.requestFormCedar}
      validateOnBlur={false}
      validateOnChange={false}
      validateOnMount={false}
    >
      {(formikProps: FormikProps<AccessibilityRequestFormCedar>) => {
        const { setFieldValue, handleSubmit, dirty } = formikProps;
        return (
          <>
            {mutationResult.error && (
              <ErrorAlert heading="System error">
                <ErrorAlertMessage
                  message={mutationResult.error.message}
                  errorKey="system"
                />
              </ErrorAlert>
            )}
            <div className="margin-bottom-4">
              <FormikForm
                onSubmit={e => {
                  handleSubmit(e);
                  window.scrollTo(0, 0);
                }}
              >
                <FieldGroup scrollElement="cedarSystemId">
                  <Label htmlFor="508Request-CedarSystemId">
                    {t(cedarSystemSelectLabelText)}
                  </Label>
                  <HelpText id="508Request-CedarSystemId-HelpText">
                    {t('newRequestForm.cedar.fields.project.helpText')}
                  </HelpText>
                  {cedarLoading ? (
                    <div className="display-flex flex-align-center padding-1 margin-top-1">
                      <Spinner
                        size="small"
                        aria-valuetext={t('newRequestForm.loadingSystems')}
                        aria-busy
                        data-testid="cedar-systems-loading"
                      />
                      <div className="margin-left-1">
                        {t('newRequestForm.loadingSystems')}
                      </div>
                    </div>
                  ) : (
                    <ComboBox
                      disabled={!!cedarError}
                      id="508Request-CedarSystemId"
                      name="cedarSystemComboBox"
                      className={classNames({ disabled: cedarError })}
                      inputProps={{
                        id: '508Request-CedarSystemId',
                        name: 'cedarSystemId',
                        'aria-describedby': '508Request-CedarSystemId-HelpText'
                      }}
                      options={cedarSystemsOptions}
                      onChange={cedarId => {
                        const system = cedarData?.cedarSystems?.find(
                          cedarSystem => cedarSystem?.id === cedarId
                        );
                        if (system) {
                          setFieldValue('cedarId', system.id);
                          setFieldValue('requestName', system.name);
                          setCedarSystemId(system.id);
                        } else {
                          setFieldValue('cedarId', '');
                          setFieldValue('requestName', '');
                          setCedarSystemId(undefined);
                        }
                      }}
                    />
                  )}
                </FieldGroup>
                <div className="margin-top-4">
                  <CollapsibleLink
                    id="LifecycleIdAccordion"
                    label={t(
                      'newRequestForm.cedar.helpAndGuidance.lifecycleIdAccordion.header'
                    )}
                  >
                    <p>
                      <Trans i18nKey="accessibility:newRequestForm.cedar.helpAndGuidance.lifecycleIdAccordion.description">
                        indexZero
                        <Link href="mailto:IT_Governance@cms.hhs.gov">
                          email
                        </Link>
                        indexTwo
                      </Trans>
                    </p>
                  </CollapsibleLink>
                </div>
                {!existingRequest && (
                  <div className="margin-top-4">
                    <Alert type="info">{t('newRequestForm.info')}</Alert>
                  </div>
                )}
                <Button
                  type="submit"
                  disabled={!dirty}
                  className="margin-top-4"
                >
                  {t(cedarSystemSubmitLabelText)}
                </Button>
              </FormikForm>
            </div>
          </>
        );
      }}
    </Formik>
  );
};

const RequestCedarSystem = () => {
  const { t } = useTranslation('accessibility');
  const history = useHistory();

  // Process either an existing request or a new one
  const { pathname } = useLocation();
  const { accessibilityRequestId } = useParams<{
    accessibilityRequestId: string;
  }>();
  const existingRequest = pathname.endsWith('/cedar-system');

  const [cedarSystemId, setCedarSystemId] = useState<string>();

  const {
    data: cedarData,
    loading: cedarLoading,
    error: cedarError
  } = useQuery<GetCedarSystemIds>(GetCedarSystemIdsQuery);

  const {
    data: bookmarksData,
    refetch: bookmarksRefetch
  } = useQuery<GetCedarSystemBookmarks>(GetCedarSystemBookmarksQuery);

  const [createBookmark] = useMutation(CreateCedarSystemBookmarkQuery);
  const [deleteBookmark] = useMutation(DeleteCedarSystemBookmarkQuery);

  const toggleCedarSystemBookmark = (bookmarkCedarSystemId: string) => {
    if (isCedarSystemBookmarked(bookmarkCedarSystemId)) {
      deleteBookmark({
        variables: {
          input: {
            cedarSystemId: bookmarkCedarSystemId
          }
        }
      }).then(bookmarksRefetch);
    } else {
      createBookmark({
        variables: {
          input: {
            cedarSystemId: bookmarkCedarSystemId
          }
        }
      }).then(bookmarksRefetch);
    }
  };

  const isCedarSystemBookmarked = (bookmarkCedarSystemId: string) =>
    bookmarksData?.cedarSystemBookmarks.find(
      bookmark => bookmark.cedarSystemId === bookmarkCedarSystemId
    ) !== undefined;

  const requestWrapperProps: RequestWrapperProps = {
    existingRequest,
    cedarData,
    cedarLoading,
    cedarError,
    setCedarSystemId
  };

  const requestForm = existingRequest ? (
    <UpdateRequestWrapper
      {...requestWrapperProps}
      accessibilityRequestId={accessibilityRequestId}
    />
  ) : (
    <CreateRequestWrapper {...requestWrapperProps} />
  );

  const pageHeadingText = existingRequest
    ? 'requestDetails.heading'
    : 'newRequestForm.heading';

  return (
    <>
      <div
        className="grid-container create-508-request margin-top-6"
        data-testid="create-508-request"
      >
        <div className="grid-row">
          <div className="tablet:grid-col-8">
            <div>
              <Button type="button" unstyled onClick={() => history.goBack()}>
                <IconArrowBack className="margin-right-05 margin-bottom-2px text-tbottom" />
                {t('requestDetails.back')}
              </Button>
            </div>
            <PageHeading className="margin-top-2">
              {t(pageHeadingText)}
            </PageHeading>
            {cedarError && (
              <div className="tablet:grid-col-8">
                <Alert type="warning">{t('newRequestForm.errorSystems')}</Alert>
              </div>
            )}
            {requestForm}
          </div>
          <div className="tablet:grid-col-3 tablet:grid-offset-1 ">
            <div className="accessibility-request__side-nav">
              {cedarSystemId && (
                <div>
                  <h3>{t('requestDetails.systemInformation')}</h3>
                  <SystemInformationCard
                    cedarSystemId={cedarSystemId}
                    bookmarked={isCedarSystemBookmarked(cedarSystemId)}
                    toggleCedarSystemBookmark={() =>
                      toggleCedarSystemBookmark(cedarSystemId)
                    }
                  />
                </div>
              )}
              <SidebarTestingLinks />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RequestCedarSystem;
