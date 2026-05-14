import { createContext, useContext, useEffect, useMemo, useState } from "react";

const themes = [
  { id: "aurora", label: "Aurora", swatch: "bg-cyan-400" },
  { id: "ember", label: "Ember", swatch: "bg-orange-400" },
  { id: "forest", label: "Forest", swatch: "bg-emerald-500" },
  { id: "violet", label: "Violet", swatch: "bg-violet-500" }
];

const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "aurora");

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("theme", theme);
  }, [theme]);

  const value = useMemo(() => ({ theme, setTheme, themes }), [theme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => useContext(ThemeContext);
