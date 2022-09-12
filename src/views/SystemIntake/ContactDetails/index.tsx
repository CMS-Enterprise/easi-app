import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import {
  Button,
  Checkbox,
  Dropdown,
  IconNavigateBefore,
  Label,
  Radio,
  TextInput
} from '@trussworks/react-uswds';
import { Field, Form, Formik, FormikHelpers, FormikProps } from 'formik';
import { useFlags } from 'launchdarkly-react-client-sdk';

import AdditionalContacts from 'components/AdditionalContacts';
import cmsDivisionsAndOfficesOptions from 'components/AdditionalContacts/cmsDivisionsAndOfficesOptions';
import CedarContactSelect from 'components/CedarContactSelect';
import MandatoryFieldsAlert from 'components/MandatoryFieldsAlert';
import PageHeading from 'components/PageHeading';
import PageNumber from 'components/PageNumber';
import AutoSave from 'components/shared/AutoSave';
import { ErrorAlert, ErrorAlertMessage } from 'components/shared/ErrorAlert';
import FieldErrorMsg from 'components/shared/FieldErrorMsg';
import FieldGroup from 'components/shared/FieldGroup';
import HelpText from 'components/shared/HelpText';
import useSystemIntakeContacts from 'hooks/useSystemIntakeContacts';
import GetSystemIntakeQuery from 'queries/GetSystemIntakeQuery';
import { UpdateSystemIntakeContactDetails as UpdateSystemIntakeContactDetailsQuery } from 'queries/SystemIntakeQueries';
import { GetSystemIntake_systemIntake as SystemIntake } from 'queries/types/GetSystemIntake';
import {
  UpdateSystemIntakeContactDetails,
  UpdateSystemIntakeContactDetailsVariables
} from 'queries/types/UpdateSystemIntakeContactDetails';
import {
  CedarContactProps,
  ContactDetailsForm,
  SystemIntakeContactProps,
  SystemIntakeRoleKeys
} from 'types/systemIntake';
import flattenErrors from 'utils/flattenErrors';
import SystemIntakeValidationSchema from 'validations/systemIntakeSchema';

import GovernanceTeamOptions from './GovernanceTeamOptions';

import './index.scss';

type ContactDetailsProps = {
  systemIntake: SystemIntake;
};

