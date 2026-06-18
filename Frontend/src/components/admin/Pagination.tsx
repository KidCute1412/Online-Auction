import { useSearchParams } from "react-router-dom";

interface PaginationProps {
  totalPages: number;
  currentPage: number;
  isPageLoading: boolean;
}

export default function Pagination({
  totalPages,
  currentPage,
  isPageLoading,
}: PaginationProps) {
  const [, setSearchParams] = useSearchParams();

  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];

    if (totalPages <= 7) {
      // Show all pages if total pages <= 7
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always insert the first page
      pages.push(1);

      if (currentPage <= 3) {
        // Page navigation close to the beginning
        for (let i = 2; i <= 5; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        // Page navigation close to the end
        pages.push("...");
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // Page navigation in the middle range
        pages.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex justify-center items-center space-x-2 mt-6">
      {/* Previous page handler button */}
      <button
        onClick={() =>
          setSearchParams((prev) => ({
            ...Object.fromEntries(prev),
            page: Math.max(currentPage - 1, 1).toString(),
          }))
        }
        disabled={currentPage === 1 || isPageLoading}
        className="cursor-pointer px-3 py-2 border border-border rounded-lg text-sm font-medium text-muted-foreground bg-card hover:bg-muted/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        Previous
      </button>

      {/* Pages list renderer */}
      {pageNumbers.map((page, index) =>
        typeof page === "string" ? (
          <span
            key={`ellipsis-${index}`}
            className="px-3 py-2 text-muted-foreground text-sm font-medium"
          >
            {page}
          </span>
        ) : (
          <button
            key={page}
            onClick={() =>
              setSearchParams((prev) => ({
                ...Object.fromEntries(prev),
                page: page.toString(),
              }))
            }
            disabled={isPageLoading}
            className={`cursor-pointer px-3 py-2 border border-border rounded-lg text-sm font-medium transition-colors ${
              page === currentPage
                ? "bg-primary text-primary-foreground border-primary"
                : "text-muted-foreground bg-card hover:bg-muted/50"
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {page}
          </button>
        )
      )}

      {/* Next page handler button */}
      <button
        onClick={() =>
          setSearchParams((prev) => ({
            ...Object.fromEntries(prev),
            page: Math.min(currentPage + 1, totalPages).toString(),
          }))
        }
        disabled={currentPage === totalPages || isPageLoading}
        className="cursor-pointer px-3 py-2 border border-border rounded-lg text-sm font-medium text-muted-foreground bg-card hover:bg-muted/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        Next
      </button>
    </div>
  );
}
