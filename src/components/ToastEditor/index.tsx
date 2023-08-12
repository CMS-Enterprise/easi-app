/**
 * Toast's react component provides apis through a legacy ref.
 * Modifications are done through regular javascript apis.
 * Customization properties on the react component aren't enough in cases
 * where we want to hook into and tweak existing behavior.
 */

import React, { useEffect } from 'react';
import { ControllerRenderProps } from 'react-hook-form';
// eslint-disable-next-line import/no-extraneous-dependencies
import ToastuiEditor from '@toast-ui/editor';
import { Editor, EditorProps } from '@toast-ui/react-editor';
import classNames from 'classnames';
import DOMPurify from 'dompurify';

// eslint-disable-next-line import/no-extraneous-dependencies
import '@toast-ui/editor/dist/toastui-editor.css';
import './index.scss';

interface EditableAttrFromProps {
  'aria-describedby'?: string;
  'aria-labelledby'?: string;
  'data-testid'?: string;
}

interface ToastEditorProps extends EditableAttrFromProps, EditorProps {
  id?: string;
  className?: string;
  /** RHF controlled input field */
  field?: ControllerRenderProps<any, any>;
  required?: boolean;
}

/**
 * Initialize modifications the link tool's popup element.
 * It wont be available until the tool is used for the first time.
 * Listen to the link toolbar item to catch the popup element.
 */
function initLinkPopup(editorEl: HTMLElement) {
  const toolbarEl = editorEl?.querySelector('.toastui-editor-toolbar');
  if (editorEl && toolbarEl) {
    toolbarEl.addEventListener('click', event => {
      if (
        (event.target as HTMLElement).closest(
          '.link.toastui-editor-toolbar-icons'
        )
      ) {
        const popupEl = editorEl.querySelector(
          '.toastui-editor-popup-add-link'
        ) as HTMLElement;
        // console.log('click link', popupEl);
        if (popupEl) {
          // Only run popup element mods once
          // console.log('el.dataset.hasModifications', el.dataset.hasModifications);
          if (!('hasModifications' in editorEl.dataset)) {
            modifyLinkPopup(popupEl);
            // eslint-disable-next-line no-param-reassign
            editorEl.dataset.hasModifications = '';
          }

          repositionLinkPopup(popupEl);
        }
      }
    });
  }
}

/**
 * Apply element-related modifications to the link tool's popup
 */
function modifyLinkPopup(popupEl: HTMLElement) {
  // console.log('modifyLinkPopup');

  const textLabel = popupEl.querySelector('label[for=toastuiLinkTextInput]');
  if (textLabel) {
    textLabel.textContent = 'Display text';
  }

  const cancelButton = popupEl.querySelector('.toastui-editor-close-button');
  if (cancelButton) {
    const cancelSpan = document.createElement('span');
    cancelSpan.className = 'usa-button usa-button--unstyled';
    cancelSpan.textContent = 'Cancel';
    cancelButton.replaceChildren(cancelSpan);
  }

  const applyButton = popupEl.querySelector('.toastui-editor-ok-button');
  if (applyButton) {
    const applySpan = document.createElement('span');
    applySpan.className = 'usa-button margin-right-3';
    applySpan.textContent = 'Apply';
    applyButton.replaceChildren(applySpan);
  }

  if (applyButton && cancelButton) {
    applyButton.insertAdjacentElement('afterend', cancelButton);
  }
}

/**
 * Reposition the link popup element so that it stays in view.
 * See `popupEl`'s style class `.toastui-editor-popup` for related mods.
 */
function repositionLinkPopup(popupEl: HTMLElement) {
  // console.log('modifyLinkPopupPosition', popupEl.offsetLeft);
  if (popupEl.offsetLeft < 0) {
    // eslint-disable-next-line no-param-reassign
    popupEl.style.left = '0';
  }
}

/**
 * Apply certain properties to toast's text field
 */
function setEditableElementProps(
  el: HTMLElement,
  editorProps: Pick<
    ToastEditorProps,
    keyof EditableAttrFromProps | 'id' | 'required'
  >
) {
  // We are only using the editor's wysiwyg mode,
  // so scope the selector on toast's ww container
  const elEditable = el?.querySelector(
    '.toastui-editor-ww-container .toastui-editor-contents'
  );

  if (elEditable) {
    if (editorProps.id) {
      elEditable.id = editorProps.id;
    }

    elEditable.setAttribute('role', 'textbox');
    elEditable.setAttribute('aria-multiline', 'true');
    elEditable.setAttribute(
      'aria-required',
      editorProps.required ? 'true' : 'false'
    );

    ['aria-describedby', 'aria-labelledby', 'data-testid'].forEach(attr => {
      const editableAttr = attr as keyof EditableAttrFromProps;
      const val = editorProps[editableAttr];
      if (val) elEditable.setAttribute(attr, val);
    });
  }
}

/**
 * Sanitize the html on the editor change event.
 * Allow linebreak tags (p, br) from the editor and also match the tags set in toolbar items.
 */
function sanitizeHtmlOnContentChange(editor: ToastuiEditor) {
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
}

/**
 * Show the current link in the pop up when editing
 * https://github.com/nhn/tui.editor/issues/1256
 */
function showLinkUnderSelection(editor: ToastuiEditor) {
  editor.eventEmitter.removeEventHandler('query');
  editor.eventEmitter.listen('query', (query, payload = {}) => {
    // console.log('query', query, payload);
    if (query === 'getPopupInitialValues' && payload.popupName === 'link') {
      const range = editor.getSelection() as [number, number];
      const info = editor.getRangeInfoOfNode(
        Math.floor((range[0] + range[1]) / 2)
      );
      if (info.type === 'link') {
        editor.setSelection(info.range[0], info.range[1]);
        let link = window.getSelection()?.getRangeAt(0).commonAncestorContainer
          .parentElement as HTMLAnchorElement;
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

/**
 * Toast rich text editor as a RHF constrolled input field.
 * Set to WYSIWYG mode only.
 * Outputs HTML.
 */
function ToastEditor({ className, field, ...editorProps }: ToastEditorProps) {
  const editorRef = React.createRef<Editor>();

  // Make sure to apply mods only once
  useEffect(() => {
    const toast = editorRef.current;
    if (!toast) return;

    const el = toast.getRootElement();
    const editor = toast.getInstance();

    setEditableElementProps(el, editorProps);
    initLinkPopup(el);
    sanitizeHtmlOnContentChange(editor);
    showLinkUnderSelection(editor);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
