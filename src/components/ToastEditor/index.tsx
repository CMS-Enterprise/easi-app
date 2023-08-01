import React, { useEffect, useState } from 'react';
import { Editor, Viewer } from '@toast-ui/react-editor';
import { Grid, GridContainer } from '@trussworks/react-uswds';

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

  // Hack to edit existing links
  // https://github.com/nhn/tui.editor/issues/1256
  useEffect(() => {
    if (editorRef.current) {
      const editor = editorRef.current.getInstance();
      editor.eventEmitter.removeEventHandler('query');
      editor.eventEmitter.listen('query', (query, payload = {}) => {
        if (query === 'getPopupInitialValues' && payload.popupName === 'link') {
          const range = editor.getSelection() as [number, number];
          const info = editor.getRangeInfoOfNode(
            Math.floor((range[0] + range[1]) / 2)
          );
          if (info.type === 'link') {
            editor.setSelection(info.range[0], info.range[1]);
            let link = window.getSelection()?.getRangeAt(0)
              .commonAncestorContainer.parentElement as HTMLAnchorElement;
            link = link?.closest('a') || link?.querySelector('a') || link;
            return {
              linkUrl: link?.href,
              linkText: link?.innerText
            };
          }
          return {
            linkText: editor.getSelectedText()
          };
        }
        return null;
      });
    }
  }, [editorRef]);

  return (
    <GridContainer>
      <Grid row gap>
        <Grid col={6}>
          <h6>Editor</h6>
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
          <h6>Saved text</h6>
          <pre style={{ whiteSpace: 'pre-wrap' }}>{mdContent}</pre>
        </Grid>
        <Grid col={6}>
          <h6>Viewer</h6>
          <div className="easi-toastui-editor">
            <Viewer
              initialValue={initialValue}
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

export default ToastEditor;
