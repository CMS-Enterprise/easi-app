import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
// import { useTranslation } from 'react-i18next';
import Mention from '@tiptap/extension-mention';
import {
  EditorContent,
  NodeViewWrapper,
  ReactNodeViewRenderer,
  useEditor
} from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import classNames from 'classnames';

// import { sortBy } from 'lodash';
import Alert from 'components/shared/Alert';

import extractTextContent from '../../utils/extractTextContent';

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

const MentionTextArea = React.forwardRef<
  HTMLDivElement,
  {
    id: string;
    setFieldValue?: (value: any, shouldValidate?: boolean | undefined) => void;
    editable?: boolean;
    disabled?: boolean;
    initialContent?: string;
    className?: string;
  }
>(
  (
    { id, setFieldValue, editable, disabled, initialContent, className },
    ref
  ) => {
    const { t } = useTranslation('discussions');

    const [tagAlert, setTagAlert] = useState<boolean>(false);

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

    const editor = useEditor({
      editable: editable && !disabled,
      editorProps: {
        attributes: {
          id
        }
      },
      extensions: [
        StarterKit,
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
        if (setFieldValue) {
          if (extractTextContent(inputContent) === '') {
            setFieldValue('');
            return;
          }
          setFieldValue(inputContent);
        }
      },
      // Sets a alert of a mention is selected, and users/teams will be emailed
      onSelectionUpdate: ({ editor: input }: any) => {
        setTagAlert(!!getMentions(input?.getJSON()).length);
      },
      content: initialContent
    });

    useEffect(() => {
      if (initialContent) editor?.commands.setContent(initialContent);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
      <>
        <EditorContent
          innerRef={ref}
          editor={editor}
          id={id}
          className={classNames(className, 'usa-textarea', {
            tiptap__readonly: !editable,
            tiptap__editable: editable
          })}
        />

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
