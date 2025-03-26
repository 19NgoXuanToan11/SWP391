import oilySkin from "../../../assets/pictures/oily_skin.jpg";
import drySkin from "../../../assets/pictures/dry_skin.jpg";
import combinationSkin from "../../../assets/pictures/combination_skin.jpg";
import sensitiveSkin from "../../../assets/pictures/sensitive_skin.jpg";
import { Link } from "react-router-dom";
import { ArrowRightOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";

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
    {
      title: "Da Nhạy Cảm",
      description:
        "Dễ bị kích ứng bởi các yếu tố môi trường, mỹ phẩm và thay đổi nhiệt độ.",
      symptoms: [
        "Dễ đỏ và kích ứng",
        "Cảm giác ngứa và châm chích",
        "Phản ứng với nhiều sản phẩm",
        "Da mỏng và dễ tổn thương",
      ],
      recommendations: [
        "Sản phẩm không hương liệu",
        "Thành phần dịu nhẹ, không cồn",
        "Kem chống nắng vật lý",
        "Tránh các sản phẩm có tính tẩy mạnh",
      ],
      image: sensitiveSkin,
      color: "blue",
    },
  ];

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      {/* Phần Tiêu Đề với hiệu ứng */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-7xl mx-auto text-center mb-20"
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-6 ">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-600">
            Tìm Hiểu Loại Da Của Bạn
          </span>
          <motion.div
            className="absolute -bottom-2 left-0 right-0 h-1 "
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ delay: 0.5, duration: 0.8 }}
          />
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Khám phá loại da của bạn và nhận được những khuyến nghị phù hợp cho
          quy trình chăm sóc da hoàn hảo.
        </p>
      </motion.div>

      {/* Lưới Các Loại Da với hiệu ứng staggered */}
      <div className="max-w-7xl mx-auto">
        {skinTypes.map((type, index) => (
          <motion.div
            key={type.title}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2, duration: 0.5 }}
            className="mb-16"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Phần hình ảnh - thay đổi vị trí dựa trên index */}
              <div
                className={`lg:col-span-5 ${
                  index % 2 === 0 ? "lg:order-1" : "lg:order-2"
                }`}
              >
                <div className="relative group">
                  <div className="absolute inset-0  rounded-3xl transform rotate-3 scale-105 group-hover:rotate-0 transition-transform duration-300" />
                  <div className="relative overflow-hidden rounded-3xl shadow-xl">
                    <img
                      src={type.image}
                      alt={type.title}
                      className="w-full h-[400px] object-cover transform group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    <h3 className="absolute bottom-6 left-6 text-3xl font-bold text-white">
                      {type.title}
                    </h3>
                  </div>
                </div>
              </div>

              {/* Phần nội dung */}
              <div
                className={`lg:col-span-7 ${
                  index % 2 === 0 ? "lg:order-2" : "lg:order-1"
                }`}
              >
                <div className="bg-white/80 backdrop-blur-md p-8 rounded-3xl shadow-lg border border-pink-100 hover:shadow-xl transition-all duration-300">
                  <p className="text-gray-600 leading-relaxed text-lg mb-6">
                    {type.description}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Triệu Chứng */}
                    <div className="bg-pink-50/50 p-6 rounded-2xl">
                      <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <span className="w-8 h-8 rounded-full bg-pink-400 flex items-center justify-center text-white mr-2">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </span>
                        Triệu Chứng Phổ Biến
                      </h4>
                      <ul className="space-y-3">
                        {type.symptoms.map((symptom) => (
                          <li
                            key={symptom}
                            className="flex items-center text-gray-600 group"
                          >
                            <span className="w-6 h-6 rounded-full bg-pink-100 flex items-center justify-center mr-3 group-hover:bg-pink-200 transition-colors duration-200">
                              <svg
                                className="w-4 h-4 text-pink-500"
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
                            </span>
                            <span className="group-hover:text-pink-600 transition-colors duration-200">
                              {symptom}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Khuyến Nghị */}
                    <div className="bg-purple-50/50 p-6 rounded-2xl">
                      <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <span className="w-8 h-8 rounded-full bg-purple-400 flex items-center justify-center text-white mr-2">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </span>
                        Khuyến Nghị
                      </h4>
                      <ul className="space-y-3">
                        {type.recommendations.map((rec) => (
                          <li
                            key={rec}
                            className="flex items-center text-gray-600 group"
                          >
                            <span className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center mr-3 group-hover:bg-purple-200 transition-colors duration-200">
                              <svg
                                className="w-4 h-4 text-purple-500"
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
                            </span>
                            <span className="group-hover:text-purple-600 transition-colors duration-200">
                              {rec}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Nút Hành Động */}
                  <div className="mt-8">
                    <Link to="/quiz-landing">
                      <button
                        className="w-full py-4 px-6 bg-gradient-to-r from-pink-400 to-purple-500 text-white rounded-xl font-medium 
                        hover:from-pink-500 hover:to-purple-600 transition-all duration-300 transform hover:scale-[1.02] 
                        focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 shadow-lg shadow-pink-500/20
                        hover:shadow-xl hover:shadow-pink-500/30 relative overflow-hidden group"
                      >
                        <span className="relative z-10 flex items-center justify-center">
                          Khám Phá Thêm
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 ml-2 transform group-hover:translate-x-1 transition-transform duration-300"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M14 5l7 7m0 0l-7 7m7-7H3"
                            />
                          </svg>
                        </span>
                        <span className="absolute top-0 left-0 w-full h-full bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></span>
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Call to action section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        s
        className="max-w-4xl mx-auto mt-16"
      >
        <div className="relative bg-white/90 backdrop-blur-md rounded-3xl p-10 shadow-xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-pink-500/10 to-purple-500/10" />
          <div className="absolute -right-20 -top-20 w-64 h-64 bg-purple-300 rounded-full opacity-20 blur-3xl" />
          <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-pink-300 rounded-full opacity-20 blur-3xl" />

          <div className="relative z-10">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="md:w-2/3">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Chưa chắc chắn về loại da của bạn?
                </h2>
                <p className="text-gray-600 mb-6 text-lg">
                  Hãy làm bài kiểm tra phân tích da toàn diện để nhận được đánh
                  giá chi tiết và những khuyến nghị phù hợp với cá nhân bạn.
                </p>
              </div>

              <div className="md:w-1/3">
                <Link to="/quiz-landing">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-5 px-8 bg-gradient-to-r from-pink-500 to-purple-600 
                      text-white font-medium rounded-2xl shadow-lg shadow-pink-500/30 
                      hover:shadow-xl hover:shadow-pink-500/40 transition-all duration-300 relative overflow-hidden group"
                  >
                    <span className="relative z-10 flex items-center justify-center text-lg">
                      Làm Bài Kiểm Tra
                      <ArrowRightOutlined className="ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                    </span>
                    <span className="absolute top-0 left-0 w-full h-full bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></span>
                  </motion.button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
