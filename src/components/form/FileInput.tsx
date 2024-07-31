import clsx from "clsx";
import React, { useEffect, useState } from "react";
import { MdOutlineAttachment, MdOutlineDeleteOutline } from "react-icons/md";
import { printFileSize } from "../../utils/printFileSize";

export interface UploadedFile {
  name: string;
  size: number;
  type: string;
  dataURL: string;
}

export interface FileInputProps {
  name: string;
  required?: boolean;
  disabled?: boolean;
  files: UploadedFile[];
  onFilesChange: (files: UploadedFile[]) => void;
  onFileRemove: (file: UploadedFile) => void;
  maxFileSize?: number; // in bytes
  allowedFileTypes?: string[];
}

export function FileInput({
  name,
  required,
  disabled,
  files = [],
  onFilesChange,
  onFileRemove,
  maxFileSize,
  allowedFileTypes,
}: FileInputProps) {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>(files);
  const [isDragActive, setIsDragActive] = useState(false);

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
      e.dataTransfer.clearData();
    }
  };

  const handleFiles = (files: FileList) => {
    const fileArray = Array.from(files).map((file) => ({
      name: file.name,
      size: file.size,
      type: file.type,
      dataURL: URL.createObjectURL(file),
    }));

    const validatedFiles = fileArray.filter((file) => {
      if (maxFileSize && file.size > maxFileSize) {
        console.error(
          `File ${file.name} exceeds the maximum size of ${maxFileSize} bytes`
        );
        return false;
      }
      if (allowedFileTypes && !allowedFileTypes.includes(file.type)) {
        console.error(`File ${file.name} has an unsupported file type`);
        return false;
      }
      return true;
    });

    setUploadedFiles((prevFiles) => {
      const updatedFiles = [...prevFiles, ...validatedFiles];
      onFilesChange && onFilesChange(updatedFiles);
      return updatedFiles;
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const handleFileRemove = (file: UploadedFile) => {
    const filteredFiles = uploadedFiles.filter((f) => f !== file);
    setUploadedFiles(filteredFiles);
    onFilesChange && onFilesChange(filteredFiles);
    onFileRemove && onFileRemove(file);
  };

  useEffect(() => {
    if (files) setUploadedFiles(files);
  }, [files]);

  return (
    <div className="w-full max-w-xl">
      <label htmlFor={name}>
        <div
          className={clsx(
            "border-2 border-dashed p-4 rounded-lg hover:bg-slate-100 transition-colors relative focus-within:ring-2 focus-within:ring-slate-500",
            {
              "border-slate-500 bg-slate-200": isDragActive,
              "border-slate-300 bg-white": !isDragActive,
            }
          )}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragEnter}
          onDrop={handleDrop}
        >
          <input
            id={name}
            name={name}
            type="file"
            multiple
            className="w-full h-full left-0 top-0 absolute flex -z-10 outline-0"
            onChange={handleInputChange}
            aria-describedby="selected-files"
            required={required}
            disabled={disabled}
          />
          <p className="text-center text-slate-500">
            Drag & drop files here, or click to select files
          </p>
        </div>
      </label>
      <ul className="mt-4" id="selected-files">
        {uploadedFiles.map((file, index) => (
          <li
            key={index}
            className="flex p-2 space-x-2 border-b border-slate-200"
          >
            <span className="font-medium text-slate-500">
              <MdOutlineAttachment className="size-5" />
            </span>
            <span className="font-medium flex-1 text-sm text-slate-900">
              {file.name}
            </span>
            <span className="text-sm text-slate-500">
              {printFileSize(file.size)}
            </span>
            <button
              type="button"
              className="size-6 rounded-full flex items-center justify-center text-red-600 hover:bg-red-100 active:text-red-700"
              aria-label="Remove file"
              onClick={() => handleFileRemove(file)}
            >
              <MdOutlineDeleteOutline className=" size-5" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
