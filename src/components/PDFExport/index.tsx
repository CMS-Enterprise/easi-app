import React, { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { Icon } from '@trussworks/react-uswds';
import classNames from 'classnames';

import HelpText from 'components/HelpText';
import IconButton from 'components/IconButton';

type PDFExportButtonProps = {
  children: React.ReactNode;
  handlePrint: () => void;
  disabled?: boolean;
  className?: string;
};

export const PDFExportButton = ({
  children,
  handlePrint,
  disabled,
  className
}: PDFExportButtonProps) => {
  return (
    <IconButton
      icon={<Icon.FileDownload aria-hidden />}
      className={classNames('easi-no-print', className)}
      type="button"
      onClick={handlePrint}
      disabled={disabled}
      unstyled
    >
      {children}
    </IconButton>
  );
};

type PDFExportProps = {
  filename: string;
  title: string;
  children: React.ReactNode;
  label?: string;
  helpText?: string;
  linkPosition?: 'top' | 'bottom' | 'both';
  disabled?: boolean;
};

const PDFExport = ({
  title,
  filename,
  children,
  label = 'Download PDF',
  helpText,
  linkPosition = 'bottom',
  disabled
}: PDFExportProps) => {
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    documentTitle: filename,
    content: () => printRef.current,
    pageStyle: `
      @page { margin: 1in; }
    `
  });

  const Controls = ({ className }: { className?: string }) => (
    <div className={classNames('easi-pdf-export__controls', className)}>
      <PDFExportButton handlePrint={handlePrint} disabled={disabled}>
        {label}
      </PDFExportButton>
      {helpText && <HelpText className="margin-top-1">{helpText}</HelpText>}
    </div>
  );

  const showTop = linkPosition === 'top' || linkPosition === 'both';
  const showBottom = linkPosition === 'bottom' || linkPosition === 'both';

  return (
    <>
      {showTop && <Controls />}
      <div className="easi-pdf-export" ref={printRef}>
        <h1 className="easi-only-print">{title}</h1>
        {children}
      </div>
      {showBottom && <Controls className="margin-top-6" />}
    </>
  );
};

export default PDFExport;
