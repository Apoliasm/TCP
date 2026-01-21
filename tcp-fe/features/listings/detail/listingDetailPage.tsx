"use client";

import { useListing } from "./hooks/useListing";
import { useRouter } from "next/navigation";
import {
  ImageGroupResponse,
  ListingItemResponse,
  ListingResponse,
} from "@/lib/api/listings/types";
import { StatusBadge } from "@/shared/ui/StatusBadge";
import { useUser } from "@/shared/hooks/useUser";
import { RemoveAlert } from "./components/RemoveAlert";
import { useDeleteListing } from "./hooks/useDeletingListing";
import { useState } from "react";

type Props = {
  id: number;
};

export default function ListingDetailPage({ id }: Props) {
  const { data, isLoading, error } = useListing(id);
  const router = useRouter();
  const { data: user } = useUser();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleBack = () => {
    router.push("/listing");
  };

  const {
    isDeleting,
    handleDeleteConfirm,
  } = useDeleteListing(id, user?.userId ?? undefined);

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };
  const handleDeleteCancel = () => {
    setShowDeleteConfirm(false);
  };

  // 현재 사용자가 게시글 작성자인지 확인
  const isOwner = user?.userId !== null && user?.userId === data?.userId;
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
            handleBack();
          }}
          className="text-sm text-gray-500 hover:underline"
        >
          ← 뒤로가기
        </button>
        <div>게시글을 불러오지 못했습니다.</div>
      </main>
    );
  }

  const listing = data as unknown as ListingResponse;

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
        <div className="flex items-center justify-between">
          <button
            onClick={() => {
              handleBack();
            }}
            className="text-sm text-gray-500 hover:underline"
          >
            ← 뒤로가기
          </button>

          {isOwner && (
            <button
              onClick={handleDeleteClick}
              disabled={isDeleting}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-sm"
            >
              {isDeleting ? "삭제 중..." : "삭제"}
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <StatusBadge status={listing.status} />
          <h1 className="text-2xl font-bold">{listing.title}</h1>
        </div>

        <div className="text-sm text-gray-500">
          판매자 ID: {listing.userId} · 작성일: {createdText}
        </div>
      </header>

      {showDeleteConfirm && (
        <RemoveAlert handleDeleteCancel={handleDeleteCancel} handleDeleteConfirm={handleDeleteConfirm} isDeleting={isDeleting} />
      )}

      {listing.images.map((image) => (
        <ImageSection key={image.id} image={image} />
      ))}
    </main>
  );
}

function ImageSection({ image }: { image: ImageGroupResponse }) {
  const imageSrc = image.url;

  return (
    <section className="border rounded p-4 mb-6">
      <div className="text-sm text-gray-500 mb-2">사진 #{image.order + 1}</div>

      <div className="w-full h-56 bg-gray-100 flex items-center justify-center text-gray-400 text-sm mb-4">
        {imageSrc ? (
          <img
            src={`/api${imageSrc}`}
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

function ListingItemRow({ item }: { item: ListingItemResponse }) {
  return (
    <li className="border rounded p-3 bg-white shadow-sm space-y-2">
      {/* 상단 라인: 아이템 타입/이름 */}
      <div className="flex justify-between items-start gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-gray-800 truncate">
              {item.name}
            </span>
            <span className="text-gray-600 text-sm">
              {Number(item.pricePerUnit).toLocaleString()}원
            </span>
          </div>
        </div>
        <div>기능 추가 예정</div>
      </div>

      {/* 상태/가격 */}
      {item.detailText.length > 0 && (
        <div className="flex gap-1">
          <span className=" shrink-0 text-gray-600 text-sm ">제품 설명 :</span>

          <span className="min-w-0 text-black text-base wrap-break-word">
            {item.detailText}
          </span>
        </div>
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
