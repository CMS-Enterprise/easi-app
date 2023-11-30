import React, { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { IconFileDownload } from '@trussworks/react-uswds';
import classNames from 'classnames';

import IconButton from 'components/shared/IconButton';

type UsePDFExportProps = {
  /** PDF filename */
  filename: string;
  /** Optional title to display at top of PDF */
  title?: string;
};

type PDFExportButtonProps = {
  children: React.ReactNode;
  disabled?: boolean;
  className?: string;
};

/**
 * Hook for using ReactToPrint export to PDF functionality
 *
 * Returns `PDFExportButton` and `PDFExportWrapper` components
 */
const usePDFExport = ({ filename, title }: UsePDFExportProps) => {
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    documentTitle: filename,
    content: () => printRef.current,
    // The lib default is to have no margin, which hides window.prints()'s built in pagination
    // Set auto margins back to show everything the browser renders
    pageStyle: `
      @page {
        margin: auto;
      }
    `
  });

  /** Export button for PDF */
  const PDFExportButton = ({
    children,
    className,
    disabled = false
  }: PDFExportButtonProps) => {
    return (
      <IconButton
        icon={<IconFileDownload />}
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

  /** Wrapper for PDF content */
  const PDFExportWrapper = ({ children }: { children: React.ReactNode }) => {
    return (
      <div ref={printRef}>
        {title && <h1 className="easi-only-print">{title}</h1>}
        {children}
      </div>
    );
  };

  return {
    PDFExportWrapper,
    PDFExportButton
  };
};

export default usePDFExport;
