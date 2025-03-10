import { useEffect, useState } from "react";
import dayInfo from "../../static/day.json";

export default function HomePage() {
  const [day, setDay] = useState<any[]>([]);

  useEffect(() => {
    setDay(dayInfo);
  }, []);

  return (
    <div>
      {day.map((dn, idx) => (
        <div key={`wordle-${idx}`}>
          <a href={`/wordle?day=${idx}`}>Wordle: Day {idx + 1}</a>
        </div>
      ))}
    </div>
  );
}
