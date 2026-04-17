import { Link } from "react-router-dom";
import useCart from "../../hooks/useCart";
import formatCurrency from "../../utils/formatCurrency";

const CartSummary = () => {
  const { cart, totals } = useCart();

  const subtotal = totals.subtotal;
  const shipping = subtotal > 100 ? 0 : 10;
  const total = subtotal + shipping;

  return (
    <div className="border rounded-lg shadow-sm p-6 h-fit space-y-4">
      <h2 className="text-xl font-bold">Order Summary</h2>

      <div className="flex justify-between text-gray-600">
        <span>Subtotal</span>
        <span>{formatCurrency(subtotal)}</span>
      </div>

      <div className="flex justify-between text-gray-600">
        <span>Shipping</span>
        <span>{shipping === 0 ? "Free" : formatCurrency(shipping)}</span>
      </div>

      <div className="border-t pt-4 flex justify-between font-bold text-lg">
        <span>Total</span>
        <span>{formatCurrency(total)}</span>
      </div>

      <Link
        to="/checkout"
        className="block text-center bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
      >
        Proceed to Checkout ({cart.reduce((acc, item) => acc + item.qty, 0)} items)
      </Link>
    </div>
  );
};

export default CartSummary;
