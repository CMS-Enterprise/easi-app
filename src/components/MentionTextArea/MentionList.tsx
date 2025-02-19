/* MentionList renders the TipTap suggestion dropdown in addition to defining
defining keyboard events */

import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState
} from 'react';
import { useTranslation } from 'react-i18next';
import { TagType } from 'gql/generated/graphql';

import Spinner from 'components/Spinner';
import {
  MentionListOnKeyDown,
  MentionSuggestionProps
} from 'types/discussions';

import './index.scss';

export const SuggestionLoading = () => {
  return (
    <div className="items width-full padding-1">
      <Spinner size="small" />
    </div>
  );
};

/** Handler dropdown scroll event on keypress */
const scrollIntoView = () => {
  const selectedElm = document.querySelector('.is-selected');
  selectedElm?.scrollIntoView({ block: 'nearest' });
};

/** Renders the list of suggestions within `MentionTextArea` */
const MentionList = forwardRef<MentionListOnKeyDown, MentionSuggestionProps>(
  (props, ref) => {
    const { t } = useTranslation('general');

    const [selectedIndex, setSelectedIndex] = useState<number>(0);

    /** Sets the selected mention within the editor props */
    const selectItem = (index: number) => {
      const item = props.items[index];

      if (item) {
        props.command({
          'tag-type': item.tagType,
          label: item.displayName,
          'data-label': item.displayName,
          'data-id-db': item.tagType === TagType.USER_ACCOUNT ? item.id : ''
        });
      }
    };

    const upHandler = () => {
      setSelectedIndex(
        (selectedIndex + props.items?.length - 1) % props.items?.length
      );
      scrollIntoView();
    };

    const downHandler = () => {
      setSelectedIndex((selectedIndex + 1) % props.items?.length);
      scrollIntoView();
    };

    const enterHandler = () => {
      selectItem(selectedIndex);
    };

    useEffect(() => setSelectedIndex(0), [props.items]);

    useImperativeHandle(ref, () => ({
      onKeyDown: ({ event }) => {
        if (
          event.key === 'ArrowUp' ||
          (event.shiftKey && event.key === 'Tab')
        ) {
          upHandler();
          return true;
        }

        if (
          event.key === 'ArrowDown' ||
          (!event.shiftKey && event.key === 'Tab')
        ) {
          downHandler();
          return true;
        }

        if (event.key === 'Enter') {
          enterHandler();
          return true;
        }

        return false;
      }
    }));

    return (
      <div className="items">
        {props.items?.length ? (
          props.items?.map((item, index) => (
            <button
              className={`item ${index === selectedIndex ? 'is-selected' : ''}`}
              key={item.displayName}
              id={item.displayName}
              type="button"
              onClick={() => selectItem(index)}
            >
              {item.displayName}
            </button>
          ))
        ) : (
          <span className="item padding-x-1">{t('noResults')}</span>
        )}
      </div>
    );
  }
);

export default MentionList;
