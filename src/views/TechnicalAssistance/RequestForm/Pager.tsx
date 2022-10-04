import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button, IconArrowBack } from '@trussworks/react-uswds';

import UswdsReactLink from 'components/LinkWrapper';

type PageButtonProps =
  | {
      text?: string;
      disabled?: boolean;
      outline?: boolean;
      type?: 'button' | 'submit';
      onClick?: (e: React.MouseEvent<HTMLElement>) => void;
    }
  | false;

type Props = {
  back?: PageButtonProps;
  next?: PageButtonProps;
  saveExitDisabled?: boolean;
};

/**
 * Common form step footer pager elements.
 * Buttons default to type `button`.
 * Button `text` has a default text fallback.
 * The `back` button defaults to `outline` unless it's set.
 * The save and exit option is wip.
 */
export function Pager({ back, next, saveExitDisabled }: Props) {
  const { t } = useTranslation('technicalAssistance');

  return (
    <div className="border-base-light border-top-1px">
      <div className="margin-top-2">
        {back && (
          <Button
            type={back.type ?? 'button'}
            outline={'outline' in back ? back.outline : true}
            disabled={back.disabled}
            onClick={back.onClick}
          >
            {back.text ?? t('button.back')}
          </Button>
        )}
        {next && (
          <Button
            type={next.type ?? 'button'}
            outline={next.outline}
            disabled={next.disabled}
            onClick={next.onClick}
          >
            {next.text ?? t('button.next')}
          </Button>
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
