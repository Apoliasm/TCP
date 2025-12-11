"use client";

import { ListingDraft } from "../types/types";
type ListingTitleValue = {
  title: string;
  // ListingDraft에 content가 있다면 이걸로 확장 가능
};

type ListingTitleActions = {
  setTitle: (title: string) => void;
};

type ListingTitleProps = {
  value: ListingTitleValue;
  actions: ListingTitleActions;
};

export function ListingTitle({ value, actions }: ListingTitleProps) {
  const { title } = value;
  const { setTitle } = actions;

  return (
    <section className="bg-slate-50 rounded-xl p-6 space-y-4 border border-slate-200">
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="제목을 입력하세요"
      />
    </section>
  );
}
