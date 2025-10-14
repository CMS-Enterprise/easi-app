import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';
import { Button, GridContainer, Icon } from '@trussworks/react-uswds';
import { SystemProfileLockableSection } from 'gql/generated/graphql';

import Alert from 'components/Alert';
import Breadcrumbs from 'components/Breadcrumbs';
import IconLink from 'components/IconLink';
import PageHeading from 'components/PageHeading';
import PercentCompleteTag from 'components/PercentCompleteTag';
import { systemProfileLockableSections } from 'constants/systemProfile';

import './index.scss';

type SystemProfileFormWrapperProps = {
  children: React.ReactNode;
  section: SystemProfileLockableSection;
  readOnly?: boolean;
  showPendingChangesAlert?: boolean;
};

/**
 * Wrapper for the edit system profile form.
 *
 * Includes header, section title/description, and form navigation footer.
 */
const SystemProfileFormWrapper = ({
  children,
  section,
  readOnly,
  showPendingChangesAlert
}: SystemProfileFormWrapperProps) => {
  const { t } = useTranslation('systemProfile');
  const history = useHistory();

  const { systemId } = useParams<{
    systemId: string;
  }>();

  /** Returns next section enum/key and route if it exists */
  const nextSection = useMemo(() => {
    const sectionIndex = systemProfileLockableSections.findIndex(
      s => s.key === section
    );

    const sectionCount = systemProfileLockableSections.length;

    return sectionIndex < sectionCount - 1
      ? systemProfileLockableSections[sectionIndex + 1]
      : undefined;
  }, [section]);

  return (
    <div className="system-profile-form-wrapper">
      <div className="bg-base-lightest padding-bottom-6">
        <GridContainer>
          <Breadcrumbs
            items={[
              { text: t('header:home'), url: '/' },
              {
                text: t('editSystemProfile.form.systemDetails'),
                url: `/systems/${systemId}/edit`
              },
              { text: t('editSystemProfile.form.breadcrumb') }
            ]}
          />

          <PageHeading className="margin-bottom-1">
            {t('editSystemProfile.heading')}
          </PageHeading>

          <PercentCompleteTag
            percentComplete={70}
            translationKey="general:percentCompleteOverall"
          />

          <p className="text-body-lg text-light line-height-body-5 margin-bottom-2 margin-top-3">
            {t('editSystemProfile.form.subheading')}
          </p>

          <p className="font-body-md text-light line-height-body-4 margin-top-1 margin-bottom-4">
            {t('editSystemProfile.form.description')}
          </p>

          <IconLink
            to={`/systems/${systemId}/edit`}
            icon={<Icon.ArrowBack aria-hidden />}
            iconPosition="before"
          >
            {t('form:saveAndExit')}
          </IconLink>
        </GridContainer>
      </div>

      <GridContainer className="padding-top-3 padding-bottom-7">
        <h2 className="margin-bottom-1">
          {t(`sectionCards.${section}.title`)}
        </h2>

        <p className="font-body-md text-light line-height-body-4 margin-top-1">
          {t(`sectionCards.${section}.description`)}
        </p>
        {children}
      </GridContainer>

      <GridContainer className="padding-bottom-10 margin-bottom-3">
        <div className="border-top-1px border-base-light padding-top-2 padding-bottom-1 margin-y-05 display-flex flex-align-center">
          <h4 className="margin-y-0 margin-right-1">
            {t('editSystemProfile.form.sectionCompleteness')}
          </h4>

          {/* TODO EASI-4984: should show external data tag instead of percentage if applicable */}
          <PercentCompleteTag percentComplete={0} />
        </div>

        {showPendingChangesAlert && (
          <Alert type="warning" slim className="margin-bottom-3">
            {t('editSystemProfile.form.pendingChangesAlert')}
          </Alert>
        )}

        <div className="form-button-group margin-top-2 display-flex tablet:flex-align-center flex-gap-105">
          {!readOnly && (
            <Button
              type="submit"
              outline
              onClick={() => history.push(`/systems/${systemId}/edit`)}
            >
              {t('form:saveAndExit')}
            </Button>
          )}

          {nextSection && (
            <Button
              type={readOnly ? 'button' : 'submit'}
              onClick={() =>
                history.push(`/systems/${systemId}/${nextSection.route}`)
              }
            >
              {t(
                readOnly
                  ? 'editSystemProfile.form.continueToNextSection'
                  : 'editSystemProfile.form.saveAndContinue'
              )}
            </Button>
          )}

          {nextSection && (
            <p
              className="margin-y-0 text-base-dark"
              data-testid="next-section-text"
            >
              {t('editSystemProfile.form.nextSection', {
                sectionName: t(
                  `systemProfile:sectionCards.${nextSection.key}.title`
                )
              })}
            </p>
          )}
        </div>

        <IconLink
          to={`/systems/${systemId}/edit`}
          icon={<Icon.ArrowBack aria-hidden />}
          iconPosition="before"
          className="margin-top-105"
        >
          {readOnly ? t('form:exitForm') : t('form:exitFormWithoutSaving')}
        </IconLink>
      </GridContainer>
    </div>
  );
};

export default SystemProfileFormWrapper;
