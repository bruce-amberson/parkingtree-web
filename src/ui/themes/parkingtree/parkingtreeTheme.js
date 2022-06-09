import { lighten } from '@material-ui/core/styles/colorManipulator';

export const coreColors = {
  primary: '#0EC47E',
  accent: 'orange',
  error: '#FF0000',
  text: '#404040',
};

/* eslint-disable */
export default {
  overrides: {
    MuiFormControl: {
      root: {
        overflow: 'hidden',
        minHeight: 70,
        flexGrow: 1,
        textTransform: 'initial',
        minWidth: 72,
        marginRight: 0,
        // marginBottom: '20px',
        fontFamily: 'Roboto, PT Sans, Arial, sans-serif',
      },
    },
    MuiButton: {
      root: {
        color: coreColors.text,
        top: '10px',
        marginBottom: '20px'
      },
      contained: {
        color: 'white',
        backgroundColor: coreColors.primary,
        '&:hover': {
          color: 'white',
          backgroundColor: lighten(coreColors.primary, 0.4),
          boxShadow: 'none',
        },
        boxShadow: 'none',
      },
      outlined: {
        borderColor: coreColors.text,
      },
    },
    MuiInputBase: {
      multiline: {
        paddingTop: '9px',
      }
    },
    MuiInput: {
      underline: {
        '&:after': {
          borderBottomColor: coreColors.accent,
        },
        '&:before': {
          borderBottom: '1px solid rgb(175, 175, 175)'
        },
        '&:hover:not($disabled):not($focused):not($error):before': {
          borderBottom: '2px solid rgb(175, 175, 175)',
        },
      },
    },
    // MuiTab: {
    //   root: {
    //     // background: '#FFF',
    //     // '&$selected': {
    //     //   color: coreColors.accent,
    //     // },
    //     // '&$hover': {
    //     //   color: coreColors.primary,
    //     // },
    //   },
    //   textColorPrimary : {
    //   },
    //   // label: {
    //   //   color: coreColors.accent,
    //   //   fontWeight: 'normal',
    //   // },
    //   wrapper: {
    //     // borderBottom: '2px solid #FFF',
    //     // '&:hover': {
    //     //   borderBottom: '2px solid green'
    //     // }
    //   }
    // },
    MuiTabs: {
      root: {
        overflow: 'hidden',
        minHeight: 48,
        flexGrow: 1,
        textTransform: 'initial',
        minWidth: 72,
        marginRight: 0,
        fontFamily: 'Arial, Helvetica, sans-serif',
        
      },
      /* Styles applied to the flex container element. */
      flexContainer: {
        display: 'flex',
      },
      /* Styles applied to the flex container element if `centered={true}` & `scrollable={false}`. */
      centered: {
        justifyContent: 'center',
      },
      /* Styles applied to the tablist element. */
      scroller: {
        position: 'relative',
        display: 'inline-block',
        flex: '1 1 auto',
        whiteSpace: 'nowrap',
      },
      /* Styles applied to the tablist element if `scrollable={false}`. */
      fixed: {
        overflowX: 'hidden',
        width: '100%',
      },
      /* Styles applied to the tablist element if `scrollable={true}`. */
      scrollable: {
        overflowX: 'scroll',
      },
      /* Styles applied to the `ScrollButtonComponent` component. */
      scrollButtons: {},
      /* Styles applied to the `ScrollButtonComponent` component if `scrollButtons="auto"`. */
      // scrollButtonsAuto: {
      //   [theme.breakpoints.down('xs')]: {
      //     display: 'none',
      //   },
      // },
      indicator: {
        backgroundColor: coreColors.accent
      },
    },
    MuiMenuItem: {
      root: {
        fontFamily: 'Arial, Helvitica, sans-serif',
      },
    },
  },
  palette: {
    common: {
      warn: 'rgb(250, 229, 0)'
    },
    primary: {
      main: coreColors.primary,
      light: lighten(coreColors.primary, 0.85),
      dark: 'rgb(156,39,176)',
    },
    row: {
      trim: 'rgb(236,228,237)',
      hover: 'rgb(255,210,254)',
      selected: 'rgb(224,164,227)',
    },
    secondary: {
      main: coreColors.primary
    },
    error: {
      main: coreColors.error,
    },
    text: {
      main: coreColors.text,
    },
    base: {
      main: coreColors.text,
    }
  },
  typography: {
    useNextVariants: true,
    fontFamily: [
      'Arial', 'Helvitica', 'sans-serif',
    ]
  },
};
/* eslint-enable */