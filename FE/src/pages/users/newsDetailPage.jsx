import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button, Tag, Avatar } from "antd";
import {
  ArrowLeftOutlined,
  ClockCircleOutlined,
  UserOutlined,
  ShareAltOutlined,
  HeartOutlined,
} from "@ant-design/icons";

// Data mẫu cho chi tiết bài viết
const newsData = {
  1: {
    title: "Chăm Sóc Tóc Của Bạn",
    date: "14/07/2022",
    author: "Sarah Johnson",
    readTime: "5 phút đọc",
    categories: ["Chăm sóc tóc", "Làm đẹp"],
    image: "/src/assets/pictures/blog1.jpg",
    content: `
      <div class="space-y-6">
        <p>Mái tóc khỏe đẹp là niềm mơ ước của mọi người, đặc biệt là phái nữ. Tuy nhiên, không phải ai cũng biết cách chăm sóc tóc đúng cách để có được mái tóc như ý.</p>

        <h2 class="text-2xl font-bold mt-8 mb-4">1. Bảo vệ tóc khỏi tác động của môi trường</h2>
        <p>Cũng giống như da cần kem chống nắng trước khi ra ngoài, tóc cũng cần được bảo vệ để tránh hư tổn. Các yếu tố môi trường như nắng, gió, khói bụi có thể làm tóc khô xơ, gãy rụng.</p>

        <h2 class="text-2xl font-bold mt-8 mb-4">2. Chọn đúng sản phẩm chăm sóc tóc</h2>
        <p>Việc lựa chọn dầu gội, dầu xả phù hợp với tình trạng tóc là vô cùng quan trọng. Nếu bạn có tóc khô, hãy chọn các sản phẩm có khả năng dưỡng ẩm cao. Ngược lại, với tóc dầu, nên chọn sản phẩm có khả năng cân bằng độ ẩm.</p>

        <h2 class="text-2xl font-bold mt-8 mb-4">3. Thói quen chăm sóc tóc hàng ngày</h2>
        <ul class="list-disc pl-6 space-y-2">
          <li>Không gội đầu bằng nước quá nóng</li>
          <li>Tránh buộc tóc quá chặt</li>
          <li>Hạn chế sử dụng các thiết bị tạo kiểu bằng nhiệt</li>
          <li>Massage da đầu thường xuyên</li>
          <li>Cắt tỉa tóc định kỳ</li>
        </ul>

        <div class="bg-pink-50 p-6 rounded-lg mt-8">
          <h3 class="text-xl font-bold mb-4">Lời khuyên từ chuyên gia</h3>
          <p class="italic">"Việc chăm sóc tóc cần kiên trì và thực hiện đúng cách. Bạn nên dành ít nhất 10 phút mỗi ngày để chăm sóc mái tóc của mình."</p>
        </div>
      </div>
    `,
    relatedArticles: [
      {
        id: 2,
        title: "Bổ Sung Tinh Chất Sâu",
        image: "/src/assets/pictures/blog2.jpg",
      },
      {
        id: 3,
        title: "Để Tóc Khô Tự Nhiên",
        image: "/src/assets/pictures/blog3.jpg",
      },
    ],
  },
  2: {
    title: "Bổ Sung Tinh Chất Sâu",
    date: "14/07/2022",
    author: "Emily Wang",
    readTime: "4 phút đọc",
    categories: ["Chăm sóc tóc", "Dưỡng tóc"],
    image: "/src/assets/pictures/blog2.jpg",
    content: `
      <div class="space-y-6">
        <p>Tinh chất dưỡng tóc (hair serum) là bước quan trọng trong quy trình chăm sóc tóc mà nhiều người thường bỏ qua. Hãy cùng tìm hiểu về cách sử dụng và lợi ích của tinh chất dưỡng tóc.</p>

        <h2 class="text-2xl font-bold mt-8 mb-4">1. Tại sao cần bổ sung tinh chất?</h2>
        <p>Tinh chất dưỡng tóc chứa các dưỡng chất cô đặc, có khả năng thẩm thấu sâu vào sợi tóc, giúp phục hồi và bảo vệ tóc hiệu quả hơn các sản phẩm thông thường.</p>

        <h2 class="text-2xl font-bold mt-8 mb-4">2. Cách chọn tinh chất phù hợp</h2>
        <ul class="list-disc pl-6 space-y-2">
          <li>Tóc khô xơ: Chọn tinh chất giàu dưỡng ẩm</li>
          <li>Tóc hư tổn: Ưu tiên thành phần protein, keratin</li>
          <li>Tóc nhuộm: Tìm các sản phẩm bảo vệ màu nhuộm</li>
          <li>Tóc dầu: Chọn tinh chất dạng nhẹ, không dầu</li>
        </ul>

        <div class="bg-pink-50 p-6 rounded-lg mt-8">
          <h3 class="text-xl font-bold mb-4">Mẹo sử dụng</h3>
          <p class="italic">Thoa tinh chất khi tóc còn ẩm để tăng khả năng hấp thụ. Tập trung vào phần ngọn tóc vì đây là vùng dễ bị hư tổn nhất.</p>
        </div>
      </div>
    `,
    relatedArticles: [
      {
        id: 4,
        title: "Cung Cấp Dinh Dưỡng Bổ Sung Cho Tóc",
        image: "/src/assets/pictures/blog4.jpg",
      },
      {
        id: 5,
        title: "Sử Dụng Dầu Xả Dưỡng Ẩm Cho Tóc",
        image: "/src/assets/pictures/blog5.jpg",
      },
    ],
  },
  3: {
    title: "Để Tóc Khô Tự Nhiên",
    date: "14/07/2022",
    author: "Lisa Chen",
    readTime: "3 phút đọc",
    categories: ["Chăm sóc tóc", "Mẹo làm đẹp"],
    image: "/src/assets/pictures/blog3.jpg",
    content: `
      <div class="space-y-6">
        <p>Việc sấy tóc thường xuyên có thể gây ra nhiều tổn thương cho mái tóc của bạn. Hãy học cách để tóc khô tự nhiên một cách đúng đắn.</p>

        <h2 class="text-2xl font-bold mt-8 mb-4">1. Lợi ích của việc để tóc khô tự nhiên</h2>
        <ul class="list-disc pl-6 space-y-2">
          <li>Giảm thiểu tổn thương do nhiệt</li>
          <li>Giữ được độ ẩm tự nhiên của tóc</li>
          <li>Tóc ít bị xơ rối hơn</li>
          <li>Tiết kiệm thời gian</li>
        </ul>

        <h2 class="text-2xl font-bold mt-8 mb-4">2. Các bước để tóc khô đúng cách</h2>
        <p>Sử dụng khăn microfiber thấm nhẹ nhàng, tránh chà xát mạnh. Có thể áp dụng phương pháp "plopping" để giữ form tóc tự nhiên.</p>

        <div class="bg-pink-50 p-6 rounded-lg mt-8">
          <h3 class="text-xl font-bold mb-4">Lưu ý quan trọng</h3>
          <p class="italic">Không nên đi ngủ khi tóc còn ướt vì có thể tạo môi trường thuận lợi cho nấm phát triển trên da đầu.</p>
        </div>
      </div>
    `,
    relatedArticles: [
      {
        id: 1,
        title: "Chăm Sóc Tóc Của Bạn",
        image: "/src/assets/pictures/blog1.jpg",
      },
      {
        id: 4,
        title: "Cung Cấp Dinh Dưỡng Bổ Sung Cho Tóc",
        image: "/src/assets/pictures/blog4.jpg",
      },
    ],
  },
  4: {
    title: "Cung Cấp Dinh Dưỡng Bổ Sung Cho Tóc",
    date: "14/07/2022",
    author: "Maria Rodriguez",
    readTime: "6 phút đọc",
    categories: ["Dinh dưỡng", "Chăm sóc tóc"],
    image: "/src/assets/pictures/blog4.jpg",
    content: `
      <div class="space-y-6">
        <p>Bên cạnh việc chăm sóc tóc bên ngoài, việc bổ sung dinh dưỡng từ bên trong cũng rất quan trọng để có một mái tóc khỏe đẹp.</p>

        <h2 class="text-2xl font-bold mt-8 mb-4">1. Các dưỡng chất thiết yếu cho tóc</h2>
        <ul class="list-disc pl-6 space-y-2">
          <li>Protein: Thành phần chính của tóc</li>
          <li>Biotin: Vitamin B7 giúp tóc mọc khỏe</li>
          <li>Sắt: Ngăn ngừa rụng tóc</li>
          <li>Kẽm: Hỗ trợ sản xuất protein</li>
          <li>Omega-3: Giúp tóc bóng mượt</li>
        </ul>

        <h2 class="text-2xl font-bold mt-8 mb-4">2. Thực phẩm tốt cho tóc</h2>
        <p>Bổ sung các loại thực phẩm giàu dinh dưỡng như cá hồi, trứng, rau xanh đậm, các loại hạt, và trái cây giàu vitamin C.</p>

        <div class="bg-pink-50 p-6 rounded-lg mt-8">
          <h3 class="text-xl font-bold mb-4">Chế độ ăn cân bằng</h3>
          <p class="italic">Một chế độ ăn đa dạng, giàu dinh dưỡng sẽ cung cấp đầy đủ dưỡng chất cần thiết cho mái tóc khỏe mạnh.</p>
        </div>
      </div>
    `,
    relatedArticles: [
      {
        id: 2,
        title: "Bổ Sung Tinh Chất Sâu",
        image: "/src/assets/pictures/blog2.jpg",
      },
      {
        id: 5,
        title: "Sử Dụng Dầu Xả Dưỡng Ẩm Cho Tóc",
        image: "/src/assets/pictures/blog5.jpg",
      },
    ],
  },
  5: {
    title: "Sử Dụng Dầu Xả Dưỡng Ẩm Cho Tóc",
    date: "14/07/2022",
    author: "Sophie Anderson",
    readTime: "4 phút đọc",
    categories: ["Chăm sóc tóc", "Sản phẩm"],
    image: "/src/assets/pictures/blog5.jpg",
    content: `
      <div class="space-y-6">
        <p>Dầu xả là bước không thể thiếu trong quy trình chăm sóc tóc. Tìm hiểu cách chọn và sử dụng dầu xả hiệu quả.</p>

        <h2 class="text-2xl font-bold mt-8 mb-4">1. Tầm quan trọng của dầu xả</h2>
        <p>Dầu xả giúp phục hồi độ ẩm, làm mềm tóc và bảo vệ tóc khỏi các tác nhân gây hại từ môi trường.</p>

        <h2 class="text-2xl font-bold mt-8 mb-4">2. Cách sử dụng dầu xả đúng</h2>
        <ul class="list-disc pl-6 space-y-2">
          <li>Chỉ xả từ giữa tóc đến ngọn</li>
          <li>Để dầu xả trong 2-3 phút</li>
          <li>Xả sạch với nước mát</li>
          <li>Sử dụng lượng vừa đủ</li>
        </ul>

        <div class="bg-pink-50 p-6 rounded-lg mt-8">
          <h3 class="text-xl font-bold mb-4">Lời khuyên</h3>
          <p class="italic">Với tóc dày, có thể chia tóc thành nhiều phần nhỏ để dầu xả thấm đều hơn.</p>
        </div>
      </div>
    `,
    relatedArticles: [
      {
        id: 1,
        title: "Chăm Sóc Tóc Của Bạn",
        image: "/src/assets/pictures/blog1.jpg",
      },
      {
        id: 3,
        title: "Để Tóc Khô Tự Nhiên",
        image: "/src/assets/pictures/blog3.jpg",
      },
    ],
  },
};

