import { style } from '@vanilla-extract/css';

import { colors } from '@/style/token/color.css';
import { fonts } from '@/style/token/typography.css';

export const container = style({
  display: 'inline-flex',
  padding: '2.5rem',
  flexDirection: 'column',
  alignItems: 'center',
  borderRadius: '16px',
  background: '#282C33',
});

export const contentWrapper = style({
  width: '34.75rem',
  display: 'flex',
  flexDirection: 'column',
});

export const iconWrapper = style({
  display: 'flex',
  justifyContent: 'flex-end',
  alignItems: 'center',
});

export const closeIcon = style({
  width: '2rem',
  height: '2rem',
  cursor: 'pointer',
});

export const title = style({
  color: colors.white01,
  textAlign: 'center',
  ...fonts.display02,
});

export const subtitle = style({
  color: '#5A5E66',
  textAlign: 'center',
  ...fonts.subtitle06,
  marginTop: '0.5625rem',
});

export const highlight = style({
  color: colors.white01,
});

export const listWrapper = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: '1.25rem',
  marginTop: '2.44rem',
  marginBottom: '3.12rem',
});

export const listItem = style({
  display: 'flex',
  alignItems: 'center',
  gap: '0.38rem',
  color: colors.white01,
  ...fonts.body02,
  cursor: 'pointer',
});

export const checkboxIcon = style({
  width: '1.5rem',
  height: '1.5rem',
});
