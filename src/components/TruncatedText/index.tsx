import React, { useState } from 'react';
import { Button, Icon } from '@trussworks/react-uswds';
import classnames from 'classnames';

import { RichTextViewer } from 'components/RichTextEditor';

// This component takes free form text and a character limit and
// will return the whole text until it reaches the character limit, once
// it is over the character limit the text will be truncated and a
// button to expand / unexpand the text will be provided if the user
// desires to see the entire text

type TruncatedTextProps = {
  id: string;
  label: string;
  text: string;
  charLimit: number;
  closeLabel?: string;
  className?: string;
  isRich?: boolean;
};

const TruncatedText = ({
  id,
  label,
  text,
  charLimit,
  closeLabel,
  className,
  isRich = false
}: TruncatedTextProps) => {
  const [isOpen, setOpen] = useState(true);

  // If text is shorter then specified character limit, just
  // return the whole text
  if (text.length < charLimit) {
    if (isRich)
      return (
        <div className={className}>
          <RichTextViewer value={text} />
        </div>
      );
    return <div className={className}>{text}</div>;
  }

  // Text is longer then specified character limit, truncate text
  // and provide button to allow users to expand / unexpand out
  // text if desired
  const startOfText: string = text.substring(0, charLimit);

  return (
    <div className={className}>
      {/* eslint-disable-next-line no-nested-ternary */}
      {isRich ? (
        <RichTextViewer value={isOpen ? `${startOfText}... ` : `${text} `} />
      ) : isOpen ? (
        `${startOfText}... `
      ) : (
        `${text} `
      )}
      <Button
        type="button"
        onClick={() => setOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-controls={id}
        className={classnames({ 'text-bold': isOpen })}
        unstyled
      >
        {isOpen ? (
          <Icon.ExpandMore aria-hidden />
        ) : (
          <Icon.NavigateNext aria-hidden />
        )}
        {isOpen ? closeLabel || label : label}
      </Button>
    </div>
  );
};

export default TruncatedText;
