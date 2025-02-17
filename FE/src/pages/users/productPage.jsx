import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Sidebar } from "../../components/sidebar";
import { Pagination } from "antd";
import { SwapOutlined, CloseOutlined } from "@ant-design/icons";
import { Button, Drawer, Table } from "antd";
import { notification } from "antd";

export function ProductsPage() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 9;
  const [productsToCompare, setProductsToCompare] = useState([]);
  const [isCompareDrawerOpen, setIsCompareDrawerOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        "https://6793c6495eae7e5c4d8fd8d4.mockapi.io/api/skincare"
      );
      const data = await response.json();
      const convertedData = data.map((product) => ({
        ...product,
        price: product.price * 24500,
        originalPrice: product.originalPrice
          ? product.originalPrice * 24500
          : null,
      }));
      setProducts(convertedData);
      setFilteredProducts(convertedData);
    } catch (error) {
      console.error("Lỗi khi tải sản phẩm:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (filters) => {
    let filtered = [...products];

    // Filter by search term
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchLower) ||
          product.description.toLowerCase().includes(searchLower) ||
          product.keyIngredients?.toLowerCase().includes(searchLower)
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
    if (filters.brands.length > 0) {
      filtered = filtered.filter((product) =>
        filters.brands.includes(product.brand)
      );
    }

    // Filter by categories
    if (filters.categories.length > 0) {
      filtered = filtered.filter((product) =>
        filters.categories.includes(product.category)
      );
    }

    // Filter by skin types
    if (filters.skinTypes.length > 0) {
      filtered = filtered.filter((product) =>
        filters.skinTypes.includes(product.skinType)
      );
    }

    // Filter by volume
    if (filters.volumes && filters.volumes.length > 0) {
      filtered = filtered.filter((product) => {
        return filters.volumes.some(
          (volume) =>
            product.volume &&
            product.volume.toLowerCase() === volume.toLowerCase()
        );
      });
    }

    setFilteredProducts(filtered);
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
    if (productsToCompare.find((p) => p.id === product.id)) {
      setProductsToCompare(
        productsToCompare.filter((p) => p.id !== product.id)
      );
    } else if (productsToCompare.length < 3) {
      setProductsToCompare([...productsToCompare, product]);
    } else {
      notification.warning({
        message: "Chỉ có thể so sánh tối đa 3 sản phẩm",
        placement: "top",
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
    },
    ...productsToCompare.map((product) => ({
      title: (
        <div className="text-center">
          <img
            src={product.image}
            alt={product.name}
            className="w-20 h-20 object-cover mx-auto mb-2"
          />
          <div>{product.name}</div>
          <Button
            icon={<CloseOutlined />}
            size="small"
            onClick={() => handleCompareToggle(product)}
            className="mt-2"
          />
        </div>
      ),
      dataIndex: product.id,
      key: product.id,
      width: 200,
    })),
  ];

  const compareData = [
    { feature: "Thương hiệu" },
    { feature: "Giá" },
    { feature: "Thể tích" },
    { feature: "Loại da phù hợp" },
    { feature: "Thành phần chính" },
  ].map((row) => {
    const rowData = { ...row };
    productsToCompare.forEach((product) => {
      if (row.feature === "Thương hiệu") rowData[product.id] = product.brand;
      if (row.feature === "Giá")
        rowData[product.id] = formatPrice(product.price);
      if (row.feature === "Thể tích") rowData[product.id] = product.volume;
      if (row.feature === "Loại da phù hợp")
        rowData[product.id] = product.skinType;
      if (row.feature === "Thành phần chính")
        rowData[product.id] = product.keyIngredients;
    });
    return rowData;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Sidebar onFilterChange={handleFilterChange} />

          <div className="col-span-3">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-10">
                <h3 className="text-lg font-medium text-gray-900">
                  Không tìm thấy sản phẩm
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  Vui lòng thử lại với bộ lọc khác
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {getCurrentProducts().map((product) => (
                    <motion.div
                      key={product.id}
                      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow flex flex-col h-full"
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="relative">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-48 object-cover"
                          onClick={() => handleProductClick(product.id)}
                        />
                        {product.discount && (
                          <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-lg">
                            -{product.discount}%
                          </span>
                        )}
                      </div>
                      <div className="p-4 flex flex-col flex-grow">
                        <h2
                          className="text-lg font-semibold text-gray-800 mb-2 cursor-pointer"
                          onClick={() => handleProductClick(product.id)}
                        >
                          {product.name}
                        </h2>
                        <p className="text-sm text-gray-600 mb-2">
                          {product.description}
                        </p>
                        <div className="text-sm text-gray-600 mb-2">
                          <p>Thể Tích: {product.volume}</p>
                          <p>Loại Da: {product.skinType}</p>
                          {product.keyIngredients && (
                            <p>Thành Phần Chính: {product.keyIngredients}</p>
                          )}
                        </div>
                        <div className="flex-grow"></div>
                        <div className="mt-4 flex items-center justify-between">
                          <div className="flex flex-col">
                            <span className="text-pink-500 font-bold text-lg">
                              {formatPrice(product.price)}
                            </span>
                            {product.originalPrice && (
                              <span className="text-gray-400 line-through text-sm">
                                {formatPrice(product.originalPrice)}
                              </span>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <button
                              className="bg-pink-500 text-white text-sm font-semibold py-2 px-4 rounded-lg hover:bg-pink-600 transition duration-300"
                              onClick={() => handleBuyNowClick(product.id)}
                            >
                              Mua Ngay
                            </button>
                            <button
                              className={`p-2 rounded-lg border ${
                                productsToCompare.find(
                                  (p) => p.id === product.id
                                )
                                  ? "bg-purple-500 text-white"
                                  : "border-purple-500 text-purple-500"
                              }`}
                              onClick={() => handleCompareToggle(product)}
                            >
                              <SwapOutlined />
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Pagination */}
                <div className="mt-8 flex justify-center">
                  <Pagination
                    current={currentPage}
                    total={filteredProducts.length}
                    pageSize={pageSize}
                    onChange={handlePageChange}
                    showSizeChanger={false}
                    className="text-pink-500"
                  />
                </div>

                <Drawer
                  title="So sánh sản phẩm"
                  placement="right"
                  width={800}
                  open={isCompareDrawerOpen}
                  onClose={() => setIsCompareDrawerOpen(false)}
                >
                  {productsToCompare.length > 0 ? (
                    <Table
                      columns={compareColumns}
                      dataSource={compareData}
                      pagination={false}
                      bordered
                      scroll={{ x: "max-content" }}
                    />
                  ) : (
                    <div className="text-center py-8">
                      <p>Chưa có sản phẩm nào được chọn để so sánh</p>
                    </div>
                  )}
                </Drawer>

                {productsToCompare.length > 0 && (
                  <div className="fixed bottom-8 right-8">
                    <button
                      type="primary"
                      size="large"
                      icon={<SwapOutlined />}
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
