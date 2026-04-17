import useFetch from "../../hooks/useFetch";
import AdminSidebar from "../../components/admin/AdminSidebar";

export default function AdminUsers() {
  const { data: users, loading, error } = useFetch("/users");

  return (
    <div className="flex gap-6">
      <AdminSidebar />

      <div className="flex-1 bg-white p-6 rounded shadow">
        <h1 className="text-xl font-bold mb-6">Manage Users</h1>

        {loading && <p>Loading...</p>}
        {error && <p className="text-red-600">{error}</p>}

        {users && users.length > 0 && (
          <table className="w-full border">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2">Name</th>
                <th className="p-2">Email</th>
                <th className="p-2">Admin</th>
              </tr>
            </thead>

            <tbody>
              {users.map((u) => (
                <tr key={u._id} className="border-t">
                  <td className="p-2">{u.name}</td>
                  <td className="p-2">{u.email}</td>
                  <td className="p-2">{u.isAdmin ? "Yes" : "No"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
