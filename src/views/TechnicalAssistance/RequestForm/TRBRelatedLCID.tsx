import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Fieldset, Label, Link } from '@trussworks/react-uswds';
import classNames from 'classnames';

import FieldErrorMsg from 'components/shared/FieldErrorMsg';
import FieldGroup from 'components/shared/FieldGroup';
import HelpText from 'components/shared/HelpText';
import MultiSelect from 'components/shared/MultiSelect';
import useCacheQuery from 'hooks/useCacheQuery';
import GetSystemIntakesWithLCIDS from 'queries/GetSystemIntakesWithLCIDS';
import { GetSystemIntakesWithLCIDS as GetSystemIntakesWithLCIDSType } from 'queries/types/GetSystemIntakesWithLCIDS';

type TRBRelatedLCIDProps = {
  id?: string;
};

const TRBRelatedLCID = ({ id }: TRBRelatedLCIDProps) => {
  const { t } = useTranslation('technicalAssistance');

  const { data, error, loading } = useCacheQuery<GetSystemIntakesWithLCIDSType>(
    GetSystemIntakesWithLCIDS
  );

  const systemIntakes = data?.systemIntakesWithLcids || [];

  return (
    <>
      {/* <MultiSelect
        id="trb-related-requests"
        name="systemIntakes"
        selectedLabel={t('relatedLCIDS')}
        className="margin-top-1"
        options={systemIntakes.map(intake => ({
          value: intake.id,
          label: intake.requestName || ''
        }))}
        onChange={(values: string[]) =>
          setActiveFundingSource({
            action,
            data: { ...activeFundingSource, sources: values }
          })
        }
        initialValues={activeFundingSource.sources}
      /> */}
    </>
  );
};

export default TRBRelatedLCID;
