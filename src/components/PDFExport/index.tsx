import React from 'react';
import axios from 'axios';

import { useFlags } from 'contexts/flagContext';

type PDFExportProps = {
  filename: string;
  title: string;
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
        html: content,
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

const downloadPDF = (title: string, filename: string): void => {
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
        ${document.body.outerHTML} 
      </html>`;

  generatePDF(filename, markupToRender);
};

// PDFExport adds a "Download PDF" button to the screen. When this button is clicked,
// the HTML content of the *entire current page* is sent to the server and converted
// to PDF format. This is required because the style rules for the page are inlined
// into the document source. Style changes will need to be made using print styles.
//
// An additional benefit to this design is that is pushes us to have decent print
// stylesheets for the application, whether or not we are expecting users to export
// that part to PDF.
const PDFExport = ({ title, filename }: PDFExportProps) => {
  const flags = useFlags();

  return flags.pdfExport ? (
    <button
      className="easi-no-print"
      type="button"
      onClick={() => downloadPDF(title, filename)}
    >
      Download PDF
    </button>
  ) : null;
};

export default PDFExport;