export function NewsDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const article = newsData[id];

  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800">
            Không tìm thấy bài viết
          </h2>
          <Button
            type="primary"
            onClick={() => navigate("/news")}
            className="mt-4"
          >
            Quay lại trang tin tức
          </Button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gray-50 py-12"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate("/news")}
          className="flex items-center gap-2 px-4 py-2 mb-8 text-gray-700 bg-white rounded-lg shadow-sm hover:bg-gray-50 transition-colors duration-200 border border-gray-200"
        >
          <ArrowLeftOutlined className="text-gray-500" />
          <span className="font-medium">Quay lại</span>
        </button>

        <article className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="relative">
            <img
              src={article.image}
              alt={article.title}
              className="w-full h-[400px] object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6">
              <div className="space-x-2 mb-4">
                {article.categories.map((category) => (
                  <Tag key={category} color="pink">
                    {category}
                  </Tag>
                ))}
              </div>
              <h1 className="text-4xl font-bold text-white mb-4">
                {article.title}
              </h1>
            </div>
          </div>

          <div className="p-8">
            <div className="flex items-center justify-between mb-8 pb-8 border-b">
              <div className="flex items-center space-x-4">
                <Avatar icon={<UserOutlined />} />
                <div>
                  <p className="font-medium">{article.author}</p>
                  <div className="flex items-center text-gray-500 text-sm">
                    <ClockCircleOutlined className="mr-1" />
                    <span>
                      {article.date} • {article.readTime}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex space-x-4">
                <Button icon={<HeartOutlined />} />
                <Button icon={<ShareAltOutlined />} />
              </div>
            </div>

            <div
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />

            {article.relatedArticles && (
              <div className="mt-12">
                <h3 className="text-2xl font-bold mb-6">Bài viết liên quan</h3>
                <div className="grid grid-cols-2 gap-6">
                  {article.relatedArticles.map((related) => (
                    <motion.div
                      key={related.id}
                      whileHover={{ scale: 1.02 }}
                      className="cursor-pointer"
                      onClick={() => navigate(`/news/${related.id}`)}
                    >
                      <div className="bg-gray-50 rounded-lg overflow-hidden">
                        <img
                          src={related.image}
                          alt={related.title}
                          className="w-full h-48 object-cover"
                        />
                        <div className="p-4">
                          <h4 className="font-medium hover:text-pink-600">
                            {related.title}
                          </h4>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </article>
      </div>
    </motion.div>
  );
}
