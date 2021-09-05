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
      200: '#dee9ff',
      300: '#c9dbff',
      400: '#73a2ff',
      500: '#4080ff',
      600: '#3075ff',
      700: '#0f4abf',
      800: '#053187',
      900: '#032870',
    },
    green: {
      200: '#bdffc4',
      300: '#84fa92',
      400: '#51e863',
      500: '#2dcc3f',
      600: '#28b839',
      700: '#11801e',
      800: '#096113',
      900: '#03470b',
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
