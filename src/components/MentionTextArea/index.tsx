import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Document from '@tiptap/extension-document';
import Mention from '@tiptap/extension-mention';
import Paragraph from '@tiptap/extension-paragraph';
import Text from '@tiptap/extension-text';
import {
  EditorContent,
  NodeViewWrapper,
  ReactNodeViewRenderer,
  useEditor
} from '@tiptap/react';
import { Icon } from '@trussworks/react-uswds';
import classNames from 'classnames';

import Alert from 'components/shared/Alert';
import IconButton from 'components/shared/IconButton';

import suggestion from './suggestion';
import { getMentions } from './util';

import './index.scss';

/* The rendered Mention after selected from MentionList
This component can be any react jsx component, but must be wrapped in <NodeViewWrapper />
Attrs of selected mention are accessed through node prop */
const MentionComponent = ({ node }: { node: any }) => {
  const { label } = node.attrs;

  // Label may return null if the text was truncated by <TruncatedText />
  // In this case don't render the mention, and shift the line up by the height of the non-rendered label
  if (!label) {
    return <div className="margin-top-neg-4" />;
  }

  return (
    <NodeViewWrapper className="react-component display-inline">
      <span className="tiptap mention">{`@${label}`}</span>
    </NodeViewWrapper>
  );
};

/* Extended TipTap Mention class with additional attributes
Additionally sets a addNodeView to render custo JSX as mention */
const CustomMention = Mention.extend({
  atom: true,
  selectable: true,
  addAttributes() {
    return {
      ...this.parent?.(),
      'data-id-db': {
        default: ''
      },
      'tag-type': {
        default: ''
      }
    };
  },
  addNodeView() {
    return ReactNodeViewRenderer(MentionComponent);
  }
});

type MentionTextAreaProps = {
  id: string;
  setFieldValue?: (value: string) => void;
  editable?: boolean;
  disabled?: boolean;
  initialContent?: string;
  /** Truncate text with read more/less button for non-editable text */
  truncateText?: boolean;
  className?: string;
};

/**
 * Rich text area component with functionality to tag users or teams
 */
const MentionTextArea = React.forwardRef<HTMLDivElement, MentionTextAreaProps>(
  (
    {
      id,
      setFieldValue,
      editable = false,
      disabled,
      initialContent,
      truncateText,
      className
    },
    ref
  ) => {
    const { t } = useTranslation('discussions');

    const [textExpanded, setTextExpanded] = useState(false);

    /** Alert shown below field when tagging user or user group */
    const [tagAlert, setTagAlert] = useState<boolean>(false);

    /** Mock users array for testing until tagging functionality is implemented  */
    const fetchUsers = ({ query }: { query: string }) => {
      return [
        { username: 'a', displayName: 'Admin lead', tagType: 'other' },
        {
          username: 'b',
          displayName: 'Governance Admin Team',
          tagType: 'other'
        },
        {
          username: 'c',
          displayName: 'Governance Review Board (GRB)',
          tagType: 'other'
        },
        {
          username: 'OSYC',
          displayName: 'Grant Eliezer',
          tagType: 'user'
        },
        {
          username: 'MKCK',
          displayName: 'Forest Brown',
          tagType: 'user'
        },
        {
          username: 'PJEA',
          displayName: 'Janae Stokes',
          tagType: 'user'
        }
      ];
    };

    /** Character limit when truncating text in non-editable text area */
    const truncatedTextCharLimit = 275;

    const textIsTruncated = useMemo(() => {
      if (editable || !initialContent) return false;

      return truncateText && initialContent.length > truncatedTextCharLimit;
    }, [initialContent, truncateText, truncatedTextCharLimit, editable]);

    /** Editor content */
    const content = useMemo(() => {
      // If no initial content, set to empty string
      if (!initialContent) return '';

      // If text is not truncated or truncated and expanded, return `initialContent`
      if (!textIsTruncated || textExpanded) return initialContent;

      // Return truncated text with ellipses
      return `${initialContent.slice(0, truncatedTextCharLimit)} ...`;
    }, [textIsTruncated, truncatedTextCharLimit, textExpanded, initialContent]);

    /** Tiptap editor instance */
    const editor = useEditor(
      {
        editable: editable && !disabled,
        editorProps: {
          attributes: {
            id,
            role: 'textbox',
            'aria-label': t('Rich text area')
          }
        },
        extensions: [
          Document,
          Paragraph,
          Text,
          CustomMention.configure({
            HTMLAttributes: {
              class: 'mention'
            },
            suggestion: {
              ...suggestion,
              items: fetchUsers
            }
          })
        ],
        onUpdate: ({ editor: input }) => {
          const inputContent = input?.getHTML();
          const inputText = input?.getText();

          if (setFieldValue) {
            // Prevents editor from setting value to '<p></p>' when user deletes all text
            if (inputText === '') {
              setFieldValue('');
              return;
            }

            setFieldValue(inputContent);
          }
        },
        // Sets an alert if a mention is selected, and users/teams will be emailed
        onSelectionUpdate: ({ editor: input }: any) => {
          setTagAlert(!!getMentions(input?.getJSON()).length);
        },
        content
      },
      [textExpanded]
    );

    /** Clear editor content when field is reset */
    useEffect(() => {
      if (editable) {
        if (
          !initialContent ||
          // Check if value is empty string and editor is not already reset
          (initialContent.length === 0 && initialContent !== editor?.getText())
        ) {
          editor?.commands.clearContent();
        }
      }
    }, [editor, initialContent, editable]);

    return (
      <>
        <EditorContent
          ref={ref}
          tabIndex={editable ? -1 : undefined}
          editor={editor}
          className={classNames(className, {
            'tiptap__editable usa-textarea': editable,
            'tiptap__readonly font-body-sm line-height-body-5': !editable,
            'tiptap__readonly--truncated': truncateText && !textExpanded
          })}
        />

        {
          // Read more/less button for truncated text
          textIsTruncated && (
            <IconButton
              icon={textExpanded ? <Icon.ExpandLess /> : <Icon.ExpandMore />}
              type="button"
              onClick={() => setTextExpanded(!textExpanded)}
              iconPosition="after"
              className="margin-bottom-205"
              unstyled
            >
              {textExpanded ? t('general:readLess') : t('general:readMore')}
            </IconButton>
          )
        }

        {tagAlert && editable && (
          <Alert type="info" slim>
            {t('general.alerts.saveDiscussion')}
          </Alert>
        )}
      </>
    );
  }
);

export default MentionTextArea;
