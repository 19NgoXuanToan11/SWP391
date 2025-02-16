import oilySkin from "../assets/pictures/oily_skin.jpg";
import drySkin from "../assets/pictures/dry_skin.jpg";
import combinationSkin from "../assets/pictures/combination_skin.jpg";
import { Link } from "react-router-dom";

export function SkinTypes() {
  const skinTypes = [
    {
      title: "Da Dầu",
      description:
        "Sản xuất nhiều dầu nhờn, dẫn đến da bóng và lỗ chân lông to.",
      symptoms: [
        "Da bóng dầu",
        "Lỗ chân lông to",
        "Dễ nổi mụn",
        "Kết cấu da dày",
      ],
      recommendations: [
        "Sử dụng sản phẩm không dầu",
        "Thử acid salicylic",
        "Tẩy tế bào chết thường xuyên",
      ],
      image: oilySkin,
      color: "rose",
    },
    {
      title: "Da Khô",
      description:
        "Thiếu độ ẩm tự nhiên, dẫn đến cảm giác căng và có thể bong tróc.",
      symptoms: [
        "Bề mặt da sần sùi",
        "Bong tróc",
        "Cảm giác căng",
        "Nếp nhăn rõ ràng",
      ],
      recommendations: [
        "Kem dưỡng ẩm đậm đặc",
        "Sữa rửa mặt dịu nhẹ",
        "Serum dưỡng ẩm",
      ],
      image: drySkin,
      color: "amber",
    },
    {
      title: "Da Hỗn Hợp",
      description:
        "Kết hợp giữa vùng da dầu và khô, thường dầu ở vùng chữ T và khô ở má.",
      symptoms: [
        "Vùng chữ T dầu",
        "Má khô",
        "Lỗ chân lông kích thước không đều",
        "Thỉnh thoảng nổi mụn",
      ],
      recommendations: [
        "Chăm sóc theo từng vùng",
        "Sản phẩm cân bằng",
        "Cân bằng da nhẹ nhàng",
      ],
      image: combinationSkin,
      color: "pink",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-50 py-16 px-4 sm:px-6 lg:px-8">
      {/* Phần Tiêu Đề */}
      <div className="max-w-7xl mx-auto text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
          Tìm Hiểu <span className="text-pink-500">Loại Da Của Bạn</span>
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Khám phá loại da của bạn và nhận được những khuyến nghị phù hợp cho
          quy trình chăm sóc da hoàn hảo.
        </p>
      </div>

      {/* Lưới Các Loại Da */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {skinTypes.map((type) => (
          <div
            key={type.title}
            className="group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
          >
            {/* Phần Hình Ảnh */}
            <div className="relative h-64 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
              <img
                src={type.image}
                alt={type.title}
                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
              />
              <h3 className="absolute bottom-4 left-6 text-2xl font-bold text-white z-20">
                {type.title}
              </h3>
            </div>

            {/* Nội Dung */}
            <div className="p-6 space-y-6">
              <p className="text-gray-600 leading-relaxed">
                {type.description}
              </p>

              {/* Triệu Chứng */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3">
                  Triệu Chứng Phổ Biến
                </h4>
                <ul className="space-y-2">
                  {type.symptoms.map((symptom) => (
                    <li
                      key={symptom}
                      className="flex items-center text-gray-600"
                    >
                      <svg
                        className="w-5 h-5 text-pink-400 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      {symptom}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Khuyến Nghị */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3">
                  Khuyến Nghị
                </h4>
                <ul className="space-y-2">
                  {type.recommendations.map((rec) => (
                    <li key={rec} className="flex items-center text-gray-600">
                      <svg
                        className="w-5 h-5 text-rose-400 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M13 10V3L4 14h7v7l9-11h-7z"
                        />
                      </svg>
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Nút Hành Động */}
              <button className="w-full py-3 px-4 bg-gradient-to-r from-rose-400 to-pink-500 text-white rounded-xl font-medium hover:from-rose-500 hover:to-pink-600 transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2">
                Tìm Hiểu Thêm
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Kêu Gọi Hành Động */}
      <div className="max-w-3xl mx-auto mt-16 text-center">
        <div className="bg-pink-50 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Chưa chắc chắn về loại da của bạn?
          </h2>
          <p className="text-gray-600 mb-6">
            Hãy làm bài kiểm tra phân tích da toàn diện để nhận được đánh giá
            chi tiết và những khuyến nghị phù hợp với cá nhân bạn.
          </p>
          <Link to="/quiz-landing">
            <button className="inline-flex items-center px-6 py-3 bg-pink-500 text-white font-medium rounded-xl hover:bg-pink-600 transition-colors duration-200">
              Làm Bài Kiểm Tra
              <svg
                className="w-5 h-5 ml-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
