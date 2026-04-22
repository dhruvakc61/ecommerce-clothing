import { Link, useLocation } from "react-router-dom";

const menu = [
  { label: "Dashboard", path: "/admin", note: "Overview and health" },
  { label: "Products", path: "/admin/products", note: "Inventory and edits" },
  { label: "Users", path: "/admin/users", note: "Customer access" },
  { label: "Orders", path: "/admin/orders", note: "Fulfilment pipeline" },
];

function isActivePath(pathname, path) {
  if (path === "/admin") return pathname === path;
  return pathname === path || pathname.startsWith(`${path}/`);
}

export default function AdminSidebar() {
  const { pathname } = useLocation();

  return (
    <div className="w-full shrink-0 xl:w-80">
      <div className="xl:hidden">
        <div className="rounded-[24px] border border-[#eadfd2] bg-[#fffaf3] px-4 py-4 shadow-[0_12px_35px_rgba(36,28,23,0.05)]">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--theme-accent)]">
                Admin Workspace
              </p>
              <p className="mt-1 text-sm text-[var(--theme-muted)]">
                Switch between sections without losing data on mobile.
              </p>
            </div>
            <div className="rounded-full bg-[var(--theme-ink)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white">
              {menu.find((item) => isActivePath(pathname, item.path))?.label || "Panel"}
            </div>
          </div>

          <nav className="mt-4 flex gap-2 overflow-x-auto pb-1">
            {menu.map((item) => {
              const active = isActivePath(pathname, item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`whitespace-nowrap rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] transition ${
                    active
                      ? "border-[var(--theme-accent)] bg-[var(--theme-accent)] text-white shadow-[0_12px_24px_rgba(176,122,79,0.2)]"
                      : "border-[#eadfd2] bg-white text-[var(--theme-ink)]"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      <aside className="sticky top-24 hidden rounded-[28px] border border-[#eadfd2] bg-[linear-gradient(180deg,rgba(36,28,23,0.96),rgba(54,43,36,0.92))] p-6 text-white shadow-[0_24px_60px_rgba(36,28,23,0.18)] xl:block">
        <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#d8b18a]">
          Baya Admin
        </p>
        <h2 className="mt-3 font-[var(--font-display)] text-4xl leading-none text-white">
          Command Center
        </h2>
        <p className="mt-4 text-sm leading-7 text-white/72">
          Review store activity, keep inventory healthy, and move through fulfilment with a cleaner workflow.
        </p>

        <nav className="mt-8 space-y-3">
          {menu.map((item) => {
            const active = isActivePath(pathname, item.path);

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`block rounded-[22px] border px-4 py-4 transition ${
                  active
                    ? "border-[#d8b18a]/40 bg-white/12 shadow-[0_16px_32px_rgba(0,0,0,0.14)]"
                    : "border-white/8 bg-white/[0.04] hover:border-white/20 hover:bg-white/[0.08]"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className={`text-sm font-semibold ${active ? "text-white" : "text-white/88"}`}>
                      {item.label}
                    </p>
                    <p className="mt-1 text-xs uppercase tracking-[0.16em] text-white/55">
                      {item.note}
                    </p>
                  </div>
                  <span
                    className={`mt-1 inline-flex h-2.5 w-2.5 rounded-full ${
                      active ? "bg-[#d8b18a]" : "bg-white/18"
                    }`}
                  />
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="mt-8 rounded-[22px] border border-white/10 bg-white/[0.05] p-4">
         
          <p className="mt-2 text-sm leading-6 text-white/70">
          </p>
        </div>
      </aside>
    </div>
  );
}
