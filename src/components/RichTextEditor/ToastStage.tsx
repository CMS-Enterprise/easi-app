import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Grid, GridContainer } from '@trussworks/react-uswds';

import RichTextEditor, { RichTextViewer } from '.';

function ToastStage() {
  const { control, handleSubmit, watch } = useForm({
    defaultValues: {
      htmlField:
        // ''
        '<ol><li><p>list</p></li></ol><p>&lt;span&gt;par<a href="https://google.com" rel="noopener" target="_blank">agraph</a></p><p>break</p>'
      // '<ol><li><p>list</p></li></ol><p>&lt;span&gt;paragraph</p><p>break</p>'
      // '<p><em>Rich</em> <strong>text</strong> <a href="http://localhost:3000/toast" target="_blank">link</a>.</p><p><br></p><p>double break</p><p><br></p><ul><li><p>Bullet</p></li><li><p>list</p></li></ul><ol><li><p>asdfsdfNumbered</p></li><li><p>list</p></li></ol>'
      // '<p><em>Rich</em> <strong>text</strong> <a href="http://localhost:3000/toast" target="_blank">link</a>.</p><p><br></p><p>double break</p><ul><li><p>Bullet</p></li><li><p>list</p></li></ul><ol><li><p>Numbered</p></li><li><p>list</p></li></ol>'
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
              render={({ field }) => (
                <RichTextEditor height="300px" field={field} />
              )}
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
          <RichTextViewer value={watch('htmlField')} />
          <div style={{ borderTop: '1px solid black' }}>
            <p>paragraph</p>
            <p>break</p>
            <ul>
              <li>bullet</li>
              <li>list</li>
            </ul>
            <ol>
              <li>numbered</li>
              <li>list</li>
            </ol>
          </div>
        </Grid>
      </Grid>
    </GridContainer>
  );
}

export default ToastStage;
