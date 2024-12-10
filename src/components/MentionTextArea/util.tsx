// Possible Util to extract only mentions from content
// eslint-disable-next-line import/prefer-default-export
export const getMentions = (data: any) => {
  const mentions: any = [];

  data?.content?.forEach((para: any) => {
    para?.content?.forEach((content: any) => {
      if (content?.type === 'mention') {
        mentions.push(content?.attrs);
      }
    });
  });

  return mentions;
};
