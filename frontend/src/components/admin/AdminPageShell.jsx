import AdminSidebar from "./AdminSidebar";

export default function AdminPageShell({
  eyebrow,
  title,
  description,
  actions,
  children,
}) {
  return (
    <section className="w-full px-2 pb-6 pt-20 sm:px-3 sm:pb-8 sm:pt-22 lg:px-4">
      <div className="mx-auto w-full max-w-[1680px]">
        <div className="rounded-[26px] border border-[#eadfd2] bg-[linear-gradient(180deg,rgba(255,253,249,0.94)_0%,rgba(246,241,234,0.88)_100%)] p-2 shadow-[0_22px_60px_rgba(36,28,23,0.07)] sm:rounded-[30px] sm:p-3">
          <div className="flex flex-col gap-3 xl:flex-row">
            <AdminSidebar />

            <div className="min-w-0 flex-1">
              <div className="overflow-hidden rounded-[24px] border border-[#eadfd2] bg-white/90 shadow-[0_14px_40px_rgba(36,28,23,0.05)] backdrop-blur sm:rounded-[28px]">
                <div className="border-b border-[#f1e7dc] bg-[radial-gradient(circle_at_top_right,rgba(216,177,138,0.18),transparent_34%),linear-gradient(180deg,rgba(255,253,249,0.98),rgba(255,249,242,0.92))] px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-7">
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

                <div className="px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-7">{children}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
