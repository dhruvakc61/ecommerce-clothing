// Placeholder for ProductCard.jsx
// Full implementation will be added later.
import { Link } from "react-router-dom";
import formatCurrency from "../../utils/formatCurrency";
import useCart from "../../hooks/useCart";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();

  return (
    <div className="bg-white shadow rounded p-4 hover:shadow-lg transition">
      <Link to={`/products/${product._id}`}>
        <img
          src={product.image || "https://via.placeholder.com/600x800?text=Product"}
          alt={product.name}
          className="w-full h-64 object-cover rounded"
        />
      </Link>

      <div className="mt-4">
        <h3 className="text-lg font-semibold">{product.name}</h3>
        <p className="text-blue-600 font-bold mt-1">
          {formatCurrency(product.price)}
        </p>

        <div className="grid grid-cols-2 gap-2 mt-3">
          <Link
            to={`/products/${product._id}`}
            className="text-center bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            View
          </Link>
          <button
            type="button"
            onClick={() => addToCart(product, 1)}
            className="text-center bg-gray-900 text-white py-2 rounded hover:bg-gray-800"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
