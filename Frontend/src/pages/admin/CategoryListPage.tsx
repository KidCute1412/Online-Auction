import { useEffect, useMemo, useState } from "react";
import FilterBar from "@/components/admin/FilterBar";
import { Pencil, Trash2 } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { formatToVN } from "@/utils/format_time";
import type { CategoryItem } from "@/interface/category.interface";
import { useFilters } from "@/hooks/useFilters";
import { slugify } from "@/utils/make_slug";
import { toast } from "sonner";
import Loading from "@/components/common/Loading";
import PaginationComponent from "@/components/common/Pagination";
import { categoryService } from "@/services/category.service";

const LIMIT = 5;

export default function CategoryList() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [items, setItems] = useState<CategoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPageLoading, setIsPageLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get("page") || "1", 10));

  const pageParam = searchParams.get("page");
  useEffect(() => {
    setCurrentPage(parseInt(pageParam || "1", 10));
  }, [pageParam]);

  const {
    statusFilter,
    creatorFilter,
    dateFrom,
    dateTo,
    search: searchFromUrl,
    handleStatusFilterChange,
    handleCreatorFilterChange,
    handleDateFromChange,
    handleDateToChange,
    handleSearchChange,
    resetFilters,
  } = useFilters();

  // Local state to keep unmodified search query string
  const [localSearch, setLocalSearch] = useState("");
  const [creatorOptions, setCreatorOptions] = useState<string[]>([]);

  useEffect(() => {
    categoryService.getCreators()
      .then((data) => {
        setCreatorOptions(data);
      })
      .catch(() => {
        setCreatorOptions([]);
      });
  }, []);

  const fetchItems = () => {
    setIsPageLoading(true);

    categoryService
      .list({
        page: currentPage,
        limit: LIMIT,
        status: statusFilter,
        creator: creatorFilter,
        dateFrom,
        dateTo,
        search: slugify(searchFromUrl),
        deleted: false,
      })
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
    categoryService
      .getTotal({
        status: statusFilter,
        creator: creatorFilter,
        dateFrom,
        dateTo,
        search: slugify(searchFromUrl),
        deleted: false,
      })
      .then((data) => {
        const total = data.total;
        setTotalPages(Math.ceil(total / LIMIT));
        const newTotalPages = Math.ceil(total / LIMIT);
        if (currentPage > newTotalPages && newTotalPages > 0) {
          setSearchParams((prev) => ({
            ...Object.fromEntries(prev),
            page: "1",
          }));
        }
      })
      .catch(() => {
        setTotalPages(1);
      });
  };

  useEffect(() => {
    if (!searchFromUrl) {
      setLocalSearch("");
    }
  }, [searchFromUrl]);

  // Handle enter key press on search textbox
  const handleSearchSubmit = () => {
    const slugified = slugify(localSearch);
    if (slugified !== searchFromUrl) {
      handleSearchChange(slugified);
    }
  };

  useEffect(() => {
    fetchTotal();
  }, [statusFilter, creatorFilter, dateFrom, dateTo, searchFromUrl]);

  useEffect(() => {
    fetchItems();
  }, [
    currentPage,
    statusFilter,
    creatorFilter,
    dateFrom,
    dateTo,
    searchFromUrl,
  ]);



  const handleDelete = (id: number) => {
    categoryService
      .delete(id)
      .then((data) => {
        if (data.code === "success") {
          toast.success(data.message || "Category deleted successfully!");
          fetchItems();
          fetchTotal();
        } else {
          toast.error(data.message || "Failed to delete category!");
        }
      })
      .catch((err) => {
        toast.error(err.message || "Failed to delete category!");
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
        Manage Categories
      </h2>

      <FilterBar
        showStatusFilter
        statusFilter={statusFilter}
        setStatusFilter={handleStatusFilterChange}
        statusOptions={[
          { value: "all", label: "Status" },
          { value: "active", label: "Active" },
          { value: "inactive", label: "Inactive" },
        ]}
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
        onCreateNew={() =>
          navigate(`/${import.meta.env.VITE_PATH_ADMIN}/category/create`)
        }
        onTrashClick={() =>
          navigate(`/${import.meta.env.VITE_PATH_ADMIN}/category/trash`)
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
                <th className="px-4 py-3 text-center text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Category Name
                </th>
                <th className="px-4 py-3 text-center text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Status
                </th>
                <th className="px-4 py-3 text-center text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Created By
                </th>
                <th className="px-4 py-3 text-center text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Updated By
                </th>
                <th className="px-4 py-3 text-center text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {items.map((item) => {
                return (
                  <tr key={item.id} className="hover:bg-muted/20 transition-colors duration-150">
                    <td className="px-4 py-3 font-medium text-foreground text-center text-sm">
                      {item.name}
                    </td>
                    <td className="px-4 py-3 text-center text-sm">
                      <span
                        className={`inline-flex items-center justify-center px-2.5 py-0.5 rounded-md font-semibold text-xs min-w-[80px] ${
                          item.status === "active"
                            ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                            : "bg-destructive/10 text-destructive border border-destructive/20"
                        }`}
                      >
                        {item.status === "active" ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center text-sm">
                      <div className="font-medium text-foreground">
                        {item.created_by || "Unknown"}
                      </div>
                      <div className="text-muted-foreground text-xs mt-0.5">
                        {formatToVN(item.created_at)}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center text-sm">
                      <div className="font-medium text-foreground">
                        {item.updated_by || "Unknown"}
                      </div>
                      <div className="text-muted-foreground text-xs mt-0.5">
                        {formatToVN(item.updated_at)}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center text-sm">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          className="p-1.5 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                          onClick={() =>
                            navigate(
                              `/${
                                import.meta.env.VITE_PATH_ADMIN
                              }/category/edit/${item.id}`
                            )
                          }
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="cursor-pointer p-1.5 hover:bg-destructive/10 text-muted-foreground hover:text-destructive rounded-lg transition-colors"
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
            No categories match the filters
          </div>
        )}
      </div>

      {/* Mobile/Tablet Card View */}
      <div className="mt-5 space-y-4 lg:hidden relative">
        {isPageLoading && <Loading></Loading>}
        {items.map((item) => {
          return (
            <div
              key={item.id}
              className="bg-card rounded-xl border border-border p-4 shadow-sm text-foreground transition-colors duration-300"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div>
                    <h3 className="font-bold text-foreground text-base">
                      {item.name}
                    </h3>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold mt-1 ${
                        item.status === "active"
                          ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                          : "bg-destructive/10 text-destructive border border-destructive/20"
                      }`}
                    >
                      {item.status === "active" ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Created by:</span>
                  <span className="font-medium text-foreground">
                    {item.created_by || "Unknown"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Created at:</span>
                  <span className="text-muted-foreground">
                    {formatToVN(item.created_at)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Updated by:</span>
                  <span className="font-medium text-foreground">
                    {item.updated_by || "Unknown"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Updated at:</span>
                  <span className="text-muted-foreground">
                    {formatToVN(item.updated_at)}
                  </span>
                </div>
              </div>

              <div className="flex gap-2 mt-4 pt-3 border-t border-border/55">
                <button
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-1.5 bg-muted/30 hover:bg-muted text-foreground text-sm rounded-lg transition-colors cursor-pointer"
                  onClick={() =>
                    navigate(
                      `/${import.meta.env.VITE_PATH_ADMIN}/category/edit/${
                        item.id
                      }`
                    )
                  }
                >
                  <Pencil size={14} />
                  <span className="font-medium">Edit</span>
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
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
            No categories match the filters
          </div>
        )}
      </div>

      <PaginationComponent numberOfPages={totalPages} currentPage={currentPage} controlPage={setCurrentPage}></PaginationComponent>
    </div>
  );
}
