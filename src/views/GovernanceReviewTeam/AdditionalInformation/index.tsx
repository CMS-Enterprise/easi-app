import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { Button } from '@trussworks/react-uswds';
import { Field, Form, Formik, FormikProps } from 'formik';
import { DateTime } from 'luxon';

import MandatoryFieldsAlert from 'components/MandatoryFieldsAlert';
import PageHeading from 'components/PageHeading';
import {
  DateInputDay,
  DateInputMonth,
  DateInputYear
} from 'components/shared/DateInput';
import { ErrorAlert, ErrorAlertMessage } from 'components/shared/ErrorAlert';
import FieldErrorMsg from 'components/shared/FieldErrorMsg';
import FieldGroup from 'components/shared/FieldGroup';
import HelpText from 'components/shared/HelpText';
import Label from 'components/shared/Label';
import TextField from 'components/shared/TextField';
import { SystemIntake } from 'queries/types/SystemIntake';
import {
  UpdateSystemIntakeReviewDates,
  UpdateSystemIntakeReviewDatesVariables
} from 'queries/types/UpdateSystemIntakeReviewDates';
import UpdateSystemIntakeReviewDatesQuery from 'queries/UpdateSystemIntakeReviewDatesQuery';
import { SubmitDatesForm } from 'types/systemIntake';
import { parseAsUTC } from 'utils/date';
import flattenErrors from 'utils/flattenErrors';
import { DateValidationSchema } from 'validations/systemIntakeSchema';

const AdditionalInformation = ({
  systemIntake
}: {
  systemIntake: SystemIntake;
}) => {
  return <></>;
};

export default AdditionalInformation;
