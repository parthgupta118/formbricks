"use client";

import UploadSurveyLogoModal from "@/app/(app)/environments/[environmentId]/surveys/[surveyId]/edit/components/UploadSurveyLogoModal";
import { usePathname } from "next/navigation";
import { useRef, useState } from "react";

import { TProduct } from "@formbricks/types/product";
import FileInput from "@formbricks/ui/FileInput";
import LogoUploader from "@formbricks/ui/LogoUploader";

interface FileUploadSurveyLogoProps {
  product: TProduct;
  onLogoChange: ({ logoUrl }) => void;
}

export default function FileUploadSurveyLogo({ product, onLogoChange }: FileUploadSurveyLogoProps) {
  const path = usePathname();
  const environmentId = path?.split("/environments/")[1]?.split("/")[0];
  const [isSurveyLogoModalOpen, setSurveyLogoModalOpen] = useState(false);
  console.log(product.brand?.logoUrl, "logo url");

  return (
    <>
      <div className="h-14 w-[10rem]">
        <LogoUploader
          id="logo-file-input"
          allowedFileExtensions={["png", "jpeg"]}
          environmentId={environmentId}
          onFileUpload={(url: string[]) => {
            if (url.length > 0) {
              onLogoChange({ logoUrl: url[0] });
              setSurveyLogoModalOpen(true);
            } else {
              onLogoChange({ logoUrl: "" });
            }
          }}
          fileUrl={product?.brand?.logoUrl}
          withEdit
          handleEdit={() => setSurveyLogoModalOpen(true)}
        />
      </div>
      <UploadSurveyLogoModal
        environmentId={environmentId}
        open={isSurveyLogoModalOpen}
        setOpen={setSurveyLogoModalOpen}
        logoUrl={product?.brand?.logoUrl}
        bgColor={"#FF00FF"}
        onLogoChange={onLogoChange}
        // membershipRole={membershipRole}
      />
    </>
  );
}
