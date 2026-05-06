import { Suspense, useState, useTransition } from "react";
import { useProducts } from "../hooks/useProducts";
import { useProductStats } from "../hooks/useProductStats";
import StatsCards from "../components/StatsCards";
import ProductTable from "../components/ProductTable";
import Pagination from "../components/Pagination";

export default function Dashboard() {
  const [page, setPage] = useState(1);
  const [isPending, startTransition] = useTransition();

  const handlePageChange = (newPage: number) => {
    // transition으로 감싸면 suspend가 발생해도 Suspense fallback을 커밋하지 않고 현재 UI 유지
    startTransition(() => setPage(newPage));
  };

  return (
    <div className="max-w-6xl mx-auto p-8 space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">상품 관리 대시보드</h1>
      {/* fallback은 초기 로드(이전 UI 없음)에만 표시, 페이지 전환 시엔 startTransition이 차단 */}
      <Suspense
        fallback={
          <div className="p-8 text-center text-gray-400">로딩 중...</div>
        }
      >
        <DashboardContent
          page={page}
          onPageChange={handlePageChange}
          isPending={isPending}
        />
      </Suspense>
    </div>
  );
}

function DashboardContent({
  page,
  onPageChange,
  isPending,
}: {
  page: number;
  onPageChange: (page: number) => void;
  isPending: boolean;
}) {
  const { data: stats } = useProductStats();
  const { data: products } = useProducts(page, 10);

  return (
    <div
      className={`space-y-6 transition-opacity ${isPending ? "opacity-50" : "opacity-100"}`}
    >
      <StatsCards stats={stats} />
      <div className="rounded-lg border border-gray-200 overflow-hidden">
        <ProductTable items={products.items} />
        <div className="px-4 py-3 border-t border-gray-100 bg-gray-100">
          <Pagination
            total={products.total}
            page={products.page}
            pageSize={products.pageSize}
            onPageChange={onPageChange}
          />
        </div>
      </div>
    </div>
  );
}
