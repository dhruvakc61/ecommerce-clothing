import AdminSidebar from "../../components/admin/AdminSidebar";
import useFetch from "../../hooks/useFetch";

export default function AdminUsers() {
  const { data: users, loading, error } = useFetch("/users");

  return (
    <div className="flex gap-6">
      <AdminSidebar />
      <div className="flex-1 bg-white p-6 rounded shadow">
        <h1 className="text-2xl font-bold mb-6">Manage Users</h1>
        {loading && <p>Loading users...</p>}
        {error && <p className="text-red-600">{error}</p>}
        {!loading && (!users || users.length === 0) && <p>No users found.</p>}
        {users && users.length > 0 && (
          <table className="w-full text-left border">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3">Name</th>
                <th className="p-3">Email</th>
                <th className="p-3">Role</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="border-t">
                  <td className="p-3">{user.name}</td>
                  <td className="p-3">{user.email}</td>
                  <td className="p-3">{user.isAdmin ? "Admin" : "User"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
