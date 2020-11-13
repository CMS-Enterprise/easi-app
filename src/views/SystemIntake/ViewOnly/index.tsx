import React from 'react';
import axios from 'axios';
import { DateTime } from 'luxon';

import SystemIntakeReview from 'components/SystemIntakeReview';
import { SystemIntakeForm } from 'types/systemIntake';

type SystemIntakeViewOnlyProps = {
  systemIntake: SystemIntakeForm;
};

function downloadFile(filename: string, content: string) {
  axios
    .request({
      url: `${process.env.REACT_APP_API_ADDRESS}/pdf/generate`,
      responseType: 'blob',
      method: 'POST',
      data: {
        html: content,
        filename
      }
    })
    .then(response => {
      // This approach works fine in the tests I've done in Chrome
      // With PDF files that are < 100kB. For larger files we might need to
      // instead redirect the browser to a URL that returns the file. That
      // approach is complicated by using JWTs for auth.
      const blobUrl = URL.createObjectURL(
        new Blob([response.data], { type: 'application/pdf' })
      );

      const link = document.createElement('a');

      link.href = blobUrl;

      // TODO generate a useful filename here
      link.download = 'generated.pdf';

      // This downloads the file
      // TODO test this in various browsers. Some reports say this might not work
      // properly in Firefox and that firing a MouseEvent is required instead.
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    })
    .catch(error => {
      // TODO add error handling: display a modal if things fail?
      console.debug(error);
    });
}

const SystemIntakeView = ({ systemIntake }: SystemIntakeViewOnlyProps) => {
  const download = (): void => {
    downloadFile('intake.html', document.documentElement.outerHTML);
  };

  return (
    <>
      <div>
        <h1>Review your Intake Request</h1>
        <SystemIntakeReview
          systemIntake={systemIntake}
          now={DateTime.local()}
        />
      </div>
      <button className="easi-no-print" type="button" onClick={download}>
        Download PDF
      </button>
    </>
  );
};

export default SystemIntakeView;
