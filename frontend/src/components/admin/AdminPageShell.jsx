import AdminSidebar from "./AdminSidebar";

export default function AdminPageShell({
  eyebrow,
  title,
  description,
  actions,
  children,
}) {
  return (
    <section className="w-full px-4 pb-10 pt-24 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl">
        <div className="rounded-[32px] border border-[#eadfd2] bg-[linear-gradient(180deg,rgba(255,253,249,0.94)_0%,rgba(246,241,234,0.88)_100%)] p-3 shadow-[0_28px_80px_rgba(36,28,23,0.08)] sm:p-4">
          <div className="flex flex-col gap-4 xl:flex-row">
            <AdminSidebar />

            <div className="min-w-0 flex-1">
              <div className="overflow-hidden rounded-[28px] border border-[#eadfd2] bg-white/90 shadow-[0_18px_50px_rgba(36,28,23,0.06)] backdrop-blur">
                <div className="border-b border-[#f1e7dc] bg-[radial-gradient(circle_at_top_right,rgba(216,177,138,0.18),transparent_34%),linear-gradient(180deg,rgba(255,253,249,0.98),rgba(255,249,242,0.92))] px-5 py-6 sm:px-8 sm:py-8">
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                    <div className="min-w-0">
                      {eyebrow ? (
                        <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--theme-accent)]">
                          {eyebrow}
                        </p>
                      ) : null}
                      <h1 className="font-[var(--font-display)] text-3xl leading-none text-[var(--theme-ink)] sm:text-5xl">
                        {title}
                      </h1>
                      {description ? (
                        <p className="mt-4 max-w-3xl text-sm leading-7 text-[var(--theme-muted)] sm:text-[15px]">
                          {description}
                        </p>
                      ) : null}
                    </div>

                    {actions ? (
                      <div className="flex flex-wrap items-center gap-3">{actions}</div>
                    ) : null}
                  </div>
                </div>

                <div className="px-5 py-6 sm:px-8 sm:py-8">{children}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
