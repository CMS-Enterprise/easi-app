/**
 * Replace `incoming` object properties that are `null`
 * with properties that exists in `fill`.
 */
export default function nullFillObject(incoming: any, fill: any) {
  const obj: any = {};
  Object.keys(fill).forEach(k => {
    if (incoming[k] === null) {
      obj[k] = fill[k];
    } else if (k in incoming) {
      obj[k] = incoming[k];
    }
  });
  return obj;
}
