import { useEffect, useState } from 'react';
import _ from 'lodash';

export const useHighlightedTableRow = (highlightedTableRow, setHighlightedTableRow, tableList, ref?) => {
  const [highlightedItemIndex, setHighlightedItemIndex] = useState<number>();
  const [timeoutRef, setTimeoutRef] = useState<string | number | NodeJS.Timeout>();

  useEffect(() => {
    if (!_.isEmpty(highlightedTableRow)) {
      const itemIndex = tableList.findIndex((item) => item[highlightedTableRow.property] === highlightedTableRow.value);
      if (itemIndex !== -1) {
        setHighlightedItemIndex(itemIndex);
        ref && ref.current && ref.current.scrollIntoView({ behavior: 'smooth' });
        if (timeoutRef) clearTimeout(timeoutRef);
        setTimeoutRef(
          setTimeout(() => {
            setHighlightedTableRow({});
            setHighlightedItemIndex(undefined);
          }, 20000) // time to show 'highlighted' class
        );
      }
    } else {
      setHighlightedItemIndex(undefined);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [highlightedTableRow, tableList]);

  return highlightedItemIndex;
};
