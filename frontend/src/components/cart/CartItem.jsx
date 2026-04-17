import useCart from "../../hooks/useCart";
import formatCurrency from "../../utils/formatCurrency";

// Single cart row with quantity controls and remove button.
const CartItem = ({ item }) => {
  const { updateQty, removeFromCart } = useCart();
  const lineId = item.cartItemId || item._id;

  const decrease = () => updateQty(lineId, item.qty - 1);
  const increase = () => updateQty(lineId, item.qty + 1);

  return (
    <div className="flex items-center justify-between border p-4 rounded-lg shadow-sm">
      <div className="flex items-center gap-4">
        <img
          src={item.image || "https://via.placeholder.com/120x120?text=Product"}
          alt={item.name}
          className="w-20 h-20 object-cover rounded"
        />
        <div>
          <h3 className="font-semibold text-lg">{item.name}</h3>
          <p className="text-gray-500">{formatCurrency(item.price)}</p>
          {item.size && <p className="text-gray-500 text-sm">Size: {item.size}</p>}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={decrease}
            className="px-2 py-1 border rounded"
            aria-label="Decrease quantity"
          >
            -
          </button>
          <span className="min-w-6 text-center">{item.qty}</span>
          <button
            type="button"
            onClick={increase}
            className="px-2 py-1 border rounded"
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>
        <p className="font-bold">
          {formatCurrency(item.price * item.qty)}
        </p>
        <button
          type="button"
          onClick={() => removeFromCart(lineId)}
          className="text-red-600 hover:underline"
        >
          Remove
        </button>
      </div>
    </div>
  );
};

export default CartItem;
