"use client";

import { useTimeline } from "./contesto";
import styles from "./page.module.css";

export function InterruttoreSuono() {
  const { muto, setMuto } = useTimeline();
  return (
    <button
      type="button"
      className={styles.interruttore}
      aria-pressed={!muto}
      onClick={() => setMuto(!muto)}
    >
      suono: {muto ? "off" : "on"}
    </button>
  );
}
