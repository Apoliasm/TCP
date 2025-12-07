"use client";

import { useListing } from "./hooks/useListing";
import {
  ListingStatus,
  ListingItemResponseDto,
} from "@/lib/api/listings/types";
import { useRouter } from "next/router";

type Props = {
  id: number;
};
export default function ListingDetailPage({ id }: Props) {
  const router = useRouter();
  // /listings/[id] 에서 id는 string으로 들어옴

  const { data, isLoading, error } = useListing(id);

  if (Number.isNaN(id)) {
    return <main className="p-8">잘못된 게시글 ID입니다.</main>;
  }

  if (isLoading) {
    return <main className="p-8">게시글을 불러오는 중입니다...</main>;
  }

  if (error || !data) {
    return (
      <main className="p-8 space-y-4">
        <button
          onClick={() => router.back()}
          className="text-sm text-gray-500 hover:underline"
        >
          ← 뒤로가기
        </button>
        <div>게시글을 불러오지 못했습니다.</div>
      </main>
    );
  }

  const listing = data;

  const created = new Date(listing.createdAt);
  const createdText = created.toLocaleString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <main className="p-8 space-y-6">
      {/* 상단 헤더 */}
      <header className="space-y-2">
        <button
          onClick={() => router.back()}
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

      {/* TODO: 사진 영역 - 아직 DTO에 없으니 자리만 잡아두기 */}
      <section className="border rounded p-4">
        <div className="text-sm text-gray-500 mb-2">사진</div>
        <div className="w-full h-56 bg-gray-100 flex items-center justify-center text-gray-400 text-sm">
          사진 데이터는 아직 없음 (나중에 photo 필드 추가)
        </div>
      </section>

      {/* 아이템 목록 */}
      <section className="border rounded p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">판매 아이템</h2>
          <span className="text-sm text-gray-500">
            총 {listing.items?.length ?? 0}개
          </span>
        </div>

        {listing.items?.length ? (
          <ul className="space-y-2">
            {listing.items.map((item) => (
              <ListingItemRow key={item.id} item={item} />
            ))}
          </ul>
        ) : (
          <div className="text-sm text-gray-500">등록된 아이템이 없습니다.</div>
        )}
      </section>

      {/* 설명 / 비고가 있으면 여기에 섹션 하나 더 두면 됨 */}
    </main>
  );
}

function StatusBadge({ status }: { status: ListingStatus }) {
  const label =
    status === "ON_SALE"
      ? "판매중"
      : status === "RESERVED"
      ? "예약중"
      : "판매완료";

  const style =
    status === "ON_SALE"
      ? "bg-green-100 text-green-700"
      : status === "RESERVED"
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

// 아이템 1줄씩 렌더링
function ListingItemRow({ item }: { item: ListingItemResponseDto }) {
  // 실제 DTO에 맞게 필드 수정하면 됨
  const typeLabel =
    item.type === "CARD"
      ? "카드"
      : item.type === "ACCESSORY"
      ? "악세서리"
      : item.type === "OTHER"
      ? "기타"
      : "아이템";

  return (
    <li className="border rounded p-2 flex items-center justify-between text-sm">
      <div className="space-y-1">
        <div className="font-medium">
          {typeLabel} #{item.id}
        </div>
        {item.note && (
          <div className="text-gray-500 text-xs">메모: {item.note}</div>
        )}
      </div>
      <div className="text-right space-y-1">
        {item.price !== undefined && item.price !== null && (
          <div className="font-semibold">{item.price.toLocaleString()}원</div>
        )}
        {item.quantity !== undefined && (
          <div className="text-gray-500 text-xs">수량: {item.quantity}</div>
        )}
      </div>
    </li>
  );
}
