"use client";

import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

import { cn } from "@formbricks/lib/cn";
import { TAllowedFileExtension } from "@formbricks/types/common";

import { Button } from "../Button";
import { uploadFile } from "../FileInput/lib/fileUpload";
import { Label } from "../Label";
import ImagePreview from "./ImagePreview";
import Uploader from "./Uploader";

interface LogoUploaderProps {
  id: string;
  allowedFileExtensions: TAllowedFileExtension[];
  environmentId: string | undefined;
  handleEdit?: () => void;
  onFileUpload: (uploadedUrl: string[] | undefined) => void;
  fileUrl?: string | string[];
  imageFit?: "cover" | "contain";
  withEdit?: boolean;
  withPreviewMode?: boolean;
}

export interface SelectedFile {
  url: string;
  name: string;
  uploaded: Boolean;
}

const LogoUploader: React.FC<LogoUploaderProps> = ({
  id,
  allowedFileExtensions,
  environmentId,
  onFileUpload,
  fileUrl,
  imageFit,
  withPreviewMode,
  withEdit,
  handleEdit,
}) => {
  const [selectedFiles, setSelectedFiles] = useState<SelectedFile[]>([]);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (files: File[]) => {
    if (files.length > 1) {
      files = [files[0]];
      toast.error("Only one file is allowed");
    }

    const allowedFiles = files.filter(
      (file) =>
        file &&
        file.type &&
        allowedFileExtensions.includes(file.name.split(".").pop() as TAllowedFileExtension)
    );

    if (allowedFiles.length < files.length) {
      if (allowedFiles.length === 0) {
        toast.error("No files are supported");
        return;
      }
      toast.error("Some files are not supported");
    }

    setSelectedFiles(
      allowedFiles.map((file) => ({ url: URL.createObjectURL(file), name: file.name, uploaded: false }))
    );

    const uploadedFiles = await Promise.allSettled(
      allowedFiles.map((file) => uploadFile(file, allowedFileExtensions, environmentId))
    );

    if (
      uploadedFiles.length < allowedFiles.length ||
      uploadedFiles.some((file) => file.status === "rejected")
    ) {
      if (uploadedFiles.length === 0) {
        toast.error("No files were uploaded");
      } else {
        toast.error("Some files failed to upload");
      }
    }

    const uploadedUrls: string[] = [];
    uploadedFiles.forEach((file) => {
      if (file.status === "fulfilled") {
        uploadedUrls.push(file.value.url);
      }
    });

    if (uploadedUrls.length === 0) {
      setSelectedFiles([]);
      return;
    }

    onFileUpload(uploadedUrls);
  };

  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = "copy";
  };

  const handleDrop = async (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const files = Array.from(e.dataTransfer.files);
    handleUpload(files);
  };

  const handleRemove = async (idx: number) => {
    const newFileUrl = selectedFiles.filter((_, i) => i !== idx).map((file) => file.url);
    onFileUpload(newFileUrl);
  };

  useEffect(() => {
    const getSelectedFiles = () => {
      if (fileUrl && typeof fileUrl === "string") {
        return [{ url: fileUrl, name: fileUrl.split("/").pop() || "", uploaded: true }];
      } else if (fileUrl && Array.isArray(fileUrl)) {
        return fileUrl.map((url) => ({ url, name: url.split("/").pop() || "", uploaded: true }));
      } else {
        return [];
      }
    };
    setSelectedFiles(getSelectedFiles());
  }, [fileUrl]);

  return (
    <div className="w-full cursor-default">
      {selectedFiles.length > 0 ? (
        withPreviewMode ? (
          <>
            <div className="flex w-full items-center rounded-lg border border-slate-200 bg-slate-100 p-4 text-sm text-slate-700">
              <div className="flex w-full max-w-60 flex-col gap-1">
                <ImagePreview
                  selectedFiles={selectedFiles}
                  handleEdit={handleEdit}
                  editIcon={withEdit}
                  imageFit={imageFit}
                  fileUrl={fileUrl}
                />
              </div>
            </div>
            <div className="mt-4 flex flex-row gap-4">
              <Button
                size="sm"
                variant="secondary"
                onClick={() => {
                  console.log("Image Input Ref:", imageInputRef.current);
                  imageInputRef.current?.click();
                }}>
                Replace Logo
              </Button>
              <Button variant="minimal" size="sm" onClick={() => handleRemove(0)}>
                Remove Logo
              </Button>
            </div>
            <label htmlFor={`${id}-selected-file`}>
              <input
                type="file"
                ref={imageInputRef}
                id={`${id}-selected-file`}
                name={`${id}-selected-file`}
                accept={allowedFileExtensions.map((ext) => `.${ext}`).join(",")}
                className="hidden"
                hidden={withPreviewMode}
                onChange={async (e) => {
                  let selectedFiles = Array.from(e.target?.files || []);
                  handleUpload(selectedFiles);
                }}
              />
            </label>
          </>
        ) : (
          <ImagePreview
            selectedFiles={selectedFiles}
            handleEdit={handleEdit}
            editIcon={withEdit}
            imageFit={imageFit}
            fileUrl={fileUrl}
          />
        )
      ) : (
        <Uploader
          id={id}
          name="selected-file"
          handleDragOver={handleDragOver}
          handleDrop={handleDrop}
          uploaderClassName={withPreviewMode ? "h-40 w-full" : "h-14 w-full"}
          allowedFileExtensions={allowedFileExtensions}
          handleUpload={handleUpload}
          title={withPreviewMode ? "Click or drag to upload here" : "Add logo here"}
        />
      )}
    </div>
  );
};

export default LogoUploader;
