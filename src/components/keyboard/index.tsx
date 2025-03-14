import { useState } from "react";
import styles from "./styles.module.css";

// A simple list of characters for the keyboard layout
const rows = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["Enter", "Z", "X", "C", "V", "B", "N", "M", "←"],
];

interface KeyboardProps {
  onKeyPress: (key: string) => void;
}
export default function Keyboard({ onKeyPress }: KeyboardProps) {
  const [pressedKeys, setPressedKeys] = useState<string[]>([]);

  const handleKeyPress = (key: string) => {
    onKeyPress(key);
    setPressedKeys((prev) => [...prev, key]); // Optionally track pressed keys
  };

  return (
    <div className={styles["keyboard"]}>
      {rows.map((row, index) => (
        <div key={index} className={styles["keyboard-row"]}>
          {row.map((key) => (
            <button
              key={key}
              className={styles[`keyboard-key`]}
              onClick={() => handleKeyPress(key)}
            >
              {key}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
}
