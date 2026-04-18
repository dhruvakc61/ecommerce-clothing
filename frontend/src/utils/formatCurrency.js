// Placeholder for formatCurrency.js
// Full implementation will be added later.
export default function formatCurrency(value) {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
  }).format(value);
}
