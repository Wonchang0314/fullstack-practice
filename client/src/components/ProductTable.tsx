import type { Product } from "../api/types.gen";
import StatusBadge from "./StatusBadge";

const priceFormatter = new Intl.NumberFormat("ko-KR", {
  style: "currency",
  currency: "KRW",
});

export default function ProductTable({ items }: { items: Product[] }) {
  return (
    <table className="w-full text-sm" aria-label="상품 목록">
      <thead className="bg-gray-100 text-gray-500">
        <tr>
          {["ID", "상품명", "카테고리", "가격", "재고", "상태", "등록일"].map(
            (h) => (
              <th key={h} className="px-4 py-3 text-left font-medium">
                {h}
              </th>
            ),
          )}
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-100">
        {items.map((p) => (
          <tr key={p.id} className="hover:bg-gray-50">
            <td className="px-4 py-3 text-gray-500">{p.id}</td>
            <td className="px-4 py-3 font-medium">{p.name}</td>
            <td className="px-4 py-3 text-gray-600">{p.category}</td>
            <td className="px-4 py-3">{priceFormatter.format(p.price)}</td>
            <td className="px-4 py-3">{p.stock}</td>
            <td className="px-4 py-3">
              <StatusBadge status={p.status} />
            </td>
            <td className="px-4 py-3 text-gray-500">
              {p.createdAt.slice(0, 10)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
