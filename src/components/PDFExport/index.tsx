import React, { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { IconFileDownload } from '@trussworks/react-uswds';
import classNames from 'classnames';

import IconButton from 'components/shared/IconButton';

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
        <IconButton
          icon={<IconFileDownload />}
          className="easi-no-print"
          type="button"
          onClick={handlePrint}
          disabled={disabled}
          unstyled
        >
          {label || 'Download PDF'}
        </IconButton>
      </div>

      {linkPosition === 'top' && PrintContent}
    </>
  );
};

export default PDFExport;
