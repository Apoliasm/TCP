"use client";

import { useListing } from "./hooks/useListing";
import {
  ListingImageItemResponseDto,
  ListingStatus,
} from "@/lib/api/listings/types";

type Props = {
  id: number;
};
export default function ListingDetailPage({ id }: Props) {
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
          onClick={() => {
            //목록 이동 버튼
          }}
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
      <header className="space-y-2">
        <button
          onClick={() => {
            //목록으로 돌아가기 버튼
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

      {data.images.map((image) => (
        <section key={image.id} className="border rounded p-4 mb-6">
          {/* 이미지 영역 */}
          <div className="text-sm text-gray-500 mb-2">
            사진 #{image.order + 1}
          </div>

          <div className="w-full h-56 bg-gray-100 flex items-center justify-center text-gray-400 text-sm mb-4">
            {image.imageUrl ? (
              <img
                src={`${process.env.NEXT_PUBLIC_API_BASE_URL}${image.imageUrl}`}
                alt={`image-${image.id}`}
                className="h-full object-contain"
              />
            ) : (
              "사진 데이터는 아직 없음"
            )}
          </div>

          {/* 아이템 리스트 */}
          <div>
            <h3 className="font-semibold mb-2">이 사진에 포함된 카드 정보</h3>

            {image.items.length === 0 && (
              <p className="text-gray-400 text-sm">등록된 아이템이 없습니다.</p>
            )}

            <ul className="space-y-3">
              {image.items.map((item) => (
                <ListingItemRow key={item.id} item={item} />
              ))}
            </ul>
          </div>
        </section>
      ))}

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
function ListingItemRow({ item }: { item: ListingImageItemResponseDto }) {
  // 실제 DTO에 맞게 필드 수정하면 됨
  return (
    <li key={item.id} className="border rounded p-3 bg-white shadow-sm">
      <div className="flex justify-between items-center">
        <div className="font-medium text-gray-800">코드: {item.infoId}</div>
        <div className="text-sm text-gray-500">수량: {item.quantity}장</div>
      </div>

      <div className="text-gray-600 text-sm mt-1">상태: {item.condition}</div>

      <div className="text-gray-600 text-sm">
        가격: {item.pricePerUnit.toLocaleString()}원
      </div>

      {item.detail && (
        <div className="text-gray-500 text-sm mt-1">{item.detail}</div>
      )}
    </li>
  );
}
