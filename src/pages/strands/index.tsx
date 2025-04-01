import clsx from "clsx";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import dayInfo from "../../static/day.json";
import styles from "./styles.module.css";

type StrandsInfo = {
  prompt: string;
  spanogram: string;
  strandsMap: string[][];
  answerCoords: {
    answer: string;
    coords: number[][];
  }[];
};

type AnswerCoords = {
  answer: string;
  coords: number[][];
};

export default function Strands() {
  const router = useRouter();

  const [strandsInfo, setStrandsInfo] = useState<StrandsInfo>();
  const [wordsFound, setWordsFound] = useState<number[][]>([]);
  const [count, setCount] = useState<number>(0);
  const [currGuess, setCurrGuess] = useState<AnswerCoords | undefined>(
    undefined
  );

  useEffect(() => {
    if (router.isReady) {
      const { day } = router.query;

      if (day) {
        const today = Number(day);
        const todayInfo = dayInfo[today].strands;

        const strands = {
          prompt: todayInfo.prompt!,
          spanogram: todayInfo.span!,
          strandsMap: todayInfo.strandsMap!,
          answerCoords: todayInfo.answerCoords!.map((item) => ({
            answer: item.answer,
            coords: item.coords,
          })),
        };

        setStrandsInfo(strands);
      }
    }
  }, [router.isReady, router.query]);

  /**
   rules:
   if i & j are "next to" the most recent coor:
      add it
   else -> clear entire guess

   if i & j are already in list:
      remove all coors after i & j
      and remove same number of letters from the guess
   */
  const handleSelectItem = (letter: string, i: number, j: number) => {
    if (wordsFound.some((idx) => idx[0] === i && idx[1] === j)) return;
    if (currGuess) {
      const currIdx = currGuess.coords.findIndex(
        (coor) => coor[0] === i && coor[1] === j
      );
      // handle removing if coords already in currGuess
      if (currIdx !== -1) {
        const newCoors = currGuess.coords.slice(0, currIdx + 1);
        const newAnswer = currGuess.answer.slice(0, currIdx + 1);
        setCurrGuess({ answer: newAnswer, coords: newCoors });
        return;
      }
      // add new letter to the guess
      const len = currGuess.coords.length;
      if (
        (Math.abs(i - currGuess.coords[len - 1][0]) === 1 &&
          Math.abs(j - currGuess.coords[len - 1][1]) === 1) ||
        (Math.abs(i - currGuess.coords[len - 1][0]) === 0 &&
          Math.abs(j - currGuess.coords[len - 1][1]) === 1) ||
        (Math.abs(i - currGuess.coords[len - 1][0]) === 1 &&
          Math.abs(j - currGuess.coords[len - 1][1]) === 0)
      ) {
        setCurrGuess((prev) => {
          if (prev) {
            return {
              answer: prev.answer.concat(letter),
              coords: [...prev.coords, [i, j]],
            };
          } else {
            return { answer: letter, coords: [[i, j]] };
          }
        });
        return;
        // clear all guesses
      } else {
        setCurrGuess(undefined);
        return;
      }
    }
    setCurrGuess((prev) => {
      if (prev) {
        return {
          answer: prev.answer.concat(letter),
          coords: [...prev.coords, [i, j]],
        };
      } else {
        return { answer: letter, coords: [[i, j]] };
      }
    });
  };

  const handleGuess = () => {
    const answerIdx = strandsInfo?.answerCoords.findIndex(
      (answer) => answer.answer === currGuess?.answer
    );
    console.log(answerIdx);
    if (answerIdx !== undefined && answerIdx !== -1) {
      console.log(strandsInfo?.answerCoords[answerIdx]);
      const correct = strandsInfo?.answerCoords[answerIdx];
      console.log(correct);
      if (
        correct?.coords.every(
          (coor, idx) =>
            coor[0] === currGuess?.coords[idx][0] &&
            coor[1] === currGuess?.coords[idx][1]
        )
      ) {
        console.log("done");
        setWordsFound((prev) => [...prev, ...correct.coords]);
        setCount(count + 1);
      }
    }
    setCurrGuess(undefined);
  };

  return (
    <div className={styles["container"]}>
      <div className={styles["prompt-container"]}>{strandsInfo?.prompt}</div>
      <div>{currGuess?.answer || "Guess..."}</div>
      <div>
        {strandsInfo?.strandsMap.map((row, idx) => (
          <div key={`row-${idx}`} className={styles["map-row"]}>
            {row.map((char, jdx) => (
              <div
                key={`col-${jdx}`}
                className={clsx("item", {
                  [styles["map-item-selected"]]: currGuess?.coords.some(
                    (coord) => coord[0] === idx && coord[1] === jdx
                  ),
                  [styles["map-item-correct"]]: wordsFound.some(
                    (coord) => coord[0] === idx && coord[1] === jdx
                  ),
                  [styles["map-item"]]: true,
                })}
                onClick={() => handleSelectItem(char, idx, jdx)}
              >
                {char}
              </div>
            ))}
          </div>
        ))}
      </div>
      <div>
        {count} / {strandsInfo?.answerCoords.length} of today's words found.
      </div>
      <div className={styles["btn-container"]}>
        <div className={styles["guess-btn"]} onClick={() => handleGuess()}>
          Guess
        </div>
        <div
          className={styles["guess-btn"]}
          onClick={() => setCurrGuess(undefined)}
        >
          Clear
        </div>
      </div>
    </div>
  );
}
