import { FeaturePageLayout } from "@/shared/ui/FeaturePageLayout";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};
export default function CommonRouter(props: Props) {
  const { children } = props;
  return (
    <div className="bg-slate-50">
      <div className="min-h-screen">
        <div className="rounded-2xl bg-white shadow-lg border border-slate-100 p-6 max-w-3xl mx-auto px-4">
          {children}
        </div>
      </div>
    </div>
  );
}
