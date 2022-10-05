import { Row } from 'react-table';

/**
 * Get text from jsx node.
 */
// Copied from https://stackoverflow.com/questions/50428910/get-text-content-from-node-in-react
function getJsxText(node: JSX.Element): string | undefined {
  if (typeof node === 'string') return node;
  if (typeof node === 'number') return String(node);
  if (node instanceof Array) return node.map(getJsxText).join('');
  if (typeof node === 'object' && node) return getJsxText(node.props.children);
  return undefined;
}

/**
 * A react table global filter used to match against text values returned from `Column.Cell`.
 *
 * This filter requires that table rows have been prepped with `prepareRow` so that
 * `Column.Cell` is available. Make sure to do this when using hooks such as pagination.
 */
/*
Note: This generic version is commented out because instantiation expressions aren't working at the moment
https://github.com/microsoft/TypeScript/pull/47607
https://github.com/microsoft/TypeScript/issues/50161

  export default function globalFilterCellText<T extends object>(
    rows: Row<T>[],
    columnIds: string[],
    filterValue: string
  ): Row<T>[] {
  ...
  globalFilter: useMemo(() => globalFilterCellText<GetTrbRequests_trbRequests>, []),
  ...
*/
export default function globalFilterCellText(
  rows: Row<any>[],
  columnIds: string[],
  filterValue: string
): Row<any>[] {
  const filterValueLower = filterValue.toLowerCase();
  return rows.filter(row =>
    row.cells.some(cell => {
      // Unavailable column suggests the row is unprepared
      // Cannot op, skip
      if (!cell.column) {
        // console.debug('Row filter skipped');
        return true;
      }

      const renderer = cell.column.Cell as Function;
      let renderedValue: string;
      // Use the Cell function if it's defined to get the cell's text value
      // unless it's just the default renderer
      if (
        typeof renderer === 'function' &&
        renderer.name !== 'defaultRenderer'
      ) {
        renderedValue = getJsxText(renderer(cell)) || '';
      } else {
        renderedValue = cell.value;
      }
      return renderedValue.toLowerCase().includes(filterValueLower);
    })
  );
}
