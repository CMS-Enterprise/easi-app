const themeColorTokens = {
  'base-lightest': '#f0f0f0',
  'base-lighter': '#dfe1e2',
  'base-light': '#a9aeb1',
  base: '#71767a',
  'base-dark': '#565c65',
  'base-darker': '#3d4551',
  'base-darkest': '#1b1b1b',
  ink: '#1b1b1b',
  'primary-lighter': '#d9e8f6',
  'primary-light': '#73b3e7',
  primary: '#005ea2',
  'primary-vivid': '#0050d8',
  'primary-dark': '#1a4480',
  'primary-darker': '#162e51',
  'secondary-lighter': '#f8dfe2',
  'secondary-light': '#f2938c',
  secondary: '#d83933',
  'secondary-vivid': '#e41d3d',
  'secondary-dark': '#b50909',
  'secondary-darker': '#8b0a03',
  'accent-cool-lighter': '#e1f3f8',
  'accent-cool-light': '#97d4ea',
  'accent-cool': '#00bde3',
  'accent-cool-dark': '#28a0cb',
  'accent-cool-darker': '#07648d',
  'accent-warm-lighter': '#f2e4d4',
  'accent-warm-light': '#ffbc78',
  'accent-warm': '#fa9441',
  'accent-warm-dark': '#c05600',
  'accent-warm-darker': '#775540',
  emergency: '#9c3d10',
  'emergency-dark': '#332d29'
};

const systemColorTokens = {
  'blue-vivid-40': '#2491ff',
  'gray-20': '#c9c9c9'
};

const colorTokens = {
  ...themeColorTokens,
  ...systemColorTokens
};

const color = (token: keyof typeof colorTokens) => {
  return colorTokens[token];
};

export default color;
