import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Grid, GridContainer } from '@trussworks/react-uswds';

import ToastEditor, { ToastViewer } from '.';

function ToastStage() {
  const { control, handleSubmit, watch } = useForm({
    defaultValues: {
      htmlField:
        '<p><em>Rich</em> <strong>text</strong> <a href="http://localhost:3000/toast" target="_blank">link</a>.</p><ul><li><p>Bullet</p></li></ul><ol><li><p>Numbered</p></li></ol>'
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
          <ToastViewer initialValue={watch('htmlField')} />
        </Grid>
      </Grid>
    </GridContainer>
  );
}

export default ToastStage;
