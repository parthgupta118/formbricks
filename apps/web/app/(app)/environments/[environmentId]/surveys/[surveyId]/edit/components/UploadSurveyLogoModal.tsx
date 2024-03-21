import ColorSurveyBg from "@/app/(app)/environments/[environmentId]/surveys/[surveyId]/edit/components/ColorSurveyBg";
import { ExclamationCircleIcon } from "@heroicons/react/24/outline";
import { CodeBracketIcon, PaintBrushIcon, SparklesIcon } from "@heroicons/react/24/solid";
import { useEffect, useState } from "react";

import { colours } from "@formbricks/lib/constants";
import { Alert, AlertDescription, AlertTitle } from "@formbricks/ui/Alert";
import { Badge } from "@formbricks/ui/Badge";
import { Button } from "@formbricks/ui/Button";
import { ColorPicker } from "@formbricks/ui/ColorPicker";
import FileInput from "@formbricks/ui/FileInput";
import { Label } from "@formbricks/ui/Label";
import LogoUploader from "@formbricks/ui/LogoUploader";
// import { TMembershipRole } from "@formbricks/types/memberships";
import { Modal } from "@formbricks/ui/Modal";

interface UploadSurveyLogoModalProps {
  environmentId: string;
  open: boolean;
  setOpen: (v: boolean) => void;
  logoUrl?: string;
  onLogoChange: ({ logoUrl }) => void;
  bgColor: string;
  // membershipRole?: TMembershipRole;
}

export default function UploadSurveyLogoModal({
  environmentId,
  open,
  setOpen,
  bgColor,
  logoUrl,
  onLogoChange,
  // membershipRole,
}: UploadSurveyLogoModalProps) {
  const id = environmentId;
  const [color, setColor] = useState(bgColor || "#FF00FFF");
  const [localLogoUrl, setLocalLogoUrl] = useState(logoUrl);

  useEffect(() => {
    setLocalLogoUrl(logoUrl);
  }, [logoUrl]);

  return (
    <>
      <Modal open={open} setOpen={setOpen} noPadding closeOnOutsideClick={false} hideCloseButton>
        <div className="flex h-full flex-col rounded-lg">
          <div className="rounded-t-lg bg-slate-100">
            <div className="flex w-full items-center justify-between p-6">
              <div className="flex items-center space-x-2">
                <div className="mr-1.5 h-6 w-6 text-slate-500">
                  <PaintBrushIcon />
                </div>
                <div>
                  <div className="text-xl font-medium text-slate-700">Logo Settings (For All Surveys)</div>
                  <div className="text-sm text-slate-500">Change logo settings for all surveys.</div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex h-full flex-col items-center gap-4 space-x-2 p-6">
            <div className="flex w-full flex-col gap-2">
              <Label>{logoUrl ? "Preview" : "Company Logo"}</Label>
              <LogoUploader
                id="logo-file-input"
                allowedFileExtensions={["png", "jpeg"]}
                imageFit="cover"
                environmentId={environmentId}
                onFileUpload={(url: string[]) => {
                  if (url.length > 0) {
                    setLocalLogoUrl(url[0]);
                  }
                }}
                fileUrl={localLogoUrl}
                withPreviewMode
              />
            </div>
            <div className="flex w-full flex-col gap-1">
              <Label className="mb-2">Background Color</Label>
              <div className="flex w-full items-center rounded-lg border border-slate-200 bg-slate-100 p-4 text-sm text-slate-700">
                <div className="w-full max-w-sm items-center">
                  <Label htmlFor="brandcolor">Color (HEX)</Label>
                  <ColorPicker color={color} onChange={setColor} />
                </div>
              </div>
            </div>

            <Alert className="flex items-center bg-slate-50">
              <ExclamationCircleIcon className="h-3.5 w-3.5" />
              <AlertDescription>
                <span className="text-xs text-slate-600">
                  The logo will be updated for all surveys which have the logo settings enabled
                </span>
              </AlertDescription>
            </Alert>
          </div>
          <div className="flex justify-end p-6">
            <div className="flex space-x-2">
              <Button type="button" variant="minimal" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="darkCTA"
                type="submit"
                loading={false}
                onClick={() => {
                  onLogoChange({ logoUrl: localLogoUrl });
                  setOpen(false);
                }}>
                Save
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}
