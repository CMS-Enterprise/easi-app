import React, { useEffect } from 'react';
import { ControllerRenderProps } from 'react-hook-form';
import { Editor, EditorProps } from '@toast-ui/react-editor';
import classNames from 'classnames';
import DOMPurify from 'dompurify';

// eslint-disable-next-line import/no-extraneous-dependencies
import '@toast-ui/editor/dist/toastui-editor.css';
import './index.scss';

interface ToastEditorProps extends EditorProps {
  className?: string;
  id?: string;
  'data-testid'?: string;
  /** RHF field */
  field?: ControllerRenderProps<any, any>;
}

/** Toast rich text editor as a RHF field. Set to WYSIWYG mode only. Outputs HTML. */
function ToastEditor({ className, field, ...editorProps }: ToastEditorProps) {
  const editorRef = React.createRef<Editor>();

  useEffect(() => {
    if (editorRef.current === null) return;
    const editor = editorRef.current.getInstance();

    // Sanitize the html on the editor change event
    // Allow linebreak tags (p, br) from the editor and also match the tags set in toolbar items
    editor.eventEmitter.listen('change', () => {
      const html = editor.getHTML();
      const sanitized = DOMPurify.sanitize(html, {
        ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'ol', 'ul', 'li', 'a']
      });
      // Only set again if something if sanitized value was different,
      // which should just be on copy and paste.
      // Setting it on every change will jump the text cursor to the end of content.
      if (html !== sanitized) {
        editor.setHTML(sanitized);
      }
    });

    // Hack to show the current link in the pop up when editing
    // https://github.com/nhn/tui.editor/issues/1256
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
  }, [editorRef]);

  // Forward certain properties to toast's text field
  useEffect(() => {
    const el = editorRef.current
      ?.getRootElement()
      // We are only using the editor's wysiwyg mode,
      // so scope the selector on toast's ww container
      .querySelector('.toastui-editor-ww-container .toastui-editor-contents');
    if (!el) return;
    if (editorProps.id) {
      el.id = editorProps.id;
    }
    if (editorProps['data-testid']) {
      el.setAttribute('data-testid', editorProps['data-testid']);
    }
  }, [editorRef, editorProps]);

  return (
    <div className={classNames('easi-toast-editor', className)}>
      <Editor
        ref={editorRef}
        usageStatistics={false}
        initialEditType="wysiwyg"
        hideModeSwitch
        toolbarItems={[['bold', 'italic'], ['ol', 'ul'], ['link']]}
        initialValue={field?.value}
        height={editorProps.height || '100%'}
        onBlur={() => {
          field?.onBlur();
        }}
        onChange={() => {
          const val = editorRef.current?.getInstance().getHTML() || '';
          field?.onChange(val);
        }}
      />
    </div>
  );
}

export default ToastEditor;
