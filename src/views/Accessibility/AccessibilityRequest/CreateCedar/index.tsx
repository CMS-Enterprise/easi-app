/* eslint-disable react/prop-types */
import React, { useMemo, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/client';
import {
  Alert,
  Button,
  ComboBox,
  IconLaunch,
  Link
} from '@trussworks/react-uswds';
import classNames from 'classnames';
import { Form as FormikForm, Formik, FormikProps } from 'formik';

import UswdsReactLink from 'components/LinkWrapper';
import PageHeading from 'components/PageHeading';
import { AlertText } from 'components/shared/Alert';
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
import { AccessibilityRequestFormCedar } from 'types/accessibility';
import accessibilitySchema from 'validations/accessibilitySchema';

import SystemInformationCard from './SystemInformationCard';

import './index.scss';

const CreateCedar = () => {
  const history = useHistory();
  const { t } = useTranslation('accessibility');
  const { showMessageOnNextPage } = useMessage();

  // Process either an existing request or a new one
  const { pathname } = useLocation();
  const { accessibilityRequestId } = useParams<{
    accessibilityRequestId: string;
  }>();
  const existingRequest = pathname.endsWith('/cedar-system');
  const [cedarSystemId, setCedarSystemId] = useState<string>();

  const { data, loading, error } = useQuery<GetCedarSystemIds>(
    GetCedarSystemIdsQuery
  );

  const [mutate, mutationResult] = useMutation(CreateAccessibilityRequestQuery);
  const handleSubmitForm = (values: AccessibilityRequestFormCedar) => {
    mutate({
      variables: {
        input: {
          name: values.requestName,
          cedarSystemId: values.cedarId
        }
      }
    }).then(response => {
      if (!response.errors) {
        if (existingRequest) {
          // todo
        } else {
          const uuid =
            response.data.createAccessibilityRequest.accessibilityRequest.id;
          showMessageOnNextPage(
            <>
              <AlertText className="margin-bottom-2">
                {t('newRequestForm.confirmation')}
              </AlertText>
              <Link
                href="https://www.surveymonkey.com/r/3R6MXSW"
                target="_blank"
                rel="noopener noreferrer"
              >
                {t('newRequestForm.surveyLink')}
                <IconLaunch className="margin-left-05 margin-bottom-2px text-tbottom" />
              </Link>
            </>
          );
          history.push(`/508/requests/${uuid}/documents`);
        }
      }
    });
  };

  const {
    loading: loadingBookmarks,
    error: errorBookmarks,
    data: dataBookmarks,
    refetch: refetchBookmarks
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
      }).then(refetchBookmarks);
    } else {
      createBookmark({
        variables: {
          input: {
            cedarSystemId: bookmarkCedarSystemId
          }
        }
      }).then(refetchBookmarks);
    }
  };

  const isCedarSystemBookmarked = (bookmarkCedarSystemId: string) =>
    dataBookmarks?.cedarSystemBookmarks.find(
      bookmark => bookmark.cedarSystemId === bookmarkCedarSystemId
    ) !== undefined;

  const projectComboBoxOptions = useMemo(() => {
    return (data?.cedarSystems || []).map(system => {
      return {
        label: system!.name!,
        value: system!.id!
      };
    });
  }, [data]);

  return (
    <>
      <div
        className="grid-container create-508-request"
        data-testid="create-508-request"
      >
        <div className="grid-row">
          <div className="tablet:grid-col-8">
            {existingRequest && (
              <Link href={`/508/requests/${accessibilityRequestId}`}>
                {t('requestDetails.back')}
              </Link>
            )}
            <PageHeading>
              {t(
                existingRequest
                  ? 'requestDetails.heading'
                  : 'newRequestForm.heading'
              )}
            </PageHeading>
            {error && (
              <div className="tablet:grid-col-8">
                <Alert type="warning">{t('newRequestForm.errorSystems')}</Alert>
              </div>
            )}
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
                            {t(
                              existingRequest
                                ? 'requestDetails.selectSystemRequest'
                                : 'newRequestForm.cedar.fields.project.label'
                            )}
                          </Label>
                          <HelpText id="508Request-CedarSystemId-HelpText">
                            {t('newRequestForm.cedar.fields.project.helpText')}
                          </HelpText>
                          {loading ? (
                            <div className="display-flex flex-align-center padding-1 margin-top-1">
                              <Spinner
                                size="small"
                                aria-valuetext={t(
                                  'newRequestForm.loadingSystems'
                                )}
                                aria-busy
                                data-testid="cedar-systems-loading"
                              />
                              <div className="margin-left-1">
                                {t('newRequestForm.loadingSystems')}
                              </div>
                            </div>
                          ) : (
                            <ComboBox
                              disabled={!!error}
                              id="508Request-CedarSystemId"
                              name="cedarSystemComboBox"
                              className={classNames({ disabled: error })}
                              inputProps={{
                                id: '508Request-CedarSystemId',
                                name: 'cedarSystemId',
                                'aria-describedby':
                                  '508Request-CedarSystemId-HelpText'
                              }}
                              options={projectComboBoxOptions}
                              onChange={cedarId => {
                                const system = data?.cedarSystems?.find(
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
                            <Alert type="info">
                              {t('newRequestForm.info')}
                            </Alert>
                          </div>
                        )}
                        <Button
                          type="submit"
                          disabled={!dirty}
                          className="margin-top-4"
                        >
                          {t(
                            existingRequest
                              ? 'requestDetails.saveSystem'
                              : 'newRequestForm.submitBtn'
                          )}
                        </Button>
                      </FormikForm>
                    </div>
                  </>
                );
              }}
            </Formik>
          </div>
          <div className="tablet:grid-col-3 tablet:grid-offset-1">
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
            <div>
              <UswdsReactLink
                className="display-inline-block margin-top-3"
                target="_blank"
                rel="noopener noreferrer"
                to="/508/templates"
              >
                {t('requestDetails.testingTemplates')}
                <IconLaunch className="margin-left-05" />
              </UswdsReactLink>
              <UswdsReactLink
                className="display-inline-block margin-top-3"
                target="_blank"
                rel="noopener noreferrer"
                to="/508/testing-overview"
              >
                {t('requestDetails.testingSteps')}
                <IconLaunch className="margin-left-05" />
              </UswdsReactLink>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateCedar;
