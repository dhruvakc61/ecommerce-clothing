// Placeholder for Pagination.jsx
// Full implementation will be added later.
export default function Pagination({ page, pages, onPageChange }) {
  if (pages <= 1) return null;

  const numbers = [...Array(pages).keys()].map((x) => x + 1);

  return (
    <div className="flex justify-center space-x-2 mt-6">
      {numbers.map((num) => (
        <button
          key={num}
          onClick={() => onPageChange(num)}
          className={`px-3 py-1 rounded ${
            num === page ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          {num}
        </button>
      ))}
    </div>
  );
}