import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { Button, ButtonGroup, IconArrowBack } from '@trussworks/react-uswds';
import classNames from 'classnames';

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
  buttons?: React.ReactNode[];
  saveExitText?: string;
  saveExitHidden?: boolean;
  saveExitDisabled?: boolean;
  submit?: StepSubmit;
  submitDisabled?: boolean;
  className?: string;
  taskListUrl: string;
  border?: boolean;
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
  buttons,
  saveExitText,
  saveExitHidden,
  saveExitDisabled,
  submit,
  submitDisabled,
  className,
  taskListUrl,
  border = true
}: Props) {
  const { t } = useTranslation('technicalAssistance');
  const history = useHistory();

  const buttonItems = [
    ...(back
      ? [
          <Button
            type={back.type ?? 'button'}
            outline={back.outline !== undefined ? back.outline : true}
            disabled={back.disabled}
            onClick={back.onClick}
            className="margin-top-0 margin-bottom-1 mobile-lg:margin-bottom-0"
          >
            {back.text ?? t('button.back')}
          </Button>
        ]
      : []),
    ...(next
      ? [
          <Button
            type={next.type ?? 'submit'}
            outline={next.outline}
            disabled={next.disabled}
            onClick={next.onClick}
            className="margin-top-0"
          >
            {next.text ?? t('button.next')}
          </Button>
        ]
      : []),
    ...(buttons || [])
  ];

  return (
    <div
      className={classNames(className, {
        'border-base-light border-top-1px': border
      })}
    >
      {buttonItems && (
        <ButtonGroup className={classNames({ 'margin-top-2': border })}>
          {buttonItems.map(button => button)}
        </ButtonGroup>
      )}
      {!saveExitHidden && (
        <Button
          className="margin-top-2 display-flex flex-align-center"
          type="button"
          unstyled
          disabled={saveExitDisabled}
          onClick={() => {
            if (!submitDisabled) {
              submit?.(() => {
                history.push(taskListUrl);
              });
            } else {
              history.push(taskListUrl);
            }
          }}
        >
          <IconArrowBack className="margin-right-05" />
          {saveExitText || t('button.saveAndExit')}
        </Button>
      )}
    </div>
  );
}

export default Pager;
