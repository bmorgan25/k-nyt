import clsx from "clsx";
import { useEffect, useRef, useState } from "react";
import styles from "./styles.module.css";

export const ResizableText = ({
  text,
  selected,
}: {
  text: string;
  selected: boolean;
}) => {
  const boxRef = useRef<HTMLDivElement>(null);
  const [fontSize, setFontSize] = useState(12); // Default font size

  useEffect(() => {
    const box = boxRef.current;
    if (!box) return;

    let minSize = 9; // Minimum font size
    let maxSize = 15; // Default font size (won't exceed this)
    let newSize = maxSize;

    box.style.fontSize = `${newSize}px`;

    while (
      (box.scrollWidth > box.clientWidth ||
        box.scrollHeight > box.clientHeight) &&
      newSize > minSize
    ) {
      newSize--;
      box.style.fontSize = `${newSize}px`;
    }

    setFontSize(newSize); // Update state
  }, [text]);

  return (
    <div
      ref={boxRef}
      className={clsx("box", {
        [styles["word-box-selected"]]: selected,
        [styles["word-box"]]: true,
      })}
      style={{
        fontSize: `${fontSize}px`,
      }}
    >
      {text}
    </div>
  );
};
