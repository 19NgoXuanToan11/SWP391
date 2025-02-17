import { useEffect, useState } from "react";
import vitaminC from "../assets/pictures/vitamin_C_serum.jpg";
import hyaluronic from "../assets/pictures/hyaluronic_acid.jpg";
import retinol from "../assets/pictures/retinol_cream.jpg";
import niacinamide from "../assets/pictures/niacinamide_serum.jpg";
import sunscreen from "../assets/pictures/sunscreen_SPF_50.jpg";
import { Link } from "react-router-dom";

const products = [
  {
    id: 1,
    name: "Serum Vitamin C",
    price: "890.000đ",
    image: vitaminC,
    description: "Serum làm sáng da",
  },
  {
    id: 2,
    name: "Hyaluronic Acid",
    price: "750.000đ",
    image: hyaluronic,
    description: "Serum cấp ẩm sâu",
  },
  {
    id: 3,
    name: "Kem Retinol",
    price: "1.290.000đ",
    image: retinol,
    description: "Kem chống lão hóa",
  },
  {
    id: 4,
    name: "Serum Niacinamide",
    price: "690.000đ",
    image: niacinamide,
    description: "Serum se khít lỗ chân lông",
  },
  {
    id: 5,
    name: "Kem Chống Nắng SPF 50",
    price: "540.000đ",
    image: sunscreen,
    description: "Kem chống nắng bảo vệ da",
  },
];

export function ProductSlider() {
  const [position, setPosition] = useState(0);

  useEffect(() => {
    // Log để kiểm tra vị trí
    console.log("Vị trí hiện tại:", position);

    const interval = setInterval(() => {
      setPosition((prev) => {
        const newPosition = (prev - 1) % (products.length * 320);
        console.log("Vị trí mới:", newPosition);
        return newPosition;
      });
    }, 50);

    return () => clearInterval(interval);
  }, []);

  // Log để kiểm tra sản phẩm
  console.log("Sản phẩm:", products);
  console.log("Hình ảnh sản phẩm đầu tiên:", products[0].image);

  return (
    <section className="py-16 overflow-hidden bg-gradient-to-r from-rose-50 to-pink-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-12">
          <span className="font-bold text-pink-500">Sản phẩm</span> Bán Chạy
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
              {/* Nhân đôi mảng sản phẩm để tạo hiệu ứng cuộn vô hạn */}
              {[...products, ...products, ...products].map((product, index) => {
                console.log(
                  "Đang hiển thị sản phẩm:",
                  product.name,
                  "với hình ảnh:",
                  product.image
                );
                return (
                  <div
                    key={`${product.id}-${index}`}
                    className="flex-none w-80 mx-4"
                  >
                    <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                      <div className="relative h-64">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover"
                          onError={(e) =>
                            console.error("Hình ảnh không thể tải:", e)
                          }
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                      <div className="p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {product.name}
                        </h3>
                        <p className="text-gray-600 mb-4">
                          {product.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-pink-500 font-bold">
                            {product.price}
                          </span>
                          <Link
                            to={`/product`}
                            className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors duration-300"
                          >
                            Mua ngay
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Gradient Overlay Right */}
          <div className="absolute right-0 top-0 w-32 h-full bg-gradient-to-l from-rose-50 to-transparent z-10" />
        </div>
      </div>
    </section>
  );
}
