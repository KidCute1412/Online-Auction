"use client";

import { useState } from "react";
import { Filter, RotateCcw, Search, Trash2 } from "lucide-react";

type StatusOption = {
  value: string;
  label: string;
};

type BulkActionOption = {
  value: string;
  label: string;
};

type Props = {
  showStatusFilter?: boolean;
  statusFilter?: string;
  setStatusFilter?: (v: string) => void;
  statusOptions?: StatusOption[];

  // Creator identity filtering properties
  creatorFilter?: string;
  setCreatorFilter?: (v: string) => void;
  creatorOptions?: string[];

  // Date filtering constraints
  dateFrom?: string;
  setDateFrom?: (v: string) => void;
  dateTo?: string;
  setDateTo?: (v: string) => void;

  // Search input and handlers
  search?: string;
  setSearch?: (v: string) => void;
  onSearchSubmit?: () => void;

  // Form controls and submit actions
  onResetFilters?: () => void;

  bulkActionOptions?: BulkActionOption[];
  onApplyBulkAction?: (action: string) => void;

  onCreateNew?: () => void;
  createLabel?: string;

  onTrashClick?: () => void;
  trashLabel?: string;
};

export default function FilterBar({
  showStatusFilter = true,
  statusFilter,
  setStatusFilter,
  statusOptions,

  creatorFilter,
  setCreatorFilter,
  creatorOptions = [],

  dateFrom,
  setDateFrom,
  dateTo,
  setDateTo,

  search,
  setSearch,
  onSearchSubmit,

  onResetFilters,
  bulkActionOptions,
  onApplyBulkAction,

  onCreateNew,
  createLabel = "+ Create New",

  onTrashClick,
  trashLabel = "Trash",
}: Props) {
  // Setup active status filters
  const effectiveStatusOptions: StatusOption[] = statusOptions ?? [
    { value: "all", label: "Status" },
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
  ];

  // Setup bulk data modify options
  const effectiveBulkActions: BulkActionOption[] = bulkActionOptions ?? [
    { value: "hide", label: "Hide" },
    { value: "delete", label: "Delete" },
  ];

  const hasStatusFilter =
    showStatusFilter && statusFilter !== undefined && !!setStatusFilter;

  const hasCreatorFilter =
    creatorFilter !== undefined &&
    !!setCreatorFilter &&
    creatorOptions.length > 0;

  const hasDateFilter =
    dateFrom !== undefined &&
    dateTo !== undefined &&
    !!setDateFrom &&
    !!setDateTo;

  const hasResetButton = !!onResetFilters;

  const hasTopFilters =
    hasStatusFilter || hasCreatorFilter || hasDateFilter || hasResetButton;

  const hasSearch = search !== undefined && !!setSearch;

  const hasBulkAction = !!onApplyBulkAction && !!effectiveBulkActions.length;

  const [selectedAction, setSelectedAction] = useState<string>("");
  const [isComposing, setIsComposing] = useState(false);

  const handleApplyClick = () => {
    if (!onApplyBulkAction) return;
    if (!selectedAction) return;
    onApplyBulkAction(selectedAction);
  };

  return (
    <div className="mb-7 space-y-6 text-foreground">
      {/* Top section holding all structured filters */}
      {hasTopFilters && (
        <div className="flex h-14 items-stretch rounded-xl border border-border bg-card overflow-hidden shadow-sm text-sm w-fit transition-colors duration-300">
          {/* Section banner */}
          <div className="flex h-full items-center gap-2 px-4 border-r border-border font-medium text-foreground">
            <Filter className="w-4 h-4 text-accent" />
            <span>Filters</span>
          </div>

          {/* Status selector filter */}
          {hasStatusFilter && (
            <div className="flex h-full items-center gap-2 px-4 border-r border-border">
              <select
                className="cursor-pointer bg-transparent outline-none font-medium text-foreground text-sm"
                value={statusFilter}
                onChange={(e) => setStatusFilter!(e.target.value)}
              >
                {effectiveStatusOptions.map((opt) => (
                  <option key={opt.value} value={opt.value} className="bg-card text-foreground text-sm">
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Creator selector filter */}
          {hasCreatorFilter && (
            <div className="flex items-center px-4 h-full border-r border-border">
              <select
                className="cursor-pointer bg-transparent outline-none font-medium text-foreground text-sm"
                value={creatorFilter}
                onChange={(e) => setCreatorFilter!(e.target.value)}
              >
                <option className="bg-card text-foreground text-sm" value="">
                  Creator
                </option>
                {creatorOptions.map((c) => (
                  <option className="bg-card text-foreground text-sm" key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Date range filter component */}
          {hasDateFilter && (
            <div className="flex h-full items-center gap-3 px-4 border-r border-border">
              <input
                type="date"
                className="h-8 rounded-lg px-2 text-sm border border-border bg-muted/30 text-foreground outline-none"
                value={dateFrom}
                onChange={(e) => setDateFrom!(e.target.value)}
              />
              <span className="text-muted-foreground">-</span>
              <input
                type="date"
                className="h-8 rounded-lg px-2 text-sm border border-border bg-muted/30 text-foreground outline-none"
                value={dateTo}
                onChange={(e) => setDateTo!(e.target.value)}
              />
            </div>
          )}

          {/* Reset filter configurations */}
          {hasResetButton && (
            <button
              type="button"
              onClick={onResetFilters}
              className="flex items-center gap-2 px-4 h-full text-sm font-semibold text-destructive hover:text-destructive/80 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Clear Filters</span>
            </button>
          )}
        </div>
      )}

      {/* Bottom control row holding bulk action inputs and creation links */}
      <div className="flex h-12 items-stretch gap-3">
        {/* Bulk Action selector */}
        {hasBulkAction && (
          <div className="flex rounded-xl bg-card border border-border overflow-hidden shadow-sm transition-colors duration-300">
            <select
              className="cursor-pointer h-full px-3 text-sm text-foreground bg-transparent outline-none border-none"
              value={selectedAction}
              onChange={(e) => setSelectedAction(e.target.value)}
            >
              <option value="" className="bg-card text-foreground">-- Actions --</option>
              {effectiveBulkActions.map((act) => (
                <option key={act.value} value={act.value} className="bg-card text-foreground">
                  {act.label}
                </option>
              ))}
            </select>

            <button
              type="button"
              className="cursor-pointer h-full px-4 text-sm font-semibold text-destructive hover:bg-muted/30 border-l border-border transition-colors"
              onClick={handleApplyClick}
            >
              Apply
            </button>
          </div>
        )}

        {/* Global search entry textfield */}
        {hasSearch && (
          <div className="flex items-center space-x-2 h-full w-[400px] rounded-xl border border-border bg-card px-4 shadow-sm transition-colors duration-300">
            <Search className="w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search (press Enter to apply)"
              className="flex-1 border-none bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
              value={search}
              onChange={(e) => {
                if (!isComposing) {
                  setSearch!(e.target.value);
                }
              }}
              onCompositionStart={() => setIsComposing(true)}
              onCompositionEnd={(e) => {
                setIsComposing(false);
                setSearch!((e.target as HTMLInputElement).value);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !isComposing && onSearchSubmit) {
                  onSearchSubmit();
                }
              }}
            />
          </div>
        )}

        {/* Standard create new trigger */}
        {onCreateNew && (
          <button
            type="button"
            className="h-full px-5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-all shadow-sm cursor-pointer"
            onClick={onCreateNew}
          >
            {createLabel}
          </button>
        )}

        {/* Trash drawer selector trigger */}
        {onTrashClick && (
          <button
            type="button"
            className="h-full px-4 rounded-xl bg-destructive text-destructive-foreground text-sm font-semibold hover:opacity-90 transition-all shadow-sm cursor-pointer flex items-center gap-2"
            onClick={onTrashClick}
          >
            <Trash2 size={15} />
            <span className="hidden sm:inline">{trashLabel}</span>
          </button>
        )}
      </div>
    </div>
  );
}
