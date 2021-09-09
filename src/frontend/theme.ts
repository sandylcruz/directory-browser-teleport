export interface Breakpoints {
  'extra-small': string;
  small: string;
  medium: string;
  large: string;
  'extra-large': string;
}

export interface ColorEntry {
  200: string;
  300: string;
  400: string;
  500: string;
  600: string;
  700: string;
  800: string;
  900: string;
}

export interface Colors {
  black: string;
  blue: ColorEntry;
  green: ColorEntry;
  grey: ColorEntry;
  white: string;
}

export interface Theme {
  borderRadii: string;
  breakpoints: Breakpoints;
  colors: Colors;
  fontFamily: string;
  primaryHue: keyof Colors;
  secondaryHue: keyof Colors;
}

const theme: Theme = {
  borderRadii: '2px',
  breakpoints: {
    'extra-small': '512px',
    small: '768px',
    medium: '900px',
    large: '1200px',
    'extra-large': '1600px',
  },
  colors: {
    black: '#000000',
    blue: {
      200: '#6a9afc',
      300: '#4e85f5',
      400: '#3570e8',
      500: '#225cd4',
      600: '#154cbd',
      700: '#0b43b3',
      800: '#063594',
      900: '#022875',
    },
    green: {
      200: '#66dde3',
      300: '#40c3c9',
      400: '#28b2b8',
      500: '#1a979c',
      600: '#012b30',
      700: '#118385',
      800: '#0a6769',
      900: '#064b4d',
    },
    grey: {
      200: '#ededed',
      300: '#d9d9d9',
      400: '#ababab',
      500: '#999999',
      600: '#828282',
      700: '#787878',
      800: '#787878',
      900: '#424242',
    },
    white: '#ffffff',
  },
  fontFamily: 'Helvetica, Arial, sans-serif',
  primaryHue: 'blue',
  secondaryHue: 'green',
};

export default theme;
