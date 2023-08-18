import { MantineThemeOverride } from '@mantine/core';

// https://mantine.dev/theming/mantine-provider/

const mantineThemeConfig: MantineThemeOverride = {
  // default theme config
  colorScheme: 'light',
  colors: {
    dark: [
      '#fff',
      '#A6A7AB',
      '#909296',
      '#5C5F66',
      '#373A40',
      '#2C2E33',
      '#25262B',
      '#1A1B1E',
      '#141517',
      '#101113',
    ],

    'white-alpha': [
      'rgba(255, 255, 255, 0.04)', // whiteAlpha 50
      'rgba(255, 255, 255, 0.06)', // whiteAlpha 100
      'rgba(255, 255, 255, 0.08)', // whiteAlpha 200
      'rgba(255, 255, 255, 0.16)', // whiteAlpha 300
      'rgba(255, 255, 255, 0.24)', // whiteAlpha 400
      'rgba(255, 255, 255, 0.36)', // whiteAlpha 500
      'rgba(255, 255, 255, 0.48)', // whiteAlpha 600
      'rgba(255, 255, 255, 0.64)', // whiteAlpha 700
      'rgba(255, 255, 255, 0.8)', // whiteAlpha 800
      'rgba(255, 255, 255, 0.92)', // whiteAlpha 900
    ],

    'black-alpha': [
      'rgba(0, 0, 0, 0.04)', // blackAlpha 50
      'rgba(0, 0, 0, 0.06)', // blackAlpha 100
      'rgba(0, 0, 0, 0.08)', // blackAlpha 200
      'rgba(0, 0, 0, 0.16)', // blackAlpha 300
      'rgba(0, 0, 0, 0.24)', // blackAlpha 400
      'rgba(0, 0, 0, 0.36)', // blackAlpha 500
      'rgba(0, 0, 0, 0.48)', // blackAlpha 600
      'rgba(0, 0, 0, 0.64)', // blackAlpha 700
      'rgba(0, 0, 0, 0.8)', // blackAlpha 800
      'rgba(0, 0, 0, 0.92)', // blackAlpha 900
    ],

    gray: [
      'rgba(247, 250, 252, 1)', // gray 50
      'rgba(237, 242, 247, 1)', // gray 100
      'rgba(226, 232, 240, 1)', // gray 200
      'rgba(203, 213, 224, 1)', // gray 300
      'rgba(160, 174, 192, 1)', // gray 400
      'rgba(113, 128, 150, 1)', // gray 500
      'rgba(74, 85, 104, 1)', // gray 600
      'rgba(45, 55, 72, 1)', // gray 700
      'rgba(26, 32, 44, 1)', // gray 800
      'rgba(23, 25, 35, 1)', // gray 900
    ],

    red: [
      'rgba(255, 245, 245, 1)', // red 50
      'rgba(254, 215, 215, 1)', // red 100
      'rgba(254, 178, 178, 1)', // red 200
      'rgba(252, 129, 129, 1)', // red 300
      'rgba(245, 101, 101, 1)', // red 400
      'rgba(229, 62, 62, 1)', // red 500
      'rgba(197, 48, 48, 1)', // red 600
      'rgba(155, 44, 44, 1)', // red 700
      'rgba(130, 39, 39, 1)', // red 800
      'rgba(99, 23, 27, 1)', // red 900
    ],

    orange: [
      'rgba(255, 250, 240, 1)', // orange 50
      'rgba(254, 235, 203, 1)', // orange 100
      'rgba(251, 211, 141, 1)', // orange 200
      'rgba(246, 173, 85, 1)', // orange 300
      'rgba(237, 137, 54, 1)', // orange 400
      'rgba(221, 107, 32, 1)', // orange 500
      'rgba(192, 86, 33, 1)', // orange 600
      'rgba(156, 66, 33, 1)', // orange 700
      'rgba(123, 52, 30, 1)', // orange 800
      'rgba(101, 43, 25, 1)', // orange 900
    ],

    yellow: [
      'rgba(255, 255, 240, 1)', // yellow 50
      'rgba(254, 252, 191, 1)', // yellow 100
      'rgba(250, 240, 137, 1)', // yellow 200
      'rgba(246, 224, 94, 1)', // yellow 300
      'rgba(236, 201, 75, 1)', // yellow 400
      'rgba(214, 158, 46, 1)', // yellow 500
      'rgba(183, 121, 31, 1)', // yellow 600
      'rgba(151, 90, 22, 1)', // yellow 700
      'rgba(116, 66, 16, 1)', // yellow 800
      'rgba(95, 55, 14, 1)', // yellow 900
    ],

    green: [
      'rgba(240, 255, 244, 1)', // green 50
      'rgba(198, 246, 213, 1)', // green 100
      'rgba(154, 230, 180, 1)', // green 200
      'rgba(104, 211, 145, 1)', // green 300
      'rgba(72, 187, 120, 1)', // green 400
      'rgba(56, 161, 105, 1)', // green 500
      'rgba(37, 133, 90, 1)', // green 600
      'rgba(39, 103, 73, 1)', // green 700
      'rgba(34, 84, 61, 1)', // greem 800
      'rgba(28, 69, 50, 1)', // green 900
    ],

    teal: [
      'rgba(230, 255, 250, 1)', // teal 50
      'rgba(178, 245, 234, 1)', // teal 100
      'rgba(129, 230, 217, 1)', // teal 200
      'rgba(79, 209, 197, 1)', // teal 300
      'rgba(56, 178, 172, 1)', // teal 400
      'rgba(49, 151, 149, 1)', // teal 500
      'rgba(44, 122, 123, 1)', // teal 600
      'rgba(40, 94, 97, 1)', // teal 700
      'rgba(35, 78, 82, 1)', // teal 800
      'rgba(29, 64, 68, 1)', // teal 900
    ],

    blue: [
      'rgba(235, 248, 255, 1)', // blue 50
      'rgba(190, 227, 248, 1)', // blue 100
      'rgba(144, 205, 244, 1)', // blue 200
      'rgba(99, 179, 237, 1)', // blue 300
      'rgba(66, 153, 225, 1)', // blue 400
      'rgba(49, 130, 206, 1)', // blue 500
      'rgba(43, 108, 176, 1)', // blue 600
      'rgba(44, 82, 130, 1)', // blue 700
      'rgba(42, 67, 101, 1)', // blue 800
      'rgba(26, 54, 93, 1)', // blue 900
    ],

    cyan: [
      'rgba(237, 253, 253, 1)', // cyan 50
      'rgba(196, 241, 249, 1)', // cyan 100
      'rgba(157, 236, 249, 1)', // cyan 200
      'rgba(118, 228, 247, 1)', // cyan 300
      'rgba(11, 197, 234, 1)', // cyan 400
      'rgba(0, 181, 216, 1)', // cyan 500
      'rgba(0, 163, 196, 1)', // cyan 600
      'rgba(9, 135, 160, 1)', // cyan 700
      'rgba(8, 111, 131, 1)', // cyan 800
      'rgba(6, 86, 102, 1)', // cyan 900
    ],

    purple: [
      'rgba(250, 245, 255, 1)', // purple 50
      'rgba(233, 216, 253, 1)', // purple 100
      'rgba(233, 216, 253, 1)', // purple 200
      'rgba(183, 148, 244, 1)', // purple 300
      'rgba(159, 122, 234, 1)', // purple 400
      'rgba(128, 90, 213, 1)', // purple 500
      'rgba(107, 70, 193, 1)', // purple 600
      'rgba(85, 60, 154, 1)', // purple 700
      'rgba(68, 51, 122, 1)', // purple 800
      'rgba(50, 38, 89, 1)', // purple 900
    ],

    pink: [
      'rgba(255, 245, 247, 1)', // pink 50
      'rgba(254, 215, 226, 1)', // pink 100
      'rgba(251, 182, 206, 1)', // pink 200
      'rgba(246, 135, 179, 1)', // pink 300
      'rgba(237, 100, 166, 1)', // pink 400
      'rgba(213, 63, 140, 1)', // pink 500
      'rgba(184, 50, 128, 1)', // pink 600
      'rgba(151, 38, 109, 1)', // pink 700
      'rgba(151, 38, 109, 1)', // pink 800
      'rgba(151, 38, 109, 1)', // pink 900
    ],
  },
  shadows: {
    xs: '0px 0px 0px 1px rgba(0, 0, 0, 0.05)',
    sm: '0px 1px 2px 0px rgba(0, 0, 0, 0.05)',
    base: '0px 2px 4px -1px rgba(0, 0, 0, 0.06), 0px 4px 6px -1px rgba(0, 0, 0, 0.1);',
    md: '0px 2px 4px -1px rgba(0, 0, 0, 0.06), 0px 4px 6px -1px rgba(0, 0, 0, 0.1)',
    xl: '0px 10px 10px -5px rgba(0, 0, 0, 0.04), 0px 20px 25px -5px rgba(0, 0, 0, 0.1)',
    lg: '0px 4px 6px -2px rgba(0, 0, 0, 0.05), 0px 10px 15px -3px rgba(0, 0, 0, 0.1)',
    '2xl': '0px 25px 50px -12px rgba(0, 0, 0, 0.25)',
    outline: '0px 0px 0px 3px rgba(63, 153, 225, 0.6)',
  },

  radius: {
    none: '0rem',
    sm: '0.125rem',
    base: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    '2xl': '1rem',
    '3xl': '1.5rem',
    full: '999px',
  },

  spacing: {
    0: '0px',
    px: '1px',
    1: '4px',
    2: '8px',
    3: '12px',
    4: '16px',
    5: '20px',
    6: '24px',
    7: '28px',
    8: '32px',
    9: '36px',
    10: '40px',
    12: '48px',
    14: '56px',
    16: '64px',
    20: '80px',
    24: '96px',
    28: '112px',
    32: '128px',
    36: '144px',
    40: '160ox',
    44: '176px',
    48: '192px',
    52: '208px',
    56: '224px',
    60: '240px',
    64: '256px',
    72: '288px',
    80: '320px',
    96: '384px',
  },

  breakpoints: {
    sm: '30em',
    md: '48em',
    lg: '62em',
    xl: '80em',
    '2xl': '96em',
  },

  fontFamily: 'monospace',

  fontSizes: {
    xs: '12px',
    sm: '14px',
    md: '16px',
    lg: '18px',
    xl: '20px',
    '2xl': '24px',
    '3xl': '30px',
    '4xl': '36px',
    '5xl': '48px',
    '6xl': '60px',
  },
};

const mantineTheme = (mantineCustom: MantineThemeOverride): MantineThemeOverride => {
  return { ...mantineThemeConfig, ...mantineCustom };
};

export const customTheme = mantineTheme(mantineThemeConfig);
