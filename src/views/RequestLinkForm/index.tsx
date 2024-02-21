import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
// import { useQuery } from '@apollo/client';
import {
  Breadcrumb,
  BreadcrumbBar,
  BreadcrumbLink
} from '@trussworks/react-uswds';

import MainContent from 'components/MainContent';
import PageHeading from 'components/PageHeading';
import MultiSelect from 'components/shared/MultiSelect';
// import GetCedarSystemIdsQuery from 'queries/GetCedarSystemIdsQuery';
// import { GetCedarSystemIds } from 'queries/types/GetCedarSystemIds';

const RequestLinkForm = () => {
  const { t } = useTranslation('intake');

  // const { data, loading, error } = useQuery<GetCedarSystemIds>(
  //   GetCedarSystemIdsQuery
  // );

  const cedarSystemIdOptions = useMemo(() => {
    const data = {
      cedarSystems: [
        {
          id: '000-0000-1',
          name: 'Application Programming Interface Gateway'
        },
        {
          id: '000-0000-2',
          name: 'Blueprint'
        },
        {
          id: '000-0000-3',
          name: 'Value Based Care Management System'
        },
        {
          id: '000-0000-4',
          name: 'CMS Operations Information Network'
        }
      ]
    };
    return (data?.cedarSystems || []).map(system => {
      return {
        label: system!.name!,
        value: system!.id!
      };
    });
    // }, [data]);
  }, []);

  return (
    <MainContent className="grid-container margin-bottom-5">
      <BreadcrumbBar variant="wrap">
        <Breadcrumb>
          <BreadcrumbLink asCustom={Link} to="/">
            <span>{t('navigation.itGovernance')}</span>
          </BreadcrumbLink>
        </Breadcrumb>
        <Breadcrumb current>{t('navigation.startRequest')}</Breadcrumb>
      </BreadcrumbBar>
      <PageHeading>{t('requestTypeForm.heading')}</PageHeading>
      <MultiSelect
        name="cedarSystemIds"
        options={cedarSystemIdOptions}
        onChange={values => {
          // console.log('values', values);
        }}
      />
    </MainContent>
  );
};

export default RequestLinkForm;
