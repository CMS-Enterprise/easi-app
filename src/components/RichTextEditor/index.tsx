/**
 * Toast's react component provides apis through a legacy ref.
 * Modifications are done through regular javascript apis.
 * Customization properties on the react component aren't enough in cases
 * where we want to hook into and tweak existing behavior.
 */

import React, { useEffect, useRef, useState } from 'react';
import { ControllerRenderProps } from 'react-hook-form';
// eslint-disable-next-line import/no-extraneous-dependencies
import ToastuiEditor from '@toast-ui/editor';
import {
  Editor,
  EditorProps,
  Viewer,
  ViewerProps
} from '@toast-ui/react-editor';
import classNames from 'classnames';
import DOMPurify from 'dompurify';

import ExternalLinkModal from 'components/shared/ExternalLinkModal';

// eslint-disable-next-line import/no-extraneous-dependencies
import '@toast-ui/editor/dist/toastui-editor.css';
import './index.scss';

interface EditableProps {
  id?: string;
  'aria-describedby'?: string;
  'aria-labelledby'?: string;
  'data-testid'?: string;
}

interface RichTextEditorProps extends EditorProps {
  /** Wrapper div classname */
  className?: string;
  /** Editable element div props */
  editableProps?: EditableProps;
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
        if (popupEl) {
          // Only run popup element mods once
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
  editorProps: RichTextEditorProps
) {
  // We are only using the editor's wysiwyg mode,
  // so scope the selector on toast's ww container
  const elEditable = el?.querySelector(
    '.toastui-editor-ww-container .toastui-editor-contents'
  ) as HTMLElement;

  if (elEditable) {
    // Relay the height property to the editable since it's modified to be resizable.
    // The original parent with dimensions will not reflow accordingly when editable is resizable.
    if (editorProps.height) {
      elEditable.style.height = editorProps.height;
    }

    elEditable.setAttribute('role', 'textbox');
    elEditable.setAttribute('aria-multiline', 'true');
    elEditable.setAttribute(
      'aria-required',
      editorProps.required ? 'true' : 'false'
    );

    if (editorProps.editableProps?.id) {
      elEditable.id = editorProps.editableProps.id;
    }

    const editableAttrs: Array<keyof EditableProps> = [
      'aria-describedby',
      'aria-labelledby',
      'data-testid'
    ];
    editableAttrs.forEach(attr => {
      const val = editorProps.editableProps?.[attr];
      if (val) elEditable.setAttribute(attr, val);
    });
  }
}

/**
 * Sanitize the html on the editor change event.
 * Allow linebreak tags (p, br) from the editor and also match the tags set in toolbar items.
 */
function sanitizeHtmlOnContentChange(toastEditor: ToastuiEditor) {
  toastEditor.eventEmitter.listen('change', () => {
    const html = toastEditor.getHTML();
    // NOTE make sure to update the allowed policy on the backend when it is updated here as well
    // It is created in pkg/sanitization/html.go in createHTMLPolicy
    const sanitized = DOMPurify.sanitize(html, {
      ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'ol', 'ul', 'li', 'a']
    });
    // Only set again if something if sanitized value was different,
    // which should just be on copy and paste.
    // Setting it on every change will jump the text cursor to the end of content.
    if (html !== sanitized) {
      toastEditor.setHTML(sanitized);
    }
  });
}

const mailtoRe = /^mailto:/;
const httpsRe = /^https?:\/\//;

// Do some field validation on the link popup's url field.
// Another approach is to re-use toast's exec command to add a link but instead
// we are going to use dompurify's hook that gets called after content change.
// See sanitizeHtmlOnContentChange() -> DOMPurify.sanitize()
DOMPurify.addHook('afterSanitizeAttributes', node => {
  // check all href attributes for validity
  if (node.hasAttribute('href')) {
    const href = node.getAttribute('href');
    if (href === null) return;
    // Allow `mailto:` urls
    if (href.match(mailtoRe)) return;
    // Ensure url has a `https://` prefix
    if (!href.match(httpsRe)) {
      node.setAttribute('href', `https://${href}`);
    }
  }
});

/**
 * Show the current link in the pop up when editing
 * https://github.com/nhn/tui.editor/issues/1256
 */
