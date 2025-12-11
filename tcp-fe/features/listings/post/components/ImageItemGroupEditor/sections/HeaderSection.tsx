// sections/HeaderSection.tsx

import { ImageGroupDraft } from "../../../types/types";

type HeaderSectionValue = {
  image: ImageGroupDraft;
};

type HeaderSectionActions = {
  onRemove: (group: ImageGroupDraft) => void;
};

type HeaderSectionProps = {
  value: HeaderSectionValue;
  actions: HeaderSectionActions;
};

export function HeaderSection({ value, actions }: HeaderSectionProps) {
  const { image } = value;
  const imageIndex = image.order;
  const { onRemove } = actions;

  return (
    <header className="mb-3 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-slate-900 text-xs text-white">
          {imageIndex}
        </span>
        <p className="text-xs text-slate-600">사진 {imageIndex}</p>
      </div>
      <button
        type="button"
        onClick={() => onRemove(image)}
        className="text-xs text-slate-400 hover:text-red-500"
      >
        이 사진 삭제
      </button>
    </header>
  );
}
