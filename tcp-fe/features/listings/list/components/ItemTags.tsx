import { ItemSummary } from "@/lib/api/listings/types";

export function ItemTags(props: { items: ItemSummary[] }) {
  const { items } = props;

  return (
    <div className="flex gap-2 overflow-x-auto ">
      {items.map((item) => (
        <div
          key={item.id}
          className="border rounded-lg text-xs bg-slate-100 px-2"
        >
          {item.name}
        </div>
      ))}
    </div>
  );
}
