// sections/ImagePreviewSection.tsx

type ImagePreviewSectionValue = {
  previewUrl?: string;
};

type ImagePreviewSectionProps = {
  value: ImagePreviewSectionValue;
};

export function ImagePreviewSection({ value }: ImagePreviewSectionProps) {
  const { previewUrl } = value;

  if (!previewUrl) return null;

  return (
    <div className="mb-4">
      <img
        src={previewUrl}
        alt="상품 이미지"
        className="h-32 w-full rounded-lg object-cover"
      />
    </div>
  );
}
