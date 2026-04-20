import AdminPageShell from "../../components/admin/AdminPageShell";
import useFetch from "../../hooks/useFetch";

export default function AdminUsers() {
  const { data: users, loading, error } = useFetch("/api/users");
  const userList = Array.isArray(users) ? users : [];
  const adminCount = userList.filter((user) => user.isAdmin).length;

  return (
    <AdminPageShell
      eyebrow="Accounts"
      title="Manage Users"
      description="Every user record now stays readable on mobile, with stacked cards for phones and a wider table for larger screens."
    >
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-[22px] border border-[#eadfd2] bg-[#fffaf3] p-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--theme-accent)]">Total Users</p>
          <p className="mt-3 text-3xl font-semibold text-[var(--theme-ink)]">{userList.length}</p>
        </div>
        <div className="rounded-[22px] border border-[#eadfd2] bg-white p-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--theme-accent)]">Admins</p>
          <p className="mt-3 text-3xl font-semibold text-[var(--theme-ink)]">{adminCount}</p>
        </div>
        <div className="rounded-[22px] border border-[#eadfd2] bg-white p-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--theme-accent)]">Customers</p>
          <p className="mt-3 text-3xl font-semibold text-[var(--theme-ink)]">{userList.length - adminCount}</p>
        </div>
      </div>

      <div className="mt-6">
        {loading && <p className="text-sm text-[var(--theme-muted)]">Loading users...</p>}
        {error && <p className="text-sm text-red-600">{error}</p>}
        {!loading && userList.length === 0 && <p className="text-sm text-[var(--theme-muted)]">No users found.</p>}

        {userList.length > 0 ? (
          <>
            <div className="space-y-4 md:hidden">
              {userList.map((user) => (
                <article key={user._id} className="rounded-[24px] border border-[#eadfd2] bg-white p-4 shadow-[0_12px_30px_rgba(36,28,23,0.04)]">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-base font-semibold text-[var(--theme-ink)]">{user.name}</p>
                      <p className="mt-1 break-all text-sm text-[var(--theme-muted)]">{user.email}</p>
                    </div>
                    <span className="rounded-full bg-[#f5ece3] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--theme-accent)]">
                      {user.isAdmin ? "Admin" : "User"}
                    </span>
                  </div>
                </article>
              ))}
            </div>

            <div className="hidden overflow-hidden rounded-[26px] border border-[#eadfd2] md:block">
              <div className="overflow-x-auto">
                <table className="min-w-full text-left">
                  <thead className="bg-[#fbf5ee]">
                    <tr className="text-[11px] uppercase tracking-[0.18em] text-[var(--theme-accent)]">
                      <th className="px-5 py-4 font-semibold">Name</th>
                      <th className="px-5 py-4 font-semibold">Email</th>
                      <th className="px-5 py-4 font-semibold">Role</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#f1e7dc] bg-white">
                    {userList.map((user) => (
                      <tr key={user._id}>
                        <td className="px-5 py-4 font-medium text-[var(--theme-ink)]">{user.name}</td>
                        <td className="px-5 py-4 text-sm text-[var(--theme-muted)]">{user.email}</td>
                        <td className="px-5 py-4 text-sm text-[var(--theme-ink)]">{user.isAdmin ? "Admin" : "User"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        ) : null}
      </div>
    </AdminPageShell>
  );
}
