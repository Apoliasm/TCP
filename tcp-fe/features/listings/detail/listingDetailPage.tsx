"use client";

import { useMemo } from "react";
import { useListing } from "./hooks/useListing";
import {
  ListingDetailResponse,
  ListingImageItemResponse,
  ListingImageResponse,
} from "./types/types";
import { useRouter } from "next/navigation";
import { ListingStatus } from "@/lib/api/listings/types";
import { RARITY } from "../post/types/types";

type Props = {
  id: number;
};

export default function ListingDetailPage({ id }: Props) {
  const { data, isLoading, error } = useListing(id);
  const router = useRouter();
  const handleBack = () => {
    router.push("/listing");
  };
  if (!Number.isFinite(id)) {
    return <main className="p-8">잘못된 게시글 ID입니다.</main>;
  }

  if (isLoading) {
    return <main className="p-8">게시글을 불러오는 중입니다...</main>;
  }

  if (error || !data) {
    return (
      <main className="p-8 space-y-4">
        <button
          onClick={() => {
            // TODO: 목록 이동
          }}
          className="text-sm text-gray-500 hover:underline"
        >
          ← 뒤로가기
        </button>
        <div>게시글을 불러오지 못했습니다.</div>
      </main>
    );
  }

  const listing = data as unknown as ListingDetailResponse;

  const createdText = listing?.createdAt
    ? new Date(listing.createdAt).toLocaleString("ko-KR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  return (
    <main className="p-8 space-y-6">
      <header className="space-y-2">
        <button
          onClick={() => {
            handleBack();
          }}
          className="text-sm text-gray-500 hover:underline"
        >
          ← 뒤로가기
        </button>

        <div className="flex items-center gap-2">
          <StatusBadge status={listing.status} />
          <h1 className="text-2xl font-bold">{listing.title}</h1>
        </div>

        <div className="text-sm text-gray-500">
          판매자 ID: {listing.sellerId} · 작성일: {createdText}
        </div>
      </header>

      {listing.images.map((image) => (
        <ImageSection key={image.id} image={image} />
      ))}
    </main>
  );
}

function ImageSection({ image }: { image: ListingImageResponse }) {
  const imageSrc = buildImageSrc(image.imageUrl);

  return (
    <section className="border rounded p-4 mb-6">
      <div className="text-sm text-gray-500 mb-2">사진 #{image.order + 1}</div>

      <div className="w-full h-56 bg-gray-100 flex items-center justify-center text-gray-400 text-sm mb-4">
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={`listing-image-${image.id}`}
            className="h-full object-contain"
          />
        ) : (
          "사진 데이터는 아직 없음"
        )}
      </div>

      <div>
        <h3 className="font-semibold mb-2">이 사진에 포함된 아이템</h3>

        {image.items.length === 0 ? (
          <p className="text-gray-400 text-sm">등록된 아이템이 없습니다.</p>
        ) : (
          <ul className="space-y-3">
            {image.items.map((item) => (
              <ListingItemRow key={item.id} item={item} />
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

function StatusBadge({ status }: { status: ListingStatus }) {
  const label =
    status === ListingStatus.ON_SALE
      ? "판매중"
      : status === ListingStatus.RESERVED
      ? "예약중"
      : status === ListingStatus.SOLD
      ? "판매완료"
      : "unknown";

  const style =
    status === ListingStatus.ON_SALE
      ? "bg-green-100 text-green-700"
      : status === ListingStatus.RESERVED
      ? status === "RESERVED"
      : status === ListingStatus.SOLD
      ? "bg-yellow-100 text-yellow-700"
      : "bg-gray-200 text-gray-600";

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 text-xs rounded ${style}`}
    >
      {label}
    </span>
  );
}

function ListingItemRow({ item }: { item: ListingImageItemResponse }) {
  const itemInfo = item.itemInfo;
  const cardInfo = itemInfo?.cardInfo;

  // 카드명은 cardName이 있으면 우선, 없으면 candidate.name, 둘 다 없으면 fallback
  const cardDisplayName =
    cardInfo?.cardName?.name ?? cardInfo?.candidate?.name ?? "(이름 미확정)";

  return (
    <li className="border rounded p-3 bg-white shadow-sm space-y-2">
      {/* 상단 라인: 아이템 타입/이름 */}
      <div className="flex justify-between items-start gap-3">
        <div className="min-w-0">
          {itemInfo?.type === "CARD" && cardInfo ? (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-gray-800 truncate">
                {cardDisplayName}
              </span>
              {cardInfo.rarity ?? (
                <span className="text-[10px] text-emerald-600">
                  {`레어도 ${RARITY[cardInfo.rarity]}`}
                </span>
              )}
            </div>
          ) : (
            <div className="font-semibold text-gray-800">
              {itemInfo?.type ?? "ITEM"} (infoId: {item.infoId ?? "-"})
            </div>
          )}
        </div>

        <div className="text-sm text-gray-500 shrink-0">
          수량: {item.quantity}개
        </div>
      </div>

      {/* 상태/가격 */}
      <div className="flex align-middle gap-3 ">
        <span className="text-gray-600 text-sm">
          가격: {Number(item.pricePerUnit).toLocaleString()}원
        </span>
        <span className="text-gray-600 text-sm">
          상태: {item.condition || "-"}
        </span>
      </div>

      {!!item.detail && (
        <div className="text-gray-500 text-sm">{item.detail}</div>
      )}
    </li>
  );
}

/**
 * imageUrl이 "/uploads/..." 형태로 올 때 NEXT_PUBLIC_API_BASE_URL과 합쳐서 URL 생성
 */
function buildImageSrc(imageUrl: string | null): string | null {
  if (!imageUrl) return null;

  if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
    return imageUrl;
  }

  const base = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!base) return imageUrl;

  const baseTrimmed = base.endsWith("/") ? base.slice(0, -1) : base;
  const pathTrimmed = imageUrl.startsWith("/") ? imageUrl : `/${imageUrl}`;

  return `${baseTrimmed}${pathTrimmed}`;
}
