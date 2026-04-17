import { useState } from "react";

export default function ProductFilter({ onFilter }) {
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("");
  const [price, setPrice] = useState([0, 1000]);
  const [search, setSearch] = useState("");

  const applyFilters = () => {
    const filters = { category, sort, search };
    if (price[0] > 0) filters.minPrice = price[0];
    if (price[1] < 1000) filters.maxPrice = price[1];
    onFilter(filters);
  };

  return (
    <div className="space-y-6">
      {/* Search */}
      <div>
        <label className="font-semibold block">Search</label>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products"
          className="w-full border px-3 py-2 rounded"
        />
      </div>

      {/* Category */}
      <div>
        <label className="font-semibold block">Category</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full border px-3 py-2 rounded"
        >
          <option value="">All</option>
          <option value="men">Men</option>
          <option value="women">Women</option>
          <option value="kids">Kids</option>
          <option value="accessories">Accessories</option>
        </select>
      </div>

      {/* Sort */}
      <div>
        <label className="font-semibold block">Sort</label>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="w-full border px-3 py-2 rounded"
        >
          <option value="">Default</option>
          <option value="low-high">Price: Low to High</option>
          <option value="high-low">Price: High to Low</option>
        </select>
      </div>

      {/* Price Range */}
      <div>
        <label className="font-semibold block">Price Range</label>
        <div className="flex items-center space-x-3">
          <input
            type="number"
            value={price[0]}
            min="0"
            max={price[1]}
            onChange={(e) => setPrice([Number(e.target.value), price[1]])}
            className="border w-20 px-2 py-1 rounded"
          />
          <span>-</span>
          <input
            type="number"
            value={price[1]}
            min={price[0]}
            max="1000"
            onChange={(e) => setPrice([price[0], Number(e.target.value)])}
            className="border w-20 px-2 py-1 rounded"
          />
        </div>
      </div>

      <button
        onClick={applyFilters}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        Apply Filters
      </button>
    </div>
  );
}
