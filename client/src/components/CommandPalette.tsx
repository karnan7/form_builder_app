import { Search } from "lucide-react";
import { useState } from "react";

interface CommandPaletteProps {
  setOpen: (open: boolean) => void;
}
const CommandPalette = ({ setOpen }: CommandPaletteProps) => {
  const [query, setQuery] = useState("");
  return (
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
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search forms or run a command…"
            className="h-14 w-full bg-transparent text-sm text-fg outline-none placeholder:text-muted"
          />
          <kbd className="hidden rounded-md border border-default bg-surface-2 px-1.5 py-0.5 text-[10px] font-medium text-muted sm:block">
            ESC
          </kbd>
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;
