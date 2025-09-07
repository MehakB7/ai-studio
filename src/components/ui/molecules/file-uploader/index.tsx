import React, { useRef, forwardRef, useImperativeHandle } from "react";
import { UploadIcon } from "lucide-react";

export interface FileUploaderRef {
  clear: () => void; // parent can call this
}

type FileUploaderProps = {
  handleFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleDrop: (event: React.DragEvent<HTMLDivElement>) => void;
  handleDragOver: (event: React.DragEvent<HTMLDivElement>) => void;
  error?: string;
};

export const FileUploader = forwardRef<FileUploaderRef, FileUploaderProps>(
  ({ handleFileSelect, handleDrop, handleDragOver, error }, ref) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    useImperativeHandle(ref, () => ({
      clear: () => {
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      },
    }));

    return (
      <div
        className="mb-4 p-4 border-2 border-dashed border-border rounded-lg hover:border-primary/50 transition-colors cursor-pointer"
        onClick={() => fileInputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        data-testid="area-file-upload"
        role="button"
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg"
          className="hidden"
          onChange={handleFileSelect}
          data-testid="input-file"
        />
        <div className="text-center">
          <UploadIcon className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            Click to upload or drag & drop an image
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            PNG or JPG up to 10MB
          </p>
        </div>
        {error && (
          <p
            className="text-xs text-destructive mt-2"
            data-testid="upload-error"
          >
            {error}
          </p>
        )}
      </div>
    );
  },
);

FileUploader.displayName = "FileUploader";
