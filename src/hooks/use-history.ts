import { useState, useEffect, useCallback } from "react";
import { ImageGenerationResponse } from "./use-post-with-retry";

export function useHistory() {
  const [history, setHistory] = useState<ImageGenerationResponse[]>([]);
  useEffect(() => {
    const stored = localStorage.getItem("history");
    if (stored) {
      try {
        setHistory(JSON.parse(stored));
      } catch {
        setHistory([]);
      }
    }
  }, []);

  const addEntry = useCallback(
    (entry: ImageGenerationResponse) => {
      if(!entry){
        return;
      }

      setHistory((prev) => {
        let updated = [entry, ...prev];
        if (updated.length > 5) {
          updated = updated.slice(0, 5);
        }

        localStorage.setItem("history", JSON.stringify(updated));
        return updated;
      });
    },
    []
  );

  return { history, addEntry };
}
