import { FeaturePageLayout } from "@/shared/ui/FeaturePageLayout";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};
export default function CommonRouter(props: Props) {
  const { children } = props;
  return (
    <main className="flex flex-col grow bg-slate-50 pb-8 pt-2">
      <div className="h-full rounded-2xl bg-white shadow-lg border border-slate-100 p-6 w-11/12 mx-auto">
        {children}
      </div>
    </main>
  );
}
