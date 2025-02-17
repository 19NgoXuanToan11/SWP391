import React, { useState } from "react";

export function Sidebar({ onFilterChange }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedSkinTypes, setSelectedSkinTypes] = useState([]);
  const [selectedVolumes, setSelectedVolumes] = useState([]);

  // Danh sách các option cố định
  const volumeOptions = ["30mL", "50mL", "60mL", "100mL", "200mL"];
  const brandOptions = [
    "La Roche-Posay",
    "L'Oréal",
    "Innisfree",
    "Laneige",
    "The Ordinary",
    "Cerave",
  ];
  const categoryOptions = [
    "Chăm sóc da",
    "Sữa rửa mặt",
    "Kem dưỡng ẩm",
    "Serum",
  ];
  const skinTypeOptions = [
    "Da thường",
    "Da dầu",
    "Da khô",
    "Da hỗn hợp",
    "Da nhạy cảm",
  ];

  // Xử lý thay đổi tìm kiếm
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    applyFilters({ searchTerm: value });
  };

  // Xử lý thay đổi khoảng giá
  const handlePriceChange = (type, value) => {
    const numericValue = value === "" ? "" : parseFloat(value);
    const newPriceRange = { ...priceRange, [type]: numericValue };
    setPriceRange(newPriceRange);
    applyFilters({ priceRange: newPriceRange });
  };

  // Xử lý thay đổi checkbox
  const handleCheckboxChange = (type, value) => {
    let newSelected;
    switch (type) {
      case "volumes":
        newSelected = selectedVolumes.includes(value)
          ? selectedVolumes.filter((item) => item !== value)
          : [...selectedVolumes, value];
        setSelectedVolumes(newSelected);
        break;
      case "brands":
        newSelected = selectedBrands.includes(value)
          ? selectedBrands.filter((item) => item !== value)
          : [...selectedBrands, value];
        setSelectedBrands(newSelected);
        break;
      case "categories":
        newSelected = selectedCategories.includes(value)
          ? selectedCategories.filter((item) => item !== value)
          : [...selectedCategories, value];
        setSelectedCategories(newSelected);
        break;
      case "skinTypes":
        newSelected = selectedSkinTypes.includes(value)
          ? selectedSkinTypes.filter((item) => item !== value)
          : [...selectedSkinTypes, value];
        setSelectedSkinTypes(newSelected);
        break;
      default:
        return;
    }

    applyFilters({ [type]: newSelected });
  };

  // Đặt lại tất cả các bộ lọc
  const handleResetFilters = () => {
    setSearchTerm("");
    setPriceRange({ min: "", max: "" });
    setSelectedBrands([]);
    setSelectedCategories([]);
    setSelectedSkinTypes([]);
    setSelectedVolumes([]);

    onFilterChange({
      searchTerm: "",
      priceRange: { min: "", max: "" },
      brands: [],
      categories: [],
      skinTypes: [],
      volumes: [],
    });
  };

  // Áp dụng tất cả các bộ lọc
  const applyFilters = (changedFilter) => {
    onFilterChange({
      searchTerm,
      priceRange,
      brands: selectedBrands,
      categories: selectedCategories,
      skinTypes: selectedSkinTypes,
      volumes: selectedVolumes,
      ...changedFilter,
    });
  };

  return (
    <div className="w-64 bg-white p-4 rounded-lg shadow-md">
      {/* Tìm kiếm */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Tìm kiếm sản phẩm..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
        />
      </div>

      {/* Đặt lại bộ lọc */}
      <button
        onClick={handleResetFilters}
        className="w-full bg-pink-500 text-white py-2 rounded-lg font-semibold hover:bg-pink-600 mb-4"
      >
        Đặt lại bộ lọc
      </button>

      {/* Khoảng giá */}
      <div className="mb-6">
        <h3 className="text-lg font-bold mb-2">Khoảng giá (VND)</h3>
        <div className="flex items-center space-x-2">
          <input
            type="number"
            placeholder="Tối thiểu"
            value={priceRange.min}
            onChange={(e) => handlePriceChange("min", e.target.value)}
            className="w-full px-2 py-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
            min="0"
          />
          <span>-</span>
          <input
            type="number"
            placeholder="Tối đa"
            value={priceRange.max}
            onChange={(e) => handlePriceChange("max", e.target.value)}
            className="w-full px-2 py-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
            min="0"
          />
        </div>
      </div>

      {/* Thương hiệu */}
      <div className="mb-6">
        <h3 className="text-lg font-bold mb-2">Thương hiệu</h3>
        <div className="space-y-2">
          {brandOptions.map((brand) => (
            <label key={brand} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={selectedBrands.includes(brand)}
                onChange={() => handleCheckboxChange("brands", brand)}
                className="text-pink-500 focus:ring-pink-500"
              />
              <span>{brand}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Danh mục */}
      <div className="mb-6">
        <h3 className="text-lg font-bold mb-2">Danh mục</h3>
        <div className="space-y-2">
          {categoryOptions.map((category) => (
            <label key={category} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={selectedCategories.includes(category)}
                onChange={() => handleCheckboxChange("categories", category)}
                className="text-pink-500 focus:ring-pink-500"
              />
              <span>{category}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Loại da */}
      <div className="mb-6">
        <h3 className="text-lg font-bold mb-2">Loại da</h3>
        <div className="space-y-2">
          {skinTypeOptions.map((type) => (
            <label key={type} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={selectedSkinTypes.includes(type)}
                onChange={() => handleCheckboxChange("skinTypes", type)}
                className="text-pink-500 focus:ring-pink-500"
              />
              <span>{type}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Thể tích */}
      <div className="mb-6">
        <h3 className="text-lg font-bold mb-2">Thể tích</h3>
        <div className="space-y-2">
          {volumeOptions.map((volume) => (
            <label
              key={volume}
              className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-1 rounded"
            >
              <input
                type="checkbox"
                checked={selectedVolumes.includes(volume)}
                onChange={() => handleCheckboxChange("volumes", volume)}
                className="w-4 h-4 text-pink-500 border-gray-300 rounded focus:ring-pink-500"
              />
              <span className="text-gray-700">{volume}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
