import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FilterOutlined,
  SearchOutlined,
  CloseOutlined,
  CheckOutlined,
  ReloadOutlined,
  DollarOutlined,
  TagsOutlined,
  SkinOutlined,
  ExperimentOutlined,
  UpOutlined,
  DownOutlined,
} from "@ant-design/icons";
import {
  useGetBrandsQuery,
  useGetCategoriesQuery,
} from "../../services/api/beautyShopApi";
import { Spin } from "antd";

// Hàm chuyển đổi chuỗi tiếng Việt sang không dấu
const removeAccents = (str) => {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
};

// Hàm fuzzy search
const fuzzySearch = (query, text) => {
  if (!query) return true;

  // Chuyển đổi cả query và text về chữ thường không dấu
  const normalizedQuery = removeAccents(query);
  const normalizedText = removeAccents(text);

  return normalizedText.includes(normalizedQuery);
};

export function Sidebar({ onFilterChange }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedSkinTypes, setSelectedSkinTypes] = useState([]);
  const [selectedVolumes, setSelectedVolumes] = useState([]);
  const [activeSection, setActiveSection] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");

  // Thêm hook để fetch brands từ API
  const { data: brands, isLoading: isBrandsLoading } = useGetBrandsQuery();

  // Thêm hook để fetch categories từ API
  const { data: categories, isLoading: isCategoriesLoading } =
    useGetCategoriesQuery();

  // Cập nhật brandOptions để sử dụng dữ liệu từ API
  const brandOptions = brands?.map((brand) => brand.brandName) || [];

  // Cập nhật categoryOptions để sử dụng dữ liệu từ API
  const categoryOptions =
    categories?.map((category) => category.categoryName) || [];

  // Danh sách các option cố định
  const volumeOptions = ["30ml", "50ml", "100ml", "150ml", "200ml"];
  const skinTypeOptions = ["Da dầu", "Da khô", "Da hỗn hợp", "Da nhạy cảm"];

  // Xử lý thay đổi tìm kiếm
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    applyFilters({ searchTerm: value });
  };

  // Thêm hàm để lấy các từ khóa phổ biến có thể liên quan đến từ khóa tìm kiếm
  const getSearchSuggestions = (term) => {
    // Các từ khóa phổ biến trong ngành mỹ phẩm
    const commonKeywords = [
      {
        keyword: "kem chống nắng",
        aliases: ["chong nang", "kem chong nang", "sun screen", "sunscreen"],
      },
      {
        keyword: "sữa rửa mặt",
        aliases: ["sua rua mat", "srm", "cleanser", "face wash"],
      },
      {
        keyword: "dưỡng ẩm",
        aliases: ["duong am", "moisturizer", "hydrating", "kem duong"],
      },
      { keyword: "serum", aliases: ["tinh chat", "essence", "tinh chất"] },
      { keyword: "mặt nạ", aliases: ["mat na", "mask", "sheet mask"] },
      {
        keyword: "tẩy trang",
        aliases: ["tay trang", "makeup remover", "cleansing oil"],
      },
      { keyword: "toner", aliases: ["nuoc hoa hong", "nước hoa hồng"] },
    ];

    if (!term || term.trim() === "") return [];

    const normalizedTerm = removeAccents(term.toLowerCase());

    // Tìm các từ khóa phù hợp
    return commonKeywords
      .filter(
        (item) =>
          item.aliases.some((alias) => alias.includes(normalizedTerm)) ||
          removeAccents(item.keyword).includes(normalizedTerm)
      )
      .map((item) => item.keyword);
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
    setActiveSection(null);
    setSortOrder("asc");

    onFilterChange({
      searchTerm: "",
      priceRange: { min: "", max: "" },
      brands: [],
      categories: [],
      skinTypes: [],
      volumes: [],
      sortOrder: "asc",
    });
  };

  // Áp dụng tất cả các bộ lọc với fuzzy search
  const applyFilters = (changedFilter) => {
    const currentFilters = {
      searchTerm,
      priceRange,
      brands: selectedBrands,
      categories: selectedCategories,
      skinTypes: selectedSkinTypes,
      volumes: selectedVolumes,
      sortOrder,
      ...changedFilter,
      fuzzySearch: true, // Thêm cờ để biết rằng cần áp dụng fuzzy search
    };

    onFilterChange(currentFilters);
  };

  const handleSortChange = (order) => {
    console.log("Sort order changed to:", order);
    setSortOrder(order);
    applyFilters({ sortOrder: order });
  };

  const handleOptionClick = (type, option) => {
    switch (type) {
      case "brands":
        const newBrands = selectedBrands.includes(option)
          ? selectedBrands.filter((item) => item !== option)
          : [...selectedBrands, option];
        setSelectedBrands(newBrands);
        applyFilters({ brands: newBrands });
        break;
      case "categories":
        const newCategories = selectedCategories.includes(option)
          ? selectedCategories.filter((item) => item !== option)
          : [...selectedCategories, option];
        setSelectedCategories(newCategories);
        applyFilters({ categories: newCategories });
        break;
      case "skinTypes":
        const newSkinTypes = selectedSkinTypes.includes(option)
          ? selectedSkinTypes.filter((item) => item !== option)
          : [...selectedSkinTypes, option];
        setSelectedSkinTypes(newSkinTypes);
        applyFilters({ skinTypes: newSkinTypes });
        break;
      case "volumes":
        const newVolumes = selectedVolumes.includes(option)
          ? selectedVolumes.filter((item) => item !== option)
          : [...selectedVolumes, option];
        setSelectedVolumes(newVolumes);
        applyFilters({ volumes: newVolumes });
        break;
      default:
        break;
    }
  };

  const filterSections = [
    {
      id: "brands",
      title: "Thương hiệu",
      icon: <TagsOutlined />,
      options: brandOptions,
      type: "brands",
      selected: selectedBrands,
      isLoading: isBrandsLoading,
    },
    {
      id: "categories",
      title: "Danh mục",
      icon: <FilterOutlined />,
      options: categoryOptions,
      type: "categories",
      selected: selectedCategories,
      isLoading: isCategoriesLoading,
    },
    {
      id: "skinTypes",
      title: "Loại da",
      icon: <SkinOutlined />,
      options: skinTypeOptions,
      type: "skinTypes",
      selected: selectedSkinTypes,
    },
    {
      id: "volumes",
      title: "Thể tích",
      icon: <ExperimentOutlined />,
      options: volumeOptions,
      type: "volumes",
      selected: selectedVolumes,
    },
  ];

  return (
    <motion.div
      initial={{ x: -300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="w-80 bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl p-6 border border-gray-100"
    >
      {/* Search Bar */}
      <div className="relative mb-6 group">
        <SearchOutlined
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 
          group-hover:text-pink-500 transition-colors duration-300"
        />
        <div className="flex items-center relative">
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full pl-12 pr-10 py-4 bg-gray-50/50 rounded-2xl border border-gray-200 
              focus:border-pink-500 focus:ring-4 focus:ring-pink-500/20 transition-all duration-300
              placeholder:text-gray-400 text-gray-700"
          />
          {searchTerm && (
            <motion.button
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              onClick={() => {
                setSearchTerm("");
                applyFilters({ searchTerm: "" });
              }}
              className="absolute right-4 text-gray-400 hover:text-pink-500 transition-colors duration-300"
            >
              <CloseOutlined />
            </motion.button>
          )}
        </div>

        {/* Phần đề xuất tìm kiếm */}
        {searchTerm && (
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute left-0 right-0 mt-2 bg-white rounded-xl shadow-md z-50 border border-gray-100 overflow-hidden"
            >
              {getSearchSuggestions(searchTerm).length > 0 ? (
                <div className="py-2">
                  <p className="px-4 py-2 text-sm text-gray-500">
                    Bạn có thể đang tìm:
                  </p>
                  {getSearchSuggestions(searchTerm).map((suggestion, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ backgroundColor: "#F9FAFB" }}
                      className="px-4 py-2 cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={() => {
                        setSearchTerm(suggestion);
                        applyFilters({ searchTerm: suggestion });
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <SearchOutlined className="text-pink-500" />
                        <span className="text-gray-800">{suggestion}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : null}
            </motion.div>
          </AnimatePresence>
        )}
      </div>

      {/* Sort Order */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <DollarOutlined className="text-pink-500" />
          <span>Sắp xếp theo giá</span>
        </h3>
        <div className="grid grid-cols-2 gap-2">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleSortChange("asc")}
            className={`px-4 py-3 rounded-xl flex items-center justify-center gap-2 transition-all duration-200 
              ${
                sortOrder === "asc"
                  ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg shadow-pink-500/20"
                  : "bg-gray-50 text-gray-600 hover:bg-gray-100"
              }`}
          >
            <UpOutlined
              className={sortOrder === "asc" ? "text-white" : "text-gray-400"}
            />
            <span>Thấp đến cao</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleSortChange("desc")}
            className={`px-4 py-3 rounded-xl flex items-center justify-center gap-2 transition-all duration-200 
              ${
                sortOrder === "desc"
                  ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg shadow-pink-500/20"
                  : "bg-gray-50 text-gray-600 hover:bg-gray-100"
              }`}
          >
            <DownOutlined
              className={sortOrder === "desc" ? "text-white" : "text-gray-400"}
            />
            <span>Cao đến thấp</span>
          </motion.button>
        </div>
      </div>

      {/* Reset Filters Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleResetFilters}
        className="w-full mb-8 py-4 px-6 bg-gradient-to-r from-pink-500 to-purple-500 
          text-white rounded-2xl font-medium shadow-lg shadow-pink-500/20 
          hover:shadow-xl hover:shadow-pink-500/30 transition-all duration-300 
          flex items-center justify-center gap-2"
      >
        <ReloadOutlined className="text-lg" />
        <span>Đặt lại bộ lọc</span>
      </motion.button>

      {/* Price Range */}
      <motion.div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <DollarOutlined className="text-pink-500" />
            <span>Khoảng giá</span>
          </h3>
        </div>
        <div className="space-y-4">
          <div className="relative">
            <input
              type="number"
              placeholder="Giá tối thiểu"
              value={priceRange.min}
              onChange={(e) => handlePriceChange("min", e.target.value)}
              className="w-full px-4 py-3 bg-gray-50/50 rounded-xl border border-gray-200 
                focus:border-pink-500 focus:ring-4 focus:ring-pink-500/20 transition-all duration-300"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
              đ
            </span>
          </div>
          <div className="relative">
            <input
              type="number"
              placeholder="Giá tối đa"
              value={priceRange.max}
              onChange={(e) => handlePriceChange("max", e.target.value)}
              className="w-full px-4 py-3 bg-gray-50/50 rounded-xl border border-gray-200 
                focus:border-pink-500 focus:ring-4 focus:ring-pink-500/20 transition-all duration-300"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
              đ
            </span>
          </div>
        </div>
      </motion.div>

      {/* Filter Sections */}
      <div className="space-y-6">
        {filterSections.map((section) => (
          <motion.div
            key={section.id}
            initial={false}
            animate={{ height: activeSection === section.id ? "auto" : "48px" }}
            className="overflow-hidden bg-gray-50/50 rounded-2xl border border-gray-200"
          >
            <motion.button
              whileHover={{ backgroundColor: "rgba(249, 250, 251, 0.9)" }}
              onClick={() =>
                setActiveSection(
                  activeSection === section.id ? null : section.id
                )
              }
              className="w-full px-4 py-3 flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <span className="text-pink-500">{section.icon}</span>
                <span className="font-medium">{section.title}</span>
                {section.selected.length > 0 && (
                  <span className="bg-pink-500 text-white text-xs px-2 py-1 rounded-full">
                    {section.selected.length}
                  </span>
                )}
              </div>
              <motion.span
                animate={{ rotate: activeSection === section.id ? 180 : 0 }}
                transition={{ duration: 0.3 }}
                className="text-gray-400"
              >
                ▼
              </motion.span>
            </motion.button>

            <AnimatePresence>
              {activeSection === section.id && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="px-4 pb-4"
                >
                  <div className="space-y-2">
                    {section.isLoading ? (
                      <div className="flex items-center justify-center py-4">
                        <Spin size="small" />
                      </div>
                    ) : section.options.length > 0 ? (
                      section.options.map((option) => (
                        <motion.div
                          key={option}
                          whileHover={{ x: 4 }}
                          onClick={() =>
                            handleOptionClick(section.type, option)
                          }
                          className="flex items-center gap-3 cursor-pointer p-2 hover:bg-white 
                            rounded-xl transition-all duration-200"
                        >
                          <motion.div
                            initial={false}
                            animate={{
                              backgroundColor: section.selected.includes(option)
                                ? "#EC4899"
                                : "white",
                              borderColor: section.selected.includes(option)
                                ? "#EC4899"
                                : "#D1D5DB",
                            }}
                            className="w-5 h-5 rounded-lg border-2 flex items-center justify-center"
                          >
                            {section.selected.includes(option) && (
                              <CheckOutlined className="text-white text-xs" />
                            )}
                          </motion.div>
                          <span className="text-gray-700">{option}</span>
                        </motion.div>
                      ))
                    ) : (
                      <div className="text-center text-gray-500 py-4">
                        Không có dữ liệu
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
