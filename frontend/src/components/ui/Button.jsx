// Placeholder for Button.jsx
// Full implementation will be added later.
export default function Button({ children, onClick, type = "button", className = "", disabled }) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition disabled:bg-gray-400 ${className}`}
    >
      {children}
    </button>
  );
}