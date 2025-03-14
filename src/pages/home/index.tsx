import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import dayInfo from "../../static/day.json";
import styles from "./styles.module.css";

export default function HomePage() {
  const [day, setDay] = useState<any[]>([]);

  const router = useRouter();

  useEffect(() => {
    setDay(dayInfo);
  }, []);

  const routeToGame = (game: string, day: number) => {
    router.push(`/${game}?day=${day}`);
  };

  return (
    <div className={styles["home-container"]}>
      {day.map((dn, idx) => (
        <section key={idx} className={styles["day-section"]}>
          <h2>Day {idx + 1}</h2>
          <div className={styles["games-container"]}>
            <div
              className={styles["game-card"]}
              onClick={() => routeToGame("wordle", idx)}
            >
              Wordle
            </div>
            <div
              className={styles["game-card"]}
              onClick={() => routeToGame("connections", idx)}
            >
              Connections
            </div>
            <div
              className={styles["game-card"]}
              onClick={() => routeToGame("mini", idx)}
            >
              Mini
            </div>
          </div>
        </section>
      ))}
    </div>
  );
}
