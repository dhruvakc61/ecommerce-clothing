import { useState } from "react";

export default function Sidebar({ children }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        className="md:hidden bg-blue-600 text-white px-3 py-2 rounded"
        onClick={() => setOpen(true)}
      >
        Open Filters
      </button>

      <div
        className={`fixed inset-0 bg-black bg-opacity-40 z-40 transition-opacity ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setOpen(false)}
      />

      <aside
        className={`fixed top-0 left-0 bg-white w-64 h-full z-50 shadow transform transition-transform ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <button
          className="absolute top-3 right-3 text-lg"
          onClick={() => setOpen(false)}
        >
          x
        </button>

        <div className="p-4">{children}</div>
      </aside>
    </>
  );
}
