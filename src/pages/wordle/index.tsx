import clsx from "clsx";
import { useEffect, useState } from "react";
import styles from "./styles.module.css";

export default function wordle() {
  const todayWord = "MOOSE";

  const [guess, setGuess] = useState<string[][]>(
    Array(6).fill(Array(5).fill(""))
  );

  const [guessIdx, setGuessIdx] = useState<number>(0);
  const [currIdx, setCurrIdx] = useState<number>(0);
  const [colorIdxs, setColorIdxs] = useState<string[][]>(
    Array(6).fill(Array(5).fill("none"))
  );

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log(currIdx);

    const newGuess = [...guess];
    newGuess[guessIdx] = [...guess[guessIdx]];

    const inputValue = event.target.value;

    if (inputValue === "" || inputValue.length === 1) {
      // Handle input (non-backspace)
      newGuess[guessIdx][currIdx] = inputValue;
      if (currIdx <= 4) {
        setCurrIdx(currIdx + 1);
      }
    }

    setGuess(newGuess); // Update the state with the new guess
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Backspace") {
      const newGuess = [...guess];
      newGuess[guessIdx] = [...guess[guessIdx]];

      // Handle backspace (remove the current character)
      newGuess[guessIdx][currIdx - 1] = "";

      if (currIdx > 0) {
        setCurrIdx(currIdx - 1);
      }

      setGuess(newGuess); // Update the state with the new guess
    }
  };

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

    // remove green letters
    tempWord = tempWord
      .split("")
      .filter((ch, i) => currColors[guessIdx][i] !== "green")
      .join("");

    // set yellow letters
    currGuess.split("").forEach((char, i) => {
      if (currColors[guessIdx][i] === "green") return;
      if (tempWord.includes(char)) {
        currColors[guessIdx][i] = "yellow";
      } else {
        currColors[guessIdx][i] = "grey";
      }
    });

    setColorIdxs(currColors);
    setGuessIdx(guessIdx + 1);
    setCurrIdx(0);
  };

  useEffect(() => {
    console.log(guess);
  }, [guess]);

  return (
    <div>
      {/** Wordle section */}
      <div id="container">
        {guess.map((g, idx) => (
          <div id={`row-${idx}`} className={styles["row"]}>
            {g.map((char, jdx) => (
              <div
                id={`char-${idx}-${jdx}`}
                className={clsx("row", {
                  [styles["char-box-green"]]: colorIdxs[idx][jdx] === "green",
                  [styles["char-box-yellow"]]: colorIdxs[idx][jdx] === "yellow",
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
      {/** Input section */}
      <div>
        <input
          value={guess[guessIdx][currIdx]} // Make the input field a controlled component
          onChange={handleInput}
          onKeyDown={handleKeyDown} // Listen for the backspace key
          maxLength={1}
        />
        <button
          type="button"
          onClick={() => checkAnswer()}
          disabled={currIdx <= 4}
        >
          Submit
        </button>
      </div>
    </div>
  );
}
