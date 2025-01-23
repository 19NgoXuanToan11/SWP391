import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Sidebar } from "../../components/sidebar";

export function ProductsPage() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        "https://67825c20c51d092c3dcf2e82.mockapi.io/skincare"
      );
      const data = await response.json();
      setProducts(data);
      setFilteredProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
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
      filtered = filtered.filter(product => {
        // Kiểm tra nếu volume của sản phẩm khớp với bất kỳ volume nào được chọn
        return filters.volumes.some(volume => 
          product.volume && product.volume.toLowerCase() === volume.toLowerCase()
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
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

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
                  No products found
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  Please try different filters
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
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
                        <p>Volume: {product.volume}</p>
                        <p>Skin Type: {product.skinType}</p>
                        {product.keyIngredients && (
                          <p>Key Ingredients: {product.keyIngredients}</p>
                        )}
                      </div>
                      <div className="flex-grow"></div>
                      <div className="mt-4 flex items-center justify-between">
                        <div className="flex flex-col">
                          <span className="text-pink-500 font-bold">
                            {formatPrice(product.price)}
                          </span>
                          {product.originalPrice && (
                            <span className="text-gray-400 line-through text-sm">
                              {formatPrice(product.originalPrice)}
                            </span>
                          )}
                        </div>
                        <button
                          className="bg-pink-500 text-white text-sm font-semibold py-2 px-4 rounded-lg hover:bg-pink-600 transition duration-300 min-w-[100px]"
                          onClick={() => handleBuyNowClick(product.id)}
                        >
                          Buy Now
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
