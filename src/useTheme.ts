import { useEffect, useState } from "react";

export type Theme = "kebab" | "nina";

const codes = { nina: "nina", kebab: "gonke" };

export const useTheme = () => {
  const [theme, setTheme] = useState<Theme>("kebab");
  const [effect, setEffect] = useState<Theme>();

  useEffect(() => {
    if (effect) return;
    const next = theme === "kebab" ? "nina" : "kebab";
    let typed = "";
    const onKeyDown = ({ key }: KeyboardEvent) => {
      if (key.length > 1) return;
      typed = (typed + key.toLowerCase()).slice(-5);
      if (typed.endsWith(codes[next])) setEffect(next);
    };
    addEventListener("keydown", onKeyDown);
    return () => removeEventListener("keydown", onKeyDown);
  }, [theme, effect]);

  useEffect(() => {
    if (!effect) return;
    const timers = [
      setTimeout(() => setTheme(effect), 1500),
      setTimeout(() => setEffect(undefined), 3000),
    ];
    return () => timers.forEach(clearTimeout);
  }, [effect]);

  useEffect(() => {
    document.documentElement.classList.toggle("nina", theme === "nina");
  }, [theme]);

  return { theme, effect };
};
