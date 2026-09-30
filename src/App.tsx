import { useEffect, useState } from "react";
import type { Snapshot } from "../server/members";
import { GonkeRot, NinaIntro } from "./Effects";
import { KebabPage } from "./KebabPage";
import { NinaPage } from "./NinaPage";
import { useTheme } from "./useTheme";

export default function App() {
  const [snapshot, setSnapshot] = useState<Snapshot | null>();
  const { theme, effect } = useTheme();

  useEffect(() => {
    fetch("/api/snapshot")
      .then((response) => response.json())
      .then(setSnapshot, () => setSnapshot(null));
  }, []);

  return (
    <>
      <div
        className={`fixed inset-0 -z-10 ${theme === "nina" ? "bg-[linear-gradient(160deg,#fff0f8,#ffc9e6_50%,#ff9fd2)]" : "bg-kebab"}`}
      />
      {theme === "nina" ? (
        <NinaPage snapshot={snapshot} rotting={effect === "kebab"} />
      ) : (
        <KebabPage snapshot={snapshot} />
      )}
      {effect === "nina" && <NinaIntro />}
      {effect === "kebab" && <GonkeRot />}
    </>
  );
}
