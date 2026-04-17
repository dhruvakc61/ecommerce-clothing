import AccountOrdersPanel from "../components/account/AccountOrdersPanel";
import useFetch from "../hooks/useFetch";

export default function OrderHistory() {
  const { data: orders, loading, error } = useFetch("/orders/my");

  return (
    <AccountOrdersPanel
      orders={Array.isArray(orders) ? orders : []}
      loading={loading}
      error={error}
      title="My Orders"
      subtitle="A dedicated view of your purchase history, delivery progress, and order summaries."
    />
  );
}
