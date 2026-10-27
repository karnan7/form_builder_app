import {
  BarChart3,
  CornerDownLeft,
  FileText,
  Inbox,
  LayoutDashboard,
  LayoutTemplate,
  Plus,
  Search,
  Settings,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type Dispatch,
  type KeyboardEvent,
  type SetStateAction,
} from "react";
import { useNavigate } from "react-router";
import { createPortal } from "react-dom";
import { cn } from "../lib/utils";

interface FormSummary {
  _id: string;
  title: string;
}
interface StaticAction {
  id: string;
  label: string;
  icon: LucideIcon;
  to: string;
}
interface PaletteItem {
  id: string;
  label: string;
  icon: LucideIcon;
  kind: "action" | "form";
  run: () => void;
}
interface CommandPaletteProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

const STATIC_ACTIONS: StaticAction[] = [
  {
    id: "dashboard",
    label: "Go to Dashboard",
    icon: LayoutDashboard,
    to: "/dashboard",
  },
  { id: "new", label: "Create blank form", icon: Plus, to: "/builder/new" },
  {
    id: "ai",
    label: "Generate form with AI",
    icon: Sparkles,
    to: "/builder/new?ai=1",
  },
  { id: "insights", label: "View Insights", icon: BarChart3, to: "/insights" },
  { id: "inbox", label: "Open Inbox", icon: Inbox, to: "/inbox" },
  {
    id: "templates",
    label: "Browse templates",
    icon: LayoutTemplate,
    to: "/templates",
  },
  { id: "settings", label: "Open Settings", icon: Settings, to: "/settings" },
];

const MAX_FORM_RESULTS = 6;
const LIST_ID = "cmdk-list";
const optionId = (i: number) => `cmdk-opt-${i}`;

const CommandPalette = ({ open, setOpen }: CommandPaletteProps) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState<string>("");
  const [active, setActive] = useState<number>(0);
  const [forms, setForms] = useState<FormSummary[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const close = useCallback(() => setOpen(false), [setOpen]);

  // Reset state and (re)load forms whenever the palette opens.
  useEffect(() => {
    if (!open) return;
    setQuery("");
    setActive(0);

    // let cancelled = false;
    // formApi
    //   .list()
    //   .then((data: FormSummary[]) => {
    //     if (!cancelled) setForms(data);
    //   })
    //   .catch((err: unknown) => console.error("CommandPalette: failed to load forms", err));

    // return () => {
    //   cancelled = true;
    // };
    setForms([]);
  }, [open]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  const actions = useMemo<PaletteItem[]>(
    () =>
      STATIC_ACTIONS.map((a) => ({
        id: a.id,
        label: a.label,
        icon: a.icon,
        kind: "action" as const,
        run: () => navigate(a.to),
      })),
    [navigate],
  );

  const items = useMemo<PaletteItem[]>(() => {
    const q = query.toLowerCase().trim();

    const matchedActions = actions.filter((a) =>
      a.label.toLocaleLowerCase().includes(q),
    );

    const matchedForms: PaletteItem[] = forms
      .filter((f) => f.title.toLowerCase().includes(q))
      .slice(0, MAX_FORM_RESULTS)
      .map((f) => ({
        id: f._id,
        label: f.title,
        icon: FileText,
        kind: "form" as const,
        run: () => navigate(`/builder/${f._id}`),
      }));

    return [...matchedActions, ...matchedForms];
  }, [query, actions, forms, navigate]);

  // Keep the highlighted row visible during keyboard navigation.
  useEffect(() => {
    if (!open) return;
    document
      .getElementById(optionId(active))
      ?.scrollIntoView({ block: "nearest" });
  }, [open, active]);

  const runItem = (item: PaletteItem) => {
    item.run();
    close();
  };

  const handleQueryChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setActive(0);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.nativeEvent.isComposing) return; // ignore IME composition

    if (e.key === "Escape") {
      close();
      return;
    }
    if (items.length === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActive((a) => (a + 1) % items.length);
        break;
      case "ArrowUp":
        e.preventDefault();
        setActive((a) => (a - 1 + items.length) % items.length);
        break;
      case "Enter": {
        e.preventDefault();
        const item = items[active];
        if (item) runItem(item);
        break;
      }
    }
  };

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-60 flex items-start justify-center p-4 pt-[12vh]">
      <button
        type="button"
        aria-label="Close command palette"
        className="absolute inset-0 cursor-pointer border-0 bg-slate-900/40 p-0 backdrop-blur-sm animate-fade-in"
        onClick={() => setOpen(false)}
      />
      <div className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-default bg-surface shadow-pop animate-scale-in">
        <div className="flex items-center gap-3 border-b border-default px-4">
          <Search className="h-4.5 w-4.5 text-muted" />
          <input
            ref={inputRef}
            role="combobox"
            aria-expanded="true"
            aria-controls={LIST_ID}
            aria-activedescendant={items.length ? optionId(active) : undefined}
            value={query}
            onChange={handleQueryChange}
            onKeyDown={handleKeyDown}
            placeholder="Search forms or run a command…"
            className="h-14 w-full bg-transparent text-sm text-fg outline-none placeholder:text-muted"
          />
          <kbd className="hidden rounded-md border border-default bg-surface-2 px-1.5 py-0.5 text-[10px] font-medium text-muted sm:block">
            ESC
          </kbd>
        </div>

        <div
          id={LIST_ID}
          role="listbox"
          className="max-h-80 overflow-y-auto scrollbar-thin p-2"
        >
          {items.length === 0 && (
            <p className="px-3 py-8 text-center text-sm text-muted">
              No results found
            </p>
          )}
          {items.map((item, i) => {
            const Icon = item.icon;
            const isActive = active === i;
            return (
              <button
                key={`${item.kind}-${item.id}`}
                id={optionId(i)}
                type="button"
                role="option"
                aria-selected={isActive}
                onMouseEnter={() => setActive(i)}
                onClick={() => runItem(item)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-colors",
                  isActive
                    ? "bg-brand-50 text-brand-700 dark:bg-brand-900/30 dark:text-brand-200"
                    : "text-fg",
                )}
              >
                <Icon
                  className="h-4 w-4 shrink-0 opacity-80"
                  aria-hidden="true"
                />
                <span className="flex-1 truncate">{item.label}</span>
                {item.kind === "form" && (
                  <span className="text-[10px] uppercase text-muted">Form</span>
                )}
                {isActive && (
                  <CornerDownLeft
                    className="h-3.5 w-3.5 text-muted"
                    aria-hidden="true"
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default CommandPalette;
