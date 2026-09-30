import { useEffect, useState } from "react";
import ninaIcon from "./assets/nina-icon.png";

export type Theme = "kebab" | "nina";

const codes = { nina: "nina", kebab: "gonke" };
const icon = document.querySelector<HTMLLinkElement>("link[rel=icon]")!;
const heads = {
  kebab: { title: document.title, icon: icon.href },
  nina: { title: "Drømmesalen · A4-131", icon: ninaIcon },
};

export const useTheme = () => {
  const [theme, setTheme] = useState<Theme>(
    localStorage.theme === "nina" ? "nina" : "kebab",
  );
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
      setTimeout(
        () =>
          document.documentElement.classList.toggle("nina", effect === "nina"),
        effect === "nina" ? 500 : 1500,
      ),
      setTimeout(() => setTheme(effect), 1500),
      setTimeout(() => setEffect(undefined), 3000),
    ];
    return () => timers.forEach(clearTimeout);
  }, [effect]);

  useEffect(() => {
    document.title = heads[theme].title;
    icon.href = heads[theme].icon;
    localStorage.theme = theme;
  }, [theme]);

  return { theme, effect };
};
