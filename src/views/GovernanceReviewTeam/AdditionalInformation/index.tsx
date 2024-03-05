import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { Button } from '@trussworks/react-uswds';
import { Field, Form, Formik, FormikProps } from 'formik';
import { DateTime } from 'luxon';

import UswdsReactLink from 'components/LinkWrapper';
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
import SystemCard from 'components/SystemCard';
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
  const { t } = useTranslation('governanceReviewTeam');

  return (
    <div>
      <PageHeading className="margin-y-0">
        {t('additionalInformation.title')}
      </PageHeading>

      <p className="font-body-md line-height-body-4 text-light margin-top-05 margin-bottom-2">
        {t('additionalInformation.description')}
      </p>

      <div className="margin-bottom-4">
        <span className="font-body-md line-height-body-4 margin-right-1 text-base">
          {t('additionalInformation.somethingIncorrect')}
        </span>

        <UswdsReactLink to={`/system/link/${systemIntake.id}`}>
          {t('additionalInformation.editInformation')}
        </UswdsReactLink>
      </div>

      {systemIntake.systems.map(system => (
        <SystemCard
          id={system.id}
          name={system.name}
          description={system.description}
          acronym={system.acronym}
          businessOwnerOrg={system.businessOwnerOrg}
          businessOwners="Patrick Segura" // TODO: fill with role info once BE is done
        />
      ))}
      {/* <SystemCard id={systemIntake.id} /> */}
    </div>
  );
};

export default AdditionalInformation;
