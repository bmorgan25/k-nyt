import { Modal } from "@/components/modal";
import clsx from "clsx";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Keyboard from "../../components/keyboard";
import dayInfo from "../../static/day.json";
import styles from "./styles.module.css";

export default function Wordle() {
  const [todayWord, setTodayWord] = useState<string>("");
  const [guess, setGuess] = useState<string[][]>(
    Array(6).fill(Array(5).fill(""))
  );

  const [guessIdx, setGuessIdx] = useState<number>(0);
  const [currIdx, setCurrIdx] = useState<number>(0);
  const [colorIdxs, setColorIdxs] = useState<string[][]>(
    Array(6).fill(Array(5).fill("none"))
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const router = useRouter();

  useEffect(() => {
    if (router.isReady) {
      const { day } = router.query;

      if (day) {
        const today = Number(day);
        setTodayWord(dayInfo[today].wordle);
      }
      console.log(day);
    }
  }, [router.isReady, router.query]);

  const checkAnswer = () => {
    const currGuess = guess[guessIdx].join("").toLocaleUpperCase();
    let tempWord = todayWord;

    const currColors = [...colorIdxs];
    currColors[guessIdx] = [...colorIdxs[guessIdx]];

    // set green first
    currGuess.split("").forEach((char, i) => {
      if (tempWord[i] === char) {
        currColors[guessIdx][i] = "green";
      }
    });

    // use freq map to make sure not adding yellows more than once
    const freq: { [key: string]: number } = {};
    tempWord.split("").forEach((ch) => {
      if (ch in freq) {
        freq[ch] += 1;
      } else {
        freq[ch] = 1;
      }
    });

    // remove green letters
    tempWord = tempWord
      .split("")
      .filter((ch, i) => currColors[guessIdx][i] !== "green")
      .join("");

    // set yellow letters
    currGuess.split("").forEach((char, i) => {
      if (currColors[guessIdx][i] === "green") return;
      if (tempWord.includes(char)) {
        if (freq[char] >= 1) {
          currColors[guessIdx][i] = "yellow";
          freq[char] -= 1;
        } else {
          currColors[guessIdx][i] = "grey";
        }
      } else {
        currColors[guessIdx][i] = "grey";
      }
    });

    setColorIdxs(currColors);
    if (currGuess === todayWord) {
      setModalMessage(`Congrats! You solved today's word: ${todayWord}`);
      setIsModalOpen(true);
      return;
    } else if (guessIdx + 1 > 5) {
      setModalMessage(`Oh no! You couldn't get today's word! Try again!`);
      setIsModalOpen(true);
      return;
    }
    setGuessIdx(guessIdx + 1);
    setCurrIdx(0);
  };

  const handleKeyPress = (key: string) => {
    if (key === "Enter") {
      // Handle the enter key logic
      console.log("Submit guess:", guess);
      if (currIdx === 5) {
        checkAnswer();
      }
    } else if (key === "Delete") {
      const newGuess = [...guess];
      newGuess[guessIdx] = [...guess[guessIdx]];

      // Handle backspace (remove the current character)
      newGuess[guessIdx][currIdx - 1] = "";

      if (currIdx > 0) {
        setCurrIdx(currIdx - 1);
      }

      setGuess(newGuess); // Update the state with the new guess
    } else {
      if (currIdx >= 5) {
        return;
      }
      console.log(currIdx);

      const newGuess = [...guess];
      newGuess[guessIdx] = [...guess[guessIdx]];

      //const inputValue = event.target.value;

      if (key === "" || key.length === 1) {
        // Handle input (non-backspace)
        newGuess[guessIdx][currIdx] = key;
        if (currIdx <= 4) {
          setCurrIdx(currIdx + 1);
        }
      }

      setGuess(newGuess); // Update the state with the new guess
    }
  };

  return (
    <>
      <div className={styles["container"]}>
        {/** Wordle section */}
        <div id="container">
          {guess.map((g, idx) => (
            <div key={`row-${idx}`} className={styles["row"]}>
              {g.map((char, jdx) => (
                <div
                  key={`char-${idx}-${jdx}`}
                  className={clsx("row", {
                    [styles["char-box-green"]]: colorIdxs[idx][jdx] === "green",
                    [styles["char-box-yellow"]]:
                      colorIdxs[idx][jdx] === "yellow",
                    [styles["char-box-grey"]]: colorIdxs[idx][jdx] === "grey",
                    [styles["char-box"]]: colorIdxs[idx][jdx] === "none",
                  })}
                >
                  {char}
                </div>
              ))}
            </div>
          ))}
        </div>
        <div>
          <Modal
            isOpen={isModalOpen}
            message={modalMessage}
            onClose={() => setIsModalOpen(false)}
          />
        </div>
        {/** Input section */}
        <div>
          <Keyboard onKeyPress={handleKeyPress} />
        </div>
      </div>
    </>
  );
}
