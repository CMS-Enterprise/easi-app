import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { Button, IconArrowBack } from '@trussworks/react-uswds';

import { StepSubmit } from '.';

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
  saveExitHidden?: boolean;
  saveExitDisabled?: boolean;
  submit?: StepSubmit;
  className?: string;
  taskListUrl: string | null;
};

/**
 * Common form step footer pager elements.
 * Buttons default to type `button`.
 * Button `text` has a default text fallback.
 * The `back` button defaults to `outline`.
 * The "Save and exit" button needs `submit` defined to function.
 */
export function Pager({
  back,
  next,
  saveExitHidden,
  saveExitDisabled,
  submit,
  className,
  taskListUrl
}: Props) {
  const { t } = useTranslation('technicalAssistance');
  const history = useHistory();

  return (
    <div className={`border-base-light border-top-1px ${className || ''}`}>
      <div className="margin-top-2">
        {back && (
          <Button
            type={back.type ?? 'button'}
            outline={back.outline !== undefined ? back.outline : true}
            disabled={back.disabled}
            onClick={back.onClick}
            className="margin-top-0 margin-bottom-1 mobile-lg:margin-bottom-0"
          >
            {back.text ?? t('button.back')}
          </Button>
        )}
        {next && (
          <Button
            type={next.type ?? 'submit'}
            outline={next.outline}
            disabled={next.disabled}
            onClick={next.onClick}
            className="margin-top-0"
          >
            {next.text ?? t('button.next')}
          </Button>
        )}
      </div>
      {!saveExitHidden && (
        <Button
          className="margin-top-2"
          type="button"
          unstyled
          disabled={saveExitDisabled}
          onClick={() => {
            submit?.(
              taskListUrl
                ? () => {
                    history.push(taskListUrl);
                  }
                : undefined
            );
          }}
        >
          <IconArrowBack className="margin-right-05 margin-bottom-2px text-tbottom" />
          {t('button.saveAndExit')}
        </Button>
      )}
    </div>
  );
}

export default Pager;
