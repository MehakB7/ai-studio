import { useState, useRef } from "react";
import { useImageUpload } from "@/hooks/use-image-upload";
import { Button } from "@/components/ui/button";
import { formatFileSize } from "@/lib/image-utils";
import { Send, X, Image } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import SelectBox from "@/components/ui/molecules/selectBox";
import { STYLES } from "@/lib/config";
import {
  FileUploader,
  FileUploaderRef,
} from "@/components/ui/molecules/file-uploader";

interface ImagePromptFormProps {
  onSubmit: (data: {
    imageDataUrl: string;
    prompt: string;
    style: string;
  }) => void;
  onCancel?: () => void;
  isGenerating: boolean;
  disabled?: boolean;
}

export function ImagePromptForm({
  onSubmit,
  isGenerating,
  disabled,
  onCancel,
}: ImagePromptFormProps) {
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState("editorial");
  const { uploadedImage, isProcessing, handleFileUpload, removeImage } =
    useImageUpload();

  const [fileUploadError, stetFileUploadError] = useState("");

  const uploaderRef = useRef<FileUploaderRef>(null);

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        await handleFileUpload(file);
      } catch (error) {
        if (error instanceof Error) {
          stetFileUploadError(error?.message || "Something went wrong");
        }
      }
    }
  };

  const handleDrop = async (event: React.DragEvent) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      try {
        await handleFileUpload(file);
      } catch (error) {
        if (error instanceof Error) {
          stetFileUploadError(error?.message || "Something went wrong");
        }
      }
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!uploadedImage?.file || !prompt.trim() || isGenerating || disabled) {
      return;
    }

    onSubmit({
      imageDataUrl: uploadedImage.dataUrl,
      prompt: prompt.trim(),
      style,
    });
    setPrompt("");
    removeImage();
    uploaderRef.current?.clear();
  };

  const canSubmit =
    uploadedImage?.file && prompt.trim() && !isGenerating && !disabled;

  return (
    <div className=" border border-border bg-card backdrop-blur-sm sm:w-[500px] rounded-md">
      <div className="p-4">
        <h2 className="text-lg font-bold mb-4">Transform Your Image</h2>
        {!uploadedImage && (
          <FileUploader
            ref={uploaderRef}
            error={fileUploadError}
            handleFileSelect={handleFileSelect}
            handleDrop={handleDrop}
            handleDragOver={handleDragOver}
          />
        )}

        {uploadedImage && (
          <div
            className="mb-4 p-3 bg-muted rounded-lg"
            data-testid="preview-image"
          >
            <div className="flex items-center space-x-3">
              <img
                src={uploadedImage.dataUrl}
                alt="Image preview"
                className="w-16 h-16 rounded-lg object-cover"
                data-testid="img-preview"
              />
              <div className="flex-1">
                <p className="text-sm font-medium" data-testid="text-filename">
                  {uploadedImage.name}
                </p>
                <p
                  className="text-xs text-muted-foreground"
                  data-testid="text-filesize"
                >
                  {formatFileSize(uploadedImage.size)}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={removeImage}
                className="text-muted-foreground hover:text-destructive"
                data-testid="button-remove-image"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="flex space-x-2 flex-col">
            <Label htmlFor="style" className="block text-sm font-medium mb-2">
              Style
            </Label>
            <SelectBox
              options={STYLES}
              onValueChange={setStyle}
              value={style}
              className="w-full"
              id="style"
              testId="style"
            />
            <div className="flex-1 mt-4">
              <div className="mb-6">
                <Label
                  htmlFor="prompt"
                  className="block text-sm font-medium mb-2"
                >
                  Prompt
                </Label>
                <Textarea
                  id="prompt"
                  rows={3}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe the style or transformation you want..."
                  className="resize-none"
                  data-testid="prompt-input"
                />
              </div>
            </div>
          </div>
          <Button
            type="submit"
            size="sm"
            disabled={!canSubmit || isProcessing}
            className="w-full"
            data-testid="button-submit"
          >
            <Send className="h-4 w-4" />
            Generate Image
          </Button>
          {isGenerating && (
            <Button
              variant="destructive"
              className="w-full"
              onClick={onCancel}
              data-testid="cancel-button"
            >
              Cancel Generation
            </Button>
          )}
        </form>
        {(uploadedImage || prompt) && (
          <div
            className="text-xs text-muted-foreground bg-muted/50 rounded-lg p-3 mt-10"
            data-testid="summary-live"
          >
            <h3 className="text-sm font-bold mb-2">Live Summary</h3>
            <div className="flex  flex-col space-x-4 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center overflow-hidden">
                  {uploadedImage ? (
                    <img
                      src={uploadedImage.dataUrl}
                      alt="Uploaded image thumbnail"
                      className="w-full h-full object-cover"
                      data-testid="image-thumbnail"
                    />
                  ) : (
                    <Image className="w-6 h-6 text-muted-foreground" />
                  )}
                </div>
                <div>
                  <p
                    className="text-sm font-medium"
                    data-testid="summary-image-name"
                  >
                    {uploadedImage ? uploadedImage.name : "No image uploaded"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {uploadedImage
                      ? "Ready for generation"
                      : "Upload an image to get started"}
                  </p>
                </div>
              </div>

              <span
                data-testid="summary-style"
                className="bg-green-200 text-green-800 rounded-lg px-2 py-1 self-start"
              >
                {STYLES.find((s) => s.value === style)?.label}
              </span>
              <span data-testid="summary-prompt" className="text-wrap">
                {prompt || ""}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
