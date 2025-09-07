import { ImageGenerationResponse } from "@/hooks/use-post-with-retry";
import React from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { STYLES } from "@/lib/config";

const Preview = ({
  result,
  open,
  setOpen,
}: {
  result: ImageGenerationResponse;
  open: boolean;
  setOpen: (open: boolean) => void;
}) => {
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Preview</SheetTitle>
          <SheetDescription>This is your AI generated image.</SheetDescription>
        </SheetHeader>
        <div className="my-4 p-4">
        <img
          src={result.imageUrl}
          alt="AI generated image result"
          className="w-full rounded-lg mb-4"
          data-testid="result-image"
        />

        <div className="space-y-3 flex flex-col gap-2 ml-2">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Prompt:</p>
            <p className="text-sm" data-testid="result-prompt">
              {result.prompt}
            </p>
          </div>
          <div >
            <p className="text-sm font-medium text-muted-foreground">Style:</p>
            <span
              className="bg-green-200 text-sm text-green-800 rounded-lg px-2 py-1 self-start"
              data-testid="result-style"
            >
              {STYLES.find((s) => s.value === result.style)?.label}
            </span>
          </div>
        </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default Preview;
