import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Spin } from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
  toggleWishlist,
  selectWishlistItems,
} from "../../../store/slices/wishlist/wishlistSlice";
import { HeartOutlined, HeartFilled } from "@ant-design/icons";
import { notification } from "antd";
import api from "../../../config/axios/axios";
import endpoints from "../../../constants/endpoint";

export function ProductSlider() {
  const [products, setProducts] = useState([]);
  const [position, setPosition] = useState(0);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const wishlistItems = useSelector(selectWishlistItems);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await api.get(endpoints.GET_PRODUCTS);
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
      notification.error({
        message: "Lỗi",
        description: "Không thể tải danh sách sản phẩm",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (products.length > 0) {
      const interval = setInterval(() => {
        setPosition((prev) => {
          const newPosition = (prev - 1) % (products.length * 320);
          return newPosition;
        });
      }, 50);

      return () => clearInterval(interval);
    }
  }, [products.length]);

  const isInWishlist = (productId) => {
    return wishlistItems.some((item) => item.id === productId);
  };

  const handleWishlistToggle = (product) => {
    dispatch(
      toggleWishlist({
        id: product.productId,
        name: product.productName,
        price: product.price,
        image: product.imageUrl,
        brand: product.brandName,
        description: product.description,
        stock: product.stock > 0,
        discount: product.discount,
        originalPrice: product.originalPrice,
      })
    );
  };

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <section className="py-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold text-center mb-14 tracking-tight">
          <span>Sản phẩm</span>{" "}
          <span className="relative inline-block">
            <span className="text-pink-500 animate-pulse">nổi bật</span>
            <span className="absolute -bottom-2 left-0 w-full h-1 bg-pink-500 rounded-full transform scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100"></span>
          </span>
        </h2>

        <div className="relative">
          {/* Gradient Overlay Left */}
          <div className="absolute left-0 top-0 w-32 h-full bg-gradient-to-r from-rose-50 to-transparent z-10" />

          {/* Slider Container */}
          <div className="relative overflow-hidden">
            <div
              className="flex transition-transform duration-1000 ease-linear"
              style={{ transform: `translateX(${position}px)` }}
            >
              {products.map((product, index) => (
                <div
                  key={`${product.productId}-${index}`}
                  className="flex-none w-80 mx-4"
                >
                  <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 group">
                    <div className="relative h-64 overflow-hidden">
                      <img
                        src={product.imageUrls}
                        alt={product.productName}
                        className="w-full h-full object-cover transition-all duration-300 group-hover:opacity-50 group-hover:scale-110"
                      />

                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                        <Link
                          to={`/product/${product.productId}`}
                          className="px-6 py-3 bg-gradient-to-r from-pink-400 to-purple-500 text-white rounded-full 
                            hover:from-pink-500 hover:to-purple-600 hover:shadow-lg hover:shadow-purple-200/50
                            transition-all duration-300 transform hover:scale-110 font-medium"
                        >
                          Mua ngay
                        </Link>
                      </div>

                      {/* Dark Overlay on Hover */}
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Gradient Overlay Right */}
          <div className="absolute right-0 top-0 w-32 h-full bg-gradient-to-l from-rose-50 to-transparent z-10" />
        </div>
      </div>
    </section>
  );
}
