import { PencilIcon } from "@heroicons/react/24/outline";
import Image from "next/image";

import { TAllowedFileExtension } from "@formbricks/types/common";

import { SelectedFile } from ".";

const allowedFileTypesForPreview = ["png", "jpeg", "jpg", "webp"];
// Still Needs to be implemented
const isImage = (name: string) => {
  return allowedFileTypesForPreview.includes(name.split(".").pop() as TAllowedFileExtension);
};

interface ImagePreviewProps {
  selectedFiles: Array<SelectedFile>;
  fileUrl?: string | string[];
  imageFit?: "cover" | "contain";
  editIcon?: boolean;
  handleEdit?: () => void;
}

const ImagePreview = ({ selectedFiles, imageFit = "cover", editIcon, handleEdit }: ImagePreviewProps) => {
  return (
    <div className="h-16">
      {selectedFiles[0].name ? (
        <div className="relative mx-auto h-full w-full overflow-hidden rounded-lg">
          <Image
            src={selectedFiles[0].url}
            alt={selectedFiles[0].name}
            fill
            style={{ objectFit: imageFit, objectPosition: "left" }}
            quality={100}
            className={!selectedFiles[0].uploaded ? "opacity-50" : ""}
          />
          {selectedFiles[0].uploaded ? (
            editIcon ? (
              <div
                className="absolute right-2 top-2 flex cursor-pointer items-center justify-center rounded-md bg-slate-100 p-1 hover:bg-slate-200 hover:bg-white/90"
                onClick={handleEdit}>
                <PencilIcon className="h-4 text-slate-700 hover:text-slate-900" />
              </div>
            ) : null
          ) : (
            <Loader />
          )}
        </div>
      ) : null}
    </div>
  );
};

export default ImagePreview;

const Loader = () => {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <svg className="h-7 w-7 animate-spin text-slate-900" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    </div>
  );
};
