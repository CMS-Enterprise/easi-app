import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button, IconArrowBack } from '@trussworks/react-uswds';
import cx from 'classnames';

import UswdsReactLink from 'components/LinkWrapper';

type Props = {
  back?: { text?: string; url: string; disabled?: boolean } | false;
  next?:
    | {
        text?: string;
        url?: string;
        disabled?: boolean;
        outline?: boolean;
        submit?: boolean;
      }
    | false;
  saveExitDisabled?: boolean;
};

/**
 * Next and back nav links for form step components.
 * Also a save and exit button.
 * The `next` button also has a `submit` option to render a form submit.
 * See `formStepComponents` for example uses.
 */
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
        {next && [
          next.submit && (
            <Button
              type="submit"
              outline={next.outline}
              disabled={next.disabled}
            >
              {next.text ?? t('button.next')}
            </Button>
          ),
          next.url && (
            <UswdsReactLink
              variant="unstyled"
              className={cx('usa-button', {
                'usa-button--outline': next.outline,
                'usa-button--disabled': next.disabled
              })}
              to={next.url}
            >
              {next.text ?? t('button.next')}
            </UswdsReactLink>
          )
        ]}
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
