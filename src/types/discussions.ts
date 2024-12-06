import { AlertProps } from 'components/shared/Alert';

export type DiscussionAlert =
  | (Omit<AlertProps, 'Children'> & { message: string })
  | null;