function showLinkUnderSelection(toastEditor: ToastuiEditor) {
  toastEditor.eventEmitter.removeEventHandler('query');
  toastEditor.eventEmitter.listen('query', (query, payload = {}) => {
    if (query === 'getPopupInitialValues' && payload.popupName === 'link') {
      const range = toastEditor.getSelection() as [number, number];
      const info = toastEditor.getRangeInfoOfNode(
        Math.floor((range[0] + range[1]) / 2)
      );
      if (info.type === 'link') {
        toastEditor.setSelection(info.range[0], info.range[1]);
        let link = window.getSelection()?.getRangeAt(0).commonAncestorContainer
          .parentElement as HTMLAnchorElement;
        link = link?.closest('a') || link?.querySelector('a') || link;
        return {
          linkUrl: link?.href,
          linkText: link?.innerText
        };
      }
      return {
        linkText: toastEditor.getSelectedText()
      };
    }

    return null;
  });
}

function extractTextContent(html: string) {
  return new DOMParser().parseFromString(html, 'text/html').documentElement
    .textContent;
}

/**
 * Toast rich text editor as a RHF controlled input field.
 * Set to WYSIWYG mode only.
 * The input value is HTML.
 */
function RichTextEditor({ className, field, ...props }: RichTextEditorProps) {
  const editorRef = React.createRef<Editor>();

  // Make sure to apply mods only once
  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;

    const el = editor.getRootElement();
    const toast = editor.getInstance();

    setEditableElementProps(el, props);
    initLinkPopup(el);
    showLinkUnderSelection(toast);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // This component re-renders on content changes and loses the on change callback
  // Bind it again each time
  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;
    sanitizeHtmlOnContentChange(editor.getInstance());
  }, [editorRef]);

  return (
    <div className={classNames('easi-toast easi-toast-editor', className)}>
      <Editor
        ref={editorRef}
        usageStatistics={false}
        initialEditType="wysiwyg"
        hideModeSwitch
        // Match these against tags in `sanitizeHtmlOnContentChange()`
        toolbarItems={[['bold', 'italic'], ['ol', 'ul'], ['link']]}
        initialValue={field?.value}
        linkAttributes={{
          target: '_blank',
          rel: 'noopener'
        }}
        onBlur={() => {
          field?.onBlur();
        }}
        onChange={() => {
          const val = editorRef.current?.getInstance().getHTML() || '';

          // ToastEditor.setHTML('') which can happen in the content change callback
          // will produce something like '<p><br></p>'.
          // Get the text content and make sure to set an empty string properly
          // so that text input validations work as expected.
          if (extractTextContent(val) === '') {
            field?.onChange('');
            return;
          }

          field?.onChange(val);
        }}
        {...props}
        // Ensure the height prop is overridden after argument assignments
        // See `setEditableElementProps()` for height details
        height="100%"
      />
    </div>
  );
}

export default RichTextEditor;

interface RichTextViewerProps extends Omit<ViewerProps, 'initialValue'> {
  /** Wrapper div classname */
  className?: string;
  /** Content value that is updatable. Use this instead of `initialValue`. */
  value?: string;
}

export function RichTextViewer({
  className,
  value,
  ...props
}: RichTextViewerProps) {
  const { externalLinkModal, modalScopeRef } = useRichTextViewerLinkModal();

  return (
    <div
      ref={modalScopeRef}
      className={classNames('easi-toast easi-toast-viewer', className)}
    >
      <Viewer
        usageStatistics={false}
        // Setting link attributes here just to match Editor options, but it doesn't actually have an effect
        linkAttributes={{
          target: '_blank',
          rel: 'noopener'
        }}
        // `initialValue` does not update. Change the `key` prop so that this re-renders with `value`.
        key={value}
        initialValue={value}
        {...props}
      />
      {externalLinkModal}
    </div>
  );
}

/**
 * Hook to attach an `ExternalLinkModal` to links from `RichTextViewer` instances.
 */
export function useRichTextViewerLinkModal() {
  const [url, setUrl] = useState<string>('');
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const modalScopeRef = useRef<HTMLDivElement>(null);

  function linkHandler(event: MouseEvent) {
    const a = (event.target as HTMLElement)?.closest(
      '.toastui-editor-contents a'
    );
    if (a) {
      event.preventDefault();
      const href = a.getAttribute('href');
      if (href) {
        setUrl(href);
        setIsOpen(true);
      }
    }
  }

  useEffect(() => {
    const eventEl = modalScopeRef.current;
    eventEl?.addEventListener('click', linkHandler);
    return () => {
      eventEl?.removeEventListener('click', linkHandler);
    };
  }, []);

  return {
    modalScopeRef,
    externalLinkModal: (
      <ExternalLinkModal
        isOpen={isOpen}
        url={url}
        closeModal={() => setIsOpen(false)}
      />
    )
  };
}
