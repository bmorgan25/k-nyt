import { useRouter } from "next/router";
import styles from "./styles.module.css";

export function BackButton() {
  const router = useRouter();

  return (
    <button className={styles["back-button"]} onClick={() => router.push("/")}>
      ←
    </button>
  );
}
