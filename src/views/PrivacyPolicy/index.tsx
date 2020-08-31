import React from 'react';
import Header from 'components/Header';
import MainContent from 'components/MainContent';
import { Trans, useTranslation } from 'react-i18next';

const PrivacyPolicy = () => {
  const { t } = useTranslation();

  const printUList = ( suggestion: any ) => {
    return <ul>
      {/* {arr.map(k => (
        <li key={k}>{k}</li>
      ))} */}
    </ul>
  }

  // store your i18n array into a variable, and use typescript to cast it as an array of strings
  // TODO: is there a way of passing these lists into a function instead of displaying them manually?
  const infoYouBrowseList: string[] = t('privacyPolicy:informationWhenYouBrowseList', { returnObjects: true });
  const informationWhenYouBrowseUsageList: string[] = t('privacyPolicy:informationWhenYouBrowseUsageList', { returnObjects: true });
  const thirdPartyAnalyticsList: string[] = t('privacyPolicy:thirdPartyAnalyticsList', { returnObjects: true });
  const socialMediaUsageList: string[] = t('privacyPolicy:socialMediaUsageList', { returnObjects: true });
  const personalInfoCriteriaList: string[] = t('privacyPolicy:personalInfoCriteriaList', { returnObjects: true });
  const cookieTypesList: string[] = t('privacyPolicy:cookieTypesList', { returnObjects: true });
  const cookiesTechnologyList: string[] = t('privacyPolicy:cookiesTechnologyList', { returnObjects: true });
  const trackingParagraphList: string[] = t('privacyPolicy:trackingParagraphList', { returnObjects: true });
  const webAnalyticsToolsList1: string[] = t('privacyPolicy:webAnalyticsToolsList1', { returnObjects: true });
  const webAnalyticsToolsList2: string[] = t('privacyPolicy:webAnalyticsToolsList2', { returnObjects: true });

  return (
      <div>
          <Header />
          <MainContent className="grid-container">
            {/* Surround in Trans tags to properly format embedded HTML tags in i18n file */}
            <Trans>
              <h1>{t('privacyPolicy:mainTitle')}</h1>

              {/* CMS.gov Privacy Policy */}
              <h2>{t('privacyPolicy:policyTitle')}</h2>

              <p>
                {t('privacyPolicy:policyParagraph1')}
                <a href="https://www.cms.gov/About-CMS/Agency-Information/Aboutwebsite/Privacy-Policy">{t('privacyPolicy:policyParagraph1Link')}</a>
              </p>

              <p>
                {t('privacyPolicy:policyParagraph2')}
                <a href="#info-we-collect">{t('privacyPolicy:informationMainTitle')}</a>
              </p>

              <p>
                {t('privacyPolicy:policyParagraph3')}
              </p>

              <p>
                {t('privacyPolicy:policyParagraph4')}
                <a href="#info-usage">{t('privacyPolicy:policyParagraph4Link')}</a>
              </p>

              {/* Types of information we collect */}
              <h2 id="info-we-collect">{t('privacyPolicy:informationMainTitle')}</h2>
              <h3>{t('privacyPolicy:informationAutoCollectTitle')}</h3>
              <h4>{t('privacyPolicy:informationWhenYouBrowseTitle')}</h4>
              
              <p>{t('privacyPolicy:informationWhenYouBrowseParagraphs')}</p>
              
              <ul>
                {infoYouBrowseList.map(k => (
                <li key={k}>{k}</li>
                ))}
              </ul>
              
              <p>
                {t('privacyPolicy:informationWhenYouBrowseMoreInfo')}
                <a href="#third-party-sites-usage">{t('privacyPolicy:thirdPartyWebsitesAndAppsTitle')}</a>
              </p>

              <p>{t('privacyPolicy:informationWhenYouBrowseUsage')}</p>
              <ul>
                {informationWhenYouBrowseUsageList.map(k => (
                  <li key={k}>{k}</li>
                ))}
              </ul>

              <p>
                {t('privacyPolicy:informationWhenYouBrowseAdditionalUsage')}
                <a href="#third-party-sites-usage">{t('privacyPolicy:thirdPartyWebsitesAndAppsTitle')}</a>
              </p>

              <h3>{t('privacyPolicy:informationProvidedTitle')}</h3>
              <h4>{t('privacyPolicy:informationRequestedTitle')}</h4>

              <p>
                {t('privacyPolicy:informationRequestedParagraph')}
                <a href="https://public.govdelivery.com/accounts/USCMS/subscriber/new?preferences=true">{t('privacyPolicy:informationRequestedSubscriptionLink')}</a>
              </p>

              {/* How CMS uses information collected on CMS.gov */}
              <h2 id="info-usage">{t('privacyPolicy:informationUsageTitle')}</h2>
              
              <h3>{t('privacyPolicy:sendingCMSMessagesTitle')}</h3>
              <p>{t('privacyPolicy:sendingCMSMessagesParagraph')}</p>

              <h3>{t('privacyPolicy:conductingSurveysTitle')}</h3>
              <p>{t('privacyPolicy:conductingSurveysParagraph')}</p>

              <h3>{t('privacyPolicy:thirdPartyAnalyticsTitle')}</h3>
              <p>{t('privacyPolicy:thirdPartyAnalyticsParagraph1')}</p>
              <ul>
                {thirdPartyAnalyticsList.map(k => (
                  <li key={k}>{k}</li>
                ))}
              </ul>

              <p>{t('privacyPolicy:thirdPartyAnalyticsParagraph2')}</p>

              <h3>{t('privacyPolicy:thirdPartyToolsOutreachTitle')}</h3>

              <p>{t('privacyPolicy:thirdPartyToolsOutreachParagraph1')}</p>
              <p>
                {t('privacyPolicy:thirdPartyToolsOutreachParagraph2')}
                <a href="#third-party-sites-usage">{t('privacyPolicy:thirdPartyWebsitesAndAppsTitle')}</a>
              </p>
              <p>
                {t('privacyPolicy:thirdPartyToolsOutreachParagraph3')}
                <a href="#tracking-and-data-collection">{t('privacyPolicy:thirdPartyToolsOutreachParagraph3Link')}</a>
              </p>
              <p>{t('privacyPolicy:thirdPartyToolsOutreachParagraph4')}</p>

              {/* How CMS uses cookies & other technologies on CMS.gov */}
              <h2>{t('privacyPolicy:cookiesUsageTitle')}</h2>
              <p>
                {t('privacyPolicy:cookiesUsageParagraph1a')}
                <a href="https://www.whitehouse.gov/sites/whitehouse.gov/files/omb/memoranda/2010/m10-22.pdf">{t('privacyPolicy:cookiesUsageParagraph1Memo')}</a>
                {t('privacyPolicy:cookiesUsageParagraph1b')}
              </p>
              <p>{t('privacyPolicy:cookiesUsageParagraph2')}</p>

              <p>{t('privacyPolicy:cookiesUsageParagraph3')}</p>
              <ul>
                  {cookieTypesList.map(k => (
                    <li key={k}>{k}</li>
                  ))}
              </ul>

              <p>{t('privacyPolicy:cookiesUsageParagraph4')}</p>
              <ul>
                  {cookiesTechnologyList.map(k => (
                    <li key={k}>{k}</li>
                  ))}
              </ul>

              {/* Your choices about tracking & data collection on CMS.gov */}
              <h2 id="tracking-and-data-collection">{t('privacyPolicy:trackingTitle')}</h2>
              <p>
                {trackingParagraphList.map(k => (
                  <p>{k}</p>
                ))}
              </p>

              <p>
                {t('privacyPolicy:adChoice1')}
                <a href="#third-party-sites-usage">{t('privacyPolicy:thirdPartyWebsitesAndAppsTitle')}</a>
                {t('privacyPolicy:adChoice2')}
              </p>

              <p>
                {t('privacyPolicy:doNotTrack')}
                <a href="#third-party-sites-usage">{t('privacyPolicy:thirdPartyWebsitesAndAppsTitle')}</a>
                &nbsp;
                <a href="https://www.eff.org/issues/do-not-track">{t('privacyPolicy:doNotTrackLink2')}</a>
              </p>

              {/* How CMS uses third-party websites & applications with CMS.gov */}
              <h2 id="third-party-sites-usage">{t('privacyPolicy:thirdPartyWebsitesAndAppsTitle')}</h2>
              <p>{t('privacyPolicy:thirdPartyWebsitesAndAppsParagraph')}</p>

              <h3>{t('privacyPolicy:thirdPartyWebsitesTitle')}</h3>
              <p>{t('privacyPolicy:thirdPartyWebsitesparagraph')}</p>

              <h3>{t('privacyPolicy:webAnalyticsToolsTitle')}</h3>

              <p>{t('privacyPolicy:webAnalyticsToolsParagraph1')}</p>
              <ul>
                {webAnalyticsToolsList1.map(k => (
                    <li key={k}>{k}</li>
                ))}
              </ul>

              <p>{t('privacyPolicy:webAnalyticsToolsParagraph2')}</p>
              <ul>
                {webAnalyticsToolsList2.map(k => (
                    <li key={k}>{k}</li>
                ))}
              </ul>

              <p>{t('privacyPolicy:webAnalyticsToolsParagraph3')}</p>

              <h3>{t('privacyPolicy:digitalAdvertisingTitle')}</h3>

              <p>{t('privacyPolicy:digitalAdvertisingParagraph1')}</p>
              <p>{t('privacyPolicy:digitalAdvertisingParagraph2')}</p>

              <p>
                {t('privacyPolicy:digitalAdvertisingParagraph3')}
                <a href="#tracking-and-data-collection">{t('privacyPolicy:trackingTitle')}</a>  
              </p>

              <p>
                {t('privacyPolicy:digitalAdvertisingParagraph4')}
                <a href="#tracking-and-data-collection">{t('privacyPolicy:trackingTitle')}</a>
              </p>

              <p>{t('privacyPolicy:digitalAdvertisingParagraph5')}</p>

              <p>
                {t('privacyPolicy:digitalAdvertisingParagraph6')}
                <a href="#tracking-and-data-collection">{t('privacyPolicy:trackingTitle')}</a>
              </p>

              <p>
                {t('privacyPolicy:digitalAdvertisingParagraph7')}
                <a href="https://www.cms.gov/privacy/third-party-privacy-policies">{t('privacyPolicy:digitalAdvertisingParagraph7Link1')}</a>
                &nbsp;
                <a href="https://www.hhs.gov/pia/index/index.html">{t('privacyPolicy:digitalAdvertisingParagraph7Link2')}</a>
              </p>

              {/* How CMS protects your personal information */}
              <h2>{t('privacyPolicy:personalInfoTitle')}</h2>
              <p>{t('privacyPolicy:personalInfoParagraph1')}</p>
              <p>{t('privacyPolicy:personalInfoParagraph2')}</p>
              
              <p>
                {t('privacyPolicy:personalInfoParagraph3a')}
                <a href="https://www.govinfo.gov/content/pkg/USCODE-2012-title5/pdf/USCODE-2012-title5-partI-chap5-subchapII-sec552a.pdf">{t('privacyPolicy:personalInfoParagraph3Link1')}</a>
                {t('privacyPolicy:personalInfoParagraph3b')}
                <a href="https://www.govinfo.gov/app/details/USCODE-2010-title5/USCODE-2010-title5-partI-chap5-subchapII-sec552a">{t('privacyPolicy:personalInfoParagraph3Link2')}</a>
              </p>

              <p>{t('privacyPolicy:personalInfoParagraph4')}</p>

              <ol>
                {personalInfoCriteriaList.map(k => (
                  <li key={k}>{k}</li>
                ))}
              </ol>

              <p>
                {t('privacyPolicy:personalInfoParagraph5')}
                <a href="mailto:Privacy@cms.hhs.gov">{t('privacyPolicy:personalInfoPrivacyEmail')}</a>
              </p>
              <p>{t('privacyPolicy:personalInfoParagraph6')}</p>

              {/* How long CMS keeps data & how it’s accessed */}
              <h2>{t('privacyPolicy:dataLifecycleTitle')}</h2>
              <p>{t('privacyPolicy:dataLifecycleParagraph1')}</p>
              <p>
                {t('privacyPolicy:dataLifecycleParagraph2a')}
                <a href="https://www.hhs.gov/pia/index.html">{t('privacyPolicy:dataLifecycleParagraph2Link')}</a>
                {t('privacyPolicy:dataLifecycleParagraph2b')}
              </p>

              {/* Children & Privacy on CMS.gov */}
              <h2>{t('privacyPolicy:childPrivacyTitle')}</h2>
              <p>{t('privacyPolicy:childPrivacyParagraph')}</p>

              {/* Links to Other Sites */}
              <h2>{t('privacyPolicy:linksToOtherSitesTitle')}</h2>
              <p>{t('privacyPolicy:linkToOtherSiteParagraph')}</p>
              <h3>{t('privacyPolicy:socialMediaTitle')}</h3>
              <p>{t('privacyPolicy:socialMediaParagraph1')}</p>
              <ul>
                {socialMediaUsageList.map(k => (
                  <li key={k}>{k}</li>
                ))}
              </ul>

              <p>{t('privacyPolicy:socialMediaParagraph2')}</p>
              <p>{t('privacyPolicy:socialMediaParagraph3')}</p>

              <u>
                <li><a href="https://www.facebook.com/policies">{t('privacyPolicy:facebook')}</a></li>
                <li><a href="https://twitter.com/en/privacy">{t('privacyPolicy:twitter')}</a></li>
                <li><a href="https://support.google.com/youtube/answer/7671399?p=privacy_guidelines&hl=en&visit_id=637341420338082975-3155661882&rd=1">{t('privacyPolicy:youTube')}</a></li>
                <li><a href="https://www.linkedin.com/legal/privacy-policy">{t('privacyPolicy:linkedIn')}</a></li>
              </u>

              {/* Additional Privacy Information  */}
              <h2>{t('privacyPolicy:additionalInformationTitle')}</h2>
              <a href="https://www.cms.gov/Research-Statistics-Data-and-Systems/Computer-Data-and-Systems/Privacy">{t('privacyPolicy:additionalInformationLink')}</a>
            </Trans>
          </MainContent>

      </div>
  );
};

export default PrivacyPolicy;

