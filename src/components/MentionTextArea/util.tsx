import { JSONContent } from '@tiptap/core';

/**
 * Returns array of mentions from Tiptap input JSON data
 *
 * @example getMentions(input?.getJSON())
 */
const getMentions = <
  /** Optional type param for mention attributes if return array needs to be typed */
  MentionAttrsType extends Record<string, any> = Record<string, any>
>(
  data: JSONContent
): MentionAttrsType[] => {
  const mentions: MentionAttrsType[] = [];

  data?.content?.forEach(paragraph => {
    paragraph?.content?.forEach(content => {
      if (content?.attrs && content?.type === 'mention') {
        mentions.push(content.attrs as MentionAttrsType);
      }
    });
  });

  return mentions;
};

export default getMentions;
