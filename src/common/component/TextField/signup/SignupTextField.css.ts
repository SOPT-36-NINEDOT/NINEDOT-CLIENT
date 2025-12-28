import { style, styleVariants } from '@vanilla-extract/css';

import { colors, fonts } from '@/style/token';

const box = {
  display: 'flex',
  width: '52.2rem',
  height: '5rem',
  padding: '1.4rem 2rem',
  alignItems: 'center',
  flexShrink: 0,
  borderRadius: '8px',
};

export const inputBase = style({
  display: 'block',
  width: '100%',
  height: '100%',
  background: 'transparent',
  border: 'none',
  outline: 'none',
  padding: 0,
  color: 'inherit',
  textAlign: 'left',
});

export const inputFont = style([
  inputBase,
  fonts.body03,
  {
    selectors: {
      '&:-webkit-autofill, &:-webkit-autofill:hover, &:-webkit-autofill:focus, &:-webkit-autofill:active':
        {
          WebkitBoxShadow: `0 0 0px 1000px transparent inset`,
          WebkitTextFillColor: colors.grey10,
          transition: 'background-color 5000s ease-in-out 0s',
        },
    },
  },
]);

const createInputStateVariants = () =>
  styleVariants({
    default: { color: colors.grey6 },
    clicked: { color: colors.grey6 },
    typing: { color: colors.grey10 },
    filled: { color: colors.grey10 },
    hover: { color: colors.grey6 },
    disabled: { color: colors.grey5 },
  });

export const inputState = createInputStateVariants();

const createBoxVariants = (activeBorderColor: string) => {
  return styleVariants({
    default: {
      ...box,
      border: `2px solid transparent`,
      background: colors.grey4,
    },
    clicked: {
      ...box,
      border: `2px solid ${activeBorderColor}`,
      background: colors.grey3,
    },
    typing: {
      ...box,
      border: `2px solid ${activeBorderColor}`,
      background: colors.grey3,
      justifyContent: 'space-between',
    },
    filled: {
      ...box,
      border: `2px solid transparent`,
      background: colors.grey4,
    },
    hover: {
      ...box,
      border: `2px solid transparent`,
      background: colors.grey3,
    },
    disabled: {
      ...box,
      border: `2px solid transparent`,
      background: colors.grey4,
      justifyContent: 'space-between',
      pointerEvents: 'none',
    },
  });
};

export const fieldBox = createBoxVariants(colors.blue06);

export const clearButton = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '2rem',
  height: '2rem',
  background: 'none',
  border: 'none',
  padding: 0,
  cursor: 'pointer',
});

export const lockIcon = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '2rem',
  height: '2rem',
  color: colors.grey5,
});

export const errorContainer = style({
  display: 'flex',
  width: '52.2rem',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: '0.4rem',
});

export const errorText = style([fonts.caption02, { color: colors.error01, alignSelf: 'stretch' }]);
