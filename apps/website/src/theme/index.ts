import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#0f172a", // slate-900
      light: "#334155", // slate-700
      dark: "#020617", // slate-950
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#64748b", // slate-500
      light: "#94a3b8", // slate-400
      dark: "#475569", // slate-600
      contrastText: "#ffffff",
    },
    background: {
      default: "#ffffff",
      paper: "#ffffff",
    },
    text: {
      primary: "#0f172a", // slate-900
      secondary: "#64748b", // slate-500
    },
    grey: {
      50: "#f8fafc", // slate-50
      100: "#f1f5f9", // slate-100
      200: "#e2e8f0", // slate-200
      300: "#cbd5e1", // slate-300
      400: "#94a3b8", // slate-400
      500: "#64748b", // slate-500
      600: "#475569", // slate-600
      700: "#334155", // slate-700
      800: "#1e293b", // slate-800
      900: "#0f172a", // slate-900
    },
    divider: "#e2e8f0", // slate-200
  },
  typography: {
    fontFamily:
      'var(--font-geist-sans), -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    h4: {
      fontWeight: 700,
      fontSize: "2.25rem",
      lineHeight: 1.2,
    },
    h5: {
      fontWeight: 600,
      fontSize: "1.5rem",
      lineHeight: 1.3,
    },
    h6: {
      fontWeight: 600,
      fontSize: "1.125rem",
      lineHeight: 1.4,
    },
    body1: {
      fontSize: "1rem",
      lineHeight: 1.5,
    },
    body2: {
      fontSize: "0.875rem",
      lineHeight: 1.4,
    },
    button: {
      textTransform: "none",
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          border: "1px solid #e2e8f0",
          boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.1)",
          "&.MuiCard-outlined": {
            borderColor: "#e2e8f0",
          },
        },
      },
    },
    MuiButton: {
      defaultProps: {
        size: "small",
      },
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 500,
          borderRadius: 8,
          boxShadow: "none",
          "&:hover": {
            boxShadow: "none",
          },
        },
        contained: {
          backgroundColor: "#475569", // slate-600
          color: "#ffffff",
          "&:hover": {
            backgroundColor: "#334155", // slate-700
          },
          "&:disabled": {
            backgroundColor: "#cbd5e1", // slate-300
            color: "#94a3b8", // slate-400
          },
        },
        outlined: {
          borderColor: "#e2e8f0", // slate-200
          color: "#475569", // slate-600
          "&:hover": {
            backgroundColor: "#f8fafc", // slate-50
            borderColor: "#cbd5e1", // slate-300
          },
        },
        text: {
          color: "#64748b", // slate-500
          "&:hover": {
            backgroundColor: "#f8fafc", // slate-50
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 8,
            backgroundColor: "#ffffff",
            "& fieldset": {
              borderColor: "#e2e8f0", // slate-200
            },
            "&:hover fieldset": {
              borderColor: "#cbd5e1", // slate-300
            },
            "&.Mui-focused fieldset": {
              borderColor: "#475569", // slate-600
              borderWidth: 1,
            },
          },
          "& .MuiInputLabel-root": {
            color: "#64748b", // slate-500
            "&.Mui-focused": {
              color: "#475569", // slate-600
            },
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "#e2e8f0", // slate-200
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#cbd5e1", // slate-300
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#475569", // slate-600
            borderWidth: 1,
          },
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        root: {
          "& .MuiTabs-indicator": {
            backgroundColor: "#475569", // slate-600
          },
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 500,
          color: "#64748b", // slate-500
          "&.Mui-selected": {
            color: "#475569", // slate-600
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          color: "#64748b", // slate-500
          "&:hover": {
            backgroundColor: "#f8fafc", // slate-50
          },
        },
      },
    },
    MuiContainer: {
      styleOverrides: {
        root: {
          paddingTop: "2rem",
          paddingBottom: "2rem",
        },
      },
    },
    MuiSwitch: {
      styleOverrides: {
        root: {
          "& .MuiSwitch-switchBase": {
            "&.Mui-checked": {
              color: "#475569", // slate-600
              "& + .MuiSwitch-track": {
                backgroundColor: "#475569", // slate-600
                opacity: 1,
              },
            },
            "&.Mui-disabled": {
              color: "#cbd5e1", // slate-300
              "& + .MuiSwitch-track": {
                backgroundColor: "#e2e8f0", // slate-200
                opacity: 1,
              },
            },
          },
          "& .MuiSwitch-track": {
            backgroundColor: "#cbd5e1", // slate-300
            opacity: 1,
          },
        },
      },
    },
  },
});

export default theme;
