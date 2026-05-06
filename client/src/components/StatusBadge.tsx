import type { Product } from '../api/types.gen';

const STATUS_MAP: Record<Product['status'], { label: string; className: string }> = {
  SELLING:      { label: '판매중', className: 'bg-emerald-100 text-emerald-700' },
  OUT_OF_STOCK: { label: '품절',   className: 'bg-yellow-100 text-yellow-700' },
  DISCONTINUED: { label: '단종',   className: 'bg-red-100 text-red-600' },
};

export default function StatusBadge({ status }: { status: Product['status'] }) {
  const { label, className } = STATUS_MAP[status];
  return (
    <span className={`inline-flex rounded-md px-2 py-0.5 text-xs font-medium ${className}`}>
      {label}
    </span>
  );
}
