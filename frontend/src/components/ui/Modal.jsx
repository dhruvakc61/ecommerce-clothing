// Placeholder for Modal.jsx
// Full implementation will be added later.
export default function Modal({ open, onClose, children }) {
  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-40" onClick={onClose}></div>
      <div className="fixed top-1/2 left-1/2 z-50 bg-white p-6 rounded shadow-lg transform -translate-x-1/2 -translate-y-1/2 min-w-[300px]">
        {children}
      </div>
    </>
  );
}