const toCamelCase = (input: string) => {
  const parts = input.split('_');
  const capitlizedParts = parts.map(
    part => `${part.charAt(0).toUpperCase()}${part.slice(1).toLowerCase()}`
  );
  const first = capitlizedParts.shift()?.toLowerCase();
  return [first, ...capitlizedParts].join('');
};

export default toCamelCase;
