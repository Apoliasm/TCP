"use client";

import { FeaturePageLayout } from "@/shared/ui/FeaturePageLayout";
import { ReactNode } from "react";
import { useUser } from "../hooks/useUser";

type Props = {
  children: ReactNode;
};
export default function CommonRouter(props: Props) {
  const { data, isLoading, error } = useUser();
  if (isLoading) {
    return <div className="flex justify-center text-center">need login</div>;
  }
  if (error) {
    return <div className="flex justify-center text-center">login error</div>;
  }

  const { children } = props;
  return (
    <div className="h-full rounded-2xl bg-white shadow-lg border border-slate-100 p-4 sm:px-6 sm:py-4 w-11/12 mx-auto">
      {children}
    </div>
  );
}
