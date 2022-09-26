import React from 'react';
import { useTranslation } from 'react-i18next';
import { IconArrowBack } from '@trussworks/react-uswds';
import cx from 'classnames';

import UswdsReactLink from 'components/LinkWrapper';

type Props = {
  back?: { text?: string; url: string; disabled?: boolean } | false;
  next?:
    | {
        text?: string;
        url: string;
        disabled?: boolean;
        style?: 'outline';
      }
    | false;
  saveExitDisabled?: boolean;
};

export function Pager({ back, next, saveExitDisabled }: Props) {
  const { t } = useTranslation('technicalAssistance');

  return (
    <div className="border-base-light border-top-1px">
      <div className="margin-top-2">
        {back && (
          <UswdsReactLink
            variant="unstyled"
            className={cx('usa-button usa-button--outline', {
              'usa-button--disabled': back.disabled
            })}
            to={back.url}
          >
            {back.text ?? t('button.back')}
          </UswdsReactLink>
        )}
        {next && (
          <UswdsReactLink
            variant="unstyled"
            className={cx('usa-button', {
              'usa-button--outline': next.style === 'outline',
              'usa-button--disabled': next.disabled
            })}
            to={next.url}
          >
            {next.text ?? t('button.next')}
          </UswdsReactLink>
        )}
      </div>
      {!saveExitDisabled && (
        <div className="margin-top-2">
          <UswdsReactLink to="/trb">
            <IconArrowBack className="margin-right-05 margin-bottom-2px text-tbottom" />
            {t('button.saveAndExit')}
          </UswdsReactLink>
        </div>
      )}
    </div>
  );
}

export default Pager;
