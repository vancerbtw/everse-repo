export default function theme (theme: "dark" | "light"): {
  bg: string
  fg: string
} {
  let _theme = {
    dark: {
      bg: "#1c1c1e",
      fg: "#ffffff"
    },
    light: {
      bg: "#ffffff",
      fg: "#000000"
    }
  }
  return theme === "dark" ? _theme.dark : _theme.light;
}

export function theme2 (theme: "dark" | "light"): {
  bg: string
} {
  let _theme = {
    dark: {
      bg: "#121213",
    },
    light: {
      bg: "#f2f2f4"
    }
  }
  return theme === "dark" ? _theme.dark : _theme.light;
}