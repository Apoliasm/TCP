import { ItemSummary } from "@/lib/api/listings/types";

export function ItemTags(props: { items: ItemSummary[] }) {
  const { items } = props;

  return (
    <ul className="flex gap-2 overflow-x-auto flex-nowrap list-none p-0 m-0">
      {items.map(
        (item, index) =>
          item.name.length > 0 && (
            <li
              key={`tag-${index}`}
              className="flex flex-nowrap border rounded-lg text-xs bg-slate-100 px-2 whitespace-nowrap flex-shrink-0"
            >
              {item.name}
            </li>
          )
      )}
    </ul>
  );
}