const ContactDetails = ({ systemIntake }: ContactDetailsProps) => {
  const {
    id,
    requestType,
    requester,
    governanceTeams,
    euaUserId
  } = systemIntake;
  const formikRef = useRef<FormikProps<ContactDetailsForm>>(null);
  const { t } = useTranslation('intake');
  const history = useHistory();
  const flags = useFlags();

  // Checkbox values
  const [isReqAndBusOwnerSame, setReqAndBusOwnerSame] = useState<boolean>(
    false
  );
  const [
    isReqAndProductManagerSame,
    setReqAndProductManagerSame
  ] = useState<boolean>(false);
  const checkboxDefaultsSet = useRef(false);

  const [
    activeContact,
    setActiveContact
  ] = useState<SystemIntakeContactProps | null>(null);

  // Intake contacts
  const {
    contacts,
    createContact,
    updateContact,
    deleteContact
  } = useSystemIntakeContacts(id);
  const { businessOwner, productManager, isso } = contacts || {};

  const initialValues = {
    requester: {
      name: requester.name || '',
      component: requester.component || ''
    },
    businessOwner,
    productManager,
    isso: {
      isPresent: !!isso?.euaUserId,
      ...isso
    },
    governanceTeams: {
      isPresent: governanceTeams.isPresent,
      teams:
        governanceTeams.teams?.map(team => ({
          collaborator: team.collaborator,
          name: team.name,
          key: team.key
        })) || []
    }
  };

  const [mutate] = useMutation<
    UpdateSystemIntakeContactDetails,
    UpdateSystemIntakeContactDetailsVariables
  >(UpdateSystemIntakeContactDetailsQuery, {
    refetchQueries: [
      {
        query: GetSystemIntakeQuery,
        variables: {
          id
        }
      }
    ]
  });

  const saveExitLink = (() => {
    let link = '';
    if (requestType === 'SHUTDOWN') {
      link = '/';
    } else {
      link = `/governance-task-list/${id}`;
    }
    return link;
  })();

  const onSubmit = async (
    values: ContactDetailsForm,
    { setFieldValue }: FormikHelpers<ContactDetailsForm>
  ) => {
    /** Create or update contact in database */
    const updateSystemIntakeContact = async (type: SystemIntakeRoleKeys) => {
      if (values[type].euaUserId && values[type].component) {
        if (values?.[type].id) {
          return updateContact({ ...values[type] });
        }
        return createContact(values[type]).then(newContact => {
          setFieldValue(`${type}.id`, newContact?.id);
        });
      }
      return null;
    };

    // Update contacts and system intake form
    return Promise.all([
      updateSystemIntakeContact('businessOwner'),
      updateSystemIntakeContact('productManager'),
      updateSystemIntakeContact('isso')
    ]).then(() =>
      mutate({
        variables: {
          input: {
            id,
            requester: {
              name: values.requester.name,
              component: values.requester.component
            },
            businessOwner: {
              name: values.businessOwner.commonName,
              component: values.businessOwner.component
            },
            productManager: {
              name: values.productManager.commonName,
              component: values.productManager.component
            },
            isso: {
              isPresent: values.isso.isPresent,
              name: values.isso.commonName
            },
            governanceTeams: values.governanceTeams || []
          }
        }
      })
    );
  };

  // Set checkbox default values
  useEffect(() => {
    // Wait until contacts are loaded
    if (!checkboxDefaultsSet.current && businessOwner && euaUserId) {
      if (euaUserId === businessOwner.euaUserId) {
        setReqAndBusOwnerSame(true);
      }
      if (euaUserId === productManager?.euaUserId) {
        setReqAndProductManagerSame(true);
      }
      checkboxDefaultsSet.current = true;
    }
  }, [businessOwner, productManager, euaUserId]);

  // Wait for contacts to load before returning form
  if (!contacts) return null;

  return (
    <Formik
      initialValues={initialValues as ContactDetailsForm}
      onSubmit={onSubmit}
      validationSchema={SystemIntakeValidationSchema.contactDetails}
      validateOnBlur={false}
      validateOnChange={false}
      validateOnMount={false}
      innerRef={formikRef}
    >
      {(formikProps: FormikProps<ContactDetailsForm>) => {
        const { values, setFieldValue, errors } = formikProps;
        const flatErrors = flattenErrors(errors);

        /** Set commonName, euaUserId, and email values from contact lookup */
        const setContactFieldsFromName = (
          contact: CedarContactProps | null,
          role: SystemIntakeRoleKeys
        ) => {
          setFieldValue(`${role}.commonName`, contact?.commonName || '');
          setFieldValue(`${role}.euaUserId`, contact?.euaUserId || '');
          setFieldValue(`${role}.email`, contact?.email || '');
        };

        /** Clear contact values and delete from database */
        const clearContact = (role: SystemIntakeRoleKeys) => {
          setFieldValue(role, {
            ...values[role],
            euaUserId: '',
            commonName: '',
            component: '',
            email: ''
          });
          if (role === 'isso') {
            setFieldValue('isso.isPresent', false);
          }
          if (values[role].id) {
            deleteContact(values[role].id!);
          }
        };

        /** Set contacts same as requester if checkbox is checked */
        const setContactFromCheckbox = (
          role: 'businessOwner' | 'productManager',
          sameAsRequester: boolean
        ) => {
          if (sameAsRequester) {
            setContactFieldsFromName(
              {
                euaUserId,
                commonName: requester.name,
                email: requester.email || ''
              },
              role
            );
            setFieldValue(`${role}.component`, values.requester.component);
          } else {
            clearContact(role);
          }
          if (role === 'businessOwner') {
            setReqAndBusOwnerSame(!!sameAsRequester);
          } else {
            setReqAndProductManagerSame(!!sameAsRequester);
          }
        };

        return (
          <>
            {Object.keys(errors).length > 0 && (
              <ErrorAlert
                testId="contact-details-errors"
                classNames="margin-top-3"
                heading="Please check and fix the following"
              >
                {Object.keys(flatErrors).map(key => {
                  return (
                    <ErrorAlertMessage
                      key={`Error.${key}`}
                      errorKey={key}
                      message={flatErrors[key]}
                    />
                  );
                })}
              </ErrorAlert>
            )}
            <p className="line-height-body-5">
              {t('contactDetails.intakeProcessDescription')}
            </p>

            <div className="tablet:grid-col-6 margin-bottom-7">
              <MandatoryFieldsAlert />
              <PageHeading>{t('contactDetails.heading')}</PageHeading>
              <Form>
                {/* Requester Name */}
                <FieldGroup
                  scrollElement="requester.name"
                  error={!!flatErrors['requester.name']}
                >
                  <Label htmlFor="IntakeForm-Requester">
                    {t('contactDetails.requester')}
                  </Label>
                  <FieldErrorMsg>{flatErrors['requester.name']}</FieldErrorMsg>
                  <Field
                    as={TextInput}
                    error={!!flatErrors['requester.name']}
                    id="IntakeForm-Requester"
                    maxLength={50}
                    name="requester.name"
                    disabled
                  />
                </FieldGroup>
                {/* Requester Component */}
                <FieldGroup
                  scrollElement="requester.component"
                  error={!!flatErrors['requester.component']}
                >
                  <Label htmlFor="IntakeForm-RequesterComponent">
                    {t('contactDetails.requesterComponent')}
                  </Label>
                  <FieldErrorMsg>
                    {flatErrors['requester.component']}
                  </FieldErrorMsg>
                  <Field
                    as={Dropdown}
                    id="IntakeForm-RequesterComponent"
                    name="requester.component"
                    onChange={(e: any) => {
                      if (isReqAndBusOwnerSame) {
                        setFieldValue(
                          'businessOwner.component',
                          e.target.value
                        );
                      }
                      if (isReqAndProductManagerSame) {
                        setFieldValue(
                          'productManager.component',
                          e.target.value
                        );
                      }
                      setFieldValue('requester.component', e.target.value);
                    }}
                  >
                    <option value="" disabled>
                      {t('Select an option')}
                    </option>
                    {cmsDivisionsAndOfficesOptions('RequesterComponent')}
                  </Field>
                </FieldGroup>
                {/* Business Owner Name */}
                <FieldGroup
                  scrollElement="businessOwner.commonName"
                  error={!!flatErrors['businessOwner.commonName']}
                >
                  <h4 className="margin-bottom-1">
                    {t('contactDetails.businessOwner.name')}
                  </h4>
                  <HelpText id="IntakeForm-BusinessOwnerHelp">
                    {t('contactDetails.businessOwner.helpText')}
                  </HelpText>
                  <Field
                    as={Checkbox}
                    id="IntakeForm-IsBusinessOwnerSameAsRequester"
                    label="CMS Business Owner is same as requester"
                    name="isBusinessOwnerSameAsRequester"
                    checked={!!isReqAndBusOwnerSame}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setContactFromCheckbox(
                        'businessOwner',
                        !!e.target.checked
                      )
                    }
                    value=""
                  />
                  <Label
                    className="margin-bottom-1"
                    htmlFor="IntakeForm-BusinessOwnerName"
                  >
                    {t('contactDetails.businessOwner.nameField')}
                  </Label>
                  <FieldErrorMsg>
                    {flatErrors['businessOwner.commonName']}
                  </FieldErrorMsg>
                  <CedarContactSelect
                    id="IntakeForm-BusinessOwnerName"
                    name="businessOwner.commonName"
                    ariaDescribedBy="IntakeForm-BusinessOwnerHelp"
                    onChange={contact => {
                      if (contact !== null) {
                        setContactFieldsFromName(contact, 'businessOwner');
                      } else {
                        clearContact('businessOwner');
                      }
                    }}
                    value={
                      values.businessOwner?.euaUserId
                        ? values.businessOwner
                        : undefined
                    }
                    disabled={!!isReqAndBusOwnerSame}
                  />
                </FieldGroup>
                {/* Business Owner Component */}
                <FieldGroup
                  scrollElement="businessOwner.component"
                  error={!!flatErrors['businessOwner.component']}
                >
                  <Label htmlFor="IntakeForm-BusinessOwnerComponent">
                    {t('contactDetails.businessOwner.component')}
                  </Label>
                  <FieldErrorMsg>
                    {flatErrors['businessOwner.component']}
                  </FieldErrorMsg>
                  <Field
                    disabled={isReqAndBusOwnerSame}
                    as={Dropdown}
                    id="IntakeForm-BusinessOwnerComponent"
                    name="businessOwner.component"
                  >
                    <option value="" disabled>
                      {t('Select an option')}
                    </option>
                    {cmsDivisionsAndOfficesOptions('BusinessOwnerComponent')}
                  </Field>
                </FieldGroup>
                {/* Business Owner Email */}
                <FieldGroup
                  scrollElement="businessOwner.email"
                  error={!!flatErrors['businessOwner.email']}
                >
                  <Label htmlFor="IntakeForm-BusinessOwnerEmail">
                    {t('contactDetails.businessOwner.email')}
                  </Label>
                  <FieldErrorMsg>
                    {flatErrors['businessOwner.email']}
                  </FieldErrorMsg>
                  <Field
                    disabled
                    as={TextInput}
                    id="IntakeForm-BusinessOwnerEmail"
                    name="businessOwner.email"
                  />
                </FieldGroup>
                {/* Product Manager Name */}
                <FieldGroup
                  scrollElement="productManager.commonName"
                  error={!!flatErrors['productManager.commonName']}
                >
                  <h4 className="margin-bottom-1">
                    {t('contactDetails.productManager.name')}
                  </h4>
                  <HelpText id="IntakeForm-ProductManagerHelp">
                    {t('contactDetails.productManager.helpText')}
                  </HelpText>
                  <Field
                    as={Checkbox}
                    id="IntakeForm-IsProductManagerSameAsRequester"
                    label="CMS Project/Product Manager, or lead is same as requester"
                    name="isProductManagerSameAsRequester"
                    checked={!!isReqAndProductManagerSame}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setContactFromCheckbox(
                        'productManager',
                        !!e.target.checked
                      )
                    }
                    value=""
                  />
                  <Label
                    className="margin-bottom-1"
                    htmlFor="IntakeForm-ProductManagerName"
                  >
                    {t('contactDetails.productManager.nameField')}
                  </Label>
                  <FieldErrorMsg>
                    {flatErrors['productManager.commonName']}
                  </FieldErrorMsg>
                  <CedarContactSelect
                    id="IntakeForm-ProductManagerName"
                    name="productManager.commonName"
                    ariaDescribedBy="IntakeForm-ProductManagerHelp"
                    onChange={contact => {
                      if (contact !== null)
                        setContactFieldsFromName(contact, 'productManager');
                    }}
                    value={
                      values.productManager?.euaUserId
                        ? values.productManager
                        : undefined
                    }
                    disabled={!!isReqAndProductManagerSame}
                  />
                </FieldGroup>
                {/* Product Manager Component */}
                <FieldGroup
                  scrollElement="productManager.component"
                  error={!!flatErrors['productManager.component']}
                >
                  <Label htmlFor="IntakeForm-ProductManagerComponent">
                    {t('contactDetails.productManager.component')}
                  </Label>
                  <FieldErrorMsg>
                    {flatErrors['productManager.component']}
                  </FieldErrorMsg>
                  <Field
                    as={Dropdown}
                    id="IntakeForm-ProductManagerComponent"
                    label="Product Manager Component"
                    name="productManager.component"
                    disabled={isReqAndProductManagerSame}
                  >
                    <option value="" disabled>
                      {t('Select an option')}
                    </option>
                    {cmsDivisionsAndOfficesOptions('ProductManagerComponent')}
                  </Field>
                </FieldGroup>
                {/* Product Manager Email */}
                <FieldGroup
                  scrollElement="productManager.email"
                  error={!!flatErrors['productManager.email']}
                >
                  <Label htmlFor="IntakeForm-ProductManagerEmail">
                    {t('contactDetails.productManager.email')}
                  </Label>
                  <FieldErrorMsg>
                    {flatErrors['productManager.email']}
                  </FieldErrorMsg>
                  <Field
                    disabled
                    as={TextInput}
                    id="IntakeForm-ProductManagerEmail"
                    name="productManager.email"
                  />
                </FieldGroup>
                {/* ISSO */}
                <FieldGroup
                  scrollElement="isso.isPresent"
                  error={!!flatErrors['isso.isPresent']}
                >
                  <fieldset className="usa-fieldset margin-top-3">
                    <legend className="usa-label margin-bottom-1">
                      {t('contactDetails.isso.label')}
                    </legend>
                    <HelpText id="IntakeForm-ISSOHelp">
                      {t('contactDetails.isso.helpText')}
                    </HelpText>
                    <FieldErrorMsg>
                      {flatErrors['isso.isPresent']}
                    </FieldErrorMsg>

                    <Field
                      as={Radio}
                      id="IntakeForm-HasIssoYes"
                      name="isso.isPresent"
                      label="Yes"
                      value
                      checked={values.isso.isPresent}
                      onChange={() => setFieldValue('isso.isPresent', true)}
                      aria-describedby="IntakeForm-ISSOHelp"
                      aria-expanded={values.isso.isPresent === true}
                      aria-controls="isso-name-container"
                    />
                    {values.isso.isPresent && (
                      <div
                        data-testid="isso-name-container"
                        className="margin-left-4 margin-bottom-3"
                      >
                        <FieldGroup
                          scrollElement="isso.commonName"
                          error={!!flatErrors['isso.commonName']}
                          className="margin-top-2"
                        >
                          <Label htmlFor="IntakeForm-IssoName">
                            {t('contactDetails.isso.name')}
                          </Label>
                          <FieldErrorMsg>
                            {flatErrors['isso.commonName']}
                          </FieldErrorMsg>
                          <CedarContactSelect
                            id="IntakeForm-IssoName"
                            name="isso.commonName"
                            onChange={contact =>
                              setContactFieldsFromName(contact, 'isso')
                            }
                            value={
                              values?.isso?.euaUserId
                                ? {
                                    commonName: values?.isso?.commonName,
                                    euaUserId: values?.isso?.euaUserId
                                  }
                                : undefined
                            }
                          />
                        </FieldGroup>
                        {/* ISSO Component */}
                        <FieldGroup
                          scrollElement="isso.component"
                          error={!!flatErrors['isso.component']}
                        >
                          <Label htmlFor="IntakeForm-IssoComponent">
                            {t('contactDetails.isso.component')}
                          </Label>
                          <FieldErrorMsg>
                            {flatErrors['isso.component']}
                          </FieldErrorMsg>
                          <Field
                            as={Dropdown}
                            id="IntakeForm-IssoComponent"
                            label="ISSO Component"
                            name="isso.component"
                          >
                            <option value="" disabled>
                              {t('Select an option')}
                            </option>
                            {cmsDivisionsAndOfficesOptions('IssoComponent')}
                          </Field>
                        </FieldGroup>
                        {/* ISSO Email */}
                        <FieldGroup
                          scrollElement="isso.email"
                          error={!!flatErrors['isso.email']}
                        >
                          <Label htmlFor="IntakeForm-IssoEmail">
                            {t('contactDetails.isso.email')}
                          </Label>
                          <FieldErrorMsg>
                            {flatErrors['isso.email']}
                          </FieldErrorMsg>
                          <Field
                            disabled
                            as={TextInput}
                            id="IntakeForm-IssoEmail"
                            name="isso.email"
                          />
                        </FieldGroup>
                      </div>
                    )}
                    <Field
                      as={Radio}
                      value={false}
                      checked={!values.isso.isPresent}
                      id="IntakeForm-HasIssoNo"
                      name="isso.isPresent"
                      label="No"
                      onChange={() => clearContact('isso')}
                    />
                  </fieldset>
                </FieldGroup>
                {/* Add new contacts */}
                {flags.notifyMultipleRecipients && (
                  <AdditionalContacts
                    systemIntakeId={id}
                    activeContact={activeContact}
                    setActiveContact={setActiveContact}
                    className="margin-top-4"
                  />
                )}
                {/* Governance Teams */}
                <FieldGroup
                  scrollElement="governanceTeams.isPresent"
                  error={!!flatErrors['governanceTeams.isPresent']}
                >
                  <fieldset
                    data-testid="governance-teams-fieldset"
                    className="usa-fieldset margin-top-3 margin-bottom-105"
                  >
                    <legend className="usa-label margin-bottom-1">
                      {t('contactDetails.collaboration.label')}
                    </legend>
                    <HelpText id="IntakeForm-Collaborators">
                      {t('contactDetails.collaboration.helpText')}
                    </HelpText>
                    <FieldErrorMsg>
                      {flatErrors['governanceTeams.isPresent']}
                    </FieldErrorMsg>

                    <Field
                      as={Radio}
                      checked={values.governanceTeams.isPresent === true}
                      id="IntakeForm-YesGovernanceTeams"
                      name="governanceTeams.isPresent"
                      label={t('contactDetails.collaboration.oneOrMore')}
                      onChange={() => {
                        setFieldValue('governanceTeams.isPresent', true);
                      }}
                      value
                      aria-describedby="IntakeForm-Collaborators"
                    />
                    <div className="margin-left-3">
                      <FieldGroup
                        scrollElement="governanceTeams.teams"
                        error={!!flatErrors['governanceTeams.teams']}
                        className="margin-top-105"
                      >
                        <FieldErrorMsg>
                          {flatErrors['governanceTeams.teams']}
                        </FieldErrorMsg>
                        <GovernanceTeamOptions formikProps={formikProps} />
                      </FieldGroup>
                    </div>

                    <Field
                      as={Radio}
                      checked={values.governanceTeams.isPresent === false}
                      id="IntakeForm-NoGovernanceTeam"
                      name="governanceTeams.isPresent"
                      label={t('contactDetails.collaboration.none')}
                      onChange={() => {
                        setFieldValue('governanceTeams.isPresent', false);
                        setFieldValue('governanceTeams.teams', []);
                      }}
                      value={false}
                    />
                  </fieldset>
                </FieldGroup>
                <Button
                  disabled={!!activeContact}
                  type="button"
                  onClick={() => {
                    formikProps.validateForm().then(err => {
                      if (Object.keys(err).length === 0) {
                        onSubmit(values, formikProps).then(response => {
                          if (!response?.errors) {
                            history.push('request-details');
                          }
                        });
                      } else {
                        window.scrollTo(0, 0);
                      }
                    });
                  }}
                >
                  {t('Next')}
                </Button>
                <div className="margin-y-3">
                  <Button
                    disabled={!!activeContact}
                    type="button"
                    unstyled
                    onClick={() => {
                      onSubmit(values, formikProps).then(response => {
                        if (!response?.errors) {
                          history.push(saveExitLink);
                        }
                      });
                    }}
                  >
                    <span className="display-flex flex-align-center">
                      <IconNavigateBefore /> {t('Save & Exit')}
                    </span>
                  </Button>
                </div>
              </Form>
            </div>
            <AutoSave
              values={values}
              onSave={() => {
                if (formikRef?.current?.values)
                  onSubmit(formikRef.current.values, formikProps);
              }}
              debounceDelay={3000}
            />
            <PageNumber currentPage={1} totalPages={3} />
          </>
        );
      }}
    </Formik>
  );
};

export default ContactDetails;
