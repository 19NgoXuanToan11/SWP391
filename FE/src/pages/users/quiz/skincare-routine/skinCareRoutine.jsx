import React, { useState, useEffect } from "react";
import {
  Form,
  Select,
  Button,
  Card,
  List,
  Typography,
  Steps,
  Tooltip,
  Modal,
  Tag,
  Divider,
  message,
} from "antd";
import {
  SkinOutlined,
  SunOutlined,
  MoonOutlined,
  InfoCircleOutlined,
  ClockCircleOutlined,
  SafetyOutlined,
  ExperimentOutlined,
  CheckCircleOutlined,
  WarningOutlined,
  BulbOutlined,
  ShoppingOutlined,
  SkinFilled,
} from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  translateSkinConcern,
  getSkinTypeInfo,
} from "../../../../utils/skinCare/skinCareUtils";

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

export default function SkinCareRoutinePage() {
  const location = useLocation();
  const quizResults =
    location.state?.quizResults ||
    JSON.parse(localStorage.getItem("quizResults"));
  const [form] = Form.useForm();
  const [recommendations, setRecommendations] = useState(null);
  const [showTips, setShowTips] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const navigate = useNavigate();
  const [autoFilled, setAutoFilled] = useState(false);

  const productDetails = {
    "Sữa rửa mặt dịu nhẹ": {
      purpose: "Loại bỏ bụi bẩn, dầu thừa và tạp chất mà không làm khô da",
      howToUse: "Mát xa nhẹ nhàng với nước ấm trong 60 giây",
      tips: "Sử dụng vào buổi sáng và buổi tối, tránh nước nóng",
      ingredients: ["Ceramides", "Glycerin", "Hyaluronic Acid"],
      benefits: [
        "Không gây kích ứng",
        "Duy trì hàng rào bảo vệ da",
        "Cân bằng pH",
      ],
      warnings: "Nếu có kích ứng, giảm tần suất sử dụng",
      price: "250.000đ - 400.000đ",
      recommendedBrands: ["Cerave", "La Roche-Posay", "Simple"],
      icon: <SkinFilled />,
      color: "amber",
      timeOfDay: "Ngay sau khi thức dậy",
      timeBefore: "60 giây",
      applyMethod: "Vỗ nhẹ bằng tay hoặc bông tẩy trang",
    },
    "Nước cân bằng dưỡng ẩm": {
      purpose: "Cân bằng pH và cung cấp lớp hydrat hóa đầu tiên",
      howToUse: "Vỗ nhẹ bằng tay hoặc bông tẩy trang",
      tips: "Thoa khi da vẫn còn ẩm sau khi rửa mặt",
      ingredients: ["Hyaluronic Acid", "Panthenol", "Niacinamide"],
      benefits: [
        "Cung cấp độ ẩm",
        "Xoa dịu da",
        "Chuẩn bị cho các bước tiếp theo",
      ],
      warnings: "Tránh toner có cồn nếu bạn có làn da nhạy cảm",
      price: "200.000đ - 350.000đ",
      recommendedBrands: ["Hada Labo", "Klairs", "Paula's Choice"],
      icon: <ExperimentOutlined />,
      color: "blue",
      timeOfDay: "Ngay sau khi thức dậy",
      timeBefore: "30 giây",
      applyMethod: "Vỗ nhẹ, không chà xát. Để từng lớp thẩm thấu.",
    },
    "Nước tẩy trang Micellar": {
      purpose: "Làm sạch nhẹ nhàng, loại bỏ trang điểm và bụi bẩn",
      howToUse: "Thấm bông tẩy trang và lau nhẹ nhàng trên mặt",
      tips: "Phù hợp cho da nhạy cảm và khi cần làm sạch nhanh chóng",
      ingredients: ["Surfactants nhẹ", "Glycerin", "Nước tinh khiết"],
      benefits: [
        "Làm sạch nhẹ nhàng không cần rửa lại",
        "Không gây khô da",
        "An toàn cho da nhạy cảm",
        "Loại bỏ trang điểm hiệu quả",
      ],
      warnings: "Tránh để dung dịch dư thừa trên da quá lâu nếu da nhạy cảm",
      price: "180.000đ - 350.000đ",
      recommendedBrands: ["Bioderma", "Garnier", "Simple"],
      icon: <ExperimentOutlined />,
      color: "blue",
      timeOfDay: "Trước khi rửa mặt",
      timeBefore: "30 giây",
      applyMethod: "Thấm bông, lau nhẹ nhàng theo hướng từ trong ra ngoài",
    },
    "Sữa rửa mặt kiểm soát dầu": {
      purpose: "Loại bỏ dầu thừa, bụi bẩn và tạp chất trên da dầu",
      howToUse: "Tạo bọt với nước ấm, mát xa nhẹ nhàng và rửa sạch",
      tips: "Sử dụng không quá 2 lần/ngày để tránh kích thích sản sinh dầu",
      ingredients: ["Salicylic Acid", "Tea Tree Oil", "Zinc PCA"],
      benefits: [
        "Kiểm soát dầu nhờn hiệu quả",
        "Làm sạch sâu lỗ chân lông",
        "Ngăn ngừa mụn",
        "Không làm khô da quá mức",
      ],
      warnings: "Có thể hơi khô da, nên kết hợp với kem dưỡng ẩm phù hợp",
      price: "180.000đ - 400.000đ",
      recommendedBrands: ["La Roche-Posay", "Neutrogena", "COSRX"],
      icon: <SkinFilled />,
      color: "blue",
      timeOfDay: "Ngay sau khi thức dậy",
      timeBefore: "60 giây",
      applyMethod: "Massage nhẹ nhàng, chú ý vùng chữ T",
    },
    "Sữa rửa mặt có BHA": {
      purpose: "Làm sạch sâu, loại bỏ tế bào chết và thông thoáng lỗ chân lông",
      howToUse: "Mát xa lên mặt ẩm trong 30-60 giây, tránh vùng mắt",
      tips: "Sử dụng 2-3 lần/tuần nếu da nhạy cảm, có thể hàng ngày với da dầu",
      ingredients: ["Salicylic Acid (BHA)", "Allantoin", "Panthenol"],
      benefits: [
        "Loại bỏ tế bào chết nhẹ nhàng",
        "Làm sạch sâu lỗ chân lông",
        "Ngăn ngừa và điều trị mụn",
        "Cải thiện kết cấu da",
      ],
      warnings: "Có thể gây khô, bắt đầu với tần suất thấp và tăng dần",
      price: "250.000đ - 450.000đ",
      recommendedBrands: ["Paula's Choice", "COSRX", "CeraVe"],
      icon: <SkinFilled />,
      color: "green",
      timeOfDay: "Trước khi rửa mặt",
      timeBefore: "60 giây",
      applyMethod: "Mát xa nhẹ nhàng tập trung vào vùng chữ T và chỗ có mụn",
    },
    "Sữa rửa mặt cân bằng": {
      purpose: "Làm sạch da hỗn hợp mà không làm mất cân bằng độ ẩm",
      howToUse: "Massage lên mặt ẩm trong 30-60 giây, rửa sạch với nước ấm",
      tips: "Sử dụng hai lần mỗi ngày, tập trung vào vùng chữ T",
      ingredients: ["Amino Acids", "Glycerin", "Hyaluronic Acid"],
      benefits: [
        "Làm sạch mà không làm khô da",
        "Cân bằng vùng da dầu và khô",
        "Duy trì pH tự nhiên của da",
        "Hỗ trợ hàng rào bảo vệ da",
      ],
      warnings: "Tránh rửa mặt bằng nước quá nóng hoặc quá lạnh",
      price: "220.000đ - 400.000đ",
      recommendedBrands: ["Cetaphil", "CeraVe", "Klairs"],
      icon: <SkinFilled />,
      color: "blue",
      timeOfDay: "Ngay sau khi thức dậy",
      timeBefore: "60 giây",
      applyMethod: "Massage nhẹ nhàng, tập trung vào vùng chữ T",
    },
    "Nước cân bằng không cồn": {
      purpose: "Cân bằng pH da và chuẩn bị da cho các bước dưỡng tiếp theo",
      howToUse: "Thấm miếng bông hoặc vỗ nhẹ lên da sau khi rửa mặt",
      tips: "Sử dụng trên da còn hơi ẩm để thẩm thấu tốt hơn",
      ingredients: ["Hyaluronic Acid", "Niacinamide", "Amino Acids"],
      benefits: [
        "Cân bằng độ pH",
        "Không gây khô da",
        "Làm sạch dư lượng sữa rửa mặt",
        "Chuẩn bị da hấp thu các sản phẩm tiếp theo",
      ],
      warnings: "Tránh sử dụng toner chứa cồn có thể gây khô và kích ứng da",
      price: "200.000đ - 400.000đ",
      recommendedBrands: ["Thayers", "Klairs", "Pyunkang Yul"],
      icon: <ExperimentOutlined />,
      color: "blue",
      timeOfDay: "Ngay sau khi thức dậy",
      timeBefore: "30 giây",
      applyMethod: "Vỗ nhẹ lên da, không chà xát",
    },
    "Nước cân bằng làm dịu": {
      purpose:
        "Làm dịu da kích ứng, cân bằng pH và chuẩn bị da cho các bước tiếp theo",
      howToUse: "Thấm miếng bông hoặc vỗ nhẹ lên da sau khi rửa mặt",
      tips: "Có thể để tủ lạnh để tăng tác dụng làm dịu",
      ingredients: ["Centella Asiatica", "Panthenol", "Allantoin"],
      benefits: [
        "Làm dịu da kích ứng",
        "Giảm đỏ và ngứa",
        "Tăng cường hàng rào bảo vệ da",
        "Cân bằng pH",
      ],
      warnings:
        "Kiểm tra phản ứng trước khi sử dụng toàn mặt nếu da rất nhạy cảm",
      price: "220.000đ - 450.000đ",
      recommendedBrands: ["Etude House", "Klairs", "I'm From"],
      icon: <ExperimentOutlined />,
      color: "green",
      timeOfDay: "Ngay sau khi thức dậy",
      timeBefore: "30 giây",
      applyMethod: "Vỗ nhẹ nhàng, tránh chà xát mạnh",
    },
    "Serum chống oxy hóa": {
      purpose: "Bảo vệ da khỏi tác hại của gốc tự do và ngăn ngừa lão hóa sớm",
      howToUse: "Thoa 3-4 giọt lên da sau bước toner vào buổi sáng",
      tips: "Sử dụng vào buổi sáng để bảo vệ tối ưu khỏi tác nhân môi trường",
      ingredients: ["Vitamin C", "Vitamin E", "Ferulic Acid", "Resveratrol"],
      benefits: [
        "Trung hòa gốc tự do",
        "Ngăn ngừa lão hóa sớm",
        "Cải thiện tông màu da",
        "Tăng cường hiệu quả chống nắng",
      ],
      warnings:
        "Một số thành phần có thể không ổn định dưới ánh sáng, bảo quản đúng cách",
      price: "350.000đ - 850.000đ",
      recommendedBrands: ["SkinCeuticals", "Paula's Choice", "The Ordinary"],
      icon: <ExperimentOutlined />,
      color: "orange",
      timeOfDay: "Sau 2-3 phút",
      timeBefore: "30 giây",
      applyMethod: "Thoa đều và vỗ nhẹ để thẩm thấu",
    },
    "Serum điều trị": {
      purpose: "Điều trị các vấn đề cụ thể về da như mụn, nếp nhăn, hoặc thâm",
      howToUse: "Thoa lên vùng da cần điều trị hoặc toàn mặt tùy vấn đề",
      tips: "Sử dụng buổi tối để tăng hiệu quả phục hồi qua đêm",
      ingredients: ["Retinol", "Azelaic Acid", "Peptides", "AHA/BHA"],
      benefits: [
        "Điều trị vấn đề da cụ thể",
        "Tăng tốc tái tạo tế bào",
        "Cải thiện kết cấu và màu sắc da",
        "Kích thích sản sinh collagen",
      ],
      warnings: "Có thể gây kích ứng ban đầu, nên bắt đầu với tần suất thấp",
      price: "300.000đ - 900.000đ",
      recommendedBrands: ["Paula's Choice", "The Ordinary", "La Roche-Posay"],
      icon: <ExperimentOutlined />,
      color: "blue",
      timeOfDay: "Sau 2-3 phút",
      timeBefore: "30 giây",
      applyMethod: "Thoa đều theo chuyển động hướng lên trên và ra ngoài",
    },
    "Kem chống nắng nhẹ": {
      purpose:
        "Bảo vệ da khỏi tác hại của tia UVA/UVB với kết cấu nhẹ, không nhờn",
      howToUse: "Thoa lượng đủ (1/4 thìa cà phê) lên mặt và cổ",
      tips: "Bôi lại sau mỗi 2 giờ tiếp xúc với ánh nắng",
      ingredients: [
        "Chemical Filters",
        "Zinc Oxide",
        "Titanium Dioxide",
        "Niacinamide",
      ],
      benefits: [
        "Bảo vệ da khỏi tia UVA/UVB",
        "Kết cấu nhẹ, dễ thấm",
        "Không gây bít tắc lỗ chân lông",
        "Phù hợp cho da hỗn hợp",
      ],
      warnings: "Vẫn cần bôi lại thường xuyên dù là kết cấu nhẹ",
      price: "250.000đ - 550.000đ",
      recommendedBrands: ["La Roche-Posay", "ISNTREE", "Skin Aqua"],
      icon: <ExperimentOutlined />,
      color: "yellow",
      timeOfDay: "Trước khi ra ngoài",
      timeBefore: "15-20 phút trước khi tiếp xúc với nắng",
      applyMethod: "Thoa đều và vỗ nhẹ để không tạo vệt",
    },
  };

  const skinTypes = [
    "Da thường",
    "Da khô",
    "Da dầu",
    "Da hỗn hợp",
    "Da nhạy cảm",
  ];

  const skinConcerns = [
    "Mụn & Thâm mụn",
    "Đốm nâu & Tăng sắc tố",
    "Nếp nhăn & Rãnh nhăn",
    "Da xỉn màu & Không đều",
    "Lỗ chân lông to",
    "Đỏ & Viêm",
    "Thiếu nước",
    "Mụn đầu đen & Mụn đầu trắng",
    "Quầng thâm mắt",
    "Da chảy xệ",
    "Tổn thương do nắng",
    "Màu da không đều",
  ];

  const routines = {
    "Da thường": {
      morning: [
        "Sữa rửa mặt dịu nhẹ",
        "Nước cân bằng dưỡng ẩm",
        "Serum Vitamin C",
        "Kem dưỡng ẩm nhẹ",
        "Kem chống nắng SPF 30+",
      ],
      evening: [
        "Tẩy trang dầu",
        "Sữa rửa mặt dịu nhẹ",
        "Nước cân bằng dưỡng ẩm",
        "Serum Niacinamide",
        "Kem dưỡng đêm",
      ],
    },
    "Da khô": {
      morning: [
        "Sữa rửa mặt dịu nhẹ",
        "Nước cân bằng dưỡng ẩm",
        "Serum Hyaluronic Acid",
        "Kem dưỡng ẩm đậm đặc",
        "Kem chống nắng SPF 30+",
      ],
      evening: [
        "Tẩy trang dầu",
        "Sữa rửa mặt dịu nhẹ",
        "Nước cân bằng dưỡng ẩm",
        "Serum phục hồi",
        "Kem dưỡng đêm giàu dưỡng chất",
      ],
    },
    "Da dầu": {
      morning: [
        "Sữa rửa mặt kiểm soát dầu",
        "Nước cân bằng không cồn",
        "Serum Niacinamide",
        "Kem dưỡng dạng gel",
        "Kem chống nắng không dầu",
      ],
      evening: [
        "Sữa rửa mặt kiểm soát dầu",
        "Sữa rửa mặt có BHA",
        "Nước cân bằng không cồn",
        "Serum trị mụn",
        "Kem dưỡng ẩm nhẹ",
      ],
    },
    "Da hỗn hợp": {
      morning: [
        "Sữa rửa mặt cân bằng",
        "Nước cân bằng không cồn",
        "Serum chống oxy hóa",
        "Kem dưỡng theo vùng",
        "Kem chống nắng nhẹ",
      ],
      evening: [
        "Tẩy trang dầu",
        "Sữa rửa mặt cân bằng",
        "Nước cân bằng không cồn",
        "Serum điều trị",
        "Kem dưỡng đêm theo vùng",
      ],
    },
    "Da nhạy cảm": {
      morning: [
        "Sữa rửa mặt dịu nhẹ",
        "Nước cân bằng làm dịu",
        "Serum Centella",
        "Kem dưỡng làm dịu",
        "Kem chống nắng khoáng chất",
      ],
      evening: [
        "Nước tẩy trang Micellar",
        "Sữa rửa mặt dịu nhẹ",
        "Nước cân bằng làm dịu",
        "Serum phục hồi",
        "Kem dưỡng phục hồi da",
      ],
    },
  };

  const skinCareTips = {
    general: [
      "Luôn thoa sản phẩm theo thứ tự từ loãng đến đặc",
      "Đợi 1-2 phút giữa các bước để sản phẩm thẩm thấu",
      "Sử dụng kem chống nắng hàng ngày, kể cả trời râm",
      "Không sử dụng nhiều sản phẩm mới cùng lúc",
      "Thử sản phẩm mới trên một vùng nhỏ trong 24-48 giờ",
    ],
    application: {
      cleansing: "Massage nhẹ nhàng theo chuyển động tròn. Không kéo căng da.",
      toning: "Vỗ nhẹ, không chà xát. Để từng lớp thẩm thấu.",
      moisturizing: "Thoa lên da còn hơi ẩm để tăng khả năng hấp thu.",
    },
    timing: {
      morning: "Tập trung vào bảo vệ: chống oxy hóa và chống nắng",
      evening: "Tập trung vào phục hồi: điều trị và dưỡng ẩm sâu",
    },
  };

  const handleProductClick = (productName) => {
    setSelectedProduct(productDetails[productName]);
  };

  const renderProductModal = () => (
    <Modal
      title={
        <div className="text-center">
          <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text">
            Chi Tiết Sản Phẩm
          </span>
        </div>
      }
      open={selectedProduct !== null}
      onCancel={() => setSelectedProduct(null)}
      footer={null}
      width={700}
      className="custom-modal"
    >
      {selectedProduct && (
        <div className="space-y-6 p-4">
          {/* Mục đích sử dụng */}
          <div className="bg-purple-50 p-4 rounded-lg">
            <Text strong className="text-lg text-purple-700 flex items-center">
              <ExperimentOutlined className="mr-2" />
              Mục Đích Sử Dụng
            </Text>
            <Paragraph className="mt-2 text-purple-600">
              {selectedProduct.purpose}
            </Paragraph>
          </div>

          {/* Cách sử dụng với thêm minh họa */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <Text strong className="text-lg text-blue-700 flex items-center">
              <InfoCircleOutlined className="mr-2" />
              Cách Sử Dụng
            </Text>
            <div className="mt-2 flex items-start gap-4">
              <div className="bg-blue-100 rounded-lg p-3 flex-shrink-0">
                <ClockCircleOutlined className="text-blue-700 text-xl" />
              </div>
              <div>
                <Paragraph className="text-blue-600">
                  {selectedProduct.howToUse}
                </Paragraph>
                <div className="mt-2 flex items-center text-sm text-blue-500">
                  <InfoCircleOutlined className="mr-1" />
                  <span>Thời gian thực hiện: 1-2 phút</span>
                </div>
              </div>
            </div>
          </div>

          {/* Thành phần chính với tooltip giải thích */}
          <div className="bg-pink-50 p-4 rounded-lg">
            <Text strong className="text-lg text-pink-700 flex items-center">
              <ExperimentOutlined className="mr-2" />
              Thành Phần Chính
            </Text>
            <div className="flex flex-wrap gap-2 mt-3">
              {selectedProduct.ingredients.map((ingredient) => (
                <Tooltip
                  key={ingredient}
                  title={getIngredientDescription(ingredient)}
                  placement="top"
                >
                  <Tag
                    color="pink"
                    className="rounded-full py-1 px-3 cursor-help"
                  >
                    {ingredient}
                  </Tag>
                </Tooltip>
              ))}
            </div>
            <Paragraph className="mt-3 text-sm text-pink-500 italic">
              * Di chuột lên thành phần để xem chi tiết công dụng
            </Paragraph>
          </div>

          {/* Lợi ích với icon cho từng điểm */}
          <div className="bg-green-50 p-4 rounded-lg">
            <Text strong className="text-lg text-green-700 flex items-center">
              <CheckCircleOutlined className="mr-2" />
              Lợi Ích
            </Text>
            <ul className="mt-3 space-y-3">
              {selectedProduct.benefits.map((benefit, index) => (
                <li key={benefit} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <CheckCircleOutlined className="text-green-600 text-sm" />
                  </div>
                  <Paragraph className="text-green-600 m-0">
                    {benefit}
                  </Paragraph>
                </li>
              ))}
            </ul>
          </div>

          {/* Thương hiệu gợi ý với logo */}
          <div className="bg-indigo-50 p-4 rounded-lg">
            <Text strong className="text-lg text-indigo-700 flex items-center">
              <ShoppingOutlined className="mr-2" />
              Thương Hiệu Gợi Ý
            </Text>
            <div className="mt-3 grid grid-cols-3 gap-3">
              {selectedProduct.recommendedBrands?.map((brand) => (
                <div
                  key={brand}
                  className="bg-white rounded-lg p-3 text-center shadow-sm hover:shadow transition"
                >
                  <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-indigo-100 flex items-center justify-center">
                    {brand.charAt(0)}
                  </div>
                  <Text strong className="text-indigo-700 block">
                    {brand}
                  </Text>
                </div>
              ))}
            </div>
          </div>

          {/* Lưu ý quan trọng với thiết kế nổi bật */}
          <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-400">
            <Text strong className="text-lg text-yellow-700 flex items-center">
              <WarningOutlined className="mr-2" />
              Lưu Ý Quan Trọng
            </Text>
            <Paragraph className="mt-2 text-yellow-600">
              {selectedProduct.warnings}
            </Paragraph>
          </div>

          {/* Tips với các điểm hữu ích */}
          <div className="bg-orange-50 p-4 rounded-lg">
            <Text strong className="text-lg text-orange-700 flex items-center">
              <BulbOutlined className="mr-2" />
              Tips Sử Dụng
            </Text>
            <div className="mt-3 flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                <BulbOutlined className="text-orange-500" />
              </div>
              <Paragraph className="text-orange-600 m-0">
                {selectedProduct.tips}
              </Paragraph>
            </div>
          </div>

          {/* Footer với cta */}
          <div className="mt-6 flex justify-center">
            <button
              type="primary"
              className="bg-gradient-to-r from-pink-500 to-purple-500 border-none h-auto py-3 px-8 rounded-full text-base text-white font-medium shadow-lg shadow-pink-500/25 hover:shadow-xl hover:shadow-pink-500/40 transform hover:scale-105 transition-all duration-300"
              onClick={() => navigate("/product")}
            >
              <span className="flex items-center gap-2">
                <ShoppingOutlined />
                Mua Sắm Sản Phẩm
              </span>
            </button>
          </div>
        </div>
      )}
    </Modal>
  );

  // Hàm trả về mô tả cho từng thành phần
  const getIngredientDescription = (ingredient) => {
    const descriptions = {
      Ceramides:
        "Giúp khôi phục hàng rào bảo vệ da, giữ ẩm và bảo vệ da khỏi tác nhân gây hại",
      Glycerin:
        "Chất giữ ẩm tự nhiên, thu hút nước từ không khí và giữ nước trong da",
      "Hyaluronic Acid":
        "Giữ ẩm mạnh mẽ, có thể giữ lượng nước gấp 1000 lần trọng lượng của nó",
      Niacinamide:
        "Vitamin B3, giúp làm sáng da, giảm dầu, thu nhỏ lỗ chân lông và cải thiện đốm nâu",
      Panthenol: "Vitamin B5, làm dịu, giữ ẩm và hỗ trợ quá trình làm lành da",
      "Salicylic Acid":
        "BHA giúp loại bỏ tế bào chết, thông thoáng lỗ chân lông và điều trị mụn",
      "Tea Tree Oil":
        "Tinh dầu tự nhiên có đặc tính kháng khuẩn, giúp giảm mụn và kiểm soát dầu",
      "Zinc PCA": "Kiểm soát dầu và giảm viêm, hỗ trợ điều trị mụn",
      "Vitamin C":
        "Chống oxy hóa mạnh, làm sáng da, kích thích sản sinh collagen và ngăn ngừa lão hóa",
      "Vitamin E":
        "Chống oxy hóa, bảo vệ da khỏi tác hại môi trường và giúp dưỡng ẩm",
      "Ferulic Acid": "Chống oxy hóa, tăng cường hiệu quả của Vitamin C và E",
      Retinol:
        "Dẫn xuất vitamin A, kích thích tái tạo tế bào và sản sinh collagen, chống lão hóa",
      Peptides:
        "Chuỗi amino acid giúp tái tạo và sửa chữa da, kích thích sản sinh collagen",
      "Centella Asiatica":
        "Chiết xuất thực vật có tác dụng làm dịu, phục hồi và chống viêm",
      Allantoin: "Làm dịu, phục hồi và kích thích tái tạo tế bào da",
      "Shea Butter": "Dưỡng ẩm sâu, làm mềm và phục hồi da khô, chống oxy hóa",
      Squalane:
        "Dầu tự nhiên giống với dầu tự nhiên của da, dưỡng ẩm mà không gây bít tắc lỗ chân lông",
      "Aloe Vera":
        "Làm dịu, cấp ẩm và giảm viêm, phù hợp cho da bị cháy nắng hoặc kích ứng",
      Madecassoside:
        "Chiết xuất từ rau má, có tác dụng làm dịu, phục hồi và chống viêm mạnh",
      "Sodium Hyaluronate":
        "Dạng phân tử nhỏ hơn của hyaluronic acid, thấm sâu vào da để cấp ẩm",
      "Zinc Oxide": "Chất chống nắng vật lý, bảo vệ da khỏi tia UVA và UVB",
      "Titanium Dioxide":
        "Chất chống nắng vật lý, bảo vệ da khỏi tia UVA và UVB",
      Avobenzone: "Chất chống nắng hóa học, bảo vệ da khỏi tia UVA dài",
      "Surfactants nhẹ":
        "Chất làm sạch nhẹ nhàng không gây kích ứng, an toàn cho da nhạy cảm",
      "AHA/BHA":
        "Axit alpha và beta hydroxy, giúp tẩy tế bào chết, thông thoáng lỗ chân lông và làm đều màu da",
    };

    return (
      descriptions[ingredient] ||
      "Thành phần hoạt tính trong sản phẩm chăm sóc da"
    );
  };

  const renderEnhancedRoutineStep = (step, index, isLast, timing) => {
    const details = productDetails[step] || {
      purpose: "Chăm sóc da chuyên sâu",
      howToUse: "Theo hướng dẫn của sản phẩm",
      tips: "Tham khảo hướng dẫn cụ thể trên bao bì",
      ingredients: ["Thành phần chuyên biệt"],
      price: "Tùy theo thương hiệu",
    };

    const colorScheme =
      timing === "morning"
        ? {
            bgGradient: "from-amber-50 to-orange-50",
            borderColor: "border-amber-100/50",
            iconBg: "from-amber-400 to-orange-400",
            textColor: "text-amber-900",
            iconColor: "text-amber-500",
            timeBgColor: "bg-amber-100/40",
            timeTextColor: "text-amber-700",
          }
        : {
            bgGradient: "from-indigo-50 to-purple-50",
            borderColor: "border-indigo-100/50",
            iconBg: "from-indigo-400 to-purple-400",
            textColor: "text-indigo-900",
            iconColor: "text-indigo-500",
            timeBgColor: "bg-indigo-100/40",
            timeTextColor: "text-indigo-700",
          };

    const getTimeOfUse = () => {
      if (timing === "morning") {
        return index < 2
          ? "Ngay sau khi thức dậy"
          : index < 4
          ? "Sau 2-3 phút"
          : "Trước khi ra ngoài";
      } else {
        return index < 2
          ? "Trước khi rửa mặt"
          : index < 4
          ? "Sau 2-3 phút"
          : "Trước khi đi ngủ";
      }
    };

    return (
      <motion.div
        key={index}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 * index }}
        className={`bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-sm ${colorScheme.borderColor} hover:shadow-md transition-all duration-300 cursor-pointer`}
        onClick={() => handleProductClick(step)}
      >
        <div className="flex items-start space-x-3">
          <div
            className={`w-8 h-8 rounded-full bg-gradient-to-r ${colorScheme.iconBg} flex items-center justify-center text-white font-medium shrink-0`}
          >
            {index + 1}
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-center">
              <Text strong className={`text-lg ${colorScheme.textColor}`}>
                {step}
              </Text>
              <Tooltip title="Xem chi tiết sản phẩm">
                <InfoCircleOutlined className={colorScheme.iconColor} />
              </Tooltip>
            </div>

            <div className="mt-2">
              <div
                className={`inline-flex items-center px-2 py-1 rounded-full ${colorScheme.timeBgColor} ${colorScheme.timeTextColor} text-xs mb-2`}
              >
                <ClockCircleOutlined className="mr-1" />
                <Text className={`${colorScheme.timeTextColor} text-xs`}>
                  {getTimeOfUse()}
                </Text>
              </div>

              <Paragraph
                className={`text-sm mt-1 ${colorScheme.textColor} opacity-80 line-clamp-2`}
              >
                {details.purpose}
              </Paragraph>

              {details.ingredients && details.ingredients.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {details.ingredients.slice(0, 2).map((ingredient, idx) => (
                    <Tag
                      key={idx}
                      className={`rounded-full text-xs font-medium px-2 py-0.5 border-0 bg-${
                        timing === "morning" ? "amber" : "indigo"
                      }-100/60`}
                    >
                      {ingredient}
                    </Tag>
                  ))}
                  {details.ingredients.length > 2 && (
                    <Tag
                      className={`rounded-full text-xs font-medium px-2 py-0.5 border-0 bg-${
                        timing === "morning" ? "amber" : "indigo"
                      }-100/60`}
                    >
                      +{details.ingredients.length - 2}
                    </Tag>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  // Hàm chuyển đổi từ tiếng Anh sang tiếng Việt
  const translateSkinType = (englishType) => {
    const translations = {
      "Normal Skin": "Da thường",
      "Dry Skin": "Da khô",
      "Oily Skin": "Da dầu",
      "Combination Skin": "Da hỗn hợp",
      "Sensitive Skin": "Da nhạy cảm",
    };
    return translations[englishType] || englishType;
  };

  const translateSkinConcern = (englishConcern) => {
    const translations = {
      acne: "Mụn & Thâm mụn",
      wrinkles: "Nếp nhăn & Lão hóa",
      darkSpots: "Đốm nâu & Tăng sắc tố",
      dullness: "Da xỉn màu & Không đều",
      dryness: "Da khô & Thiếu ẩm",
      oiliness: "Da dầu",
      largePores: "Lỗ chân lông to",
      sensitivity: "Da nhạy cảm",
      redness: "Da đỏ & Kích ứng",
      unevenTexture: "Kết cấu da không đều",
    };
    return translations[englishConcern] || englishConcern;
  };

  useEffect(() => {
    // Kiểm tra xem form đã có giá trị người dùng nhập chưa
    const currentValues = form.getFieldsValue();
    const hasUserInput =
      currentValues.skinType && currentValues.skinType.length > 0;

    // Nếu đã tự động điền form hoặc người dùng đã nhập liệu, không tự động điền nữa
    if (autoFilled || hasUserInput) return;

    let shouldAutoFill = false;
    let formValues = {};

    // Chuyển đổi kết quả quiz sang tiếng Việt
    if (quizResults && quizResults.skinType) {
      shouldAutoFill = true;
      const vietnameseSkinType = translateSkinType(quizResults.skinType);
      const vietnameseConcerns =
        quizResults.concerns?.map((concern) => translateSkinConcern(concern)) ||
        [];

      formValues = {
        skinType: vietnameseSkinType,
        concerns: vietnameseConcerns,
      };
    } else {
      // Chuyển đổi routine đã lưu sang tiếng Việt từ localStorage
      const savedRoutine = localStorage.getItem("currentRoutine");
      if (savedRoutine) {
        try {
          const parsed = JSON.parse(savedRoutine);
          if (parsed && parsed.skinType) {
            shouldAutoFill = true;
            formValues = {
              skinType: parsed.skinType, // Không cần chuyển đổi vì đã là tiếng Việt
              concerns: parsed.concerns || [],
            };
          }
        } catch (error) {
          console.error("Error parsing saved routine:", error);
          localStorage.removeItem("currentRoutine");
        }
      }
    }

    // Chỉ điền form khi có dữ liệu hợp lệ
    if (shouldAutoFill) {
      form.setFieldsValue(formValues);
      setAutoFilled(true);

      // Thêm đoạn này: Tự động submit form sau khi điền
      // Sử dụng setTimeout để đảm bảo form được cập nhật trước khi submit
      setTimeout(() => {
        // Kiểm tra lại xem formValues đã có đủ dữ liệu chưa
        if (formValues.skinType) {
          const selectedRoutine = routines[formValues.skinType];
          if (selectedRoutine) {
            setRecommendations(selectedRoutine);

            // Lưu vào localStorage với giá trị tiếng Việt
            localStorage.setItem(
              "currentRoutine",
              JSON.stringify({
                skinType: formValues.skinType,
                concerns: formValues.concerns || [],
                routine: selectedRoutine,
              })
            );
          }
        }
      }, 300);
    }
  }, [quizResults, form, autoFilled, routines]);

  const handleSubmit = (values) => {
    console.log("Form values in handleSubmit:", values);

    // Kiểm tra lại giá trị một lần nữa để chắc chắn
    if (!values || !values.skinType) {
      message.error("Vui lòng chọn loại da của bạn trước khi tạo quy trình");
      return;
    }

    // Kiểm tra xem loại da có trong danh sách routines không
    if (!routines[values.skinType]) {
      message.error(`Không tìm thấy quy trình cho loại da ${values.skinType}`);
      return;
    }

    const selectedRoutine = routines[values.skinType];
    setRecommendations(selectedRoutine);

    // Lưu vào localStorage với giá trị tiếng Việt
    localStorage.setItem(
      "currentRoutine",
      JSON.stringify({
        skinType: values.skinType,
        concerns: values.concerns || [],
        routine: selectedRoutine,
      })
    );

    message.success(`Đã tạo quy trình cho ${values.skinType}`);
  };

  return (
    <div className="min-h-screen py-12 px-4 relative overflow-hidden">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="max-w-5xl mx-auto"
      >
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="bg-white/80 backdrop-blur-md shadow-xl rounded-3xl border border-white/50 overflow-hidden"
        >
          <div className="text-center p-8">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="inline-block p-3 mb-4">
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-3 rounded-full">
                  <SkinOutlined className="text-2xl" />
                </div>
              </div>
              <Title level={2} className="!mb-2">
                <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text">
                  Quy Trình Chăm Sóc Da Cá Nhân Hóa
                </span>
              </Title>
              <Paragraph className="text-gray-600 max-w-xl mx-auto">
                Hệ thống tự động cung cấp quy trình chăm sóc da phù hợp với loại
                da của bạn
              </Paragraph>
            </motion.div>
          </div>

          <div className="p-8">
            {recommendations && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="space-y-8 mt-0"
              >
                <Divider>
                  <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full">
                    <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text font-bold">
                      Quy Trình Cho {form.getFieldValue("skinType")}
                    </span>
                  </div>
                </Divider>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Morning Routine */}
                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl overflow-hidden shadow-lg border border-orange-100/50"
                  >
                    <div className="p-6 bg-gradient-to-r from-amber-200/30 to-orange-200/30 border-b border-orange-100/50">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                          <SunOutlined className="text-lg" />
                        </div>
                        <Title level={4} className="!m-0 text-amber-800">
                          Quy Trình Buổi Sáng
                        </Title>
                      </div>
                    </div>

                    <div className="p-6">
                      <div className="space-y-4">
                        {recommendations.morning.map((step, index) =>
                          renderEnhancedRoutineStep(
                            step,
                            index,
                            index === recommendations.morning.length - 1,
                            "morning"
                          )
                        )}
                      </div>
                    </div>
                  </motion.div>

                  {/* Evening Routine */}
                  <motion.div
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-3xl overflow-hidden shadow-lg border border-indigo-100/50"
                  >
                    <div className="p-6 bg-gradient-to-r from-indigo-200/30 to-purple-200/30 border-b border-indigo-100/50">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                          <MoonOutlined className="text-lg" />
                        </div>
                        <Title level={4} className="!m-0 text-indigo-800">
                          Quy Trình Buổi Tối
                        </Title>
                      </div>
                    </div>

                    <div className="p-6">
                      <div className="space-y-4">
                        {recommendations.evening.map((step, index) =>
                          renderEnhancedRoutineStep(
                            step,
                            index,
                            index === recommendations.evening.length - 1,
                            "evening"
                          )
                        )}
                      </div>
                    </div>
                  </motion.div>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                  className="mt-8 flex flex-col sm:flex-row justify-center gap-4"
                >
                  <button
                    type="primary"
                    size="large"
                    icon={<ShoppingOutlined />}
                    onClick={() => navigate("/product-recommendations")}
                    className="bg-gradient-to-r from-pink-500 to-purple-500 border-none h-auto py-3 px-8 rounded-full text-base text-white font-medium shadow-lg shadow-pink-500/25 hover:shadow-xl hover:shadow-pink-500/40 transform hover:scale-105 transition-all duration-300"
                  >
                    Xem Sản Phẩm Phù Hợp
                  </button>

                  <button
                    type="default"
                    size="large"
                    icon={<BulbOutlined />}
                    onClick={() => setShowTips(true)}
                    className="border-pink-400 text-pink-600 h-auto py-3 px-8 rounded-full text-base font-medium hover:border-pink-500 hover:text-pink-700 hover:shadow-lg transform hover:scale-105 transition-all duration-300 bg-white/80 backdrop-blur-sm"
                  >
                    Xem Lời Khuyên Chăm Sóc Da
                  </button>
                </motion.div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </motion.div>

      {/* Skin Care Tips Modal */}
      <Modal
        title={
          <div className="text-center">
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text">
              Lời Khuyên Chăm Sóc Da
            </span>
          </div>
        }
        open={showTips}
        onCancel={() => setShowTips(false)}
        footer={null}
        width={700}
        className="custom-modal"
      >
        <div className="space-y-6 p-4">
          <div className="bg-purple-50 p-4 rounded-lg">
            <Text strong className="text-lg text-purple-700 flex items-center">
              <SafetyOutlined className="mr-2" />
              Lời Khuyên Chung
            </Text>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              {skinCareTips.general.map((tip, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="text-purple-600"
                >
                  {tip}
                </motion.li>
              ))}
            </ul>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-pink-50 p-4 rounded-lg">
              <Text strong className="text-lg text-pink-700 flex items-center">
                <SunOutlined className="mr-2" />
                Quy Trình Buổi Sáng
              </Text>
              <Paragraph className="mt-2 text-pink-600">
                {skinCareTips.timing.morning}
              </Paragraph>
            </div>

            <div className="bg-indigo-50 p-4 rounded-lg">
              <Text
                strong
                className="text-lg text-indigo-700 flex items-center"
              >
                <MoonOutlined className="mr-2" />
                Quy Trình Buổi Tối
              </Text>
              <Paragraph className="mt-2 text-indigo-600">
                {skinCareTips.timing.evening}
              </Paragraph>
            </div>
          </div>
        </div>
      </Modal>

      {/* Product Detail Modal */}
      {renderProductModal()}
    </div>
  );
}
