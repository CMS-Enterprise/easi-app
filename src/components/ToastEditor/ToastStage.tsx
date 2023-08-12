import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Viewer } from '@toast-ui/react-editor';
import { Grid, GridContainer } from '@trussworks/react-uswds';

import ToastEditor from '.';

function ToastStage() {
  const { control, handleSubmit, watch } = useForm({
    defaultValues: {
      htmlField: '<p>start</p>'
    }
  });

  function onSubmit(data: any) {
    // console.debug('submit', data);
  }

  return (
    <GridContainer>
      <Grid row gap>
        <Grid col={6}>
          <h6>Editor</h6>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Controller
              name="htmlField"
              control={control}
              render={({ field }) => <ToastEditor field={field} />}
            />
            <button type="submit">submit</button>
          </form>
          <h6>Form data</h6>
          <pre style={{ whiteSpace: 'pre-wrap' }}>
            {JSON.stringify(watch(), null, 2)}
          </pre>
        </Grid>
        <Grid col={6}>
          <h6>Viewer</h6>
          <div className="easi-toastui-editor">
            <Viewer
              initialValue={watch('htmlField')}
              usageStatistics={false}
              theme="white"
              linkAttributes={{
                target: '_blank'
              }}
            />
          </div>
        </Grid>
      </Grid>
    </GridContainer>
  );
}

export default ToastStage;
