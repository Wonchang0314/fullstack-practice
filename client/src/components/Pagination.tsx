type Props = {
  total: number;
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
};

export default function Pagination({
  total,
  page,
  pageSize,
  onPageChange,
}: Props) {
  const totalPages = Math.ceil(total / pageSize);
  const start = (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);

  return (
    <nav className="flex items-center justify-between" aria-label="페이지네이션">
      <span className="text-sm text-gray-500">
        {start}–{end} / {total}건
      </span>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          className="px-2 py-1 text-sm disabled:opacity-30 disabled:cursor-not-allowed"
        >
          ←
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={`w-8 h-8 text-sm rounded-md ${
              p === page ? "bg-gray-900 text-white" : "hover:bg-gray-200"
            }`}
          >
            {p}
          </button>
        ))}
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages}
          className="px-2 py-1 text-sm disabled:opacity-30 disabled:cursor-not-allowed"
        >
          →
        </button>
      </div>
    </nav>
  );
}
