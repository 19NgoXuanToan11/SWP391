import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FireOutlined, ThunderboltOutlined } from "@ant-design/icons";

export function BeautyMythbusters() {
  const [expandedMyth, setExpandedMyth] = useState(null);

  const beautyMyths = [
    {
      id: 1,
      myth: "Nặn mụn giúp da sạch nhanh hơn",
      truth:
        "Nặn mụn có thể đẩy vi khuẩn sâu hơn vào da, gây viêm nhiễm và để lại sẹo vĩnh viễn. Hãy để các chuyên gia xử lý!",
      icon: "💥",
      color: "from-red-400 to-orange-600",
      emoji: "🙅‍♀️",
      funFact:
        "Một vết mụn thường tự lành trong 3-7 ngày, nhưng sẹo do nặn mụn có thể tồn tại vài tháng hoặc vĩnh viễn!",
    },
    {
      id: 2,
      myth: "Càng rửa mặt nhiều, da càng sạch",
      truth:
        "Rửa mặt quá nhiều phá hủy hàng rào bảo vệ tự nhiên của da, khiến da tiết nhiều dầu hơn và dễ bị kích ứng.",
      icon: "🧼",
      color: "from-blue-400 to-cyan-600",
      emoji: "🤯",
      funFact:
        "Ngay cả nước cũng có thể làm khô da nếu tiếp xúc quá nhiều - đó là lý do tại sao ngón tay bạn nhăn nheo sau khi tắm lâu!",
    },
    {
      id: 3,
      myth: "Kem chống nắng chỉ cần dùng khi đi biển",
      truth:
        "Tia UV xuyên qua cửa sổ, mây và thậm chí quần áo! Không dùng kem chống nắng hàng ngày là nguyên nhân hàng đầu gây lão hóa sớm.",
      icon: "☀️",
      color: "from-yellow-400 to-amber-600",
      emoji: "😱",
      funFact:
        "Tia UVA có thể xuyên qua cửa kính xe hơi và cửa sổ văn phòng, khiến một bên mặt của tài xế thường già hơn bên còn lại!",
    },
    {
      id: 4,
      myth: "Sản phẩm đắt tiền luôn tốt hơn",
      truth:
        "Nhiều sản phẩm bình dân có thành phần hoạt tính giống hệt sản phẩm cao cấp. Bạn thường trả tiền cho bao bì và marketing!",
      icon: "💰",
      color: "from-green-400 to-emerald-600",
      emoji: "🤑",
      funFact:
        "Một số thương hiệu xa xỉ và bình dân thuộc cùng một công ty mẹ và sản xuất tại cùng một nhà máy với công thức tương tự!",
    },
    {
      id: 5,
      myth: "Mụn chỉ là vấn đề của tuổi teen",
      truth:
        "Mụn trưởng thành rất phổ biến! Hormone, căng thẳng và chế độ ăn uống có thể gây mụn ở mọi lứa tuổi.",
      icon: "🔬",
      color: "from-purple-400 to-violet-600",
      emoji: "👵",
      funFact:
        "Có người bắt đầu nổi mụn ở tuổi 40-50 dù chưa từng có mụn khi còn trẻ. Cảm ơn sự thay đổi nội tiết tố!",
    },
    {
      id: 6,
      myth: "Dùng kem dưỡng da sẽ khiến da phụ thuộc và lười tạo ẩm",
      truth:
        "Da không thể 'lười' hay 'nghiện' kem dưỡng! Đây là một hiểu lầm phổ biến. Da luôn cần độ ẩm, và việc dưỡng ẩm đều đặn giúp duy trì hàng rào bảo vệ da khỏe mạnh.",
      icon: "🧴",
      color: "from-teal-400 to-cyan-600",
      emoji: "🧖‍♀️",
      funFact:
        "Khi ngừng dùng kem dưỡng, da không 'quên' cách tự sản xuất dầu - thực tế là da sẽ sản xuất nhiều dầu hơn để bù đắp độ ẩm bị mất, khiến da trở nên bóng nhờn!",
    },
  ];

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/3 right-1/3 w-96 h-96 bg-pink-200/20 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-purple-200/30 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute top-2/3 right-1/4 w-64 h-64 bg-yellow-200/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <div className="inline-block mb-4 relative">
            <h2 className="text-4xl md:text-5xl font-bold">
              <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent">
                Phá Vỡ Huyền Thoại Làm Đẹp
              </span>
            </h2>
          </div>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto">
            Những điều bạn vẫn tin là đúng về làm đẹp có thể là hoàn toàn sai
            lầm! Hãy cùng khám phá sự thật đằng sau những quan niệm phổ biến
            nhất.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {beautyMyths.map((myth, index) => (
            <motion.div
              key={myth.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: expandedMyth === myth.id ? 1 : 1.03 }}
              className={`bg-white rounded-2xl shadow-xl border border-pink-100 backdrop-blur-sm overflow-hidden transition-all duration-300 ${
                expandedMyth === myth.id ? "md:col-span-2 lg:col-span-3" : ""
              }`}
            >
              <div
                className={`p-6 cursor-pointer ${
                  expandedMyth === myth.id ? "" : "h-full"
                }`}
                onClick={() =>
                  setExpandedMyth(expandedMyth === myth.id ? null : myth.id)
                }
              >
                <div className="flex items-center mb-4">
                  <div
                    className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl bg-gradient-to-br ${myth.color} text-white shadow-lg mr-4`}
                  >
                    {myth.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 flex-1">
                    {expandedMyth === myth.id ? (
                      <span className="line-through text-gray-400 mr-2">
                        {myth.myth}
                      </span>
                    ) : (
                      myth.myth
                    )}
                    {expandedMyth === myth.id && (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-pink-600 block mt-1"
                      >
                        SỰ THẬT!
                      </motion.span>
                    )}
                  </h3>
                  <div
                    className="text-3xl transform transition-transform duration-300"
                    style={{
                      transform:
                        expandedMyth === myth.id
                          ? "rotate(180deg)"
                          : "rotate(0)",
                    }}
                  >
                    {expandedMyth === myth.id ? "🔍" : "❓"}
                  </div>
                </div>

                {expandedMyth !== myth.id ? (
                  <div className="bg-gradient-to-r from-pink-50 to-purple-50 p-4 rounded-xl flex items-center">
                    <ThunderboltOutlined className="text-pink-500 mr-2 text-lg" />
                    <p className="text-gray-600 italic">
                      Nhấp để khám phá sự thật đằng sau huyền thoại này...
                    </p>
                  </div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="space-y-6"
                  >
                    <div className="bg-gradient-to-r from-pink-50 to-purple-50 p-6 rounded-xl">
                      <p className="text-gray-800 text-lg leading-relaxed">
                        {myth.truth}
                      </p>
                    </div>

                    <div className="bg-gradient-to-r from-yellow-50 to-amber-50 p-6 rounded-xl">
                      <div className="flex items-start">
                        <FireOutlined className="text-amber-500 mr-3 text-xl mt-1" />
                        <div>
                          <h4 className="font-bold text-amber-700 mb-2">
                            Sự thật điên rồ:
                          </h4>
                          <p className="text-gray-700">{myth.funFact}</p>
                        </div>
                      </div>
                    </div>

                    <div className="text-center">
                      <span className="text-6xl animate-bounce inline-block">
                        {myth.emoji}
                      </span>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
