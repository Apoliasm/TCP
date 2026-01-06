import { ListingStatus } from "@/lib/api/listings/types";

export function StatusBadge({ status }: { status: ListingStatus }) {
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
