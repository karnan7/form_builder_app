import { useState } from "react";
import {
  LayoutDashboard,
  LayoutTemplate,
  Search,
  Plus,
  Menu,
  X,
  Sparkles,
  Inbox,
  Settings,
  FolderOpen,
  Bell,
  type LucideIcon,
} from "lucide-react";
import { NavLink, Outlet, useNavigate } from "react-router";
import { cn } from "../lib/utils";
import { Logo } from "../components/Logo";
import { ThemeToggle } from "./ThemeToggle";
import ProfileMenu from "../components/dashboard/ProfileMenu";
import CommandPalette from "../components/CommandPalette";

const NAV = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/forms", label: "My Forms", icon: FolderOpen },
  { to: "/insights", label: "Insights", icon: Sparkles },
  { to: "/inbox", label: "Inbox", icon: Inbox },
  { to: "/templates", label: "Templates", icon: LayoutTemplate },
  { to: "/settings", label: "Settings", icon: Settings },
];

interface RailItemProps {
  to: string;
  label: string;
  icon: LucideIcon;
}
const RailItem = ({ to, label, icon: Icon }: RailItemProps) => {
  return (
    <NavLink
      to={to}
      className="mx-3 flex h-11 items-center gap-3 rounded-xl px-2 transition-colors hover:bg-surface-2"
    >
      {({ isActive }) => (
        <>
          <span
            className={cn(
              "grid h-9 w-9 shrink-0 place-items-center rounded-lg transition-colors",
              isActive
                ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                : "text-muted",
            )}
          >
            <Icon className="h-5 w-5" strokeWidth={1.8} />
          </span>
          <span
            className={cn(
              "whitespace-nowrap text-sm font-medium opacity-0 transition-opacity duration-200 group-hover:opacity-100",
              isActive ? "text-fg" : "text-muted",
            )}
          >
            {label}
          </span>
        </>
      )}
    </NavLink>
  );
};
const DashboardLayout = () => {
  const navigate = useNavigate();
  const [paletteOpen, setPaletteOpen] = useState<boolean>(false);
  const [mobileNav, setMobileNav] = useState<boolean>(false);

  return (
    <div className="flex min-h-screen bg-app">
      <div className="hidden w-20 shrink-0 lg:block" aria-hidden />
      <aside className="group fixed left-0 top-0 z-40 hidden h-screen w-20 flex-col overflow-hidden border-r broder-default bg-surface py-5 transition-[width] duration-200 ease-out hover:w-64 hover:shadow-pop lg:flex">
        <button
          onClick={() => navigate("/dashboard")}
          className="mx-3 flex h-10 items-center gap-3 rounded-xl px-2"
          aria-label="Home"
        >
          <span className="shrink-0">
            <Logo showText={false} size={36} />
          </span>
          <span className="whitespace-nowrap text-lg font-bold tracking-tight text-fg opacity-0 transition-opacity duration-200 group-hover:opacity-100">
            Timely Forms <span className="text-brand-600">AI</span>
          </span>
        </button>

        <button
          onClick={() => navigate("/builder/new")}
          className="mx-3 mt-6 flex h-11 items-center gap-3 rounded-xl px-2 transition-colors hover:bg-surface-2"
        >
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-brand-gradient text-white shadow-soft transition hover:brightness-[1.06]">
            <Plus className="h-5 w-5" />
          </span>
          <span className="whitespace-nowrap text-sm font-semibold text-fg opacity-0 transition-opacity duration-200 group-hover:opacity-100">
            New form
          </span>
        </button>

        <nav className="mt-4 flex flex-col gap-1">
          {NAV.map((item) => (
            <RailItem key={item.to} {...item} />
          ))}
        </nav>
        <div className="mx-3 mt-auto transition-colors hover:bg-surface-2">
          <ThemeToggle />
        </div>
      </aside>

      {/* Mobile drawer */}
      {mobileNav && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close navigation"
            className="absolute inset-0 border-0 bg-slate-900/50 p-0"
            onClick={() => setMobileNav(false)}
          />
          <aside className="relative flex h-full w-64 flex-col bg-surface p-4 shadow-pop animate-slide-up">
            <div className="flex items-center justify-between">
              <Logo />
              <button
                className="text-muted"
                onClick={() => setMobileNav(false)}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <button
              onClick={() => {
                void navigate("/builder/new");
                setMobileNav(false);
              }}
              className="mt-5 flex items-center justify-center gap-2 rounded-xl bg-brand-gradient py-2.5 text-sm font-medium text-white"
            >
              <Plus className="h-4 w-4" /> New form
            </button>
            <nav className="mt-5 flex flex-col gap-1">
              {NAV.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileNav(false)}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-brand-50 text-brand-700 dark:bg-brand-900/30 dark:text-brand-200"
                        : "text-muted hover:bg-surface-2 hover:text-fg",
                    )
                  }
                >
                  <item.icon className="h-4.5 w-4.5" /> {item.label}
                </NavLink>
              ))}
            </nav>
          </aside>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top header — transparent, premium search + control cluster */}
        <header className="flex h-18 items-center gap-3 px-4 lg:px-8">
          <button
            className="text-muted lg:hidden"
            onClick={() => setMobileNav(true)}
            aria-label="Menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={() => setPaletteOpen(true)}
              className="group flex h-11 w-40 items-center gap-2.5 rounded-2xl border border-default bg-surface px-4 text-sm text-muted shadow-soft transition-all hover:border-brand-300 hover:shadow-card sm:w-64 lg:w-72"
            >
              <Search className="h-4 w-4 transition-colors group-hover:text-brand-500" />
              <span className="truncate">Search…</span>
              <kbd className="ml-auto hidden items-center rounded-lg border border-default bg-surface-2 px-2 py-0.5 text-[11px] font-medium text-muted sm:flex">
                ⌘K
              </kbd>
            </button>
            <button
              onClick={() => navigate("/inbox")}
              className="relative grid h-11 w-11 place-items-center rounded-2xl border border-default bg-surface text-muted shadow-soft transition-all hover:border-brand-300 hover:text-fg"
              aria-label="Inbox"
            >
              <Bell className="h-4.5 w-4.5" />
              <span className="absolute right-3 top-3 h-2 w-2 rounded-full bg-brand-500 ring-2 ring-surface" />
            </button>
            <ThemeToggle />
            <ProfileMenu />
          </div>
        </header>
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
      <CommandPalette open={paletteOpen} setOpen={setPaletteOpen} />
    </div>
  );
};

export default DashboardLayout;
