export default function getOrderReference(order) {
  return order?.orderReference || order?._id || "N/A";
}
