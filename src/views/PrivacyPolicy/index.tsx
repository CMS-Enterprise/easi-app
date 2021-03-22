import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Link } from '@trussworks/react-uswds';

import Footer from 'components/Footer';
import Header from 'components/Header';
import MainContent from 'components/MainContent';
import PageHeading from 'components/PageHeading';
import PageWrapper from 'components/PageWrapper';

const PrivacyPolicy = () => {
  const { t } = useTranslation();

  // store your i18n array into a variable, and use typescript to cast it as an array of strings
  const infoCollectedWhenYouBrowseList: string[] = t(
    'privacyPolicy:infoWeCollect:autoCollect:whenYouBrowse.infoList',
    { returnObjects: true }
  );
  const infoCollectedWhenYouBrowseUsageList: string[] = t(
    'privacyPolicy:infoWeCollect:autoCollect:whenYouBrowse.usageList',
    { returnObjects: true }
  );

  const thirdPartyAnalyticsUsageList: string[] = t(
    'privacyPolicy:infoUsage:thirdPartyAnalytics.usageList',
    { returnObjects: true }
  );

  const socialMediaUsageList: string[] = t(
    'privacyPolicy:linksToOtherSites:socialMedia.usageList',
    { returnObjects: true }
  );

  const personalInfoCriteriaList: string[] = t(
    'privacyPolicy:personalInfo.criteriaList',
    { returnObjects: true }
  );

  const trackingInformationList: string[] = t(
    'privacyPolicy:tracking.trackingDescription',
    { returnObjects: true }
  );

  const webAnalyticsToolsInformationList: string[] = t(
    'privacyPolicy:thirdParty:webAnalyticsTools.collectionList',
    { returnObjects: true }
  );
  const webAnalyticsToolsInformationUsageList: string[] = t(
    'privacyPolicy:thirdParty:webAnalyticsTools.usageList',
    { returnObjects: true }
  );

  return (
    <PageWrapper>
      <Header />
      <MainContent className="grid-container line-height-body-5 margin-bottom-5">
        <PageHeading>{t('privacyPolicy:mainTitle')}</PageHeading>

        {/* CMS.gov Privacy Policy */}
        <div>
          <h2>{t('privacyPolicy:policy.heading')}</h2>

          <p>
            {t('privacyPolicy:policy.info')}
            <Link
              aria-label="Open 'CMS Privacy Policy' in a new tab"
              href="https://www.cms.gov/About-CMS/Agency-Information/Aboutwebsite/Privacy-Policy"
              target="_blank"
              rel="noopener noreferrer"
              variant="external"
            >
              {t('privacyPolicy:policy.cmsPolicy')}
            </Link>
          </p>

          <p>
            {t('privacyPolicy:policy.collectionDescription')}
            <Link href="#info-we-collect">
              {t('privacyPolicy:infoWeCollect.heading')}
            </Link>
          </p>

          <p>{t('privacyPolicy:policy.personallyIdentifiableInfo')}</p>

          <p>
            {t('privacyPolicy:policy.sellingInfo')}
            <Link href="#info-usage">
              {t('privacyPolicy:infoUsage.heading')}
            </Link>
          </p>
        </div>

        {/* Types of information we collect */}
        <div>
          <h2 id="info-we-collect">
            {t('privacyPolicy:infoWeCollect.heading')}
          </h2>

          {/* auto collect */}
          <h3>{t('privacyPolicy:infoWeCollect:autoCollect.heading')}</h3>
          <h4>
            {t('privacyPolicy:infoWeCollect:autoCollect:whenYouBrowse.heading')}
          </h4>

          <p>
            {t(
              'privacyPolicy:infoWeCollect:autoCollect:whenYouBrowse.description'
            )}
          </p>

          <ul>
            {infoCollectedWhenYouBrowseList.map(k => (
              <li key={k}>{k}</li>
            ))}
          </ul>

          <p>
            {t(
              'privacyPolicy:infoWeCollect:autoCollect:whenYouBrowse.moreInfo'
            )}
            <Link href="#third-party-sites-usage">
              {t('privacyPolicy:thirdParty.heading')}
            </Link>
          </p>

          <p>
            {t(
              'privacyPolicy:infoWeCollect:autoCollect:whenYouBrowse.usageDescription'
            )}
          </p>
          <ul>
            {infoCollectedWhenYouBrowseUsageList.map(k => (
              <li key={k}>{k}</li>
            ))}
          </ul>

          <p>
            {t(
              'privacyPolicy:infoWeCollect:autoCollect:whenYouBrowse.additionalUsage'
            )}
            <Link href="#third-party-sites-usage">
              {t('privacyPolicy:thirdParty.heading')}
            </Link>
          </p>

          {/* provided */}
          <h3>{t('privacyPolicy:infoWeCollect:provided.heading')}</h3>
          <h4>{t('privacyPolicy:infoWeCollect:provided:requested.heading')}</h4>

          <p>
            {t('privacyPolicy:infoWeCollect:provided:requested.whyWeCollect')}
            <Link
              aria-label="Open 'Subscriber Preferences' in a new tab"
              href="https://public.govdelivery.com/accounts/USCMS/subscriber/new?preferences=true"
              target="_blank"
              rel="noopener noreferrer"
              variant="external"
            >
              {t(
                'privacyPolicy:infoWeCollect:provided:requested.subscriptionPrefs'
              )}
            </Link>
          </p>
        </div>

        {/* How CMS uses information collected on CMS.gov */}
        <div>
          <h2 id="info-usage">{t('privacyPolicy:infoUsage.heading')}</h2>

          {/* sending you CMS messages */}
          <h3>{t('privacyPolicy:infoUsage:sendingYouMessages.heading')}</h3>
          <p>{t('privacyPolicy:infoUsage:sendingYouMessages.description')}</p>

          {/* conducting surveys */}
          <h3>{t('privacyPolicy:infoUsage:conductingSurveys.heading')}</h3>
          <p>{t('privacyPolicy:infoUsage:conductingSurveys.description')}</p>

          {/* third party analytics */}
          <h3>{t('privacyPolicy:infoUsage:thirdPartyAnalytics.heading')}</h3>
          <p>{t('privacyPolicy:infoUsage:thirdPartyAnalytics.description')}</p>
          <ul>
            {thirdPartyAnalyticsUsageList.map(k => (
              <li key={k}>{k}</li>
            ))}
          </ul>

          <p>{t('privacyPolicy:infoUsage:thirdPartyAnalytics.reports')}</p>

          {/* third party outreach */}
          <h3>{t('privacyPolicy:infoUsage:thirdPartyOutreach.heading')}</h3>

          <p>{t('privacyPolicy:infoUsage:thirdPartyOutreach.webServices')}</p>
          <p>
            {t('privacyPolicy:infoUsage:thirdPartyOutreach.userTraffic')}
            <Link href="#third-party-sites-usage">
              {t('privacyPolicy:thirdParty.heading')}
            </Link>
          </p>
          <p>
            {t('privacyPolicy:infoUsage:thirdPartyOutreach.digitalAdvertising')}
            <Link href="#tracking-and-data-collection">
              {t('privacyPolicy:tracking.heading')}
            </Link>
          </p>
          <p>
            {t('privacyPolicy:infoUsage:thirdPartyOutreach.aggregateReports')}
          </p>
        </div>

        {/* How CMS uses cookies & other technologies on CMS.gov */}
        <div>
          <h2>{t('privacyPolicy:cookiesUsage.heading')}</h2>
          <p>
            {t('privacyPolicy:cookiesUsage.ombMemo')}
            <Link
              aria-label="Open 'M-10-22 Memo' in a new tab"
              href="https://www.whitehouse.gov/sites/whitehouse.gov/files/omb/memoranda/2010/m10-22.pdf"
              target="_blank"
              rel="noopener noreferrer"
              variant="external"
            >
              {t('privacyPolicy:cookiesUsage.memoName')}
            </Link>
            {t('privacyPolicy:cookiesUsage.guidance')}
          </p>
          <p>{t('privacyPolicy:cookiesUsage.whatIsACookie')}</p>

          {/* types of cookies */}
          <p>{t('privacyPolicy:cookiesUsage.typesOfCookies')}</p>
          <ul>
            <li>
              <Trans i18nKey="privacyPolicy:cookiesUsage:cookies.sessionCookies">
                <strong>indexZero</strong>&nbsp;indexOne
              </Trans>
            </li>
            <li>
              <Trans i18nKey="privacyPolicy:cookiesUsage:cookies.persistentCookies">
                <strong>indexZero</strong>&nbsp;indexOne
              </Trans>
            </li>
          </ul>

          {/* additional technology usage */}
          <p>{t('privacyPolicy:cookiesUsage.additionalTech')}</p>
          <ul>
            <li>
              <Trans i18nKey="privacyPolicy:cookiesUsage:additionalTechUsage.persistentCookies">
                <strong>indexZero</strong>&nbsp;indexOne
              </Trans>
            </li>
            <li>
              <Trans i18nKey="privacyPolicy:cookiesUsage:additionalTechUsage.webBeacons">
                <strong>indexZero</strong>&nbsp;indexOne
              </Trans>
              &nbsp;
              <Link href="#third-party-sites-usage">
                {t('privacyPolicy:thirdParty.heading')}
              </Link>
            </li>
            <li>
              <Trans i18nKey="privacyPolicy:cookiesUsage:additionalTechUsage.websiteLogFiles">
                <strong>indexZero</strong>&nbsp;indexOne
              </Trans>
            </li>
            <li>
              <Trans i18nKey="privacyPolicy:cookiesUsage:additionalTechUsage.flash">
                <strong>indexZero</strong>&nbsp;indexOne
              </Trans>
            </li>
            <li>
              <Trans i18nKey="privacyPolicy:cookiesUsage:additionalTechUsage.localStorageObjects">
                <strong>indexZero</strong>&nbsp;indexOne
              </Trans>
            </li>
          </ul>
        </div>

        {/* Your choices about tracking & data collection on CMS.gov */}
        <div>
          <h2 id="tracking-and-data-collection">
            {t('privacyPolicy:tracking.heading')}
          </h2>
          {trackingInformationList.map(k => (
            <p key={k}>{k}</p>
          ))}

          <p>
            <Trans i18nKey="privacyPolicy:tracking.adChoice">
              <strong>indexZero</strong>&nbsp;indexOne
            </Trans>
            <Link href="#third-party-sites-usage">
              {t('privacyPolicy:thirdParty.heading')}
            </Link>
            {t('privacyPolicy:tracking.adChoiceIcon')}
          </p>

          <p>
            <Trans i18nKey="privacyPolicy:tracking.doNotTrack">
              <strong>indexZero</strong>&nbsp;indexOne
            </Trans>
            <Link href="#third-party-sites-usage">
              {t('privacyPolicy:thirdParty.heading')}
            </Link>
            &nbsp;
            <Link
              aria-label="Open 'Do Not Track' in a new tab"
              href="https://www.eff.org/issues/do-not-track"
              target="_blank"
              rel="noopener noreferrer"
              variant="external"
            >
              {t('privacyPolicy:tracking.doNotTrackHelp')}
            </Link>
          </p>
        </div>

        {/* How CMS uses third-party websites & applications with CMS.gov */}
        <div>
          <h2 id="third-party-sites-usage">
            {t('privacyPolicy:thirdParty.heading')}
          </h2>
          <p>{t('privacyPolicy:thirdParty.description')}</p>

          {/* third party websites */}
          <h3>{t('privacyPolicy:thirdParty:websites.heading')}</h3>
          <p>{t('privacyPolicy:thirdParty:websites.activityGovernance')}</p>

          {/* web analytics tools */}
          <h3>{t('privacyPolicy:thirdParty:webAnalyticsTools.heading')}</h3>

          <p>
            {t(
              'privacyPolicy:thirdParty:webAnalyticsTools.informationCollection'
            )}
          </p>
          <ul>
            {webAnalyticsToolsInformationList.map(k => (
              <li key={k}>{k}</li>
            ))}
          </ul>

          <p>
            {t('privacyPolicy:thirdParty:webAnalyticsTools.informationUsage')}
          </p>
          <ul>
            {webAnalyticsToolsInformationUsageList.map(k => (
              <li key={k}>{k}</li>
            ))}
          </ul>

          <p>{t('privacyPolicy:thirdParty:webAnalyticsTools.optout')}</p>

          {/* digital advertising */}
          <h3>{t('privacyPolicy:thirdParty:digitalAdvertising.heading')}</h3>

          <p>
            {t('privacyPolicy:thirdParty:digitalAdvertising.thirdPartyTools')}
          </p>

          <p>
            <Trans i18nKey="privacyPolicy:thirdParty:digitalAdvertising.clickTracking">
              <strong>indexZero</strong>&nbsp;indexOne
            </Trans>
          </p>

          <p>
            <Trans i18nKey="privacyPolicy:thirdParty:digitalAdvertising.conversionTracking">
              <strong>indexZero</strong>&nbsp;indexOne
            </Trans>
            <Link href="#tracking-and-data-collection">
              {t('privacyPolicy:tracking.heading')}
            </Link>
          </p>

          <p>
            <Trans i18nKey="privacyPolicy:thirdParty:digitalAdvertising.retargeting">
              <strong>indexZero</strong>&nbsp;indexOne
            </Trans>
            <Link href="#tracking-and-data-collection">
              {t('privacyPolicy:tracking.heading')}
            </Link>
          </p>

          <p>
            <Trans i18nKey="privacyPolicy:thirdParty:digitalAdvertising.targetedAdvertising">
              <strong>indexZero</strong>&nbsp;indexOne
            </Trans>
          </p>

          <p>
            {t('privacyPolicy:thirdParty:digitalAdvertising.vendors')}
            <Link href="#tracking-and-data-collection">
              {t('privacyPolicy:tracking.heading')}
            </Link>
          </p>

          <p>
            {t('privacyPolicy:thirdParty:digitalAdvertising.vettingApps')}
            <Link
              aria-label="Open 'CMS Third Party Privacy Policies' in a new tab"
              href="https://www.cms.gov/privacy/third-party-privacy-policies"
              target="_blank"
              rel="noopener noreferrer"
              variant="external"
            >
              {t('privacyPolicy:thirdParty:digitalAdvertising.currentTools')}
            </Link>
            &nbsp;
            <Link
              aria-label="Open 'Risk Assessment of Third Party Tools' in a new tab"
              href="https://www.hhs.gov/pia/index/index.html"
              target="_blank"
              rel="noopener noreferrer"
              variant="external"
            >
              {t('privacyPolicy:thirdParty:digitalAdvertising.riskAssessments')}
            </Link>
          </p>
        </div>

        {/* How CMS protects your personal information */}
        <div>
          <h2>{t('privacyPolicy:personalInfo.heading')}</h2>
          <p>{t('privacyPolicy:personalInfo.alertsOrNews')}</p>
          <p>{t('privacyPolicy:personalInfo.disclosure')}</p>

          <p>
            {t('privacyPolicy:personalInfo.contact')}
            <Link
              aria-label="Open 'Privacy Act of 1974' in a new tab"
              href="https://www.govinfo.gov/content/pkg/USCODE-2012-title5/pdf/USCODE-2012-title5-partI-chap5-subchapII-sec552a.pdf"
              target="_blank"
              rel="noopener noreferrer"
              variant="external"
            >
              {t('privacyPolicy:personalInfo.privacyAct')}
            </Link>
            {t('privacyPolicy:personalInfo.amended')}
            <Link
              aria-label="Open '5 U.S.C. Section 552a' in a new tab"
              href="https://www.govinfo.gov/app/details/USCODE-2010-title5/USCODE-2010-title5-partI-chap5-subchapII-sec552a"
              target="_blank"
              rel="noopener noreferrer"
              variant="external"
            >
              {t('privacyPolicy:personalInfo.USCSection552')}
            </Link>
          </p>

          <p>{t('privacyPolicy:personalInfo.retrievalSystem')}</p>

          <ol>
            {personalInfoCriteriaList.map(k => (
              <li key={k}>{k}</li>
            ))}
          </ol>

          <p>
            {t('privacyPolicy:personalInfo.additionalInformation')}
            <Link href="mailto:Privacy@cms.hhs.gov">
              {t('privacyPolicy:personalInfo.privacyEmail')}
            </Link>
          </p>
          <p>{t('privacyPolicy:personalInfo.thirdPartyServices')}</p>
        </div>

        {/* How long CMS keeps data & how it’s accessed */}
        <div>
          <h2>{t('privacyPolicy:dataLifecycle.heading')}</h2>
          <p>{t('privacyPolicy:dataLifecycle.destruction')}</p>
          <p>
            {t('privacyPolicy:dataLifecycle.storageDisclaimer')}
            <Link
              aria-label="Open 'Privacy Impact Assessments' in a new tab"
              href="https://www.hhs.gov/pia/index.html"
              target="_blank"
              rel="noopener noreferrer"
              variant="external"
            >
              {t('privacyPolicy:dataLifecycle.explanation')}
            </Link>
            {t('privacyPolicy:dataLifecycle.longerLifecycle')}
          </p>
        </div>

        {/* Children & Privacy on CMS.gov */}
        <div>
          <h2>{t('privacyPolicy:childPrivacy.heading')}</h2>
          <p>{t('privacyPolicy:childPrivacy.description')}</p>
        </div>

        {/* Links to Other Sites */}
        <div>
          <h2>{t('privacyPolicy:linksToOtherSites.heading')}</h2>
          <p>{t('privacyPolicy:linksToOtherSites.description')}</p>

          <h3>{t('privacyPolicy:linksToOtherSites:socialMedia.heading')}</h3>
          <p>{t('privacyPolicy:linksToOtherSites:socialMedia.usage')}</p>
          <ul>
            {socialMediaUsageList.map(k => (
              <li key={k}>{k}</li>
            ))}
          </ul>

          <Trans i18nKey="privacyPolicy:linksToOtherSites:socialMedia.disclaimer">
            <strong>indexZero</strong>&nbsp;indexOne
          </Trans>
          <p>{t('privacyPolicy:linksToOtherSites:socialMedia.infoStorage')}</p>

          <ul>
            <li>
              <Link
                aria-label="Open 'Facebook Privacy Policy' in a new tab"
                href="https://www.facebook.com/policies"
                target="_blank"
                rel="noopener noreferrer"
                variant="external"
              >
                {t('privacyPolicy:linksToOtherSites:socialMedia.facebook')}
              </Link>
            </li>
            <li>
              <Link
                aria-label="Open 'Twitter Privacy Policy' in a new tab"
                href="https://twitter.com/en/privacy"
                target="_blank"
                rel="noopener noreferrer"
                variant="external"
              >
                {t('privacyPolicy:linksToOtherSites:socialMedia.twitter')}
              </Link>
            </li>
            <li>
              <Link
                aria-label="Open 'YouTube Privacy Policy' in a new tab"
                href="https://support.google.com/youtube/answer/7671399?p=privacy_guidelines&hl=en&visit_id=637341420338082975-3155661882&rd=1"
                target="_blank"
                rel="noopener noreferrer"
                variant="external"
              >
                {t('privacyPolicy:linksToOtherSites:socialMedia.youTube')}
              </Link>
            </li>
            <li>
              <Link
                aria-label="Open 'LinkedIn Privacy Policy' in a new tab"
                href="https://www.linkedin.com/legal/privacy-policy"
                target="_blank"
                rel="noopener noreferrer"
                variant="external"
              >
                {t('privacyPolicy:linksToOtherSites:socialMedia.linkedIn')}
              </Link>
            </li>
          </ul>
        </div>

        {/* Additional Privacy Information  */}
        <div>
          <h2>{t('privacyPolicy:additionalInformation.heading')}</h2>
          <Link
            aria-label="Open 'Privacy Statistics' in a new tab"
            href="https://www.cms.gov/Research-Statistics-Data-and-Systems/Computer-Data-and-Systems/Privacy"
            target="_blank"
            rel="noopener noreferrer"
            variant="external"
          >
            {t('privacyPolicy:additionalInformation.policies')}
          </Link>
        </div>
      </MainContent>
      <Footer />
    </PageWrapper>
  );
};

export default PrivacyPolicy;
