import React from 'react';
import { kebabCase } from 'lodash';

import CollapsableLink from 'components/shared/CollapsableLink';

type CollapsableListListProps = {
  items: string[];
  label: string;
};

const CollapsableList = (props: CollapsableListListProps) => {
  const { label, items } = props;
  const id = kebabCase(label);

  return (
    <div className="margin-top-3">
      <CollapsableLink id={id} label={label}>
        <ul className="margin-bottom-0 margin-top-1 padding-left-205 line-height-body-5">
          {items.map(item => (
            <li className="margin-bottom-1" key={item}>
              {item}
            </li>
          ))}
        </ul>
      </CollapsableLink>
    </div>
  );
};

export default CollapsableList;
