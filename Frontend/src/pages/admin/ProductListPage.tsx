import { useEffect, useMemo, useState } from "react";
import { Eye, Trash2 } from "lucide-react";
import FilterBar from "@/components/admin/FilterBar";
import { useNavigate, useSearchParams } from "react-router-dom";
import { formatToVN } from "@/utils/format_time";
import { useFilters } from "@/hooks/useFilters";
import { toast } from "sonner";
import Loading from "@/components/common/Loading";
import PaginationComponent from "@/components/common/Pagination";

const LIMIT = 10;

type ProductItem = {
  product_id: number;
  product_name: string;
  is_removed: boolean;
  seller_id: string;
  creator_name?: string;
  created_at: string;
  edited_at?: string;
};

export default function ProductListPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [items, setItems] = useState<ProductItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPageLoading, setIsPageLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get("page") || "1", 10));

  const {
    creatorFilter,
    dateFrom,
    dateTo,
    search: searchFromUrl,
    handleCreatorFilterChange,
    handleDateFromChange,
    handleDateToChange,
    handleSearchChange,
    resetFilters,
  } = useFilters();

  const [localSearch, setLocalSearch] = useState("");

  const fetchItems = () => {
    setIsPageLoading(true);

    fetch(
      `${import.meta.env.VITE_API_URL}/${
        import.meta.env.VITE_PATH_ADMIN
      }/api/product/list?page=${currentPage}&limit=${LIMIT}&creator=${creatorFilter}&dateFrom=${dateFrom}&dateTo=${dateTo}&search=${encodeURIComponent(
        searchFromUrl
      )}`,
      {
        credentials: "include",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ is_removed: false }),
      }
    )
      .then((res) => res.json())
      .then((data) => {
        setItems(data.list);
        setIsLoading(false);
        setIsPageLoading(false);
      })
      .catch(() => {
        setItems([]);
        setIsLoading(false);
        setIsPageLoading(false);
      });
  };

  const fetchTotal = () => {
    fetch(
      `${import.meta.env.VITE_API_URL}/${
        import.meta.env.VITE_PATH_ADMIN
      }/api/product/number-of-products?creator=${creatorFilter}&dateFrom=${dateFrom}&dateTo=${dateTo}&search=${encodeURIComponent(
        searchFromUrl
      )}`,
      {
        credentials: "include",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ is_removed: false }),
      }
    )
      .then((res) => res.json())
      .then((data) => {
        const total = data.total as number;
        setTotalPages(Math.ceil(total / LIMIT));
        const newTotalPages = Math.ceil(total / LIMIT);
        if (currentPage > newTotalPages && newTotalPages > 0) {
          setSearchParams((prev) => ({
            ...Object.fromEntries(prev),
            page: "1",
          }));
        }
      });
  };

  useEffect(() => {
    if (!searchFromUrl) {
      setLocalSearch("");
    }
  }, [searchFromUrl]);

  const handleSearchSubmit = () => {
    if (localSearch.trim() !== searchFromUrl) {
      handleSearchChange(localSearch.trim());
    }
  };

  useEffect(() => {
    fetchTotal();
  }, [creatorFilter, dateFrom, dateTo, searchFromUrl]);

  useEffect(() => {
    fetchItems();
  }, [currentPage, creatorFilter, dateFrom, dateTo, searchFromUrl]);

  // Extract all unique seller IDs from items
  const creatorOptions: string[] = useMemo(
    () =>
      Array.from(
        new Set(
          items
            .map((i) => i.seller_id)
            .filter((v) => v != null)
            .map(String)
            .filter((v) => v.trim() !== "")
        )
      ),
    [items]
  );

  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const allChecked = useMemo(
    () =>
      items.length > 0 &&
      items.every((i) => selectedIds.includes(i.product_id)),
    [items, selectedIds]
  );

  const toggleAll = () => {
    const itemIds = items.map((i) => i.product_id);
    setSelectedIds((prev) => {
      if (allChecked) return prev.filter((id) => !itemIds.includes(id));
      const newSet = new Set([...prev, ...itemIds]);
      return Array.from(newSet);
    });
  };

  const toggleOne = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleView = (id: number) => {
    navigate(`/${import.meta.env.VITE_PATH_ADMIN}/product/detail/${id}`);
  };

  const handleDelete = (id: number) => {
    fetch(
      `${import.meta.env.VITE_API_URL}/${
        import.meta.env.VITE_PATH_ADMIN
      }/api/product/delete/${id}`,
      {
        credentials: "include",
        method: "PATCH",
      }
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.code === "success") {
          fetchItems();
          fetchTotal();
          toast.success("Product deleted successfully!");
        }
      });
  };

  if (isLoading) {
    return (
      <Loading className="ml-[240px] bg-transparent"></Loading>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 text-foreground">
      <h2 className="font-heading font-bold text-xl sm:text-2xl mb-4 text-foreground">
        Manage Products
      </h2>

      <FilterBar
        showStatusFilter
        creatorFilter={creatorFilter}
        setCreatorFilter={handleCreatorFilterChange}
        creatorOptions={creatorOptions}
        dateFrom={dateFrom}
        setDateFrom={handleDateFromChange}
        dateTo={dateTo}
        setDateTo={handleDateToChange}
        search={localSearch}
        setSearch={setLocalSearch}
        onSearchSubmit={handleSearchSubmit}
        onResetFilters={resetFilters}
        bulkActionOptions={[
          { value: "restore", label: "Restore" },
          { value: "delete", label: "Delete" },
        ]}
        onApplyBulkAction={(action) => console.log(action, selectedIds)}
        onTrashClick={() =>
          navigate(`/${import.meta.env.VITE_PATH_ADMIN}/product/trash`)
        }
      />

      {/* Desktop Table View */}
      <div className="mt-5 bg-card rounded-xl border border-border overflow-hidden hidden lg:block relative transition-colors duration-300">
        {isPageLoading && (
          <div className="absolute inset-0 bg-background/70 backdrop-blur-xs flex justify-center items-center z-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
          </div>
        )}
        <div className="w-full overflow-x-auto">
          <table className="min-w-full divide-y divide-border">
            <thead className="bg-muted/30">
              <tr>
                <th className="px-4 py-3 text-left w-12">
                  <input
                    type="checkbox"
                    checked={allChecked}
                    onChange={toggleAll}
                    className="w-4 h-4 rounded text-accent bg-card border-border focus:ring-accent"
                  />
                </th>
                <th className="px-4 py-3 text-center text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Product Name
                </th>
                <th className="px-4 py-3 text-center text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Created By
                </th>
                <th className="px-4 py-3 text-center text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {items.map((item) => {
                const checked = selectedIds.includes(item.product_id);
                return (
                  <tr key={item.product_id} className="hover:bg-muted/20 transition-colors duration-150">
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleOne(item.product_id)}
                        className="w-4 h-4 rounded text-accent bg-card border-border focus:ring-accent"
                      />
                    </td>
                    <td className="px-4 py-3 font-medium text-foreground text-center text-sm">
                      <span title={item.product_name}>
                        {item.product_name.split(" ").length > 5
                          ? item.product_name.split(" ").slice(0, 5).join(" ") +
                            "..."
                          : item.product_name}
                      </span>
                    </td>

                    <td className="px-4 py-3 text-center text-sm">
                      <div className="font-medium text-foreground">
                        {item.creator_name || "Unknown"}
                      </div>
                      <div className="text-muted-foreground text-xs mt-0.5">
                        {formatToVN(item.created_at)}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center text-sm">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          className="cursor-pointer p-1.5 hover:bg-muted text-accent rounded-lg transition-colors"
                          onClick={() => handleView(item.product_id)}
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(item.product_id)}
                          className="cursor-pointer p-1.5 hover:bg-destructive/10 text-destructive rounded-lg transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {items.length === 0 && (
          <div className="py-8 text-center text-muted-foreground text-sm bg-card transition-colors duration-300">
            No products match the filters
          </div>
        )}
      </div>

      {/* Mobile/Tablet Card View */}
      <div className="mt-5 space-y-4 lg:hidden relative">
        {isPageLoading && <Loading></Loading>}
        {items.map((item) => {
          const checked = selectedIds.includes(item.product_id);
          return (
            <div
              key={item.product_id}
              className="bg-card rounded-xl border border-border p-4 shadow-sm text-foreground transition-colors duration-300"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleOne(item.product_id)}
                    className="w-4 h-4 mt-0.5 rounded text-accent bg-card border-border focus:ring-accent"
                  />
                  <div>
                    <h3
                      className="font-bold text-foreground text-base"
                      title={item.product_name}
                    >
                      {item.product_name.split(" ").length > 5
                        ? item.product_name.split(" ").slice(0, 5).join(" ") +
                          "..."
                        : item.product_name}
                    </h3>
                  </div>
                </div>
              </div>

              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Created by:</span>
                  <span className="font-medium text-foreground">
                    {item.seller_id || "Unknown"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Created at:</span>
                  <span className="text-muted-foreground">
                    {formatToVN(item.created_at)}
                  </span>
                </div>
              </div>

              <div className="flex gap-2 mt-4 pt-3 border-t border-border/55">
                <button
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-1.5 bg-muted/30 hover:bg-muted text-accent text-sm rounded-lg transition-colors cursor-pointer"
                  onClick={() => handleView(item.product_id)}
                >
                  <Eye size={14} />
                  <span className="font-medium">View</span>
                </button>

                <button
                  onClick={() => handleDelete(item.product_id)}
                  className="cursor-pointer flex-1 flex items-center justify-center gap-2 px-3 py-1.5 bg-destructive/10 hover:bg-destructive/20 text-destructive text-sm rounded-lg transition-colors"
                >
                  <Trash2 size={14} />
                  <span className="font-medium">Delete</span>
                </button>
              </div>
            </div>
          );
        })}

        {items.length === 0 && (
          <div className="bg-card rounded-xl border border-border py-8 text-center text-muted-foreground text-sm transition-colors duration-300">
            No products match the filters
          </div>
        )}
      </div>

      <PaginationComponent numberOfPages={totalPages} currentPage={currentPage} controlPage={setCurrentPage}></PaginationComponent>
    </div>
  );
}
