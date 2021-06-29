import React from 'react';

type FormattedJSONProps = {
  json: any;
};

const FormattedJSON = ({ json }: FormattedJSONProps) => {
  return (
    <pre style={{ whiteSpace: 'pre-wrap' }}>
      {JSON.stringify(json, null, 2)}
    </pre>
  );
};

export default FormattedJSON;
