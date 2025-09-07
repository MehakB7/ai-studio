"use client";
import { useState, useCallback } from "react";
import { ImagePromptForm } from "@/components/organisms/image-genration/form";
import History from "@/components/organisms/image-genration/history";
import Preview from "@/components/organisms/image-genration/preview";
import {
  ImageGenerationResponse,
  usePostWithRetry,
} from "@/hooks/use-post-with-retry";
import { useHistory } from "@/hooks/use-history";
import { toast } from "sonner";

export default function Home() {
  const { postData, loading, abort } = usePostWithRetry();
  const [open, setOpen] = useState(false);
  const [selectedPreview, setSelectedPreview] =
    useState<ImageGenerationResponse | null>(null);
  const { history, addEntry } = useHistory();

  const handleGeneration = async (data: {
    prompt: string;
    style: string;
    imageDataUrl: string;
  }) => {
    try {
      const result = await postData(data);
      addEntry(result);
      setSelectedPreview(result);
      setOpen(true);
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message, {
          description: "Please try again later.",
          testId: "error-toast",
          duration: 30000,
        });
      }
    }
  };

  const handleCancelation = useCallback(() => {
    abort();
  }, [abort]);

  const handlePreviewSelection = useCallback(
    (preview: ImageGenerationResponse) => {
      setSelectedPreview(preview);
      setOpen(true);
    },
    [],
  );

  return (
    <div className="flex flex-col bg-background text-foreground sm:px-60">
      <div className="flex flex-1 overflow-hidden">
        <main className="flex mt-10 flex-1 overflow-hidden gap-10 flex-wrap">
          <ImagePromptForm
            onSubmit={handleGeneration}
            onCancel={handleCancelation}
            isGenerating={loading}
            disabled={loading}
          />
          {selectedPreview && (
            <Preview result={selectedPreview} open={open} setOpen={setOpen} />
          )}
          <History history={history} loadFromHistory={handlePreviewSelection} />
        </main>
      </div>
    </div>
  );
}
