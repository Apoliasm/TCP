"use client";

import { ListingDraft } from "../types/types";
type ListingTitleValue = {
  title: string;
  // ListingDraft에 content가 있다면 이걸로 확장 가능
  content?: string;
};

type ListingTitleActions = {
  setTitle: (title: string) => void;
  setContent?: (content: string) => void;
};

type ListingTitleProps = {
  value: ListingTitleValue;
  actions: ListingTitleActions;
};

export function ListingTitle({ value, actions }: ListingTitleProps) {
  const { title, content = "" } = value;
  const { setTitle, setContent } = actions;

  return (
    <section>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="제목을 입력하세요"
      />
    </section>
  );
}
