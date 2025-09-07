import { Config } from "@/lib/config";
import { useState, useCallback, useRef } from "react";

type ImageGeneratorDTO = {
  prompt: string;
  imageDataUrl: string;
  style: string;
};

export type ImageGenerationResponse = {
  id: string;
  imageUrl: string;
  prompt: string;
  style: string;
  created_at: string;
};

type PostOptions = {
  body?: ImageGeneratorDTO;
  headers?: HeadersInit;
};

export function usePostWithRetry() {
  const [response, setResponse] = useState<ImageGenerationResponse | null>(
    null,
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const controllerRef = useRef<AbortController | null>(null);

  const postData = useCallback(
    async (
      data: ImageGeneratorDTO,
      options: PostOptions = {},
      retries = Config.NETWORK_RETRY,
    ) => {
      setLoading(true);
      setError(null);
      setResponse(null);

      controllerRef.current = new AbortController();

      let attempt = 0;
      while (attempt <= retries) {
        try {
          const res = await fetch("/api/generate", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              ...options.headers,
            },
            body: JSON.stringify(data ?? options.body),
            signal: controllerRef.current.signal,
          });

          if (!res.ok) {
            const error = await res.json();
            throw new Error(error.message);
          }

          const result = await res.json();
          setResponse(result);
          setLoading(false);
          return result;
        } catch (err: unknown) {
          if (err instanceof Error) {
            if (err.name === "AbortError") {
              setError("Request aborted");
              setLoading(false);
              return;
            }
            attempt++;
            console.log("Retrying...");
            if (attempt > retries) {
              setError(err.message || "Something went wrong");
              setLoading(false);
              throw err;
            }
          }
        }
      }
    },
    [],
  );

  const abort = useCallback(() => {
    if (controllerRef.current) {
      controllerRef.current.abort();
    }
  }, []);

  return { postData, response, loading, error, abort };
}
