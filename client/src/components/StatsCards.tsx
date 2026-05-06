import type { ProductStatsResponse } from "../api/types.gen";

type Card = { label: string; value: number; valueClass: string };

export default function StatsCards({ stats }: { stats: ProductStatsResponse }) {
  const cards: Card[] = [
    { label: "전체 상품", value: stats.total, valueClass: "text-gray-900" },
    { label: "판매중", value: stats.selling, valueClass: "text-emerald-600" },
    { label: "품절", value: stats.outOfStock, valueClass: "text-yellow-700" },
    { label: "단종", value: stats.discontinued, valueClass: "text-red-600" },
  ];

  return (
    <div className="grid grid-cols-4 gap-4">
      {cards.map(({ label, value, valueClass }) => (
        <div key={label} className="rounded-lg bg-gray-100 p-5">
          <p className="text-sm text-gray-500">{label}</p>
          <p className={`text-3xl font-semibold ${valueClass}`}>{value}</p>
        </div>
      ))}
    </div>
  );
}
