import { useMemo } from "react";
import { useAccount } from "./useAccount";

export function useTheme() {
  const { currentUser, updateTheme } = useAccount();
  const isDarkMode = currentUser?.theme === "dark";

  const toggleTheme = () => {
    if (!currentUser) return;
    const newTheme = isDarkMode ? "light" : "dark";
    updateTheme(newTheme);
  };

  const themeStyles = useMemo(() => ({
    container: { backgroundColor: isDarkMode ? "#121212" : "#f5f5f5" },
    text: { color: isDarkMode ? "#fff" : "#000" },
    card: { backgroundColor: isDarkMode ? "#1e1e1e" : "#fff", padding: 16, borderRadius: 12 },
  }), [isDarkMode]);

  return { isDarkMode, toggleTheme, themeStyles };
}
