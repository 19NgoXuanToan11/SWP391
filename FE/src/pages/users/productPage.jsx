import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Sidebar } from "../../components/sidebar";
import { Pagination } from "antd";
import {
  SwapOutlined,
  CloseOutlined,
  HeartOutlined,
  HeartFilled,
  ShoppingCartOutlined,
  LeftOutlined,
  RightOutlined,
} from "@ant-design/icons";
import { Button, Drawer, Table } from "antd";
import { notification } from "antd";
import api from "../../config/axios";
import endpoints from "../../constants/endpoint";
import { useDispatch, useSelector } from "react-redux";
import {
  toggleWishlist,
  selectIsInWishlist,
  selectWishlistItems,
} from "../../store/slices/wishlistSlice";

export function ProductsPage() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 9;
  const [productsToCompare, setProductsToCompare] = useState([]);
  const [isCompareDrawerOpen, setIsCompareDrawerOpen] = useState(false);
  const dispatch = useDispatch();

  // Thêm selector để lấy toàn bộ trạng thái wishlist
  const wishlistItems = useSelector(selectWishlistItems);

  // Function kiểm tra sản phẩm có trong wishlist
  const isProductInWishlist = (productId) => {
    return wishlistItems.some((item) => item.id === productId);
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

  const handleFilterChange = (filters) => {
    let filtered = [...products];

    // Filter by search term
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(
        (product) =>
          product.productName.toLowerCase().includes(searchLower) ||
          product.description.toLowerCase().includes(searchLower) ||
          product.mainIngredients?.toLowerCase().includes(searchLower) ||
          product.brandName?.toLowerCase().includes(searchLower)
      );
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
      console.log("Sorting products by price:", filters.sortOrder);
      filtered.sort((a, b) => {
        const priceA = parseFloat(a.price) || 0;
        const priceB = parseFloat(b.price) || 0;
        return filters.sortOrder === "asc" ? priceA - priceB : priceB - priceA;
      });
    }

    console.log("Filtered and sorted products:", filtered);
    setFilteredProducts(filtered);
    setCurrentPage(1);
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

    notification.success({
      message: "Danh sách yêu thích",
      description: `${product.productName} đã được ${
        isProductInWishlist(product.productId) ? "xóa khỏi" : "thêm vào"
      } danh sách yêu thích`,
      placement: "bottomRight",
    });
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
    { feature: "Còn lại" },
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
      if (row.feature === "Còn lại")
        rowData[product.productId] = `${product.stock} sản phẩm`;
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[1440px] mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-1">
            <Sidebar onFilterChange={handleFilterChange} />
          </div>

          <div className="md:col-span-3">
            {filteredProducts.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-10"
              >
                <h3 className="text-2xl font-medium text-gray-900">
                  Không tìm thấy sản phẩm
                </h3>
                <p className="mt-2 text-gray-500">
                  Vui lòng thử lại với bộ lọc khác
                </p>
              </motion.div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {getCurrentProducts().map((product) => {
                    return (
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
                            onClick={() =>
                              handleProductClick(product.productId)
                            }
                          />
                          {product.discount > 0 && (
                            <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                              -{product.discount}%
                            </div>
                          )}
                          <div className="absolute top-4 right-4 flex flex-col gap-2">
                            <button
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
                            </button>
                            <button
                              className="p-2 bg-white rounded-full shadow-md hover:bg-purple-50 transition-colors"
                              onClick={() => handleCompareToggle(product)}
                            >
                              <SwapOutlined className="text-purple-500 text-xl" />
                            </button>
                          </div>
                        </div>

                        <div className="p-6 flex flex-col flex-grow">
                          <div className="mb-4">
                            <h2
                              className="text-xl font-semibold text-gray-800 hover:text-pink-500 transition-colors cursor-pointer mb-2"
                              onClick={() =>
                                handleProductClick(product.productId)
                              }
                            >
                              {product.productName}
                            </h2>
                            <p className="text-gray-600 line-clamp-2">
                              {product.description}
                            </p>
                          </div>

                          {product.mainIngredients && (
                            <div className="mb-4">
                              <p className="text-sm text-gray-600">
                                <span className="font-medium">
                                  Thành phần chính:{" "}
                                </span>
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
                                      product.price *
                                        (1 + product.discount / 100)
                                    )}
                                  </span>
                                )}
                              </div>
                              <div className="flex gap-2">
                                <button
                                  type="primary"
                                  icon={<ShoppingCartOutlined />}
                                  onClick={() =>
                                    handleBuyNowClick(product.productId)
                                  }
                                  className="flex items-center gap-2 px-2 py-2.5 text-white font-medium rounded-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl active:scale-95"
                                >
                                  <ShoppingCartOutlined className="text-lg" />
                                  <span>Mua ngay</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                <div className="mt-12">
                  <CustomPagination
                    current={currentPage}
                    total={filteredProducts.length}
                    pageSize={pageSize}
                    onChange={handlePageChange}
                  />
                </div>

                <Drawer
                  title={
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-medium">
                        So sánh sản phẩm
                      </span>
                      <span className="text-gray-500 text-sm">
                        {productsToCompare.length}/4 sản phẩm
                      </span>
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
                      <div className="mt-6 flex justify-end gap-4">
                        {productsToCompare.map((product) => (
                          <Button
                            key={product.productId}
                            type="primary"
                            onClick={() => handleBuyNowClick(product.productId)}
                            className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
                          >
                            Mua {product.productName}
                          </Button>
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

                {productsToCompare.length > 0 && (
                  <div className="fixed bottom-8 right-8 z-50">
                    <button
                      onClick={() => setIsCompareDrawerOpen(true)}
                      className="flex items-center gap-2 px-6 py-3 text-white font-medium rounded-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                      <SwapOutlined className="text-xl" />
                      So sánh {productsToCompare.length} sản phẩm
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
