import { DefaultTheme, DarkTheme } from "@react-navigation/native";

export const Light = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: "#ffefc2",
    text: "#4a3728",
    primary: "#b8860b",
    card: "#f5e6a8",
    border: "#e6d49a",
    notification: "#8b6914",
    secondary: "#8b6914",
    error: "#cd853f",
  },
};

export const Dark = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: "#1a1a1a",
    text: "#fff",
    primary: "#12c2e9",
    card: "#2a2a2a",
    border: "#404040",
    notification: "#4fd1c5",
    secondary: "#5fd1c5",
    error: "#EF4444",
  },
};
