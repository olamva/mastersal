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
