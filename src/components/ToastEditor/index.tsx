import React, { useState } from 'react';
import { Editor } from '@toast-ui/react-editor';
import { GridContainer } from '@trussworks/react-uswds';

// eslint-disable-next-line import/no-extraneous-dependencies
import '@toast-ui/editor/dist/toastui-editor.css';
import './index.scss';

function ToastEditor() {
  const editorRef = React.createRef<Editor>();

  const [mdContent, setMdContent] = useState('');

  const initialValue = `
In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without relying on meaningful content. Lorem ipsum may be used as a placeholder before final copy is available.

**In publishing and graphic design,**
*Lorem ipsum is a placeholder text commonly*

* used to demonstrate
* the visual form of a
* document or a typeface without

1. relying on meaningful content.
2. Lorem ipsum may be used as a
3. placeholder before [final copy is available](https://google.com).
  `;

  const save = () => {
    setMdContent(editorRef.current?.getInstance().getMarkdown() || '');
  };

  return (
    <GridContainer>
      <div className="easi-toastui-editor">
        <Editor
          ref={editorRef}
          // initialValue="hello react editor world!"
          initialValue={initialValue}
          height="300px"
          initialEditType="wysiwyg"
          hideModeSwitch
          toolbarItems={[['bold', 'italic'], ['ol', 'ul'], ['link']]}
          usageStatistics={false}
          useCommandShortcut={false}
          theme="white"
        />
      </div>
      <button type="button" onClick={save}>
        Save
      </button>
      <pre style={{ whiteSpace: 'pre-wrap' }}>{mdContent}</pre>
    </GridContainer>
  );
}

export default ToastEditor;
