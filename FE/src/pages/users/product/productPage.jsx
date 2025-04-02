import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Sidebar } from "../../../components/sidebar/sidebar";
import { Pagination, Empty, Spin } from "antd";
import {
  SwapOutlined,
  CloseOutlined,
  HeartOutlined,
  HeartFilled,
  ShoppingCartOutlined,
  LeftOutlined,
  RightOutlined,
  DeleteOutlined,
  FilterOutlined,
  AppstoreOutlined,
  BarsOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { Button, Drawer, Table, Badge, Tooltip, Input, Select } from "antd";
import { notification } from "antd";
import api from "../../../config/axios/axios";
import endpoints from "../../../constants/endpoint";
import { useDispatch, useSelector } from "react-redux";
import {
  toggleWishlist,
  selectIsInWishlist,
  selectWishlistItems,
} from "../../../store/slices/wishlist/wishlistSlice";

export default function ProductsPage() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 9;
  const [productsToCompare, setProductsToCompare] = useState([]);
  const [isCompareDrawerOpen, setIsCompareDrawerOpen] = useState(false);
  const [viewMode, setViewMode] = useState("grid"); // grid or list
  const [mobileSidebarVisible, setMobileSidebarVisible] = useState(false);
  const [quickSearchTerm, setQuickSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("default");
  const dispatch = useDispatch();

  // Thêm selector để lấy toàn bộ trạng thái wishlist
  const wishlistItems = useSelector(selectWishlistItems);

  // Function kiểm tra sản phẩm có trong wishlist
  const isProductInWishlist = (productId) => {
    return wishlistItems.some((item) => item.id === productId);
  };

  // Thêm hàm chuyển đổi chuỗi tiếng Việt sang không dấu
  const removeAccents = (str) => {
    if (!str) return "";
    return str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
  };

  // Thêm hàm fuzzy search
  const fuzzySearch = (query, text) => {
    if (!query) return true;

    // Chuyển đổi cả query và text về chữ thường không dấu
    const normalizedQuery = removeAccents(query);
    const normalizedText = removeAccents(text);

    return normalizedText.includes(normalizedQuery);
  };

  // Thêm hàm getSearchSuggestions giống như trong sidebar
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

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await api.get(endpoints.GET_PRODUCTS);
      setProducts(response.data);
      setFilteredProducts(response.data);
    } catch (error) {
      console.error("Lỗi khi tải sản phẩm:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchProducts();
  }, []);

  // Xử lý quick search
  useEffect(() => {
    if (quickSearchTerm.trim() === "") {
      // Nếu không có từ khóa tìm kiếm, hiển thị tất cả sản phẩm
      setFilteredProducts(products);
    } else {
      // Lọc sản phẩm theo từ khóa tìm kiếm với fuzzy search
      const filtered = products.filter((product) => {
        const searchableText =
          (product.productName || "") +
          " " +
          (product.description || "") +
          " " +
          (product.mainIngredients || "") +
          " " +
          (product.brandName || "");

        return fuzzySearch(quickSearchTerm, searchableText);
      });
      setFilteredProducts(filtered);
    }
    setCurrentPage(1);
  }, [quickSearchTerm, products]);

  // Xử lý sắp xếp nhanh
  useEffect(() => {
    let sorted = [...filteredProducts];

    switch (sortOption) {
      case "price-asc":
        sorted.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        sorted.sort((a, b) => b.price - a.price);
        break;
      case "name-asc":
        sorted.sort((a, b) => a.productName.localeCompare(b.productName));
        break;
      case "name-desc":
        sorted.sort((a, b) => b.productName.localeCompare(a.productName));
        break;
      default:
        // Không sắp xếp
        break;
    }

    setFilteredProducts(sorted);
  }, [sortOption]);

  const handleFilterChange = (filters) => {
    let filtered = [...products];

    // Filter by search term với fuzzy search
    if (filters.searchTerm) {
      filtered = filtered.filter((product) => {
        // Tạo chuỗi tìm kiếm từ các thông tin sản phẩm
        const searchableText =
          (product.productName || "") +
          " " +
          (product.description || "") +
          " " +
          (product.mainIngredients || "") +
          " " +
          (product.brandName || "");

        // Áp dụng fuzzy search
        return fuzzySearch(filters.searchTerm, searchableText);
      });
    }

    // Filter by price range
    if (filters.priceRange.min !== "") {
      filtered = filtered.filter(
        (product) => product.price >= parseFloat(filters.priceRange.min)
      );
    }
    if (filters.priceRange.max !== "") {
      filtered = filtered.filter(
        (product) => product.price <= parseFloat(filters.priceRange.max)
      );
    }

    // Filter by brands
    if (filters.brands && filters.brands.length > 0) {
      filtered = filtered.filter((product) =>
        filters.brands.includes(product.brandName)
      );
    }

    // Filter by categories
    if (filters.categories && filters.categories.length > 0) {
      filtered = filtered.filter((product) =>
        filters.categories.includes(product.categoryName)
      );
    }

    // Filter by skin types
    if (filters.skinTypes && filters.skinTypes.length > 0) {
      filtered = filtered.filter((product) =>
        filters.skinTypes.includes(product.skinTypeName)
      );
    }

    // Filter by volume
    if (filters.volumes && filters.volumes.length > 0) {
      filtered = filtered.filter((product) =>
        filters.volumes.includes(product.volumeName)
      );
    }

    // Sort by price
    if (filters.sortOrder) {
      filtered.sort((a, b) => {
        const priceA = parseFloat(a.price) || 0;
        const priceB = parseFloat(b.price) || 0;
        return filters.sortOrder === "asc" ? priceA - priceB : priceB - priceA;
      });
    }

    setFilteredProducts(filtered);
    setCurrentPage(1);

    // Đóng sidebar trên mobile sau khi áp dụng bộ lọc
    setMobileSidebarVisible(false);
  };

  const handleProductClick = (productId) => {
    if (productId) navigate(`/product/${productId}`);
  };

  const handleBuyNowClick = (productId) => {
    if (productId) navigate(`/product/${productId}`);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  // Tính toán sản phẩm cho trang hiện tại
  const getCurrentProducts = () => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredProducts.slice(startIndex, endIndex);
  };

  // Xử lý thay đổi trang
  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0); // Cuộn lên đầu trang khi chuyển trang
  };

  const handleCompareToggle = (product) => {
    if (productsToCompare.find((p) => p.productId === product.productId)) {
      setProductsToCompare(
        productsToCompare.filter((p) => p.productId !== product.productId)
      );
    } else if (productsToCompare.length < 4) {
      setProductsToCompare([...productsToCompare, product]);
    } else {
      notification.warning({
        message: "Giới hạn so sánh",
        description: "Bạn chỉ có thể so sánh tối đa 4 sản phẩm",
        placement: "top",
      });
    }
  };

  const handleWishlistToggle = (product) => {
    const isCurrentlyInWishlist = isProductInWishlist(product.productId);

    dispatch(
      toggleWishlist({
        id: product.productId,
        name: product.productName,
        price: product.price,
        image: product.imageUrls,
        brand: product.brandName,
        description: product.description,
        stock: product.stock > 0,
        discount: product.discount,
        originalPrice: product.originalPrice,
        rating: product.rating,
      })
    );

    if (isCurrentlyInWishlist) {
      // Thông báo xóa khỏi danh sách yêu thích
      notification.error({
        description: (
          <div className="flex items-center space-x-3">
            <img
              src={product.imageUrls}
              alt={product.productName}
              className="w-12 h-12 rounded-lg object-cover"
            />
            <div>
              <p className="font-medium">{product.productName}</p>
              <p className="text-red-600">Đã xóa khỏi danh sách yêu thích</p>
            </div>
          </div>
        ),
        placement: "bottomRight",
        duration: 3,
        className: "custom-notification-error",
        style: {
          borderRadius: "16px",
        },
      });
    } else {
      // Thông báo thêm vào danh sách yêu thích
      notification.success({
        description: (
          <div className="flex items-center space-x-3">
            <img
              src={product.imageUrls}
              alt={product.productName}
              className="w-12 h-12 rounded-lg object-cover"
            />
            <div>
              <p className="font-medium">{product.productName}</p>
              <p className="text-green-600">Đã thêm vào danh sách yêu thích</p>
            </div>
          </div>
        ),
        placement: "bottomRight",
        duration: 3,
        className: "custom-notification-success",
        style: {
          borderRadius: "16px",
        },
      });
    }
  };

  const compareColumns = [
    {
      title: "Thông tin",
      dataIndex: "feature",
      key: "feature",
      width: 150,
      fixed: "left",
      className: "bg-gray-50 font-medium",
    },
    ...productsToCompare.map((product) => ({
      title: (
        <div className="text-center p-4">
          <div className="relative group">
            <img
              src={product.imageUrls}
              alt={product.productName}
              className="w-32 h-32 object-cover mx-auto rounded-lg shadow-md"
            />
            <Button
              icon={<CloseOutlined />}
              size="small"
              onClick={() => handleCompareToggle(product)}
              className="absolute -top-2 -right-2 rounded-full shadow-md hover:bg-red-500 hover:text-white transition-colors"
            />
          </div>
          <h3 className="mt-4 font-medium text-gray-800">
            {product.productName}
          </h3>
          <p className="text-pink-600 font-bold mt-2">
            {formatPrice(product.price)}
          </p>
        </div>
      ),
      dataIndex: product.productId,
      key: product.productId,
      width: 250,
      align: "center",
    })),
  ];

  const compareData = [
    { feature: "Thương hiệu" },
    { feature: "Giá" },
    { feature: "Thể tích" },
    { feature: "Loại da phù hợp" },
    { feature: "Danh mục" },
    { feature: "Thành phần chính" },
    { feature: "Mô tả" },
  ].map((row) => {
    const rowData = { ...row };
    productsToCompare.forEach((product) => {
      if (row.feature === "Thương hiệu")
        rowData[product.productId] = product.brandName;
      if (row.feature === "Giá")
        rowData[product.productId] = formatPrice(product.price);
      if (row.feature === "Thể tích")
        rowData[product.productId] = product.volumeName;
      if (row.feature === "Loại da phù hợp")
        rowData[product.productId] = product.skinTypeName;
      if (row.feature === "Danh mục")
        rowData[product.productId] = product.categoryName;
      if (row.feature === "Thành phần chính")
        rowData[product.productId] = product.mainIngredients;
      if (row.feature === "Mô tả")
        rowData[product.productId] = product.description;
    });
    return rowData;
  });

  // Custom Pagination component
  const CustomPagination = ({ current, total, pageSize, onChange }) => {
    const totalPages = Math.ceil(total / pageSize);

    const getPageNumbers = () => {
      let pages = [];
      if (totalPages <= 5) {
        // Hiển thị tất cả các trang nếu tổng số trang <= 5
        for (let i = 1; i <= totalPages; i++) pages.push(i);
      } else {
        // Logic cho pagination dài
        if (current <= 3) {
          pages = [1, 2, 3, 4, "...", totalPages];
        } else if (current >= totalPages - 2) {
          pages = [
            1,
            "...",
            totalPages - 3,
            totalPages - 2,
            totalPages - 1,
            totalPages,
          ];
        } else {
          pages = [
            1,
            "...",
            current - 1,
            current,
            current + 1,
            "...",
            totalPages,
          ];
        }
      }
      return pages;
    };

    return (
      <div className="flex items-center justify-center gap-2">
        {/* Previous Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => current > 1 && onChange(current - 1)}
          disabled={current === 1}
          className={`px-4 py-2 rounded-xl font-medium transition-all duration-200
            ${
              current === 1
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-white text-gray-700 hover:bg-pink-50 hover:text-pink-500 shadow-sm hover:shadow-md"
            }`}
        >
          <span className="flex items-center gap-1">
            <LeftOutlined className="text-xs" />
            Trước
          </span>
        </motion.button>

        {/* Page Numbers */}
        <div className="flex items-center gap-2">
          {getPageNumbers().map((page, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => typeof page === "number" && onChange(page)}
              className={`min-w-[40px] h-10 flex items-center justify-center rounded-xl font-medium 
                transition-all duration-200 ${
                  page === current
                    ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg shadow-pink-500/25"
                    : typeof page === "number"
                    ? "bg-white text-gray-700 hover:bg-pink-50 hover:text-pink-500 shadow-sm hover:shadow-md"
                    : "bg-transparent text-gray-400"
                }`}
            >
              {page}
            </motion.button>
          ))}
        </div>

        {/* Next Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => current < totalPages && onChange(current + 1)}
          disabled={current === totalPages}
          className={`px-4 py-2 rounded-xl font-medium transition-all duration-200
            ${
              current === totalPages
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-white text-gray-700 hover:bg-pink-50 hover:text-pink-500 shadow-sm hover:shadow-md"
            }`}
        >
          <span className="flex items-center gap-1">
            Sau
            <RightOutlined className="text-xs" />
          </span>
        </motion.button>
      </div>
    );
  };

  // Render sản phẩm dạng grid
  const renderGridView = () => {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {getCurrentProducts().map((product) => (
          <motion.div
            key={product.productId}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full overflow-hidden group"
          >
            <div className="relative overflow-hidden">
              <img
                src={product.imageUrls}
                alt={product.productName}
                className="w-full h-64 object-cover transform group-hover:scale-110 transition-transform duration-500"
                onClick={() => handleProductClick(product.productId)}
              />
              {product.discount > 0 && (
                <div className="absolute top-4 left-4 bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg">
                  -{product.discount}%
                </div>
              )}
              <div className="absolute top-4 right-4 flex flex-col gap-2">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 bg-white rounded-full shadow-md hover:bg-pink-50 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleWishlistToggle(product);
                  }}
                >
                  {isProductInWishlist(product.productId) ? (
                    <HeartFilled className="text-pink-500 text-xl" />
                  ) : (
                    <HeartOutlined className="text-gray-500 hover:text-pink-500 text-xl" />
                  )}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className={`p-2 rounded-full shadow-md transition-all duration-300 ${
                    productsToCompare.find(
                      (p) => p.productId === product.productId
                    )
                      ? "bg-purple-500 text-white"
                      : "bg-white hover:bg-purple-50"
                  }`}
                  onClick={() => handleCompareToggle(product)}
                >
                  <SwapOutlined
                    className={`text-xl ${
                      productsToCompare.find(
                        (p) => p.productId === product.productId
                      )
                        ? "text-white"
                        : "text-purple-500"
                    }`}
                  />
                </motion.button>
              </div>
            </div>

            <div className="p-6 flex flex-col flex-grow">
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <h2
                    className="text-xl font-semibold text-gray-800 hover:text-pink-500 transition-colors cursor-pointer line-clamp-2"
                    onClick={() => handleProductClick(product.productId)}
                  >
                    {product.productName}
                  </h2>
                </div>
                <p className="text-gray-600 line-clamp-2 text-sm">
                  {product.description}
                </p>
              </div>

              {product.brandName && (
                <div className="mb-3">
                  <span className="inline-block px-3 py-1 bg-pink-50 text-pink-600 rounded-full text-xs font-medium">
                    {product.brandName}
                  </span>
                </div>
              )}

              {product.mainIngredients && (
                <div className="mb-4">
                  <p className="text-sm text-gray-600 line-clamp-1">
                    <span className="font-medium">Thành phần chính: </span>
                    {product.mainIngredients}
                  </p>
                </div>
              )}

              <div className="mt-auto">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-2xl font-bold text-pink-600">
                      {formatPrice(product.price)}
                    </span>
                    {product.discount > 0 && (
                      <span className="text-sm text-gray-400 line-through">
                        {formatPrice(
                          product.price * (1 + product.discount / 100)
                        )}
                      </span>
                    )}
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleBuyNowClick(product.productId)}
                    className="flex items-center gap-2 px-4 py-2.5 text-white font-medium rounded-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 transition-all duration-300 shadow-lg hover:shadow-xl"
                    disabled={product.stock <= 0}
                  >
                    <ShoppingCartOutlined className="text-lg" />
                    <span>Mua ngay</span>
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    );
  };

  // Render sản phẩm dạng list
  const renderListView = () => {
    return (
      <div className="flex flex-col gap-6">
        {getCurrentProducts().map((product) => (
          <motion.div
            key={product.productId}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group"
          >
            <div className="flex flex-col md:flex-row">
              <div className="relative md:w-1/3 overflow-hidden">
                <img
                  src={product.imageUrls}
                  alt={product.productName}
                  className="w-full h-64 md:h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                  onClick={() => handleProductClick(product.productId)}
                />
                {product.discount > 0 && (
                  <div className="absolute top-4 left-4 bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg">
                    -{product.discount}%
                  </div>
                )}

                {/* Badge hiển thị trạng thái sản phẩm */}
                {product.stock <= 0 && (
                  <div className="absolute bottom-4 left-4 bg-gray-800 bg-opacity-80 text-white px-3 py-1 rounded-lg text-sm">
                    Hết hàng
                  </div>
                )}
                {product.stock > 0 && product.stock <= 5 && (
                  <div className="absolute bottom-4 left-4 bg-orange-500 bg-opacity-80 text-white px-3 py-1 rounded-lg text-sm">
                    Sắp hết hàng
                  </div>
                )}
              </div>

              <div className="md:w-2/3 p-6 flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2
                      className="text-xl font-semibold text-gray-800 hover:text-pink-500 transition-colors cursor-pointer mb-2"
                      onClick={() => handleProductClick(product.productId)}
                    >
                      {product.productName}
                    </h2>

                    {product.brandName && (
                      <span className="inline-block px-3 py-1 bg-pink-50 text-pink-600 rounded-full text-xs font-medium mb-2">
                        {product.brandName}
                      </span>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-2 bg-white rounded-full shadow-md hover:bg-pink-50 transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleWishlistToggle(product);
                      }}
                    >
                      {isProductInWishlist(product.productId) ? (
                        <HeartFilled className="text-pink-500 text-xl" />
                      ) : (
                        <HeartOutlined className="text-gray-500 hover:text-pink-500 text-xl" />
                      )}
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className={`p-2 rounded-full shadow-md transition-all duration-300 ${
                        productsToCompare.find(
                          (p) => p.productId === product.productId
                        )
                          ? "bg-purple-500 text-white"
                          : "bg-white hover:bg-purple-50"
                      }`}
                      onClick={() => handleCompareToggle(product)}
                    >
                      <SwapOutlined
                        className={`text-xl ${
                          productsToCompare.find(
                            (p) => p.productId === product.productId
                          )
                            ? "text-white"
                            : "text-purple-500"
                        }`}
                      />
                    </motion.button>
                  </div>
                </div>

                <p className="text-gray-600 mb-4 line-clamp-3">
                  {product.description}
                </p>

                {product.mainIngredients && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Thành phần chính: </span>
                      {product.mainIngredients}
                    </p>
                  </div>
                )}

                <div className="mt-auto flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-2xl font-bold text-pink-600">
                      {formatPrice(product.price)}
                    </span>
                    {product.discount > 0 && (
                      <span className="text-sm text-gray-400 line-through">
                        {formatPrice(
                          product.price * (1 + product.discount / 100)
                        )}
                      </span>
                    )}
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleBuyNowClick(product.productId)}
                    className="flex items-center gap-2 px-4 py-2.5 text-white font-medium rounded-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 transition-all duration-300 shadow-lg hover:shadow-xl"
                    disabled={product.stock <= 0}
                  >
                    <ShoppingCartOutlined className="text-lg" />
                    <span>Mua ngay</span>
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    );
  };

  // Loading state với hiệu ứng đẹp mắt
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="relative w-24 h-24">
          <div className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-pink-200 opacity-20"></div>
          <div className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-t-pink-500 animate-spin"></div>
        </div>
        <p className="mt-6 text-pink-600 font-medium">Đang tải sản phẩm...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br">
      <div className="max-w-[1440px] mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Sidebar cho desktop */}
          <div className="hidden md:block md:col-span-1">
            <Sidebar onFilterChange={handleFilterChange} />
          </div>

          {/* Sidebar cho mobile */}
          <Drawer
            title="Bộ lọc sản phẩm"
            placement="left"
            onClose={() => setMobileSidebarVisible(false)}
            open={mobileSidebarVisible}
            width={300}
          >
            <Sidebar onFilterChange={handleFilterChange} />
          </Drawer>

          <div className="md:col-span-3">
            {/* Hiển thị số lượng sản phẩm và kết quả tìm kiếm */}
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-2xl font-bold text-gray-800 mb-2 sm:mb-0">
                Sản phẩm
                {quickSearchTerm && (
                  <span className="text-lg font-normal text-gray-500 ml-2">
                    - Kết quả tìm kiếm cho "{quickSearchTerm}"
                  </span>
                )}
              </h2>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-lg">
                  <Tooltip title="Xem dạng lưới">
                    <Button
                      icon={<AppstoreOutlined />}
                      type={viewMode === "grid" ? "primary" : "text"}
                      onClick={() => setViewMode("grid")}
                      className={
                        viewMode === "grid" ? "bg-pink-500 text-white" : ""
                      }
                    />
                  </Tooltip>
                  <Tooltip title="Xem dạng danh sách">
                    <Button
                      icon={<BarsOutlined />}
                      type={viewMode === "list" ? "primary" : "text"}
                      onClick={() => setViewMode("list")}
                      className={
                        viewMode === "list" ? "bg-pink-500 text-white" : ""
                      }
                    />
                  </Tooltip>
                </div>
                <p className="text-gray-500">
                  Hiển thị {filteredProducts.length} sản phẩm
                </p>
              </div>
            </div>

            {filteredProducts.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white rounded-xl shadow-sm p-10 text-center"
              >
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description={
                    <div>
                      <p className="text-lg font-medium text-gray-800 mb-2">
                        Không tìm thấy sản phẩm
                      </p>
                      <p className="text-gray-500">
                        Vui lòng thử lại với bộ lọc khác
                      </p>
                    </div>
                  }
                />

                {/* Phần đề xuất tìm kiếm khi không tìm thấy kết quả */}
                {quickSearchTerm &&
                  getSearchSuggestions(quickSearchTerm).length > 0 && (
                    <div className="mt-6 mb-4">
                      <p className="text-gray-700 font-medium mb-3">
                        Bạn có thể đang tìm:
                      </p>
                      <div className="flex flex-wrap justify-center gap-2">
                        {getSearchSuggestions(quickSearchTerm).map(
                          (suggestion, index) => (
                            <motion.button
                              key={index}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => {
                                setQuickSearchTerm(suggestion);
                              }}
                              className="px-4 py-2 bg-pink-50 text-pink-600 rounded-full hover:bg-pink-100 transition-colors"
                            >
                              {suggestion}
                            </motion.button>
                          )
                        )}
                      </div>
                    </div>
                  )}

                <Button
                  type="primary"
                  onClick={() => {
                    setQuickSearchTerm("");
                    setSortOption("default");
                    handleFilterChange({});
                  }}
                  className="mt-4 bg-pink-500 hover:bg-pink-600 border-none rounded-full px-6 py-2 h-auto"
                >
                  Xóa bộ lọc
                </Button>
              </motion.div>
            ) : (
              <>
                <AnimatePresence mode="wait">
                  {viewMode === "grid" ? renderGridView() : renderListView()}
                </AnimatePresence>

                <div className="mt-12">
                  <CustomPagination
                    current={currentPage}
                    total={filteredProducts.length}
                    pageSize={pageSize}
                    onChange={handlePageChange}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Nút so sánh sản phẩm */}
      <AnimatePresence>
        {productsToCompare.length > 0 && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-8 right-8 z-50"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsCompareDrawerOpen(true)}
              className="flex items-center gap-2 px-6 py-3 text-white font-medium rounded-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <div className="flex items-center">
                <SwapOutlined className="text-xl" />
                <span className="ml-2 bg-white/20 px-2 py-0.5 rounded-full text-sm">
                  {productsToCompare.length}/4
                </span>
              </div>
              <span className="ml-1">So sánh sản phẩm</span>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Drawer so sánh sản phẩm */}
      <Drawer
        title={
          <div className="flex items-center justify-between">
            <span className="text-xl font-medium">So sánh sản phẩm</span>
          </div>
        }
        placement="right"
        width={Math.min(1200, window.innerWidth * 0.8)}
        open={isCompareDrawerOpen}
        onClose={() => setIsCompareDrawerOpen(false)}
        className="compare-drawer"
      >
        {productsToCompare.length > 0 ? (
          <div className="overflow-x-auto">
            <Table
              columns={compareColumns}
              dataSource={compareData}
              pagination={false}
              bordered
              scroll={{ x: "max-content" }}
              className="compare-table"
              rowClassName={(record, index) =>
                index % 2 === 0 ? "bg-white" : "bg-gray-50"
              }
            />
            <div className="mt-6 flex flex-wrap justify-end gap-4">
              {productsToCompare.map((product) => (
                <motion.button
                  key={product.productId}
                  whileHover={{ y: -3 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleBuyNowClick(product.productId)}
                  className="px-4 py-2 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-medium shadow-md hover:shadow-lg transform transition-all duration-300 flex items-center gap-2"
                >
                  <ShoppingCartOutlined />
                  <span>Mua {product.productName}</span>
                </motion.button>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">
              <SwapOutlined />
            </div>
            <p className="text-gray-600">
              Chưa có sản phẩm nào được chọn để so sánh
            </p>
            <p className="text-gray-400 text-sm mt-2">
              Hãy chọn tối đa 4 sản phẩm để so sánh
            </p>
          </div>
        )}
      </Drawer>
    </div>
  );
}
