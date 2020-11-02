import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Button } from '@trussworks/react-uswds';

import BreadcrumbNav from 'components/BreadcrumbNav';
import Footer from 'components/Footer';
import Header from 'components/Header';
import MainContent from 'components/MainContent';
import PageWrapper from 'components/PageWrapper';
import CollapsableLink from 'components/shared/CollapsableLink';
import HelpText from 'components/shared/HelpText';
import { RadioField, RadioGroup } from 'components/shared/RadioField';

const RequestTypeForm = () => {
  const [requestType, setRequestType] = useState('');
  const { t } = useTranslation('intake');

  const majorChangesExamples: string[] = t(
    'requestTypeForm.helpAndGuidance.majorChanges.list',
    {
      returnObjects: true
    }
  );

  const handleRequestTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRequestType(e.target.value);
  };

  return (
    <PageWrapper>
      <Header />
      <MainContent className="grid-container margin-bottom-5">
        <BreadcrumbNav className="margin-y-2">
          <li>
            <Link to="/">Home</Link>
            <i className="fa fa-angle-right margin-x-05" aria-hidden />
          </li>
          <li aria-current="location">Make a system request</li>
        </BreadcrumbNav>
        <h1 className="font-heading-2xl margin-top-4">
          {t('requestTypeForm.heading')}
        </h1>
        <h2>{t('requestTypeForm.subheading')}</h2>
        <HelpText className="margin-bottom-4">
          {t('requestTypeForm.info')}
        </HelpText>
        <RadioGroup>
          <RadioField
            id="RequestType-NewSystem"
            className="margin-bottom-4"
            label={t('requestTypeForm.fields.addNewSystem')}
            name="systemType"
            value="NEW"
            onChange={handleRequestTypeChange}
            checked={requestType === 'NEW'}
          />
          <RadioField
            id="RequestType-MajorChangesSystem"
            className="margin-bottom-4"
            label={t('requestTypeForm.fields.majorChanges')}
            name="systemType"
            value="MAJOR_CHANGES"
            onChange={handleRequestTypeChange}
            checked={requestType === 'MAJOR_CHANGES'}
          />
          <RadioField
            id="RequestType-RecompeteSystem"
            className="margin-bottom-4"
            label={t('requestTypeForm.fields.recompete')}
            name="systemType"
            value="RECOMPETE"
            onChange={handleRequestTypeChange}
            checked={requestType === 'RECOMPETE'}
          />
          <RadioField
            id="RequestType-ShutdownSystem"
            className="margin-bottom-4"
            label={t('requestTypeForm.fields.shutdown')}
            name="systemType"
            value="SHUTDOWN"
            onChange={handleRequestTypeChange}
            checked={requestType === 'SHUTDOWN'}
          />
        </RadioGroup>
        <CollapsableLink
          id="MajorChangesAccordion"
          label={t('requestTypeForm.helpAndGuidance.majorChanges.label')}
        >
          <p>{t('requestTypeForm.helpAndGuidance.majorChanges.para')}</p>
          <ul className="line-height-body-6">
            {majorChangesExamples.map(item => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </CollapsableLink>
        <Button className="margin-top-5" type="submit">
          Continue
        </Button>
      </MainContent>
      <Footer />
    </PageWrapper>
  );
};

export default RequestTypeForm;
