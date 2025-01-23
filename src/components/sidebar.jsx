import React, { useState } from "react";

export function Sidebar({ onFilterChange }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedSkinTypes, setSelectedSkinTypes] = useState([]);
  const [selectedCapacities, setSelectedCapacities] = useState([]);
  const [selectedGenders, setSelectedGenders] = useState([]);
  const [selectedOrigins, setSelectedOrigins] = useState([]);

  // Xử lý thay đổi tìm kiếm
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    applyFilters({ searchTerm: value });
  };

  // Xử lý thay đổi khoảng giá
  const handlePriceChange = (type, value) => {
    // Chuyển đổi giá trị sang số
    const numericValue = value === "" ? "" : parseFloat(value);
    const newPriceRange = { ...priceRange, [type]: numericValue };
    setPriceRange(newPriceRange);
    applyFilters({ priceRange: newPriceRange });
  };

  // Xử lý thay đổi checkbox
  const handleCheckboxChange = (type, value, setter) => {
    let newSelected;
    if (type === "brands") {
      newSelected = selectedBrands.includes(value)
        ? selectedBrands.filter((item) => item !== value)
        : [...selectedBrands, value];
      setSelectedBrands(newSelected);
    } else if (type === "categories") {
      newSelected = selectedCategories.includes(value)
        ? selectedCategories.filter((item) => item !== value)
        : [...selectedCategories, value];
      setSelectedCategories(newSelected);
    } else if (type === "skinTypes") {
      newSelected = selectedSkinTypes.includes(value)
        ? selectedSkinTypes.filter((item) => item !== value)
        : [...selectedSkinTypes, value];
      setSelectedSkinTypes(newSelected);
    }

    applyFilters({
      [type]: newSelected,
    });
  };

  // Reset tất cả các filter
  const handleResetFilters = () => {
    setSearchTerm("");
    setPriceRange({ min: "", max: "" });
    setSelectedBrands([]);
    setSelectedCategories([]);
    setSelectedSkinTypes([]);
    setSelectedCapacities([]);
    setSelectedGenders([]);
    setSelectedOrigins([]);

    onFilterChange({
      searchTerm: "",
      priceRange: { min: "", max: "" },
      brands: [],
      categories: [],
      skinTypes: [],
      capacities: [],
      genders: [],
      origins: [],
    });
  };

  // Áp dụng tất cả các filter
  const applyFilters = (changedFilter) => {
    onFilterChange({
      searchTerm,
      priceRange,
      brands: selectedBrands,
      categories: selectedCategories,
      skinTypes: selectedSkinTypes,
      capacities: selectedCapacities,
      genders: selectedGenders,
      origins: selectedOrigins,
      ...changedFilter,
    });
  };

  return (
    <div className="w-64 bg-white p-4 rounded-lg shadow-md">
      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Tìm kiếm sản phẩm..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
        />
      </div>

      {/* Reset Filters */}
      <button
        onClick={handleResetFilters}
        className="w-full bg-pink-500 text-white py-2 rounded-lg font-semibold hover:bg-pink-600 mb-4"
      >
        Xóa bộ lọc
      </button>

      {/* Price Range */}
      <div className="mb-6">
        <h3 className="text-lg font-bold mb-2">Price Range (USD)</h3>
        <div className="flex items-center space-x-2">
          <input
            type="number"
            placeholder="Min"
            value={priceRange.min}
            onChange={(e) => handlePriceChange("min", e.target.value)}
            className="w-full px-2 py-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
            min="0"
            step="1"
          />
          <span>-</span>
          <input
            type="number"
            placeholder="Max"
            value={priceRange.max}
            onChange={(e) => handlePriceChange("max", e.target.value)}
            className="w-full px-2 py-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
            min="0"
            step="1"
          />
        </div>
      </div>

      {/* Brands */}
      <div className="mb-6">
        <h3 className="text-lg font-bold mb-2">Brands</h3>
        <div className="space-y-2">
          {["La Roche-Posay", "L'Oréal", "Innisfree", "Laneige"].map(
            (brand) => (
              <label key={brand} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={selectedBrands.includes(brand)}
                  onChange={() =>
                    handleCheckboxChange("brands", brand, setSelectedBrands)
                  }
                  className="text-pink-500 focus:ring-pink-500"
                />
                <span>{brand}</span>
              </label>
            )
          )}
        </div>
      </div>

      {/* Categories */}
      <div className="mb-6">
        <h3 className="text-lg font-bold mb-2">Categories</h3>
        <div className="space-y-2">
          {["Skincare", "Makeup", "Cleansers", "Moisturizers"].map(
            (category) => (
              <label key={category} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(category)}
                  onChange={() =>
                    handleCheckboxChange(
                      "categories",
                      category,
                      setSelectedCategories
                    )
                  }
                  className="text-pink-500 focus:ring-pink-500"
                />
                <span>{category}</span>
              </label>
            )
          )}
        </div>
      </div>

      {/* Skin Types */}
      <div className="mb-6">
        <h3 className="text-lg font-bold mb-2">Skin Types</h3>
        <div className="space-y-2">
          {["Normal", "Oily", "Dry", "Combination", "Sensitive"].map((type) => (
            <label key={type} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={selectedSkinTypes.includes(type)}
                onChange={() =>
                  handleCheckboxChange("skinTypes", type, setSelectedSkinTypes)
                }
                className="text-pink-500 focus:ring-pink-500"
              />
              <span>{type}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
