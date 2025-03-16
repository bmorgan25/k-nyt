import { Modal } from "@/components/modal";
import { ResizableText } from "@/components/resize-word";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import dayInfo from "../../static/day.json";
import styles from "./styles.module.css";

function shuffleArray(array: string[]): string[] {
  const shuffled = [...array]; // Create a copy to avoid mutating the original array
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1)); // Random index from 0 to i
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]; // Swap elements
  }
  return shuffled;
}

export default function Connections() {
  const [allWords, setAllWords] = useState<string[]>([]);
  const [groups, setGroups] = useState<
    { answer: string; words: string[]; color: string }[]
  >([]);
  const [correct, setCorrect] = useState<
    { answer: string; words: string[]; color: string }[]
  >([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [guessLeft, setGuessLeft] = useState<number>(4);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const router = useRouter();

  const colorGroups = ["yellow", "green", "blue", "purple"];

  useEffect(() => {
    if (router.isReady) {
      const { day } = router.query;

      if (day) {
        const today = Number(day);
        const connInfo = dayInfo[today].connections;
        setAllWords(
          shuffleArray(
            Object.values(connInfo).flatMap((group) => group.options)
          )
        );

        const g: any = [];
        Object.keys(connInfo).forEach((key, idx) => {
          const tkey = key as keyof typeof connInfo;
          g.push({
            answer: connInfo[tkey].answer,
            words: connInfo[tkey].options,
            color: colorGroups[idx],
          });
        });

        setGroups(g);
      }
    }
  }, [router.isReady, router.query]);

  const handleSelect = (word: string) => {
    if (guessLeft === 0) return;
    if (selected.includes(word)) {
      setSelected(selected.filter((w) => w !== word));
    } else {
      setSelected([...selected, word]);
    }
    console.log(selected);
  };

  const handleGuess = () => {
    if (selected.length !== 4) return;
    let wasCorrect = false;
    groups.forEach((g) => {
      if (g.words.every((w) => selected.includes(w))) {
        setCorrect([...correct, g]);
        const removeWords = selected;
        setAllWords(allWords.filter((w) => !removeWords.includes(w)));
        wasCorrect = true;
      }
    });

    if (!wasCorrect) {
      if (guessLeft === 1) {
        setModalMessage(
          "Oh no! You couldn't get today's connections! Try again"
        );
        setIsModalOpen(true);
      }
      setGuessLeft(guessLeft - 1);
    }

    if (wasCorrect && (correct.length === 3 || correct.length === 4)) {
      setModalMessage("Congrats! You solved today's connections!");
      setIsModalOpen(true);
    }
    setSelected([]);
  };

  return (
    <div className={styles["container"]}>
      {correct.map((g, idx) => (
        <div key={`correct-${idx}`} className={styles[`correct-${g.color}`]}>
          <div>{g.answer}</div>
          <div className={styles["subtext"]}>{g.words.join(", ")}</div>
        </div>
      ))}

      {Array(4)
        .fill("")
        .map((v, idx) => (
          <div className={styles["row"]} key={`row-${idx}`}>
            {allWords.slice(idx * 4, idx * 4 + 4).map((word, i) => (
              <div key={`box-${i}`}>
                <div onClick={() => handleSelect(word)}>
                  <ResizableText
                    text={word}
                    selected={selected.includes(word)}
                  />
                </div>
              </div>
            ))}
          </div>
        ))}
      <div>
        <Modal
          isOpen={isModalOpen}
          message={modalMessage}
          onClose={() => setIsModalOpen(false)}
        />
      </div>
      <div>Guesses left: {guessLeft}</div>
      <div className={styles["submit-container"]}>
        <button
          className={styles["submit-btn"]}
          disabled={selected.length !== 4}
          onClick={() => handleGuess()}
        >
          Submit
        </button>
      </div>
    </div>
  );
}
