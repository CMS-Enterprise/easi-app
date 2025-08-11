import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { Button, ButtonGroup, Icon } from '@trussworks/react-uswds';
import classNames from 'classnames';

import Spinner from 'components/Spinner';

import { StepSubmit } from '.';

export type PageButtonProps = {
  text?: string;
  disabled?: boolean;
  outline?: boolean;
  type?: 'button' | 'submit';
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
  loading?: boolean;
};

export type PagerProps = {
  back?: PageButtonProps | false;
  next?: PageButtonProps | false;
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
}: PagerProps) {
  const { t } = useTranslation('technicalAssistance');
  const history = useHistory();

  const buttonItems = [
    ...(back
      ? [
          <div className="display-flex flex-align-center" key="buttonBack">
            <Button
              type={back.type ?? 'button'}
              outline={back.outline !== undefined ? back.outline : true}
              disabled={back.disabled}
              onClick={back.onClick}
              className="margin-top-0 margin-bottom-1 mobile-lg:margin-bottom-0"
              data-testid="pager-back-button"
            >
              {back.text ?? t('button.back')}
            </Button>
            {back?.loading && <Spinner className="margin-left-105" />}
          </div>
        ]
      : []),
    ...(next
      ? [
          <div className="display-flex flex-align-center" key="buttonNext">
            <Button
              type={next.type ?? 'submit'}
              outline={next.outline}
              disabled={next.disabled}
              onClick={next.onClick}
              className="margin-top-0"
              data-testid="pager-next-button"
            >
              {next.text ?? t('button.next')}
            </Button>
            {next?.loading && <Spinner className="margin-left-105" />}
          </div>
        ]
      : []),
    ...(buttons?.map((button, index) => {
      // eslint-disable-next-line react/no-array-index-key
      return <React.Fragment key={`button-${index}`}>{button}</React.Fragment>;
    }) || [])
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
              }, false);
            } else {
              history.push(taskListUrl);
            }
          }}
        >
          <Icon.ArrowBack className="margin-right-05" aria-hidden />
          {saveExitText || t('button.saveAndExit')}
        </Button>
      )}
    </div>
  );
}

export default Pager;
