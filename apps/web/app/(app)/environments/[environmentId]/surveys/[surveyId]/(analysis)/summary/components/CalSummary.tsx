import Headline from "@/app/(app)/environments/[environmentId]/surveys/[surveyId]/(analysis)/summary/components/Headline";
import { convertFloatToNDecimal } from "@/app/(app)/environments/[environmentId]/surveys/[surveyId]/(analysis)/summary/lib/util";
import { questionTypes } from "@/app/lib/questions";
import { InboxIcon } from "lucide-react";

import { getLocalizedValue } from "@formbricks/lib/i18n/utils";
import { TSurveySummaryCal } from "@formbricks/types/responses";
import { ProgressBar } from "@formbricks/ui/ProgressBar";

interface CalSummaryProps {
  questionSummary: TSurveySummaryCal;
  environmentId: string;
}

export const CalSummary = ({ questionSummary }: CalSummaryProps) => {
  const questionTypeInfo = questionTypes.find((type) => type.id === questionSummary.question.type);

  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 shadow-sm">
      <div className="space-y-2 px-4 pb-5 pt-6 md:px-6">
        <Headline headline={getLocalizedValue(questionSummary.question.headline, "default")} />

        <div className="flex space-x-2 text-xs font-semibold text-slate-600 md:text-sm">
          <div className="flex items-center rounded-lg bg-slate-100 p-2 ">
            {questionTypeInfo && <questionTypeInfo.icon className="mr-2 h-4 w-4 " />}
            {questionTypeInfo ? questionTypeInfo.label : "Unknown Question Type"} Question
          </div>
          <div className=" flex items-center rounded-lg bg-slate-100 p-2">
            <InboxIcon className="mr-2 h-4 w-4" />
            {questionSummary.responseCount} Responses
          </div>
          {!questionSummary.question.required && (
            <div className="flex items-center  rounded-lg bg-slate-100 p-2">Optional</div>
          )}
        </div>
      </div>
      <div className="space-y-5 rounded-b-lg bg-white px-4 pb-6 pt-4 text-sm md:px-6 md:text-base">
        <div>
          <div className="text flex justify-between px-2 pb-2">
            <div className="mr-8 flex space-x-1">
              <p className="font-semibold text-slate-700">Booked</p>
              <div>
                <p className="rounded-lg bg-slate-100 px-2 text-slate-700">
                  {convertFloatToNDecimal(questionSummary.booked.percentage, 1)}%
                </p>
              </div>
            </div>
            <p className="flex w-32 items-end justify-end text-slate-600">
              {questionSummary.booked.count} {questionSummary.booked.count === 1 ? "response" : "responses"}
            </p>
          </div>
          <ProgressBar barColor="bg-brand" progress={questionSummary.booked.percentage / 100} />
        </div>
        <div>
          <div className="text flex justify-between px-2 pb-2">
            <div className="mr-8 flex space-x-1">
              <p className="font-semibold text-slate-700">Dismissed</p>
              <div>
                <p className="rounded-lg bg-slate-100 px-2 text-slate-700">
                  {convertFloatToNDecimal(questionSummary.skipped.percentage, 1)}%
                </p>
              </div>
            </div>
            <p className="flex w-32 items-end justify-end text-slate-600">
              {questionSummary.skipped.count} {questionSummary.skipped.count === 1 ? "response" : "responses"}
            </p>
          </div>
          <ProgressBar barColor="bg-brand" progress={questionSummary.skipped.percentage / 100} />
        </div>
      </div>
    </div>
  );
};
