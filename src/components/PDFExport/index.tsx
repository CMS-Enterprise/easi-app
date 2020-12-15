import React, { useRef } from 'react';
import axios from 'axios';
import escape from 'lodash';

import { useFlags } from 'contexts/flagContext';

type PDFExportProps = {
  filename: string;
  title: string;
  children: React.ReactNode;
};

function downloadBlob(filename: string, blob: Blob) {
  // This approach to downloading files works fine in the tests I've done in Chrome
  // with PDF files that are < 100kB. For larger files we might need to
  // instead redirect the browser to a URL that returns the file. That
  // approach is complicated by using JWTs for auth.
  //
  // TODO test this in various browsers. Some reports say this might not work
  // properly in Firefox and that firing a MouseEvent is required instead.
  const blobUrl = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = blobUrl;
  link.download = filename;

  // This downloads the file to the user's machine.
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function generatePDF(filename: string, content: string) {
  axios
    .request({
      url: `${process.env.REACT_APP_API_ADDRESS}/pdf/generate`,
      responseType: 'blob',
      method: 'POST',
      data: {
        html: btoa(content),
        filename: 'input.html'
      }
    })
    .then(response => {
      const blob = new Blob([response.data], { type: 'application/pdf' });
      downloadBlob(filename, blob);
    })
    .catch(() => {
      // TODO add error handling: display a modal if things fail?
    });
}

const downloadRefAsPDF = (
  title: string,
  filename: string,
  ref: React.Ref<HTMLDivElement>
): void => {
  // Collect any stylesheets that are linked to. These are used in production.
  const stylesheetRequests = Array.prototype.slice
    .apply(document.styleSheets)
    .filter(stylesheet =>
      stylesheet.href ? axios.get(stylesheet.href) : null
    );

  // Also grab any inline styles, used predominantly in development.
  const styleBlocks = Array.prototype.slice
    .apply(document.querySelectorAll('style'))
    .map(node => node.innerText);

  // Combine external and inline styles
  Promise.all(stylesheetRequests)
    .then(stylesheets => {
      styleBlocks.concat(stylesheets.map(response => response.data));
    })
    .catch(() => {
      // TODO add error handling: display a modal if things fail?
    });

  const markupToRender = `<html lang="en">
        <head>
          <title>${escape(title)}</title>
          <style>
            ${styleBlocks.join('\n\n')}
          </style>
        </head>
        <body>
          <h1>
            ${escape(title)}
          </h1>
          ${ref && ref.current && ref.current.outerHTML} 
        </body>
      </html>`;

  generatePDF(filename, markupToRender);
};

// PDFExport adds a "Download PDF" button to the screen. When this button is clicked,
// the HTML content of child elements is sent to the server and converted
// to PDF format.
const PDFExport = ({ title, filename, children }: PDFExportProps) => {
  const flags = useFlags();

  const divEl = useRef<HTMLDivElement>(null);

  return flags.pdfExport ? (
    <div className="easi-pdf-export" ref={divEl}>
      {children}

      <button
        className="easi-no-print"
        type="button"
        onClick={() => downloadRefAsPDF(title, filename, divEl)}
      >
        Download PDF
      </button>
    </div>
  ) : (
    children
  );
};

export default PDFExport;
