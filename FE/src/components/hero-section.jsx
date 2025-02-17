import { useState } from "react";
import img1 from "../assets/pictures/1.jpg";
import img2 from "../assets/pictures/2.jpg";
import img3 from "../assets/pictures/3.jpg";
import img4 from "../assets/pictures/4.jpg";
import img5 from "../assets/pictures/5.jpg";
import img6 from "../assets/pictures/6.jpg";
import img7 from "../assets/pictures/7.jpg";
import img8 from "../assets/pictures/8.jpg";
import { Link } from "react-router-dom";

export function HeroSection() {
  const [hoveredImage, setHoveredImage] = useState(null);

  const imageCollections = [
    { default: img1, hover: img5 },
    { default: img2, hover: img6 },
    { default: img3, hover: img7 },
    { default: img4, hover: img8 },
  ];

  return (
    <section className="relative bg-gradient-to-br from-mint-50 to-pink-50 py-20">
      {/* Trang trí nền */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-pink-100 rounded-full opacity-20 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-mint-100 rounded-full opacity-20 blur-3xl" />
      </div>

      <div className="relative container mx-auto px-4 z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Nội dung văn bản */}
          <div className="space-y-10">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl xl:text-7xl font-bold text-gray-900 leading-tight tracking-tight">
                Khám Phá <br />
                <span className="bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
                  Vẻ Đẹp Tự Nhiên
                </span>
              </h1>
              <p className="text-lg text-gray-600 md:text-xl max-w-2xl leading-relaxed">
                Bắt đầu hành trình chăm sóc da biến đổi được thiết kế riêng cho
                bạn. Các chuyên gia thẩm mỹ của chúng tôi tạo ra những nghi lễ
                làm đẹp độc đáo giúp nuôi dưỡng và nâng cao vẻ rạng rỡ tự nhiên
                của làn da bạn.
              </p>
            </div>

            {/* Nút CTA */}

            <div className="flex flex-wrap gap-6">
              <Link to="/product">
                <button className="px-10 py-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full font-medium shadow-lg shadow-pink-500/25 hover:shadow-xl hover:shadow-pink-500/40 transition-all duration-300">
                  Bắt Đầu Hành Trình Của Bạn
                </button>
              </Link>
              <Link to="/quiz-landing">
                <button className="px-10 py-4 bg-white/80 backdrop-blur-sm border border-pink-100 text-gray-900 rounded-full font-medium hover:bg-white hover:border-pink-200 hover:scale-105 hover:shadow-lg transition-all duration-300">
                  Khám Phá Dịch Vụ
                </button>
              </Link>
            </div>
          </div>

          {/* Lưới hình ảnh */}
          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              {imageCollections.map((collection, index) => (
                <div
                  key={index}
                  className="group relative aspect-square overflow-hidden rounded-2xl shadow-lg transition-transform duration-300 hover:scale-105"
                  onMouseEnter={() => setHoveredImage(index)}
                  onMouseLeave={() => setHoveredImage(null)}
                >
                  {/* Hình ảnh mặc định */}
                  <img
                    src={collection.default}
                    alt={`Điều Trị Da ${index + 1}`}
                    className={`h-full w-full object-cover transition-opacity duration-500 ${
                      hoveredImage === index ? "opacity-0" : "opacity-100"
                    }`}
                    style={{ position: "absolute", top: 0, left: 0 }}
                  />

                  {/* Hình ảnh khi di chuột */}
                  <img
                    src={collection.hover}
                    alt={`Điều Trị Da ${index + 1} Khi Di Chuột`}
                    className={`h-full w-full object-cover transition-opacity duration-500 ${
                      hoveredImage === index ? "opacity-100" : "opacity-0"
                    }`}
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
