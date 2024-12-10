import { ReactRenderer } from '@tiptap/react';
import { SuggestionOptions } from '@tiptap/suggestion';
import tippy, { GetReferenceClientRect, Instance } from 'tippy.js';

import {
  MentionAttributes,
  MentionListOnKeyDown,
  MentionSuggestion,
  MentionSuggestionProps
} from 'types/discussions';

import MentionList, { SuggestionLoading } from './MentionList';

/* Returns the current textarea/RTE editor dimension to append the Mentionslist dropdown
MentionList should have the same width as this parent clientRect */
const getClientRect = ({
  editor,
  clientRect
}: MentionSuggestionProps): GetReferenceClientRect => {
  const { element } = editor.options;
  const rect = element.getBoundingClientRect();
  const mentionRect = clientRect?.();

  return () =>
    new DOMRect(
      rect?.left,
      mentionRect?.y,
      mentionRect?.width,
      mentionRect?.height
    );
};

const suggestion: Omit<
  SuggestionOptions<MentionSuggestion, MentionAttributes>,
  'editor'
> = {
  allowSpaces: true,
  render: () => {
    let reactRenderer: ReactRenderer<
      MentionListOnKeyDown,
      MentionSuggestionProps
    >;

    let spinner: Partial<Instance>;
    let popup: Partial<Instance>;

    return {
      // If we had async initial data - load a spinning symbol until onStart gets called
      // We have hardcoded in memory data for current implementation, doesn't currently get called
      onBeforeStart: props => {
        if (!props.clientRect) {
          return;
        }

        reactRenderer = new ReactRenderer(SuggestionLoading, {
          props,
          editor: props.editor
        });

        [spinner] = tippy('body', {
          getReferenceClientRect: getClientRect(props),
          appendTo: props.editor.options.element,
          content: reactRenderer.element,
          showOnCreate: true,
          interactive: false,
          trigger: 'manual',
          placement: 'bottom-start'
        });
      },

      // Render any available suggestions when mention trigger is first called - @
      onStart: props => {
        if (!props.clientRect) {
          return;
        }

        spinner.hide?.();

        reactRenderer = new ReactRenderer(MentionList, {
          props,
          editor: props.editor
        });

        [popup] = tippy('body', {
          getReferenceClientRect: getClientRect(props),
          appendTo: props.editor.options.element,
          content: reactRenderer.element,
          showOnCreate: true,
          interactive: true,
          trigger: 'manual',
          placement: 'bottom-start'
        });
      },

      // When async data/suggestions return, hide the spinner and show the updated list
      onUpdate: props => {
        reactRenderer.updateProps(props);

        if (!props.clientRect) {
          return;
        }

        popup.setProps?.({
          getReferenceClientRect: getClientRect(props)
        });

        spinner.setProps?.({
          getReferenceClientRect: getClientRect(props)
        });

        spinner.hide?.();

        popup.show?.();
      },

      // If a valid character key, render the spinner until onUpdate gets called to rerender updated list
      onKeyDown: props => {
        if (props.event.key === 'Escape') {
          popup.hide?.();
          spinner.hide?.();

          return true;
        }

        if (props.event.key.length === 1 || props.event.key === 'Backspace') {
          popup.hide?.();
          spinner.show?.();
        }

        return !!reactRenderer?.ref && reactRenderer.ref.onKeyDown(props);
      },

      onExit() {
        popup.destroy?.();
        spinner.destroy?.();
        reactRenderer.destroy();
      }
    };
  }
};

export default suggestion;
