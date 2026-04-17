// Placeholder for Alert.jsx
// Full implementation will be added later.
export default function Alert({ type = "error", message }) {
  const color =
    type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700";

  return (
    <div className={`p-3 rounded mb-4 ${color}`}>
      {message}
    </div>
  );
}