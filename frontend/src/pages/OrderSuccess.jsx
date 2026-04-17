import { Link } from "react-router-dom";

export default function OrderSuccess() {
  return (
    <div className="text-center py-20">
      <h2 className="text-3xl font-bold text-green-600">
        Order Placed Successfully!
      </h2>

      <p className="mt-4">
        Thank you for your purchase. You can view your orders anytime.
      </p>

      <Link to="/orders" className="text-blue-600 underline mt-6 block">
        View Order History
      </Link>
    </div>
  );
}
