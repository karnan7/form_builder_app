import { useState } from "react";
import { cn } from "../../lib/utils";
import { Search } from "lucide-react";
import { Input } from "../ui/Input";
import { useDebounce } from "../../hooks/useDebounce";
import { useNavigate } from "react-router";
import type { FormFilter } from "../../types/form";
import { useForms } from "../../hooks/useForm";

const FILTERS: { id: FormFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "published", label: "Published" },
  { id: "draft", label: "Drafts" },
  { id: "favorites", label: "Favorites" },
  { id: "archived", label: "Archived" },
];

interface FormsBrowserProps {
  title?: string;
  /** Pass `filter` + `onFilterChange` together to control the filter from a parent. */
  filter?: FormFilter;
  onFilterChange?: (filter: FormFilter) => void;
  /** Fires after any delete/duplicate/patch so a parent can refresh aggregate counts. */
  onMutate?: () => void;
}
const FormsBrowser = ({
  title = "Your Forms",
  filter: filterProp,
  onFilterChange,
  onMutate,
}: FormsBrowserProps) => {
  const navigate = useNavigate();
  const [internalFilter, setInternalFilter] = useState<FormFilter>("all");
  const filter = filterProp ?? internalFilter;
  const setFilter = onFilterChange ?? setInternalFilter;

  const [searchInput, setSearchInput] = useState("");
  const search = useDebounce(searchInput, 300);
  const [toDelete, setToDelete] = useState(null);

  const { forms, loading, reload, remove, duplicate, patch } = useForms({
    search,
    filter,
    onMutate,
  });

  const renderContent = () => {
    if (loading) {
      return <p className="text-sm text-muted">Loading forms…</p>;
    }

    return null;
  };
  return (
    <>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {title && <h2 className="text-lg font-semibold text-fg">{title}</h2>}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex flex-wrap items-center gap-1.5">
            {FILTERS.map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={cn(
                  "rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
                  filter === f.id
                    ? "bg-brand-600 text-white shadow-soft"
                    : "text-muted hover:bg-surface-2 hover:text-fg",
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
          <div className="relative w-full sm:w-56">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <Input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search forms…"
              className="h-9 pl-9"
            />
          </div>
        </div>
      </div>

      <div className="mt-5">{renderContent()}</div>
    </>
  );
};

export default FormsBrowser;
