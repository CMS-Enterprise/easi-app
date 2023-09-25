import React, { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { IconFileDownload } from '@trussworks/react-uswds';
import classNames from 'classnames';

type PDFExportProps = {
  filename: string;
  title: string;
  children: React.ReactNode;
  label?: string;
  linkPosition?: 'top' | 'bottom';
  disabled?: boolean;
};

// PDFExport adds a "Download PDF" button to the screen. When this button is clicked,
// the HTML content of child elements is sent to the server and converted
// to PDF format.
const PDFExport = ({
  title,
  filename,
  children,
  label,
  linkPosition = 'bottom',
  disabled
}: PDFExportProps) => {
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

  const PrintContent: JSX.Element = (
    <div className="easi-pdf-export" ref={printRef}>
      <h1 className="easi-only-print">{title}</h1>
      {children}
    </div>
  );

  return (
    <>
      {linkPosition === 'bottom' && PrintContent}

      <div
        className={classNames('easi-pdf-export__controls', {
          'margin-top-6': linkPosition === 'bottom'
        })}
      >
        <button
          className="usa-button usa-button--unstyled easi-no-print display-flex flex-align-center"
          type="button"
          onClick={handlePrint}
          disabled={disabled}
        >
          <IconFileDownload className="margin-right-05" />
          {label || 'Download PDF'}
        </button>
      </div>

      {linkPosition === 'top' && PrintContent}
    </>
  );
};

export default PDFExport;
