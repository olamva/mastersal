import { useEffect, useState } from "react";
import type { FirstMonth } from "../server/first";
import { GonkeRot, NinaIntro } from "./Effects";
import { KebabFirstPage } from "./KebabFirstPage";
import { NinaFirstPage } from "./NinaFirstPage";
import { useTheme } from "./useTheme";

export const FirstPage = () => {
  const [months, setMonths] = useState<FirstMonth[]>();
  const { theme, effect } = useTheme();

  useEffect(() => {
    fetch("/api/first")
      .then((response) => (response.ok ? response.json() : []))
      .then(setMonths, () => setMonths([]));
  }, []);

  return (
    <>
      <div
        className={`fixed inset-0 -z-10 ${theme === "nina" ? "bg-[linear-gradient(160deg,#fff0f8,#ffc9e6_50%,#ff9fd2)]" : "bg-kebab"}`}
      />
      {theme === "nina" ? (
        <NinaFirstPage months={months} rotting={effect === "kebab"} />
      ) : (
        <KebabFirstPage months={months} />
      )}
      {effect === "nina" && <NinaIntro />}
      {effect === "kebab" && <GonkeRot />}
    </>
  );
};
