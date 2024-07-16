/** Returns `Object.keys(object)` as typed array instead of `string[]` */
const extractObjectKeys = <ObjectType extends object = object>(
  object: ObjectType
): Array<keyof ObjectType> => {
  return Object.keys(object) as Array<keyof ObjectType>;
};

export default extractObjectKeys;
