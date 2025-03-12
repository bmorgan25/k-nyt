"use client";

import { useRouter } from "next/navigation";
import styles from "./styles.module.css";

export function Navbar() {
  const router = useRouter();

  return (
    <nav className={styles["navbar"]}>
      <button
        className={styles["back-button"]}
        onClick={() => router.push("/")}
      >
        ←
      </button>
      <h1>Wordle</h1>
    </nav>
  );
}
